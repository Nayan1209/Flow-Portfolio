'use client';

import { useEffect } from 'react';

const parseWorldX = (node: HTMLElement) => {
  const match = node.style.left.match(/calc\(50%\s*\+\s*(-?\d+(?:\.\d+)?)px\)/);
  return match ? Number(match[1]) : 0;
};

export default function FlowDirectionFix() {
  useEffect(() => {
    let frame = 0;

    const applyDirection = () => {
      const stage = document.querySelector<HTMLElement>('.flow-stage');
      const world = document.querySelector<HTMLElement>('.flow-world');
      const lines = stage?.querySelector<SVGSVGElement>('.flow-lines');
      if (!stage || !world || !lines) return;

      const ancestors = Array.from(
        stage.querySelectorAll<HTMLElement>('.flow-node.ancestor-depth-1, .flow-node.ancestor-depth-2, .flow-node.ancestor-depth-3, .flow-node.focus-center'),
      );
      const root = stage.querySelector<HTMLElement>('.flow-node.root-persistent');
      const focus = stage.querySelector<HTMLElement>('.flow-node.focus-center');
      if (!root || !focus) return;

      // The focused node always sits to the right of its ancestry.
      focus.style.left = 'calc(50% + 120px)';

      // Ancestor depth 1 is the immediate parent, depth 2 is its parent, etc.
      ancestors.forEach((node) => {
        if (node === focus) return;
        const match = node.className.toString().match(/ancestor-depth-(\d+)/);
        if (!match) return;
        const distance = Number(match[1]);
        node.style.left = `calc(50% + ${120 - distance * 240}px)`;
      });

      // The root is the far-left endpoint of the ancestry chain.
      const rootDistance = Math.max(
        1,
        ancestors.reduce((max, node) => {
          const match = node.className.toString().match(/ancestor-depth-(\d+)/);
          return match ? Math.max(max, Number(match[1])) : max;
        }, 1),
      );
      root.style.left = `calc(50% + ${120 - rootDistance * 240}px)`;

      // The original nested SVG puts the ancestry lines first. Hide those
      // reversed segments and replace them with correctly directed segments.
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

    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    window.addEventListener('resize', schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
