'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Minus, Plus, RotateCcw } from 'lucide-react';

type NodeId =
  | 'nayan'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'philosophy'
  | 'contact'
  | 'about'
  | 'jobpilot'
  | 'photography'
  | 'windows'
  | 'problem'
  | 'system'
  | 'technology'
  | 'nextjs'
  | 'typescript'
  | 'ai'
  | 'engineering'
  | 'manufacturing'
  | 'proposal';

type Level = 'home' | 'projects' | 'jobpilot' | 'experience' | 'skills' | 'philosophy' | 'contact' | 'about';
type Point = { x: number; y: number };
type Node = { id: NodeId; label: string; x: number; y: number; size?: number; description?: string };

type Graph = { center: Node; nodes: Node[] };

const homeGraph: Graph = {
  center: { id: 'nayan', label: 'NAYAN ASATI', x: 0, y: 0, size: 150 },
  nodes: [
    { id: 'projects', label: 'PROJECTS', x: -300, y: -110 },
    { id: 'experience', label: 'EXPERIENCE', x: 0, y: -270 },
    { id: 'skills', label: 'SKILLS', x: 300, y: -110 },
    { id: 'philosophy', label: 'PHILOSOPHY', x: -260, y: 235 },
    { id: 'contact', label: 'CONTACT', x: 260, y: 235 },
    { id: 'about', label: 'ABOUT', x: 0, y: 315 },
  ],
};

const projectGraph: Graph = {
  center: { id: 'projects', label: 'PROJECTS', x: 0, y: 0, size: 112 },
  nodes: [
    { id: 'jobpilot', label: 'JOBPILOT AI', x: -300, y: -120, description: 'AI-assisted job outreach workflow' },
    { id: 'photography', label: 'PHOTOGRAPHY', x: 0, y: -225, description: 'Cinematic photography archive' },
    { id: 'windows', label: 'WINDOWS UI', x: 300, y: -120, description: 'Interactive interface concept' },
  ],
};

const jobpilotGraph: Graph = {
  center: { id: 'jobpilot', label: 'JOBPILOT AI', x: 0, y: 0, size: 118 },
  nodes: [
    { id: 'problem', label: 'PROBLEM', x: -310, y: -125 },
    { id: 'system', label: 'SYSTEM', x: 0, y: -230 },
    { id: 'technology', label: 'TECHNOLOGY', x: 310, y: -125 },
    { id: 'nextjs', label: 'NEXT.JS', x: 165, y: 115 },
    { id: 'typescript', label: 'TYPESCRIPT', x: 310, y: 225 },
    { id: 'ai', label: 'AI AGENT', x: 20, y: 245 },
  ],
};

const experienceGraph: Graph = {
  center: { id: 'experience', label: 'EXPERIENCE', x: 0, y: 0, size: 112 },
  nodes: [
    { id: 'engineering', label: 'ENGINEER', x: -285, y: -120, description: 'Technical proposals and customer support' },
    { id: 'manufacturing', label: 'ASHOK LEYLAND', x: 0, y: -230, description: 'Shift operations and quality improvement' },
    { id: 'proposal', label: 'ROOT-CAUSE', x: 285, y: -120, description: 'Data-backed engineering problem solving' },
  ],
};

const skillsGraph: Graph = {
  center: { id: 'skills', label: 'SKILLS', x: 0, y: 0, size: 112 },
  nodes: [
    { id: 'nextjs', label: 'REACT / NEXT', x: -285, y: -120 },
    { id: 'typescript', label: 'JAVASCRIPT / TS', x: 0, y: -230 },
    { id: 'ai', label: 'PYTHON / AI', x: 285, y: -120 },
    { id: 'proposal', label: 'GIT / GITHUB', x: -145, y: 205 },
    { id: 'system', label: 'REST APIs', x: 145, y: 205 },
  ],
};

const philosophyGraph: Graph = {
  center: { id: 'philosophy', label: 'PHILOSOPHY', x: 0, y: 0, size: 122 },
  nodes: [
    { id: 'problem', label: 'FIND THE ROOT', x: -285, y: -125 },
    { id: 'system', label: 'BUILD THE SYSTEM', x: 0, y: -230 },
    { id: 'ai', label: 'SHIP WITH LEVERAGE', x: 285, y: -125 },
  ],
};

