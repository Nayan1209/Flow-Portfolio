'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, LocateFixed, Minus, Plus, RotateCcw } from 'lucide-react';

type Level = 'home' | 'projects' | 'jobpilot' | 'ironakhada' | 'portfolio' | 'photography' | 'pylauncher' | 'experience' | 'skills' | 'philosophy' | 'contact' | 'about';
type Point = { x: number; y: number };
type Node = { id: string; label: string; displayLabel?: string; x: number; y: number; size?: number; description?: string; depth?: number; homeRole?: 'primary' | 'satellite' };
type Graph = { center: Node; nodes: Node[] };
type Detail = { eyebrow: string; title: string; body: string; tags: string[]; links?: { label: string; href: string }[] };

const n = (id: string, label: string, x: number, y: number, description?: string, extra?: Partial<Node>): Node => ({ id, label, x, y, description, ...extra });

const homeGraph: Graph = {
  center: { id: 'nayan', label: 'NAYAN ASATI', x: 0, y: 0, size: 180 },
  nodes: [
    n('projects', 'PROJECTS', -220, -70, undefined, { homeRole: 'primary', size: 78 }),
    n('experience', 'EXPERIENCE', 0, -190, undefined, { homeRole: 'primary', size: 78 }),
    n('skills', 'SKILLS', 220, -70, undefined, { homeRole: 'primary', size: 78 }),
    n('philosophy', 'PHILOSOPHY', -190, 175, undefined, { homeRole: 'primary', size: 78 }),
    n('contact', 'CONTACT', 190, 175, undefined, { homeRole: 'primary', size: 78 }),
    n('about', 'ABOUT', 0, 225, undefined, { homeRole: 'primary', size: 78 }),

    n('jobpilot', 'JOBPILOT AI', -300, -110, 'AI-assisted job outreach workflow', { displayLabel: 'JOBPILOT', homeRole: 'satellite', size: 48 }),
    n('ironakhada', 'IRON AKHADA', -285, -30, 'Fitness-focused web project', { displayLabel: 'IRON AKHADA', homeRole: 'satellite', size: 48 }),
    n('portfolio', 'NAYAN ASATI PORTFOLIO', -220, -150, 'Interactive Flow portfolio experience', { displayLabel: 'PORTFOLIO', homeRole: 'satellite', size: 48 }),
    n('photography', 'GHOUL PHOTOGRAPHY', -145, -125, 'Cinematic photography archive and automated content workflows', { displayLabel: 'PHOTOGRAPHY', homeRole: 'satellite', size: 48 }),
    n('pylauncher', 'PYLAUNCHER', -145, -45, 'Python-based launcher project', { displayLabel: 'PYLAUNCHER', homeRole: 'satellite', size: 48 }),

    n('engineering', 'ENGINEER', -75, -260, 'Analyser Instrument Company Pvt. Ltd. · Nov 2025 – Jun 2026', { displayLabel: 'ANALYSER', homeRole: 'satellite', size: 48 }),
    n('manufacturing', 'ASHOK LEYLAND', 0, -275, 'Graduate Apprentice Trainee · Aug 2024 – Jul 2025', { displayLabel: 'ASHOK LEYLAND', homeRole: 'satellite', size: 48 }),
    n('proposal', 'ROOT-CAUSE', 75, -260, 'Engineering problem solving, process documentation and coordination.', { displayLabel: 'ROOT-CAUSE', homeRole: 'satellite', size: 48 }),
  ]
};

