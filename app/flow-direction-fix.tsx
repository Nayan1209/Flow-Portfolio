'use client';

import { useEffect } from 'react';

const parseWorldX = (node: HTMLElement) => {
  const match = node.style.left.match(/calc\(50%\s*\+\s*(-?\d+(?:\.\d+)?)px\)/);
  return match ? Number(match[1]) : 0;
};

const fitNode = (node: HTMLElement) => {
  const core = node.querySelector<HTMLElement>('.node-core');
  if (!core) return;
  const text = (core.textContent ?? '').trim();
  const isCenter = node.classList.contains('focus-center');
  const isRoot = node.classList.contains('root-persistent');
  const isPrimary = node.classList.contains('home-primary');
  const compact = text.length <= 8 ? 82 : text.length <= 12 ? 92 : text.length <= 16 ? 106 : 122;
  const size = isCenter ? Math.max(170, compact + 40) : isRoot ? Math.max(86, compact - 4) : isPrimary ? Math.max(100, compact) : compact;
  node.style.setProperty('--node-size', `${size}px`);
  core.style.fontSize = isCenter ? '14px' : text.length > 15 ? '8px' : '9px';
  core.style.lineHeight = '1.18';
  core.style.padding = isCenter ? '14px' : '10px';
};

export default function FlowDirectionFix() {
  useEffect(() => {
    let frame = 0;
    let lastWheelOpen = 0;

    const applyDirection = () => {
      const stage = document.querySelector<HTMLElement>('.flow-stage');
      const world = document.querySelector<HTMLElement>('.flow-world');
      const lines = stage?.querySelector<SVGSVGElement>('.flow-lines');
      if (!stage || !world || !lines) return;

      const nodes = Array.from(stage.querySelectorAll<HTMLElement>('.flow-node'));
      nodes.forEach(fitNode);

      const ancestors = Array.from(
        stage.querySelectorAll<HTMLElement>('.flow-node.ancestor-depth-1, .flow-node.ancestor-depth-2, .flow-node.ancestor-depth-3, .flow-node.focus-center'),
      );
      const root = stage.querySelector<HTMLElement>('.flow-node.root-persistent');
      const focus = stage.querySelector<HTMLElement>('.flow-node.focus-center');
      if (!root || !focus) return;

      // Keep the focused node on the right, but use a shorter 180px hierarchy step.
      const step = 180;
      const focusX = 90;
      focus.style.left = `calc(50% + ${focusX}px)`;

      ancestors.forEach((node) => {
        if (node === focus) return;
        const match = node.className.toString().match(/ancestor-depth-(\d+)/);
        if (!match) return;
        const distance = Number(match[1]);
        node.style.left = `calc(50% + ${focusX - distance * step}px)`;
      });

      const rootDistance = Math.max(
        1,
        ancestors.reduce((max, node) => {
          const match = node.className.toString().match(/ancestor-depth-(\d+)/);
          return match ? Math.max(max, Number(match[1])) : max;
        }, 1),
      );
      root.style.left = `calc(50% + ${focusX - rootDistance * step}px)`;

      // The original nested SVG can contain reversed ancestry segments. Hide only those.
      const ancestorLineCount = Math.max(0, ancestors.filter((node) => node !== focus).length);
      Array.from(lines.querySelectorAll('line')).forEach((line, index) => {
        if (index < ancestorLineCount) line.style.display = 'none';
      });

      let overlay = world.querySelector<SVGSVGElement>('.flow-ancestry-overlay');
      if (!overlay) {
        overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        overlay.setAttribute('class', 'flow-lines flow-ancestry-overlay');
        overlay.setAttribute('viewBox', '-620 -410 1240 820');
        overlay.setAttribute('aria-hidden', 'true');
        overlay.style.pointerEvents = 'none';
        world.insertBefore(overlay, lines.nextSibling);
      }

      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);

      const chain = [root, ...ancestors
        .filter((node) => node !== focus && node !== root)
        .sort((a, b) => {
          const da = Number(a.className.toString().match(/ancestor-depth-(\d+)/)?.[1] ?? 0);
          const db = Number(b.className.toString().match(/ancestor-depth-(\d+)/)?.[1] ?? 0);
          return db - da;
        }), focus];

      for (let i = 0; i < chain.length - 1; i += 1) {
        const a = chain[i];
        const b = chain[i + 1];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(parseWorldX(a)));
        line.setAttribute('y1', '0');
        line.setAttribute('x2', String(parseWorldX(b)));
        line.setAttribute('y2', '0');
        line.setAttribute('class', 'ancestry-connector');
        overlay.appendChild(line);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(applyDirection);
    };

    schedule();

    const root = document.querySelector('.flow');
    if (!root) return () => cancelAnimationFrame(frame);

    // Zooming directly over a node is also a navigation gesture. A deliberate
    // wheel-up over a node opens that node, while the normal page wheel handler
    // continues to provide the small camera zoom underneath it. A short
    // cooldown prevents trackpad bursts from skipping multiple hierarchy levels.
    const openNodeOnWheel = (event: WheelEvent) => {
      if (event.deltaY >= 0) return;
      const target = event.target as Element | null;
      const node = target?.closest<HTMLElement>('[data-node]');
      if (!node) return;
      const now = performance.now();
      if (now - lastWheelOpen < 450) return;
      lastWheelOpen = now;
      node.click();
    };

    window.addEventListener('wheel', openNodeOnWheel, { capture: true, passive: true });

    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    window.addEventListener('resize', schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('wheel', openNodeOnWheel, true);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
