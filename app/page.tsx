'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Minus, Plus, RotateCcw, ExternalLink } from 'lucide-react';

type NodeId = string;
type Level = 'home' | 'projects' | 'jobpilot' | 'photography' | 'windows' | 'experience' | 'skills' | 'philosophy' | 'contact' | 'about';
type Point = { x: number; y: number };
type Node = { id: NodeId; label: string; x: number; y: number; size?: number; description?: string };
type Graph = { center: Node; nodes: Node[] };
type Detail = { eyebrow: string; title: string; body: string; tags: string[]; links?: { label: string; href: string }[] };

const homeGraph: Graph = { center: { id: 'nayan', label: 'NAYAN ASATI', x: 0, y: 0, size: 150 }, nodes: [
  { id: 'projects', label: 'PROJECTS', x: -300, y: -110 }, { id: 'experience', label: 'EXPERIENCE', x: 0, y: -270 }, { id: 'skills', label: 'SKILLS', x: 300, y: -110 },
  { id: 'philosophy', label: 'PHILOSOPHY', x: -260, y: 235 }, { id: 'contact', label: 'CONTACT', x: 260, y: 235 }, { id: 'about', label: 'ABOUT', x: 0, y: 315 },
] };

const projectGraph: Graph = { center: { id: 'projects', label: 'PROJECTS', x: 0, y: 0, size: 112 }, nodes: [
  { id: 'jobpilot', label: 'JOBPILOT AI', x: -300, y: -120, description: 'AI-assisted job outreach workflow' },
  { id: 'photography', label: 'GHoul PHOTOGRAPHY', x: 0, y: -225, description: 'Cinematic photography archive and automated content workflows' },
  { id: 'windows', label: 'WINDOWS UI', x: 300, y: -120, description: 'Interactive interface concept' },
] };

const jobpilotGraph: Graph = { center: { id: 'jobpilot', label: 'JOBPILOT AI', x: 0, y: 0, size: 118 }, nodes: [
  { id: 'problem', label: 'PROBLEM', x: -310, y: -125, description: 'Reduce repetitive job-search and outreach work.' },
  { id: 'system', label: 'SYSTEM', x: 0, y: -230, description: 'A flow from import and matching through drafting, approval and outreach.' },
  { id: 'technology', label: 'TECHNOLOGY', x: 310, y: -125, description: 'Modern web stack with AI-assisted development workflows.' },
  { id: 'nextjs', label: 'NEXT.JS', x: 165, y: 115 }, { id: 'typescript', label: 'TYPESCRIPT', x: 310, y: 225 }, { id: 'ai', label: 'AI AGENT', x: 20, y: 245 },
] };

const photographyGraph: Graph = { center: { id: 'photography', label: 'GHOUL PHOTOGRAPHY', x: 0, y: 0, size: 124 }, nodes: [
  { id: 'archive', label: 'ARCHIVE', x: -260, y: -150, description: 'A cinematic photography archive.' },
  { id: 'gallery', label: 'GALLERY', x: 0, y: -240, description: 'Responsive galleries built for visual browsing.' },
  { id: 'automation', label: 'AUTOMATION', x: 260, y: -150, description: 'Gemini AI and Instagram API workflows.' },
] };

const windowsGraph: Graph = { center: { id: 'windows', label: 'WINDOWS UI', x: 0, y: 0, size: 116 }, nodes: [
  { id: 'concept', label: 'CONCEPT', x: -250, y: -140, description: 'Interactive interface exploration.' },
  { id: 'interaction', label: 'INTERACTION', x: 0, y: -230, description: 'A UI-first branch of the Flow portfolio work.' },
  { id: 'repository', label: 'GITHUB', x: 250, y: -140, description: 'Repository-level exploration and implementation.' },
] };

const experienceGraph: Graph = { center: { id: 'experience', label: 'EXPERIENCE', x: 0, y: 0, size: 112 }, nodes: [
  { id: 'engineering', label: 'ENGINEER', x: -285, y: -120, description: 'Analyser Instrument Company Pvt. Ltd. · Nov 2025 – Jun 2026' },
  { id: 'manufacturing', label: 'ASHOK LEYLAND', x: 0, y: -230, description: 'Graduate Apprentice Trainee · Aug 2024 – Jul 2025' },
  { id: 'proposal', label: 'ROOT-CAUSE', x: 285, y: -120, description: 'Engineering problem solving, process documentation and coordination.' },
] };

