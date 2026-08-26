'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Minus, Plus } from 'lucide-react';
import './network.css';

type NodeId = 'nayan' | 'projects' | 'experience' | 'skills' | 'philosophy' | 'contact' | 'about' | 'jobpilot' | 'photography' | 'windows';
type Point = { x: number; y: number };
type Node = { id: NodeId; label: string; x: number; y: number; size?: number };

const homeNodes: Node[] = [
  { id: 'nayan', label: 'NAYAN ASATI', x: 0, y: 0, size: 74 },
  { id: 'projects', label: 'PROJECTS', x: -290, y: -90 },
  { id: 'experience', label: 'EXPERIENCE', x: 0, y: -255 },
  { id: 'skills', label: 'SKILLS', x: 290, y: -90 },
  { id: 'philosophy', label: 'PHILOSOPHY', x: -245, y: 230 },
  { id: 'contact', label: 'CONTACT', x: 250, y: 225 },
  { id: 'about', label: 'ABOUT', x: 0, y: 305 },
];

const projectNodes: Node[] = [
  { id: 'projects', label: 'PROJECTS', x: 0, y: 0, size: 58 },
  { id: 'jobpilot', label: 'JOBPILOT AI', x: -285, y: -120 },
  { id: 'photography', label: 'PHOTOGRAPHY', x: 0, y: -215 },
  { id: 'windows', label: 'WINDOWS UI', x: 285, y: -120 },
];

const projectLinks: Partial<Record<NodeId, string>> = {
  jobpilot: 'https://github.com/Nayan1209/jobpilot-ai',
  photography: 'https://ghoul-photography.vercel.app/',
};

export default function Home() {
  const [level, setLevel] = useState<'home' | 'projects'>('home');
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [dragging, setDragging] = useState(false);
  const start = useRef<Point>({ x: 0, y: 0 });
  const startPan = useRef<Point>({ x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);

  const nodes = level === 'home' ? homeNodes : projectNodes;
  const edges = useMemo(() => nodes.filter((n) => n.id !== (level === 'home' ? 'nayan' : 'projects')), [level, nodes]);
  const centerId = level === 'home' ? 'nayan' : 'projects';

  const reset = () => { setLevel('home'); setScale(1); setPan({ x: 0, y: 0 }); setHovered(null); };
  const zoom = (factor: number) => setScale((v) => Math.min(2.4, Math.max(0.65, v * factor)));

  const select = (node: Node) => {
    if (node.id === 'nayan') return reset();
    if (node.id === 'projects') { setLevel('projects'); setScale(1.08); setPan({ x: 0, y: 0 }); return; }
    const link = projectLinks[node.id];
    if (level === 'projects' && link) window.open(link, '_blank', 'noopener,noreferrer');
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoom(event.deltaY < 0 ? 1.08 : 0.925);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('[data-node]')) return;
    setDragging(true);
    start.current = { x: event.clientX, y: event.clientY };
    startPan.current = pan;
    stage.current?.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPan({ x: startPan.current.x + event.clientX - start.current.x, y: startPan.current.y + event.clientY - start.current.y });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') reset();
      if (event.key === '+' || event.key === '=') zoom(1.08);
      if (event.key === '-') zoom(.925);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="flow" ref={stage} onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}>
      <div className="flow-grid" />
      <header className="flow-header">
        <button className="flow-wordmark" onClick={reset}>FLOW<span>.</span></button>
        <div className="flow-header-meta"><span>PORTFOLIO / 01</span><span>INTERACTIVE NETWORK</span></div>
      </header>

      <div className="flow-instructions">DRAG TO MOVE <i /> SCROLL TO ZOOM <i /> CLICK TO EXPLORE</div>

      <section className={`flow-stage ${dragging ? 'is-dragging' : ''}`} aria-label="Nayan Asati interactive portfolio network">
        <div className="flow-world" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})` }}>
          <svg className="flow-lines" viewBox="-500 -390 1000 780" aria-hidden="true">
            {edges.map((node) => {
              const center = nodes.find((n) => n.id === centerId)!;
              const active = hovered === node.id;
              return <line key={node.id} className={active ? 'active' : ''} x1={center.x} y1={center.y} x2={node.x} y2={node.y} />;
            })}
          </svg>

          {nodes.map((node) => {
            const center = node.id === centerId;
            const active = hovered === node.id;
            return (
              <button
                key={node.id}
                data-node
                className={`flow-node ${center ? 'center' : ''} ${active ? 'active' : ''}`}
                style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, '--node-size': `${node.size ?? 48}px` } as React.CSSProperties}
                onClick={() => select(node)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`Explore ${node.label}`}
              >
                <span className="node-ring" />
                <span className="node-core">{node.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="flow-controls">
        <button onClick={() => zoom(.9)} aria-label="Zoom out"><Minus size={14} /></button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => zoom(1.1)} aria-label="Zoom in"><Plus size={14} /></button>
        <button onClick={reset} aria-label="Reset network"><RotateCcw size={14} /></button>
      </aside>

      <footer className="flow-footer">
        <div><small>PHASE 01</small><strong>THE NETWORK</strong></div>
        <div className="flow-status">{level === 'home' ? 'HOME / 06 CONNECTIONS' : 'PROJECTS / 03 PROJECTS'}</div>
        <div className="flow-footer-right">{level === 'projects' ? 'ESC TO RETURN' : 'SCROLL / ZOOM'}</div>
      </footer>
    </main>
  );
}
