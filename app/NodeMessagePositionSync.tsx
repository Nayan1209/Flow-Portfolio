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
      const gap = mobile ? 14 : 26;
      const panelW = Math.min(620, vw - (mobile ? 28 : 40));
      const panelH = Math.min(mobile ? vh * .58 : vh * .58, mobile ? 520 : 560);
      let left = rect.right + gap;
      let top = rect.top + rect.height / 2 - panelH / 2;
      if (!mobile && left + panelW > vw - 14) left = rect.left - gap - panelW;
      if (left < 14 || mobile) {
        left = rect.left + rect.width / 2 - panelW / 2;
        top = rect.bottom + gap;
        if (top + panelH > vh - 12) top = rect.top - gap - panelH;
      }
      left = Math.max(12, Math.min(left, vw - panelW - 12));
      top = Math.max(12, Math.min(top, vh - panelH - 12));
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