const skillsGraph: Graph = { center: { id: 'skills', label: 'SKILLS', x: 0, y: 0, size: 112 }, nodes: [
  { id: 'frontend', label: 'WEB', x: -285, y: -120, description: 'HTML5, CSS3, JavaScript, React, Node.js, Bootstrap.' },
  { id: 'python', label: 'PYTHON', x: 0, y: -230, description: 'Python with FastAPI and Kivy.' },
  { id: 'platforms', label: 'PLATFORMS', x: 285, y: -120, description: 'Git, GitHub, GitHub Actions, Netlify, Render and GitHub Pages.' },
  { id: 'api', label: 'REST APIs', x: -145, y: 205, description: 'API-driven product development and integrations.' },
  { id: 'responsive', label: 'RESPONSIVE', x: 145, y: 205, description: 'Responsive web design across desktop and mobile.' },
] };

const philosophyGraph: Graph = { center: { id: 'philosophy', label: 'PHILOSOPHY', x: 0, y: 0, size: 122 }, nodes: [
  { id: 'problem', label: 'FIND THE ROOT', x: -285, y: -125, description: 'Use engineering-style root-cause analysis before adding complexity.' },
  { id: 'system', label: 'BUILD THE SYSTEM', x: 0, y: -230, description: 'Think end-to-end: frontend, backend, deployment and workflow.' },
  { id: 'ai', label: 'SHIP WITH LEVERAGE', x: 285, y: -125, description: 'Use AI-assisted development to move quickly while keeping working software as the goal.' },
] };

const contactGraph: Graph = { center: { id: 'contact', label: 'CONTACT', x: 0, y: 0, size: 112 }, nodes: [
  { id: 'email', label: 'EMAIL', x: -240, y: -125, description: 'nayanasati2001@gmail.com' },
  { id: 'linkedin', label: 'LINKEDIN', x: 0, y: -220, description: 'Professional profile and network.' },
  { id: 'github', label: 'GITHUB', x: 240, y: -125, description: 'Code, experiments and repositories.' },
] };

const aboutGraph: Graph = { center: { id: 'about', label: 'ABOUT', x: 0, y: 0, size: 112 }, nodes: [
  { id: 'engineer', label: 'ENGINEER', x: -285, y: -120, description: 'Electrical engineering background with manufacturing and technical proposal experience.' },
  { id: 'developer', label: 'DEVELOPER', x: 0, y: -225, description: 'Self-taught developer building full products end-to-end.' },
  { id: 'selftaught', label: 'SELF-TAUGHT', x: 285, y: -120, description: 'Hands-on learning across web development, APIs, deployment and AI-assisted workflows.' },
] };

const graphs: Record<Exclude<Level, 'home'>, Graph> = { projects: projectGraph, jobpilot: jobpilotGraph, photography: photographyGraph, windows: windowsGraph, experience: experienceGraph, skills: skillsGraph, philosophy: philosophyGraph, contact: contactGraph, about: aboutGraph };

const childLinks: Record<NodeId, Level | undefined> = {
  nayan: 'home', projects: 'projects', jobpilot: 'jobpilot', photography: 'photography', windows: 'windows', experience: 'experience', skills: 'skills', philosophy: 'philosophy', contact: 'contact', about: 'about',
  problem: undefined, system: undefined, technology: undefined, nextjs: undefined, typescript: undefined, ai: undefined, archive: undefined, gallery: undefined, automation: undefined, concept: undefined, interaction: undefined, repository: undefined, engineering: undefined, manufacturing: undefined, proposal: undefined, frontend: undefined, python: undefined, platforms: undefined, api: undefined, responsive: undefined, email: undefined, linkedin: undefined, github: undefined, engineer: undefined, developer: undefined, selftaught: undefined,
};

const externalLinks: Partial<Record<NodeId, string>> = {
  jobpilot: 'https://github.com/Nayan1209/jobpilot-ai', photography: 'https://ghoul-photography.vercel.app/', windows: 'https://github.com/Nayan1209',
  email: 'mailto:nayanasati2001@gmail.com', linkedin: 'https://linkedin.com/in/nayan-1209-asati', github: 'https://github.com/Nayan1209', repository: 'https://github.com/Nayan1209',
};