const contactGraph: Graph = {
  center: { id: 'contact', label: 'CONTACT', x: 0, y: 0, size: 112 },
  nodes: [
    { id: 'engineering', label: 'EMAIL', x: -240, y: -125 },
    { id: 'proposal', label: 'LINKEDIN', x: 0, y: -220 },
    { id: 'system', label: 'GITHUB', x: 240, y: -125 },
  ],
};

const aboutGraph: Graph = {
  center: { id: 'about', label: 'ABOUT', x: 0, y: 0, size: 112 },
  nodes: [
    { id: 'engineering', label: 'ENGINEER', x: -285, y: -120 },
    { id: 'system', label: 'DEVELOPER', x: 0, y: -225 },
    { id: 'ai', label: 'SELF-TAUGHT', x: 285, y: -120 },
  ],
};

const graphs: Record<Exclude<Level, 'home'>, Graph> = {
  projects: projectGraph,
  jobpilot: jobpilotGraph,
  experience: experienceGraph,
  skills: skillsGraph,
  philosophy: philosophyGraph,
  contact: contactGraph,
  about: aboutGraph,
};

const childLinks: Record<NodeId, Level | undefined> = {
  nayan: 'home', projects: 'projects', jobpilot: 'jobpilot', experience: 'experience', skills: 'skills', philosophy: 'philosophy', contact: 'contact', about: 'about',
  photography: undefined, windows: undefined, problem: undefined, system: undefined, technology: undefined, nextjs: undefined, typescript: undefined, ai: undefined, engineering: undefined, manufacturing: undefined, proposal: undefined,
};

const externalLinks: Partial<Record<NodeId, string>> = {
  jobpilot: 'https://github.com/Nayan1209/jobpilot-ai',
  photography: 'https://ghoul-photography.vercel.app/',
  windows: 'https://github.com/Nayan1209',
  engineering: 'mailto:nayanasati2001@gmail.com',
};

function graphFor(level: Level): Graph {
  return level === 'home' ? homeGraph : graphs[level];
}

