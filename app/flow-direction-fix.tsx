'use client';

import { useEffect } from 'react';

const getDepth = (node: Element) => {
  const match = node.className.toString().match(/ancestor-depth-(\d+)/);
  return match ? Number(match[1]) : null;
};

export default function FlowDirectionFix() {
  useEffect(() => {
    let frame = 0;

    const applyDirection = () => {
      const stage = document.querySelector<HTMLElement>('.flow-stage');
      if (!stage) return;

      const depthNodes = Array.from(stage.querySelectorAll<HTMLElement>('.flow-node')).filter(
        (node) => getDepth(node) !== null,
      );

      // Home has no ancestor-depth nodes. Nested views are the only views
      // whose ancestry needs the left-to-right correction.
      if (!depthNodes.length) return;

      const focus = stage.querySelector<HTMLElement>('.flow-node.focus-center');
      if (!focus) return;

      // Keep the focused node on the right side of its ancestry.
      focus.style.left = 'calc(50% + 120px)';

      // Every ancestor is placed progressively farther to the left.
      depthNodes.forEach((node) => {
        const depth = getDepth(node);
        if (depth === null) return;
        node.style.left = `calc(50% + ${-120 - depth * 240}px)`;
      });

      // Child/detail nodes remain to the right of the focused node.
      const ancestorSet = new Set(depthNodes);
      const nestedNodes = Array.from(stage.querySelectorAll<HTMLElement>('.flow-node'));
      nestedNodes.forEach((node) => {
        if (ancestorSet.has(node) || node === focus) return;
        const original = node.dataset.flowOriginalLeft ?? node.style.left;
        node.dataset.flowOriginalLeft = original;
        const match = original.match(/calc\(50%\s*\+\s*(-?\d+(?:\.\d+)?)px\)/);
        if (!match) return;
        node.style.left = `calc(50% + ${Number(match[1]) + 240}px)`;
      });

      // The first N SVG lines are the ancestry chain; reverse each segment
      // so its endpoints follow the corrected node coordinates. The remaining
      // lines connect the focused node to its children and move by the same
      // +240px offset as those nodes.
      const lines = Array.from(stage.querySelectorAll<SVGLineElement>('.flow-lines line'));
      const depth = Math.max(...depthNodes.map((node) => getDepth(node) ?? 0));
      lines.forEach((line, index) => {
        if (index < depth) {
          const segmentDepth = depth - index;
          line.setAttribute('x1', String(-120 - segmentDepth * 240));
          line.setAttribute('y1', '0');
          line.setAttribute('x2', String(-120 - (segmentDepth - 1) * 240));
          line.setAttribute('y2', '0');
        } else {
          const originalX1 = line.dataset.flowOriginalX1 ?? line.getAttribute('x1') ?? '0';
          const originalX2 = line.dataset.flowOriginalX2 ?? line.getAttribute('x2') ?? '0';
          const originalY1 = line.dataset.flowOriginalY1 ?? line.getAttribute('y1') ?? '0';
          const originalY2 = line.dataset.flowOriginalY2 ?? line.getAttribute('y2') ?? '0';
          line.dataset.flowOriginalX1 = originalX1;
          line.dataset.flowOriginalX2 = originalX2;
          line.dataset.flowOriginalY1 = originalY1;
          line.dataset.flowOriginalY2 = originalY2;
          line.setAttribute('x1', '120');
          line.setAttribute('y1', originalY1);
          line.setAttribute('x2', String(Number(originalX2) + 240));
          line.setAttribute('y2', originalY2);
        }
      });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(applyDirection);
    };

    schedule();

    const root = document.querySelector('.flow');
    if (!root) return () => cancelAnimationFrame(frame);

    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