const graphs: Record<Exclude<Level, 'home'>, Graph> = {
  projects:{center:{id:'projects',label:'PROJECTS',x:0,y:0,size:138},nodes:[n('jobpilot','JOBPILOT AI',-290,-105,'AI-assisted job outreach workflow'),n('ironakhada','IRON AKHADA',-145,-205,'Fitness-focused web project'),n('portfolio','NAYAN ASATI PORTFOLIO',145,-205,'Interactive Flow portfolio experience'),n('photography','GHOUL PHOTOGRAPHY',290,-105,'Cinematic photography archive and automated content workflows'),n('pylauncher','PYLAUNCHER',0,205,'Python-based launcher project')]},
  jobpilot:{center:{id:'jobpilot',label:'JOBPILOT AI',x:0,y:0,size:148},nodes:[n('problem','PROBLEM',-270,-110,'Reduce repetitive job-search and outreach work.'),n('system','SYSTEM',0,-205,'Import, matching, drafting, approval and outreach.'),n('technology','TECHNOLOGY',270,-110,'Modern web stack with AI-assisted workflows.'),n('nextjs','NEXT.JS',145,105),n('typescript','TYPESCRIPT',270,200),n('ai','AI AGENT',20,220)]},
  ironakhada:{center:{id:'ironakhada',label:'IRON AKHADA',x:0,y:0,size:142},nodes:[n('fitness','FITNESS',-230,-120,'Fitness-focused product direction.'),n('experience','EXPERIENCE',0,-205,'A focused interface built around the user journey.'),n('build','BUILD',230,-120,'Web implementation and iterative product development.')]},
  portfolio:{center:{id:'portfolio',label:'NAYAN ASATI PORTFOLIO',x:0,y:0,size:148},nodes:[n('flow','FLOW',-230,-120,'Portfolio navigation designed as a connected system.'),n('interactive','INTERACTIVE',0,-205,'Drag, zoom, hover and click interactions.'),n('phases','PHASES',230,-120,'A phased build process from foundation to deep flows.')]},
  photography:{center:{id:'photography',label:'GHOUL PHOTOGRAPHY',x:0,y:0,size:144},nodes:[n('archive','ARCHIVE',-220,-125,'A cinematic photography archive.'),n('gallery','GALLERY',0,-215,'Responsive galleries built for visual browsing.'),n('automation','AUTOMATION',220,-125,'Gemini AI and Instagram API workflows.')]},
  pylauncher:{center:{id:'pylauncher',label:'PYLAUNCHER',x:0,y:0,size:142},nodes:[n('python','PYTHON',-230,-120,'Python-based application development.'),n('launcher','LAUNCHER',0,-205,'A utility-oriented launcher experience.'),n('interface','INTERFACE',230,-120,'Desktop interaction and usability.')]},
  experience:{center:{id:'experience',label:'EXPERIENCE',x:0,y:0,size:138},nodes:[n('engineering','ENGINEER',-245,-105,'Analyser Instrument Company Pvt. Ltd. · Nov 2025 – Jun 2026'),n('manufacturing','ASHOK LEYLAND',0,-205,'Graduate Apprentice Trainee · Aug 2024 – Jul 2025'),n('proposal','ROOT-CAUSE',245,-105,'Engineering problem solving, process documentation and coordination.')]},
  skills:{center:{id:'skills',label:'SKILLS',x:0,y:0,size:138},nodes:[n('frontend','WEB',-245,-105,'HTML5, CSS3, JavaScript, React, Node.js, Bootstrap.'),n('python','PYTHON',0,-205,'Python with FastAPI and Kivy.'),n('platforms','PLATFORMS',245,-105,'Git, GitHub, GitHub Actions, Netlify, Render and GitHub Pages.'),n('api','REST APIs',-125,185,'API-driven product development and integrations.'),n('responsive','RESPONSIVE',125,185,'Responsive web design across desktop and mobile.')]},
  philosophy:{center:{id:'philosophy',label:'PHILOSOPHY',x:0,y:0,size:144},nodes:[n('problem','FIND THE ROOT',-245,-110,'Use engineering-style root-cause analysis before adding complexity.'),n('system','BUILD THE SYSTEM',0,-205,'Think end-to-end: frontend, backend, deployment and workflow.'),n('ai','SHIP WITH LEVERAGE',245,-110,'Use AI-assisted development to move quickly while keeping working software as the goal.')]},
  contact:{center:{id:'contact',label:'CONTACT',x:0,y:0,size:138},nodes:[n('email','EMAIL',-210,-110,'nayanasati2001@gmail.com'),n('linkedin','LINKEDIN',0,-200,'Professional profile and network.'),n('github','GITHUB',210,-110,'Code, experiments and repositories.')]},
  about:{center:{id:'about',label:'ABOUT',x:0,y:0,size:138},nodes:[n('engineer','ENGINEER',-245,-105,'Electrical engineering background with manufacturing and technical proposal experience.'),n('developer','DEVELOPER',0,-200,'Self-taught developer building full products end-to-end.'),n('selftaught','SELF-TAUGHT',245,-105,'Hands-on learning across web development, APIs, deployment and AI-assisted workflows.')]} 
};

