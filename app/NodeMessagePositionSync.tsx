'use client';

import { useEffect, useRef } from 'react';

export default function NodeMessagePositionSync() {
  const activeId = useRef<string | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const position = () => {
      if (!activeId.current) return;
      const node = document.querySelector<HTMLElement>(`[data-node="${CSS.escape(activeId.current)}"]`);
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw <= 720;
      // Smaller card + tighter gap keeps the detail surface visually attached to its node.
      const gap = mobile ? 10 : 16;
      const panelW = Math.min(480, vw - (mobile ? 24 : 32));
      const panelH = Math.min(mobile ? vh * .58 : vh * .56, mobile ? 520 : 540);

      let left = rect.right + gap;
      let top = rect.top + rect.height / 2 - panelH / 2;

      // Prefer the nearest side of the source node; only cross the node when necessary.
      if (!mobile && left + panelW > vw - 12) {
        left = rect.left - gap - panelW;
      }
      if (mobile) {
        left = rect.left + rect.width / 2 - panelW / 2;
        top = rect.bottom + gap;
        if (top + panelH > vh - 10) top = rect.top - gap - panelH;
      }

      left = Math.max(10, Math.min(left, vw - panelW - 10));
      top = Math.max(10, Math.min(top, vh - panelH - 10));
      root.style.setProperty('--node-message-left', `${left}px`);
      root.style.setProperty('--node-message-top', `${top}px`);
      root.style.setProperty('--node-message-transform', 'none');
      frame.current = requestAnimationFrame(position);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const node = target?.closest<HTMLElement>('[data-node]');
      if (!node || !node.dataset.node) return;
      activeId.current = node.dataset.node;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(position);
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
      if (frame.current) cancelAnimationFrame(frame.current);
      root.style.removeProperty('--node-message-left');
      root.style.removeProperty('--node-message-top');
      root.style.removeProperty('--node-message-transform');
    };
  }, []);

  return null;
}
