'use client';

import { useEffect } from 'react';

/** Keeps the existing message layer visually attached to its source node.
 * This is intentionally isolated so the graph and message content stay untouched. */
export default function NodeMessagePositionFix() {
  useEffect(() => {
    let raf = 0;

    const position = () => {
      const panel = document.querySelector<HTMLElement>('.node-message');
      if (!panel) return;

      const title = panel.querySelector<HTMLElement>('#node-message-title')?.textContent?.trim();
      if (!title) return;

      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-node]'));
      const source = nodes.find((node) => {
        const text = node.querySelector('.node-core > span')?.textContent?.trim();
        return text === title || node.getAttribute('aria-label')?.startsWith(`${title} —`);
      });
      if (!source) return;

      const rect = source.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const panelWidth = Math.min(620, vw - 40);
      const panelHeight = Math.min(panel.offsetHeight || 360, vh * 0.58);
      const gap = Math.min(34, Math.max(20, source.offsetWidth * 0.35));
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Prefer the side with more breathing room, while keeping the panel close.
      let left = centerX + rect.width / 2 + gap + panelWidth / 2;
      let top = centerY;
      if (left + panelWidth / 2 > vw - 18) {
        left = centerX - rect.width / 2 - gap - panelWidth / 2;
      }
      if (left - panelWidth / 2 < 18) {
        left = centerX;
        top = centerY + rect.height / 2 + gap + panelHeight / 2;
      }
      if (top + panelHeight / 2 > vh - 18) top = vh - 18 - panelHeight / 2;
      if (top - panelHeight / 2 < 18) top = 18 + panelHeight / 2;

      // Keep the animation's starting point at the source node too.
      const fromX = `${centerX - left}px`;
      const fromY = `${centerY - top}px`;
      panel.style.setProperty('--node-message-left', `${left}px`);
      panel.style.setProperty('--node-message-top', `${top}px`);
      panel.style.setProperty('--node-message-from-x', `calc(-50% + ${fromX})`);
      panel.style.setProperty('--node-message-from-y', `calc(-50% + ${fromY})`);
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(position);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
    };
  }, []);

  return null;
}