const parentOf: Partial<Record<Level,Level>> = { projects:'home', jobpilot:'projects', ironakhada:'projects', portfolio:'projects', photography:'projects', pylauncher:'projects', experience:'home', skills:'home', philosophy:'home', contact:'home', about:'home' };
const childLinks: Record<string,Level|undefined> = { projects:'projects',jobpilot:'jobpilot',ironakhada:'ironakhada',portfolio:'portfolio',photography:'photography',pylauncher:'pylauncher',experience:'experience',skills:'skills',philosophy:'philosophy',contact:'contact',about:'about',engineering:'experience',manufacturing:'experience',proposal:'experience',nayan:'home' };
const externalLinks: Record<string,string|undefined> = { jobpilot:'https://github.com/Nayan1209/jobpilot-ai', photography:'https://ghoul-photography.vercel.app/', email:'mailto:nayanasati2001@gmail.com', linkedin:'https://linkedin.com/in/nayan-1209-asati', github:'https://github.com/Nayan1209' };
const details: Record<Level,Detail> = {
  home:{eyebrow:'NAYAN / HOME',title:'Engineer → Developer',body:'A self-taught developer building full products end-to-end, backed by an engineering mindset for root-cause analysis, documentation and cross-functional problem solving.',tags:['Web Development','Engineering','AI-assisted workflows']},
  projects:{eyebrow:'NAYAN / PROJECTS',title:'Selected work',body:'Five selected projects currently form the Projects network. Each project can open into its own deeper flow.',tags:['JobPilot AI','Iron Akhada','Portfolio','Ghoul Photography','PyLauncher']},
  jobpilot:{eyebrow:'PROJECT / JOBPILOT AI',title:'Job outreach as a flow',body:'A project branch for exploring the problem, system and technology behind an AI-assisted job outreach workflow.',tags:['Next.js','TypeScript','AI'],links:[{label:'OPEN GITHUB',href:'https://github.com/Nayan1209/jobpilot-ai'}]},
  ironakhada:{eyebrow:'PROJECT / IRON AKHADA',title:'Iron Akhada',body:'A web-based fitness radio experience with streamed audio, live listener presence, training stations and immersive UI.',tags:['Next.js','React','TypeScript','Cloudflare']},
  portfolio:{eyebrow:'PROJECT / NAYAN ASATI PORTFOLIO',title:'The Flow portfolio',body:'An interactive portfolio presenting engineering experience, selected work, skills and contact information as a connected flow.',tags:['React','TypeScript','Vite','Tailwind CSS']},
  photography:{eyebrow:'PROJECT / GHOUL PHOTOGRAPHY',title:'A cinematic archive',body:'A responsive photography archive with automated content workflows, built around visual discovery rather than a conventional grid.',tags:['HTML5','CSS3','JavaScript','Gemini AI','Instagram API'],links:[{label:'OPEN PROJECT',href:'https://ghoul-photography.vercel.app/'}]},
  pylauncher:{eyebrow:'PROJECT / PYLAUNCHER',title:'Python utility project',body:'A dedicated branch for PyLauncher, keeping the Python project visible alongside the web products.',tags:['Python','Launcher','Desktop']},
  experience:{eyebrow:'NAYAN / EXPERIENCE',title:'Engineering in practice',body:'Experience spans technical proposals, customer support, shift operations, SAP/HMI workflows, root-cause analysis and quality improvement.',tags:['Analyser Instrument Company','Ashok Leyland','Root-cause analysis']},
  skills:{eyebrow:'NAYAN / SKILLS',title:'A practical stack',body:'The skill network reflects the technologies and platforms used across product delivery.',tags:['JavaScript','Python','React','FastAPI','GitHub Actions']},
  philosophy:{eyebrow:'NAYAN / PHILOSOPHY',title:'Think. Build. Ship.',body:'Understand the root, build the system end-to-end, then use leverage to ship working software.',tags:['Root cause','End-to-end','Leverage']},
  contact:{eyebrow:'NAYAN / CONTACT',title:'Open a connection',body:'Choose a node to open the relevant channel. The network remains the navigation layer.',tags:['Email','LinkedIn','GitHub']},
  about:{eyebrow:'NAYAN / ABOUT',title:'Engineer at the core',body:'Electrical engineering education, manufacturing experience and self-taught software development come together in one practical approach to solving problems.',tags:['B.Tech Electrical Engineering','Developer','Self-taught']}
};
const labels:Record<Level,string>={home:'HOME',projects:'PROJECTS',jobpilot:'JOBPILOT AI',ironakhada:'IRON AKHADA',portfolio:'PORTFOLIO',photography:'GHOUL PHOTOGRAPHY',pylauncher:'PYLAUNCHER',experience:'EXPERIENCE',skills:'SKILLS',philosophy:'PHILOSOPHY',contact:'CONTACT',about:'ABOUT'};
const graphFor=(level:Level):Graph=>level==='home'?homeGraph:graphs[level];
const nodeFor=(level:Level):Node=>graphFor(level).center;