export default function Home() {
  const [level, setLevel] = useState<Level>('home');
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const dragStart = useRef<Point>({ x: 0, y: 0 });
  const panStart = useRef<Point>({ x: 0, y: 0 });
  const velocity = useRef<Point>({ x: 0, y: 0 });
  const animation = useRef<number | null>(null);

  const graph = graphFor(level);
  const allNodes = useMemo(() => [graph.center, ...graph.nodes], [graph]);
  const activeNode = allNodes.find((node) => node.id === hovered);

  const resetView = (nextLevel: Level = 'home') => {
    setLevel(nextLevel);
    setScale(nextLevel === 'home' ? 1 : 1.04);
    setPan({ x: 0, y: 0 });
    setHovered(null);
    velocity.current = { x: 0, y: 0 };
  };

  const zoom = (factor: number, origin?: Point) => {
    setScale((current) => {
      const next = Math.min(2.65, Math.max(0.58, current * factor));
      if (origin) {
        const ratio = next / current;
        setPan((p) => ({ x: origin.x - (origin.x - p.x) * ratio, y: origin.y - (origin.y - p.y) * ratio }));
      }
      return next;
    });
  };

  const selectNode = (node: Node) => {
    const nextLevel = childLinks[node.id];
    if (nextLevel) {
      resetView(nextLevel);
      return;
    }
    const link = externalLinks[node.id];
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = stage.current?.getBoundingClientRect();
    const origin = rect ? { x: event.clientX - (rect.left + rect.width / 2), y: event.clientY - (rect.top + rect.height / 2) } : undefined;
    zoom(event.deltaY < 0 ? 1.075 : 0.93, origin);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('[data-node]') || (event.target as Element).closest('button')) return;
    setDragging(true);
    dragStart.current = { x: event.clientX, y: event.clientY };
    panStart.current = pan;
    velocity.current = { x: 0, y: 0 };
    stage.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = event.clientX - dragStart.current.x;
    const dy = event.clientY - dragStart.current.y;
    setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    velocity.current = { x: dx * 0.045, y: dy * 0.045 };
  };

  const stopDrag = () => {
    setDragging(false);
    if (animation.current) cancelAnimationFrame(animation.current);
    const coast = () => {
      velocity.current.x *= 0.91;
      velocity.current.y *= 0.91;
      if (Math.abs(velocity.current.x) + Math.abs(velocity.current.y) < 0.15) return;
      setPan((p) => ({ x: p.x + velocity.current.x, y: p.y + velocity.current.y }));
      animation.current = requestAnimationFrame(coast);
    };
    animation.current = requestAnimationFrame(coast);
  };

  useEffect(() => () => { if (animation.current) cancelAnimationFrame(animation.current); }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') resetView(level === 'home' ? 'home' : 'home');
      if (event.key === '+' || event.key === '=') zoom(1.08);
      if (event.key === '-') zoom(0.925);
      if (event.key === '0') resetView(level);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [level]);

  const pathLabel = level === 'home' ? 'NAYAN / HOME' : `NAYAN / ${graph.center.label}`;

  return (
    <main className="flow" ref={stage} onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
      <div className="flow-grid" />
      <div className="flow-vignette" />

      <header className="flow-header">
        <button className="flow-wordmark" onClick={() => resetView('home')} aria-label="Return home">FLOW<span>.</span></button>
        <div className="flow-header-meta"><span>PORTFOLIO / 02</span><span>FLOW NETWORK</span></div>
      </header>

      <div className="flow-instructions">DRAG TO MOVE <i /> SCROLL TO ZOOM <i /> HOVER TO TRACE <i /> CLICK TO EXPLORE</div>

      <section className={`flow-stage ${dragging ? 'is-dragging' : ''}`} aria-label="Nayan Asati interactive portfolio network">
        <div className="flow-world" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})` }}>
          <svg className="flow-lines" viewBox="-520 -410 1040 820" aria-hidden="true">
            {graph.nodes.map((node) => {
              const active = hovered === node.id;
              return <line key={node.id} className={active ? 'active' : ''} x1={graph.center.x} y1={graph.center.y} x2={node.x} y2={node.y} />;
            })}
            {level === 'jobpilot' && <>
              <line className={hovered === 'nextjs' || hovered === 'typescript' ? 'active' : ''} x1="310" y1="-125" x2="165" y2="115" />
              <line className={hovered === 'ai' ? 'active' : ''} x1="0" y1="-230" x2="20" y2="245" />
            </>}
          </svg>

          {graph.nodes.map((node) => {
            const active = hovered === node.id;
            const connected = hovered !== null && hovered === node.id;
            return (
              <button
                key={node.id}
                data-node
                className={`flow-node ${active ? 'active' : ''} ${connected ? 'trace' : ''}`}
                style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)` } as React.CSSProperties}
                onClick={() => selectNode(node)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
                aria-label={`Explore ${node.label}`}
              >
                <span className="node-halo" />
                <span className="node-core">{node.label}</span>
                {node.description && <span className="node-description">{node.description}</span>}
              </button>
            );
          })}

          <button
            data-node
            className="flow-node center"
            style={{ left: '50%', top: '50%' }}
            onClick={() => level !== 'home' && resetView('home')}
            aria-label={level === 'home' ? 'Nayan Asati' : `Return to ${graph.center.label}`}
          >
            <span className="node-halo" />
            <span className="node-core">{graph.center.label}</span>
          </button>
        </div>
      </section>

      <aside className="flow-detail" aria-live="polite">
        <span>{pathLabel}</span>
        {activeNode?.description && <strong>{activeNode.description}</strong>}
      </aside>

      <aside className="flow-controls" aria-label="Network controls">
        {level !== 'home' && <button onClick={() => resetView('home')} aria-label="Back to home"><ArrowLeft size={14} /></button>}
        <button onClick={() => zoom(0.9)} aria-label="Zoom out"><Minus size={14} /></button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => zoom(1.1)} aria-label="Zoom in"><Plus size={14} /></button>
        <button onClick={() => resetView(level)} aria-label="Reset view"><RotateCcw size={14} /></button>
      </aside>

      <footer className="flow-footer">
        <div><small>PHASE 02</small><strong>FLOW ENGINE</strong></div>
        <div className="flow-status">{level === 'home' ? 'HOME / 06 CONNECTIONS' : `${graph.center.label} / ${graph.nodes.length} NODES`}</div>
        <div className="flow-footer-right">{level === 'home' ? 'ESC / RESET' : 'ESC / HOME'}</div>
      </footer>
    </main>
  );
}