const details: Record<Level, Detail> = {
  home: { eyebrow: 'NAYAN / HOME', title: 'Engineer → Developer', body: 'A self-taught developer building full products end-to-end, backed by an engineering mindset for root-cause analysis, documentation and cross-functional problem solving.', tags: ['Web Development', 'Engineering', 'AI-assisted workflows'] },
  projects: { eyebrow: 'NAYAN / PROJECTS', title: 'Selected work', body: 'Explore the work as a network: each project opens into its own deeper branch instead of becoming a conventional portfolio card.', tags: ['Portfolio 2026', 'IRON AKHADA 2026', 'Ghoul Photography 2026'] },
  jobpilot: { eyebrow: 'PROJECT / JOBPILOT AI', title: 'Job outreach as a flow', body: 'A project branch for exploring the problem, system and technology behind an AI-assisted job outreach workflow.', tags: ['Next.js', 'TypeScript', 'AI'] },
  photography: { eyebrow: 'PROJECT / GHOUL PHOTOGRAPHY', title: 'A cinematic archive', body: 'A responsive photography archive with automated content workflows, built around visual discovery rather than a conventional grid.', tags: ['HTML5', 'CSS3', 'JavaScript', 'Gemini AI', 'Instagram API'], links: [{ label: 'OPEN PROJECT', href: 'https://ghoul-photography.vercel.app/' }] },
  windows: { eyebrow: 'PROJECT / WINDOWS UI', title: 'Interface exploration', body: 'An interactive UI concept represented as another branch of the Flow system, keeping interface work connected to the larger portfolio topology.', tags: ['UI', 'Interaction', 'GitHub'], links: [{ label: 'OPEN GITHUB', href: 'https://github.com/Nayan1209' }] },
  experience: { eyebrow: 'NAYAN / EXPERIENCE', title: 'Engineering in practice', body: 'Experience spans technical proposals, customer support, shift operations, SAP/HMI workflows, root-cause analysis and quality improvement.', tags: ['Analyser Instrument Company', 'Ashok Leyland', 'Root-cause analysis'] },
  skills: { eyebrow: 'NAYAN / SKILLS', title: 'A practical stack', body: 'The skill network reflects the tools and technologies listed in the professional profile, organized by how they support product delivery.', tags: ['JavaScript', 'Python', 'React', 'FastAPI', 'GitHub Actions'] },
  philosophy: { eyebrow: 'NAYAN / PHILOSOPHY', title: 'Think. Build. Ship.', body: 'The portfolio connects engineering discipline with modern development: understand the root, build the system end-to-end, then use leverage to ship working software.', tags: ['Root cause', 'End-to-end', 'Leverage'] },
  contact: { eyebrow: 'NAYAN / CONTACT', title: 'Open a connection', body: 'Choose a node to open the relevant channel. The network remains the navigation layer.', tags: ['Email', 'LinkedIn', 'GitHub'] },
  about: { eyebrow: 'NAYAN / ABOUT', title: 'Engineer at the core', body: 'Electrical engineering education, manufacturing experience and self-taught software development come together in one practical approach to solving problems.', tags: ['B.Tech Electrical Engineering', 'Developer', 'Self-taught'] },
};

function graphFor(level: Level): Graph { return level === 'home' ? homeGraph : graphs[level]; }