export default function Home(){
  const [level,setLevel]=useState<Level>('home');
  const [scale,setScale]=useState(1);
  const [pan,setPan]=useState<Point>({x:0,y:0});
  const [hovered,setHovered]=useState<string|null>(null);
  const [selected,setSelected]=useState('nayan');
  const [dragging,setDragging]=useState(false);
  const [opening,setOpening]=useState(false);
  const [focusIndex,setFocusIndex]=useState(0);
  const stage=useRef<HTMLDivElement>(null),dragStart=useRef<Point>({x:0,y:0}),panStart=useRef<Point>({x:0,y:0}),velocity=useRef<Point>({x:0,y:0}),animation=useRef<number|null>(null);
  const graph=graphFor(level);
  const ancestry=useMemo<Level[]>(()=>{const chain:Level[]=[];let cursor:Level=level;while(cursor!=='home'){chain.unshift(cursor);cursor=parentOf[cursor]??'home';}return ['home',...chain];},[level]);
  const depth=ancestry.length-1;
  const ancestorNodes=useMemo(()=>ancestry.map((item,index)=>{const node=nodeFor(item),distance=depth-index;return {...node,x:90-distance*150,y:0,size:distance===0?node.size:Math.max(52,(node.size??110)*Math.pow(.72,distance)),depth:distance};}),[ancestry,depth]);
  const nested=level!=='home';
  const focus=nested?ancestorNodes[depth]:graph.center;
  const displayNodes=nested?graph.nodes.map(node=>({...node,x:focus.x+node.x*.5,y:node.y*.5})):graph.nodes;
  const allNodes=nested?[...ancestorNodes,...displayNodes]:[graph.center,...displayNodes];
  const activeId=hovered??selected,activeNode=allNodes.find(node=>node.id===activeId),detail=details[level];
  const trace=ancestry.map(item=>item==='home'?'NAYAN ASATI':labels[item]);

  const setLevelView=(next:Level)=>{const nextDepth=next==='home'?0:next==='projects'?1:depth+1;setLevel(next);setScale(Math.max(.68,1-nextDepth*.055));setPan({x:0,y:0});setHovered(null);setSelected(next==='home'?'nayan':nodeFor(next).id);setFocusIndex(0);velocity.current={x:0,y:0};};
  const resetView=(next:Level='home')=>setLevelView(next);
  const zoom=(factor:number,origin?:Point)=>setScale(current=>{const next=Math.min(2.65,Math.max(.58,current*factor));if(origin){const ratio=next/current;setPan(p=>({x:origin.x-(origin.x-p.x)*ratio,y:origin.y-(origin.y-p.y)*ratio}));}return next;});
  const selectNode=(node:Node)=>{if(node.id==='nayan'){resetView('home');return;}const ancestor=ancestry.find(item=>item!=='home'&&nodeFor(item).id===node.id);if(ancestor){setLevelView(ancestor);return;}setSelected(node.id);const next=childLinks[node.id];if(next&&next!=='home'){setOpening(true);setLevel(next);setScale(Math.max(.68,1-ancestry.length*.055));setPan({x:0,y:0});setHovered(null);window.setTimeout(()=>setOpening(false),480);return;}const link=externalLinks[node.id];if(link)window.open(link,'_blank','noopener,noreferrer');};
  const focusNode=(index:number)=>{const safe=((index%allNodes.length)+allNodes.length)%allNodes.length;setFocusIndex(safe);setSelected(allNodes[safe].id);setHovered(allNodes[safe].id);};
  const onWheel=(event:React.WheelEvent<HTMLDivElement>)=>{event.preventDefault();const rect=stage.current?.getBoundingClientRect();const origin=rect?{x:event.clientX-(rect.left+rect.width/2),y:event.clientY-(rect.top+rect.height/2)}:undefined;zoom(event.deltaY<0?1.075:.93,origin);};
  const onPointerDown=(event:React.PointerEvent<HTMLDivElement>)=>{if((event.target as Element).closest('[data-node]')||(event.target as Element).closest('button')||(event.target as Element).closest('a'))return;setDragging(true);dragStart.current={x:event.clientX,y:event.clientY};panStart.current=pan;velocity.current={x:0,y:0};stage.current?.setPointerCapture(event.pointerId);};
  const onPointerMove=(event:React.PointerEvent<HTMLDivElement>)=>{if(!dragging)return;const dx=event.clientX-dragStart.current.x,dy=event.clientY-dragStart.current.y;setPan({x:panStart.current.x+dx,y:panStart.current.y+dy});velocity.current={x:dx*.045,y:dy*.045};};
  const stopDrag=()=>{setDragging(false);if(animation.current)cancelAnimationFrame(animation.current);const coast=()=>{velocity.current.x*=.91;velocity.current.y*=.91;if(Math.abs(velocity.current.x)+Math.abs(velocity.current.y)<.15)return;setPan(p=>({x:p.x+velocity.current.x,y:p.y+velocity.current.y}));animation.current=requestAnimationFrame(coast);};animation.current=requestAnimationFrame(coast);};
  useEffect(()=>()=>{if(animation.current)cancelAnimationFrame(animation.current);},[]);
  useEffect(()=>{const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')resetView('home');if(event.key==='+'||event.key==='=')zoom(1.08);if(event.key==='-')zoom(.925);if(event.key==='0')resetView(level);if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();focusNode(focusIndex+1);}if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();focusNode(focusIndex-1);}if(event.key==='Enter'){const node=allNodes[focusIndex];if(node)selectNode(node);}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[level,focusIndex,allNodes]);

  const primaryHomeNodes=displayNodes.filter(node=>node.homeRole==='primary');
  const projectHomeNodes=displayNodes.filter(node=>['jobpilot','ironakhada','portfolio','photography','pylauncher'].includes(node.id));
  const experienceHomeNodes=displayNodes.filter(node=>['engineering','manufacturing','proposal'].includes(node.id));

  return <main className="flow" ref={stage} onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
    <div className="flow-grid"/><div className="flow-vignette"/>
    <header className="flow-header"><button className="flow-wordmark" onClick={()=>resetView('home')} aria-label="Return home">FLOW<span>.</span></button><div className="flow-header-meta"><span>PORTFOLIO / 04</span><span>FLOW NETWORK</span></div></header>
    <div className="flow-trace" aria-label="Current navigation path">{trace.map((item,index)=><span key={`${item}-${index}`} className={index===trace.length-1?'current':''}>{item}{index<trace.length-1&&<b>→</b>}</span>)}</div>
    <section className={`flow-stage ${dragging?'is-dragging':''} ${opening?'is-opening':''}`} aria-label="Nayan Asati interactive portfolio network"><div className="flow-world" style={{transform:`translate3d(${pan.x}px,${pan.y}px,0) scale(${scale})`}}>
      <svg className="flow-lines" viewBox="-520 -410 1040 820" aria-hidden="true">
        {nested&&ancestorNodes.slice(1).map((node,index)=>{const previous=ancestorNodes[index];return <line key={`ancestor-${node.id}`} className={activeId===node.id||activeId===previous.id?'active':''} x1={previous.x} y1={previous.y} x2={node.x} y2={node.y}/>;})}
        {!nested&&primaryHomeNodes.map(node=><line key={`home-primary-${node.id}`} className={activeId===node.id||activeId==='nayan'?'active':''} x1={focus.x} y1={focus.y} x2={node.x} y2={node.y}/>)}
        {!nested&&projectHomeNodes.map(node=>{const parent=primaryHomeNodes.find(item=>item.id==='projects');return parent&&<line key={`home-project-${node.id}`} className={activeId===node.id||activeId==='projects'?'active':''} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y}/>;})}
        {!nested&&experienceHomeNodes.map(node=>{const parent=primaryHomeNodes.find(item=>item.id==='experience');return parent&&<line key={`home-experience-${node.id}`} className={activeId===node.id||activeId==='experience'?'active':''} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y}/>;})}
        {nested&&displayNodes.map(node=><line key={node.id} className={activeId===node.id?'active':''} x1={focus.x} y1={focus.y} x2={node.x} y2={node.y}/>)}
        {level==='jobpilot'&&<><line className={activeId==='nextjs'||activeId==='typescript'?'active':''} x1={displayNodes.find(n=>n.id==='technology')?.x??245} y1={displayNodes.find(n=>n.id==='technology')?.y??-63} x2={displayNodes.find(n=>n.id==='nextjs')?.x??173} y2={displayNodes.find(n=>n.id==='nextjs')?.y??58}/><line className={activeId==='ai'?'active':''} x1={displayNodes.find(n=>n.id==='system')?.x??90} y1={displayNodes.find(n=>n.id==='system')?.y??-115} x2={displayNodes.find(n=>n.id==='ai')?.x??100} y2={displayNodes.find(n=>n.id==='ai')?.y??122}/></>}
      </svg>
      {allNodes.map((node,index)=><button key={`${node.id}-${index}`} data-node className={`flow-node ${node.id===focus.id?'center focus-center':''} ${node.homeRole==='primary'?'home-primary':''} ${node.homeRole==='satellite'?'home-satellite':''} ${node.depth?`ancestor-depth-${node.depth}`:''} ${node.id==='nayan'?'root-persistent':''} ${activeId===node.id?'active':''}`} style={{left:`calc(50% + ${node.x}px)`,top:`calc(50% + ${node.y}px)`,'--node-size':`${node.size??54}px`} as React.CSSProperties} onClick={()=>selectNode(node)} onMouseEnter={()=>{setHovered(node.id);setSelected(node.id);}} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(node.id)} onBlur={()=>setHovered(null)} aria-label={node.id==='nayan'?'Return home':`Explore ${node.label}`}><span className="node-halo"/><span className="node-core">{node.displayLabel??node.label}</span>{node.description&&<span className="node-description">{node.description}</span>}</button>)}
    </div></section>
    <aside className="flow-detail phase4-detail" aria-live="polite"><span>{detail.eyebrow}</span><h1>{activeNode?.label??detail.title}</h1><p>{activeNode?.description??detail.body}</p><div className="detail-tags">{detail.tags.map(tag=><span key={tag}>{tag}</span>)}</div>{detail.links&&<div className="detail-links">{detail.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <ExternalLink size={12}/></a>)}</div>}</aside>
    <aside className="flow-path" aria-label="Path status"><span>TRACE</span><strong>{activeNode?.label??labels[level]}</strong><small>{level==='home'?'ROOT NODE':`DEPTH ${depth} · ANCESTRY VISIBLE`}</small></aside>
    <aside className="flow-controls" aria-label="Network controls">{level!=='home'&&<button onClick={()=>resetView('home')} aria-label="Back to home"><ArrowLeft size={14}/></button>}<button onClick={()=>zoom(.9)} aria-label="Zoom out"><Minus size={14}/></button><span>{Math.round(scale*100)}%</span><button onClick={()=>zoom(1.1)} aria-label="Zoom in"><Plus size={14}/></button><button onClick={()=>resetView(level)} aria-label="Reset view"><RotateCcw size={14}/></button><button onClick={()=>{setPan({x:0,y:0});setScale(level==='home'?1:Math.max(.68,1-depth*.055));}} aria-label="Center network"><LocateFixed size={14}/></button></aside>
    <footer className="flow-footer"><div><small>FLOW PORTFOLIO</small><strong>CINEMATIC NAVIGATION</strong></div><div className="flow-status">{level==='home'?'HOME / 06 CONNECTIONS':`${homeGraph.center.label} / ${graph.nodes.length} FOCUS NODES`}</div><div className="flow-footer-right">ESC / HOME · ARROWS / TRACE</div></footer>
  </main>;
}