export default function Home() {
  const [level, setLevel] = useState<Level>('home'); const [scale, setScale] = useState(1); const [pan, setPan] = useState<Point>({ x: 0, y: 0 }); const [hovered, setHovered] = useState<NodeId | null>(null); const [dragging, setDragging] = useState(false);
  const stage = useRef<HTMLDivElement>(null); const dragStart = useRef<Point>({ x: 0, y: 0 }); const panStart = useRef<Point>({ x: 0, y: 0 }); const velocity = useRef<Point>({ x: 0, y: 0 }); const animation = useRef<number | null>(null);
  const graph = graphFor(level); const allNodes = useMemo(() => [graph.center, ...graph.nodes], [graph]); const activeNode = allNodes.find((node) => node.id === hovered); const detail = details[level];

  const resetView = (nextLevel: Level = 'home') => { setLevel(nextLevel); setScale(nextLevel === 'home' ? 1 : 1.04); setPan({ x: 0, y: 0 }); setHovered(null); velocity.current = { x: 0, y: 0 }; };
  const zoom = (factor: number, origin?: Point) => setScale((current) => { const next = Math.min(2.65, Math.max(0.58, current * factor)); if (origin) { const ratio = next / current; setPan((p) => ({ x: origin.x - (origin.x - p.x) * ratio, y: origin.y - (origin.y - p.y) * ratio })); } return next; });
  const selectNode = (node: Node) => { const nextLevel = childLinks[node.id]; if (nextLevel) { resetView(nextLevel); return; } const link = externalLinks[node.id]; if (link) window.open(link, '_blank', 'noopener,noreferrer'); };
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => { event.preventDefault(); const rect = stage.current?.getBoundingClientRect(); const origin = rect ? { x: event.clientX - (rect.left + rect.width / 2), y: event.clientY - (rect.top + rect.height / 2) } : undefined; zoom(event.deltaY < 0 ? 1.075 : 0.93, origin); };
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => { if ((event.target as Element).closest('[data-node]') || (event.target as Element).closest('button')) return; setDragging(true); dragStart.current = { x: event.clientX, y: event.clientY }; panStart.current = pan; velocity.current = { x: 0, y: 0 }; stage.current?.setPointerCapture(event.pointerId); };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => { if (!dragging) return; const dx = event.clientX - dragStart.current.x; const dy = event.clientY - dragStart.current.y; setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy }); velocity.current = { x: dx * 0.045, y: dy * 0.045 }; };
  const stopDrag = () => { setDragging(false); if (animation.current) cancelAnimationFrame(animation.current); const coast = () => { velocity.current.x *= 0.91; velocity.current.y *= 0.91; if (Math.abs(velocity.current.x) + Math.abs(velocity.current.y) < 0.15) return; setPan((p) => ({ x: p.x + velocity.current.x, y: p.y + velocity.current.y })); animation.current = requestAnimationFrame(coast); }; animation.current = requestAnimationFrame(coast); };
  useEffect(() => () => { if (animation.current) cancelAnimationFrame(animation.current); }, []);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') resetView(level === 'home' ? 'home' : 'home'); if (event.key === '+' || event.key === '=') zoom(1.08); if (event.key === '-') zoom(0.925); if (event.key === '0') resetView(level); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [level]);

  return <main className="flow" ref={stage} onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
    <div className="flow-grid" /><div className="flow-vignette" />
    <header className="flow-header"><button className="flow-wordmark" onClick={() => resetView('home')} aria-label="Return home">FLOW<span>.</span></button><div className="flow-header-meta"><span>PORTFOLIO / 03</span><span>FLOW NETWORK</span></div></header>
    <div className="flow-instructions">DRAG TO MOVE <i /> SCROLL TO ZOOM <i /> HOVER TO TRACE <i /> CLICK TO EXPLORE</div>
    <section className={`flow-stage ${dragging ? 'is-dragging' : ''}`} aria-label="Nayan Asati interactive portfolio network"><div className="flow-world" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})` }}>
      <svg className="flow-lines" viewBox="-520 -410 1040 820" aria-hidden="true">
        {graph.nodes.map((node) => <line key={node.id} className={hovered === node.id ? 'active' : ''} x1={graph.center.x} y1={graph.center.y} x2={node.x} y2={node.y} />)}
        {level === 'jobpilot' && <><line className={hovered === 'nextjs' || hovered === 'typescript' ? 'active' : ''} x1="310" y1="-125" x2="165" y2="115" /><line className={hovered === 'ai' ? 'active' : ''} x1="0" y1="-230" x2="20" y2="245" /></>}
      </svg>
      {graph.nodes.map((node) => <button key={node.id} data-node className={`flow-node ${hovered === node.id ? 'active' : ''}`} style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)` } as React.CSSProperties} onClick={() => selectNode(node)} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(node.id)} onBlur={() => setHovered(null)} aria-label={`Explore ${node.label}`}><span className="node-halo" /><span className="node-core">{node.label}</span>{node.description && <span className="node-description">{node.description}</span>}</button>)}
      <button data-node className="flow-node center" style={{ left: '50%', top: '50%' }} onClick={() => level !== 'home' && resetView('home')} aria-label={level === 'home' ? 'Nayan Asati' : 'Return home'}><span className="node-halo" /><span className="node-core">{graph.center.label}</span></button>
    </div></section>

    <aside className="flow-detail phase3-detail" aria-live="polite"><span>{detail.eyebrow}</span><h1>{activeNode?.label ?? detail.title}</h1><p>{activeNode?.description ?? detail.body}</p><div className="detail-tags">{detail.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{detail.links && <div className="detail-links">{detail.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <ExternalLink size={12} /></a>)}</div>}</aside>

    <aside className="flow-controls" aria-label="Network controls">{level !== 'home' && <button onClick={() => resetView('home')} aria-label="Back to home"><ArrowLeft size={14} /></button>}<button onClick={() => zoom(0.9)} aria-label="Zoom out"><Minus size={14} /></button><span>{Math.round(scale * 100)}%</span><button onClick={() => zoom(1.1)} aria-label="Zoom in"><Plus size={14} /></button><button onClick={() => resetView(level)} aria-label="Reset view"><RotateCcw size={14} /></button></aside>
    <footer className="flow-footer"><div><small>PHASE 03</small><strong>DEEP FLOW</strong></div><div className="flow-status">{level === 'home' ? 'HOME / 06 CONNECTIONS' : `${graph.center.label} / ${graph.nodes.length} NODES`}</div><div className="flow-footer-right">{level === 'home' ? 'ESC / RESET' : 'ESC / HOME'}</div></footer>
  </main>;
}
