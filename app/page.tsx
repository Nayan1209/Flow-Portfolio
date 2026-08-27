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
    n('projects', 'PROJECTS', -220, -70, undefined, { homeRole: 'primary', size: 88 }),
    n('experience', 'EXPERIENCE', 0, -190, undefined, { homeRole: 'primary', size: 88 }),
    n('skills', 'SKILLS', 220, -70, undefined, { homeRole: 'primary', size: 88 }),
    n('philosophy', 'PHILOSOPHY', -190, 175, undefined, { homeRole: 'primary', size: 88 }),
    n('contact', 'CONTACT', 190, 175, undefined, { homeRole: 'primary', size: 88 }),
    n('about', 'ABOUT', 0, 225, undefined, { homeRole: 'primary', size: 88 }),

    n('jobpilot', 'JOBPILOT AI', -300, -110, 'AI-assisted job outreach workflow', { displayLabel: 'JOBPILOT', homeRole: 'satellite', size: 58 }),
    n('ironakhada', 'IRON AKHADA', -285, -30, 'Fitness-focused web project', { displayLabel: 'IRON AKHADA', homeRole: 'satellite', size: 58 }),
    n('portfolio', 'NAYAN ASATI PORTFOLIO', -220, -150, 'Interactive Flow portfolio experience', { displayLabel: 'PORTFOLIO', homeRole: 'satellite', size: 58 }),
    n('photography', 'GHOUL PHOTOGRAPHY', -145, -125, 'Cinematic photography archive and automated content workflows', { displayLabel: 'PHOTOGRAPHY', homeRole: 'satellite', size: 58 }),
    n('pylauncher', 'PYLAUNCHER', -145, -45, 'Python-based launcher project', { displayLabel: 'PYLAUNCHER', homeRole: 'satellite', size: 58 }),

    n('engineering', 'ENGINEER', -75, -260, 'Analyser Instrument Company Pvt. Ltd. · Nov 2025 – Jun 2026', { displayLabel: 'ANALYSER', homeRole: 'satellite', size: 58 }),
    n('manufacturing', 'ASHOK LEYLAND', 0, -275, 'Graduate Apprentice Trainee · Aug 2024 – Jul 2025', { displayLabel: 'ASHOK LEYLAND', homeRole: 'satellite', size: 58 }),
    n('proposal', 'ROOT-CAUSE', 75, -260, 'Engineering problem solving, process documentation and coordination.', { displayLabel: 'ROOT-CAUSE', homeRole: 'satellite', size: 58 }),
  ]
};

const graphs: Record<Exclude<Level, 'home'>, Graph> = {
  projects:{center:{id:'projects',label:'PROJECTS',x:0,y:0,size:138},nodes:[n('jobpilot','JOBPILOT AI',-290,-105,'AI-assisted job outreach workflow'),n('ironakhada','IRON AKHADA',-145,-205,'Fitness-focused web project'),n('portfolio','NAYAN ASATI PORTFOLIO',145,-205,'Interactive Flow portfolio experience'),n('photography','GHOUL PHOTOGRAPHY',290,-105,'Cinematic photography archive and automated content workflows'),n('pylauncher','PYLAUNCHER',0,205,'Python-based launcher project')]},
  jobpilot:{center:{id:'jobpilot',label:'JOBPILOT AI',x:0,y:0,size:148},nodes:[n('problem','PROBLEM',-270,-110,'Reduce repetitive job-search and outreach work.'),n('system','SYSTEM',0,-205,'Import, matching, drafting, approval and outreach.'),n('technology','TECHNOLOGY',270,-110,'Modern web stack with AI-assisted workflows.'),n('nextjs','NEXT.JS',145,105),n('typescript','TYPESCRIPT',270,200),n('ai','AI AGENT',20,220)]},
  ironakhada:{center:{id:'ironakhada',label:'IRON AKHADA',x:0,y:0,size:142},nodes:[n('fitness','FITNESS',-230,-120,'Fitness-focused product direction.'),n('userjourney','USER JOURNEY',0,-205,'A focused interface built around the training and listening journey.'),n('build','BUILD',230,-120,'Web implementation and iterative product development.')]},
  portfolio:{center:{id:'portfolio',label:'NAYAN ASATI PORTFOLIO',x:0,y:0,size:148},nodes:[n('flow','FLOW',-230,-120,'Portfolio navigation designed as a connected system.'),n('interactive','INTERACTIVE',0,-205,'Drag, zoom, hover and click interactions.'),n('phases','PHASES',230,-120,'A phased build process from foundation to deep flows.')]},
  photography:{center:{id:'photography',label:'GHOUL PHOTOGRAPHY',x:0,y:0,size:144},nodes:[n('archive','ARCHIVE',-220,-125,'A cinematic photography archive.'),n('gallery','GALLERY',0,-215,'Responsive galleries built for visual browsing.'),n('automation','AUTOMATION',220,-125,'Gemini AI and Instagram API workflows.')]},
  pylauncher:{center:{id:'pylauncher',label:'PYLAUNCHER',x:0,y:0,size:142},nodes:[n('python','PYTHON',-230,-120,'Python-based application development.'),n('launcher','LAUNCHER',0,-205,'A utility-oriented launcher experience.'),n('interface','INTERFACE',230,-120,'Desktop interaction and usability.')]},
  experience:{center:{id:'experience',label:'EXPERIENCE',x:0,y:0,size:138},nodes:[n('engineering','ENGINEER',-245,-105,'Analyser Instrument Company Pvt. Ltd. · Nov 2025 – Jun 2026'),n('manufacturing','ASHOK LEYLAND',0,-205,'Graduate Apprentice Trainee · Aug 2024 – Jul 2025'),n('proposal','ROOT-CAUSE',245,-105,'Engineering problem solving, process documentation and coordination.')]},
  skills:{center:{id:'skills',label:'SKILLS',x:0,y:0,size:138},nodes:[n('javascript','JAVASCRIPT',-280,-120,'JavaScript is used across the web development work.'),n('react','REACT',-140,-225,'React is part of the interactive portfolio and web-product stack.'),n('htmlcss','HTML / CSS',0,-245,'HTML5 and CSS3 form the web foundation.'),n('python','PYTHON',140,-225,'Python is used for application development.'),n('fastapi','FASTAPI',280,-120,'FastAPI is part of the Python backend toolkit.'),n('nodejs','NODE.JS',280,35,'Node.js is part of the web development toolkit.'),n('rest','REST APIS',140,205,'REST APIs support API-driven product development and integrations.'),n('github','GIT / GITHUB',-20,235,'Git and GitHub are used for source control and delivery.'),n('actions','GITHUB ACTIONS',-180,205,'GitHub Actions is used for automated repository workflows.'),n('responsive','RESPONSIVE WEB',-280,35,'Responsive web design supports desktop and mobile experiences.'),n('bootstrap','BOOTSTRAP',-155,-70,'Bootstrap is part of the web UI toolkit.'),n('deployment','NETLIFY / RENDER',155,-70,'Hands-on deployment experience includes Netlify and Render.')]},
  philosophy:{center:{id:'philosophy',label:'PHILOSOPHY',x:0,y:0,size:144},nodes:[n('rootcause','FIND THE ROOT',-245,-110,'Use engineering-style root-cause analysis before adding complexity.'),n('system','BUILD THE SYSTEM',0,-205,'Think end-to-end: frontend, backend, deployment and workflow.'),n('leverage','SHIP WITH LEVERAGE',245,-110,'Use AI-assisted development to move quickly while keeping working software as the goal.')]},
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

const leafDetails: Record<string,Detail> = {
  fitness:{eyebrow:'IRON AKHADA / FITNESS',title:'Why I built it',body:'I built Iron Akhada as a web-based fitness radio experience rather than a conventional fitness page. The goal was to combine training-focused discovery with an immersive listening experience.',tags:['Next.js','React','TypeScript','Cloudflare'],links:[]},
  userjourney:{eyebrow:'IRON AKHADA / USER JOURNEY',title:'How the experience is structured',body:'The interface is organized around the user journey: entering the experience, listening to streamed audio, seeing live listener presence and moving through training stations.',tags:['Immersive UI','Streamed audio','Live presence','Training stations']},
  build:{eyebrow:'IRON AKHADA / BUILD',title:'Implementation approach',body:'I focused on a responsive web implementation with a product-first interface, keeping the visual experience connected to the core listening and training functions.',tags:['Next.js','React','TypeScript','Cloudflare']},
  problem:{eyebrow:'JOBPILOT AI / PROBLEM',title:'The problem I targeted',body:'The project targets repetitive job-search and outreach work by turning the process into a connected workflow rather than a series of disconnected manual steps.',tags:['Workflow design','Job search','Automation']},
  system:{eyebrow:'JOBPILOT AI / SYSTEM',title:'The workflow',body:'The system is structured around import, matching, drafting, approval and outreach so each stage can be handled as part of one repeatable flow.',tags:['Import','Matching','Drafting','Approval','Outreach']},
  technology:{eyebrow:'JOBPILOT AI / TECHNOLOGY',title:'Technology direction',body:'The project uses a modern web stack with AI-assisted workflows, keeping the application centered on a practical end-to-end delivery model.',tags:['Next.js','TypeScript','AI']},
  nextjs:{eyebrow:'JOBPILOT AI / NEXT.JS',title:'Why Next.js',body:'Next.js is part of the modern web stack used to structure and deliver the JobPilot AI experience.',tags:['Next.js','Web Development']},
  typescript:{eyebrow:'JOBPILOT AI / TYPESCRIPT',title:'Why TypeScript',body:'TypeScript provides a typed foundation for building and maintaining the interactive application code.',tags:['TypeScript','Maintainability']},
  ai:{eyebrow:'JOBPILOT AI / AI AGENT',title:'The leverage layer',body:'The AI agent represents the automation layer of the workflow, supporting the goal of reducing repetitive work while keeping the overall process structured.',tags:['AI','Automation','Workflow']},
  flow:{eyebrow:'PORTFOLIO / FLOW',title:'The navigation approach',body:'I built the portfolio as a connected flow so the navigation itself communicates how the different parts of my work relate to each other.',tags:['React','TypeScript','Vite','Tailwind CSS']},
  interactive:{eyebrow:'PORTFOLIO / INTERACTIVE',title:'Interaction system',body:'The experience uses drag, zoom, hover and click interactions so visitors explore the portfolio as a living network instead of a conventional page stack.',tags:['Drag','Zoom','Hover','Click']},
  phases:{eyebrow:'PORTFOLIO / PHASES',title:'How it was built',body:'The portfolio was developed through phased iterations, moving from the foundation and interaction engine into deeper portfolio content and final polish.',tags:['Phased build','Interaction','Polish']},
  archive:{eyebrow:'GHOUL PHOTOGRAPHY / ARCHIVE',title:'The visual goal',body:'I built a cinematic photography archive focused on visual discovery, keeping the presentation centered on the photography rather than a conventional content grid.',tags:['HTML5','CSS3','JavaScript']},
  gallery:{eyebrow:'GHOUL PHOTOGRAPHY / GALLERY',title:'Gallery approach',body:'The gallery is responsive and designed for visual browsing across screen sizes.',tags:['Responsive design','HTML5','CSS3','JavaScript']},
  automation:{eyebrow:'GHOUL PHOTOGRAPHY / AUTOMATION',title:'Content workflow',body:'The project includes automated content workflows using Gemini AI and the Instagram API to connect the archive with a repeatable content process.',tags:['Gemini AI','Instagram API','Automation']},
  python:{eyebrow:'PYLAUNCHER / PYTHON',title:'Language choice',body:'PyLauncher is the Python-based utility branch of the portfolio projects, built around Python application development.',tags:['Python','Application development']},
  launcher:{eyebrow:'PYLAUNCHER / LAUNCHER',title:'What it does',body:'The launcher branch represents a utility-oriented launcher experience, keeping the project focused on practical desktop interaction.',tags:['Launcher','Utility','Desktop']},
  interface:{eyebrow:'PYLAUNCHER / INTERFACE',title:'Interface focus',body:'The interface work centers on desktop interaction and usability within the Python project.',tags:['Desktop','Usability','Python']},
  engineering:{eyebrow:'EXPERIENCE / ANALYSER',title:'Engineer — Analyser Instrument Company',body:'Prepared and reviewed technical compliance documentation, collaborated on technical proposals, supported customers with product specifications and achieved 90% technical scoring on tender submissions.',tags:['Technical proposals','Documentation','Customer support','Root-cause analysis']},
  manufacturing:{eyebrow:'EXPERIENCE / ASHOK LEYLAND',title:'Graduate Apprentice Trainee',body:'Led shift operations for a 100+ person team using SAP NetWeaver and Siemens HMI, applied root-cause analysis to customer complaints and implemented enhanced inspection measures.',tags:['SAP NetWeaver','Siemens HMI','Shift operations','Quality improvement']},
  proposal:{eyebrow:'EXPERIENCE / ROOT-CAUSE',title:'Engineering problem solving',body:'The engineering approach brings structured root-cause analysis, process documentation and cross-functional coordination into technical problem solving.',tags:['Root-cause analysis','Documentation','Coordination']},
  javascript:{eyebrow:'SKILLS / JAVASCRIPT',title:'JavaScript',body:'Used as a core language across the web development work and interactive portfolio experiences.',tags:['JavaScript','Web Development']},
  react:{eyebrow:'SKILLS / REACT',title:'React',body:'Used for building interactive web experiences, including the connected Flow portfolio.',tags:['React','Interactive UI']},
  htmlcss:{eyebrow:'SKILLS / HTML + CSS',title:'HTML5 + CSS3',body:'The web foundation used to structure and style responsive interfaces.',tags:['HTML5','CSS3','Responsive design']},
  python:{eyebrow:'SKILLS / PYTHON',title:'Python',body:'Used for application development, including the Python-based project work in the portfolio.',tags:['Python','Kivy','FastAPI']},
  fastapi:{eyebrow:'SKILLS / FASTAPI',title:'FastAPI',body:'Part of the Python backend toolkit used for API-oriented application development.',tags:['FastAPI','Python','REST APIs']},
  nodejs:{eyebrow:'SKILLS / NODE.JS',title:'Node.js',body:'Part of the web development toolkit used alongside JavaScript-based applications.',tags:['Node.js','JavaScript']},
  rest:{eyebrow:'SKILLS / REST APIS',title:'REST APIs',body:'API-driven development and integrations are part of the practical stack used across projects.',tags:['REST APIs','Integrations']},
  github:{eyebrow:'SKILLS / GIT + GITHUB',title:'Source control',body:'Git and GitHub are used for source control, collaboration and maintaining the portfolio codebase.',tags:['Git','GitHub','Version control']},
  actions:{eyebrow:'SKILLS / GITHUB ACTIONS',title:'Automated workflows',body:'GitHub Actions is part of the delivery workflow used for repository automation and verification.',tags:['GitHub Actions','CI']},
  responsive:{eyebrow:'SKILLS / RESPONSIVE WEB',title:'Responsive design',body:'Responsive web design is used so the portfolio and web projects work across desktop and mobile viewing.',tags:['Responsive design','Mobile','Desktop']},
  bootstrap:{eyebrow:'SKILLS / BOOTSTRAP',title:'Bootstrap',body:'Bootstrap is part of the web UI toolkit used in the developer skill set.',tags:['Bootstrap','Web UI']},
  deployment:{eyebrow:'SKILLS / DEPLOYMENT',title:'Deployment platforms',body:'Hands-on deployment experience includes Netlify and Render, alongside GitHub Pages.',tags:['Netlify','Render','GitHub Pages']},
  rootcause:{eyebrow:'PHILOSOPHY / FIND THE ROOT',title:'Root-cause first',body:'The engineering habit is to understand the underlying problem before adding complexity, using root-cause analysis as the starting point.',tags:['Root cause','Engineering mindset']},
  system:{eyebrow:'PHILOSOPHY / BUILD THE SYSTEM',title:'End-to-end thinking',body:'I prefer thinking through the complete system: frontend, backend, deployment and workflow rather than treating each layer in isolation.',tags:['Frontend','Backend','Deployment','Workflow']},
  leverage:{eyebrow:'PHILOSOPHY / SHIP WITH LEVERAGE',title:'Use leverage',body:'AI-assisted development is used to move quickly while keeping the goal focused on working software and practical delivery.',tags:['AI-assisted development','Shipping','Practical delivery']},
  email:{eyebrow:'CONTACT / EMAIL',title:'Email',body:'The direct contact channel for professional communication.',tags:['Email'],links:[{label:'SEND EMAIL',href:'mailto:nayanasati2001@gmail.com'}]},
  linkedin:{eyebrow:'CONTACT / LINKEDIN',title:'LinkedIn',body:'Professional profile and network.',tags:['LinkedIn'],links:[{label:'OPEN LINKEDIN',href:'https://linkedin.com/in/nayan-1209-asati'}]},
  github:{eyebrow:'CONTACT / GITHUB',title:'GitHub',body:'Code, experiments and repositories.',tags:['GitHub'],links:[{label:'OPEN GITHUB',href:'https://github.com/Nayan1209'}]},
  engineer:{eyebrow:'ABOUT / ENGINEER',title:'Engineering foundation',body:'Electrical engineering education combined with manufacturing and technical proposal experience provides the engineering foundation behind the development work.',tags:['Electrical Engineering','Manufacturing','Technical proposals']},
  developer:{eyebrow:'ABOUT / DEVELOPER',title:'Self-taught developer',body:'The development path is self-taught and focused on building full products end-to-end across frontend, backend and deployment.',tags:['Frontend','Backend','Deployment']},
  selftaught:{eyebrow:'ABOUT / SELF-TAUGHT',title:'Hands-on learning',body:'Hands-on learning spans web development, APIs, deployment and AI-assisted workflows.',tags:['Web Development','APIs','Deployment','AI-assisted workflows']}
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
  const [selectedDetailId,setSelectedDetailId]=useState<string|null>(null);
  const [dragging,setDragging]=useState(false);
  const [opening,setOpening]=useState(false);
  const [focusIndex,setFocusIndex]=useState(0);
  const stage=useRef<HTMLDivElement>(null),dragStart=useRef<Point>({x:0,y:0}),panStart=useRef<Point>({x:0,y:0}),velocity=useRef<Point>({x:0,y:0}),animation=useRef<number|null>(null);
  const graph=graphFor(level);
  const ancestry=useMemo<Level[]>(()=>{const chain:Level[]=[];let cursor:Level=level;while(cursor!=='home'){chain.unshift(cursor);cursor=parentOf[cursor]??'home';}return ['home',...chain];},[level]);
  const depth=ancestry.length-1;
  const ancestorNodes=useMemo(()=>ancestry.map((item,index)=>{const node=nodeFor(item),distance=depth-index;return {...node,x:120-distance*240,y:0,size:distance===0?node.size:Math.max(58,(node.size??110)*Math.pow(.78,distance)),depth:distance};}),[ancestry,depth]);
  const nested=level!=='home';
  const focus=nested?ancestorNodes[depth]:graph.center;
  const displayNodes=nested?graph.nodes.map(node=>({...node,x:focus.x+node.x*.68+75,y:node.y*.55})):graph.nodes;
  const allNodes=nested?[...ancestorNodes,...displayNodes]:[graph.center,...displayNodes];
  const activeId=hovered??selected;
  const activeNode=allNodes.find(node=>node.id===activeId);
  const baseDetail=details[level];
  const detail=selectedDetailId&&leafDetails[selectedDetailId]?leafDetails[selectedDetailId]:baseDetail;
  const trace=ancestry.map(item=>item==='home'?'NAYAN ASATI':labels[item]);

  const setLevelView=(next:Level)=>{const nextDepth=next==='home'?0:next==='projects'?1:depth+1;setLevel(next);setScale(Math.max(.68,1-nextDepth*.055));setPan({x:0,y:0});setHovered(null);setSelectedDetailId(null);setSelected(next==='home'?'nayan':nodeFor(next).id);setFocusIndex(0);velocity.current={x:0,y:0};};
  const resetView=(next:Level='home')=>setLevelView(next);
  const zoom=(factor:number,origin?:Point)=>setScale(current=>{const next=Math.min(2.65,Math.max(.58,current*factor));if(origin){const ratio=next/current;setPan(p=>({x:origin.x-(origin.x-p.x)*ratio,y:origin.y-(origin.y-p.y)*ratio}));}return next;});
  const selectNode=(node:Node)=>{
    if(node.id==='nayan'){resetView('home');return;}
    const ancestor=ancestry.find(item=>item!=='home'&&nodeFor(item).id===node.id);
    if(ancestor){setLevelView(ancestor);return;}
    setSelected(node.id);
    const next=childLinks[node.id];
    if(next&&next!=='home'){
      setOpening(true);setSelectedDetailId(null);setLevel(next);setScale(Math.max(.68,1-ancestry.length*.055));setPan({x:0,y:0});setHovered(null);window.setTimeout(()=>setOpening(false),720);return;
    }
    setSelectedDetailId(node.id);
  };
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
      <svg className="flow-lines" viewBox="-620 -410 1240 820" aria-hidden="true">
        {nested&&ancestorNodes.slice(1).map((node,index)=>{const previous=ancestorNodes[index];return <line key={`ancestor-${node.id}`} className={activeId===node.id||activeId===previous.id?'active':''} x1={previous.x} y1={previous.y} x2={node.x} y2={node.y}/>;})}
        {!nested&&primaryHomeNodes.map(node=><line key={`home-primary-${node.id}`} className={activeId===node.id||activeId==='nayan'?'active':''} x1={focus.x} y1={focus.y} x2={node.x} y2={node.y}/>)}
        {!nested&&projectHomeNodes.map(node=>{const parent=primaryHomeNodes.find(item=>item.id==='projects');return parent&&<line key={`home-project-${node.id}`} className={activeId===node.id||activeId==='projects'?'active':''} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y}/>;})}
        {!nested&&experienceHomeNodes.map(node=>{const parent=primaryHomeNodes.find(item=>item.id==='experience');return parent&&<line key={`home-experience-${node.id}`} className={activeId===node.id||activeId==='experience'?'active':''} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y}/>;})}
        {nested&&displayNodes.map(node=><line key={node.id} className={activeId===node.id?'active':''} x1={focus.x} y1={focus.y} x2={node.x} y2={node.y}/>)}
        {level==='jobpilot'&&<><line className={activeId==='nextjs'||activeId==='typescript'?'active':''} x1={displayNodes.find(n=>n.id==='technology')?.x??245} y1={displayNodes.find(n=>n.id==='technology')?.y??-63} x2={displayNodes.find(n=>n.id==='nextjs')?.x??173} y2={displayNodes.find(n=>n.id==='nextjs')?.y??58}/><line className={activeId==='ai'?'active':''} x1={displayNodes.find(n=>n.id==='system')?.x??90} y1={displayNodes.find(n=>n.id==='system')?.y??-115} x2={displayNodes.find(n=>n.id==='ai')?.x??100} y2={displayNodes.find(n=>n.id==='ai')?.y??122}/></>}
      </svg>
      {allNodes.map((node,index)=><button key={`${node.id}-${index}`} data-node className={`flow-node ${node.id===focus.id?'center focus-center':''} ${node.homeRole==='primary'?'home-primary':''} ${node.homeRole==='satellite'?'home-satellite':''} ${node.depth?`ancestor-depth-${node.depth}`:''} ${node.id==='nayan'?'root-persistent':''} ${activeId===node.id?'active':''}`} style={{left:`calc(50% + ${node.x}px)`,top:`calc(50% + ${node.y}px)`,'--node-size':`${node.size??70}px`} as React.CSSProperties} onClick={()=>selectNode(node)} onMouseEnter={()=>{setHovered(node.id);setSelected(node.id);}} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(node.id)} onBlur={()=>setHovered(null)} aria-label={node.id==='nayan'?'Return home':`Explore ${node.label}`}><span className="node-halo"/><span className="node-core">{node.displayLabel??node.label}</span>{node.description&&<span className="node-description">{node.description}</span>}</button>)}
    </div></section>
    <aside className={`flow-detail phase4-detail ${selectedDetailId?'is-case-study':''}`} aria-live="polite"><span>{detail.eyebrow}</span><h1>{detail.title}</h1><p>{detail.body}</p><div className="detail-tags">{detail.tags.map(tag=><span key={tag}>{tag}</span>)}</div>{detail.links&&detail.links.length>0&&<div className="detail-links">{detail.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <ExternalLink size={12}/></a>)}</div>}{selectedDetailId&&<small className="detail-hint">CASE STUDY NODE · CLICK ANOTHER NODE TO CONTINUE</small>}</aside>
    <aside className="flow-path" aria-label="Path status"><span>TRACE</span><strong>{activeNode?.label??labels[level]}</strong><small>{level==='home'?'ROOT NODE':`DEPTH ${depth} · ANCESTRY VISIBLE`}</small></aside>
    <aside className="flow-controls" aria-label="Network controls">{level!=='home'&&<button onClick={()=>resetView('home')} aria-label="Back to home"><ArrowLeft size={14}/></button>}<button onClick={()=>zoom(.9)} aria-label="Zoom out"><Minus size={14}/></button><span>{Math.round(scale*100)}%</span><button onClick={()=>zoom(1.1)} aria-label="Zoom in"><Plus size={14}/></button><button onClick={()=>resetView(level)} aria-label="Reset view"><RotateCcw size={14}/></button><button onClick={()=>{setPan({x:0,y:0});setScale(level==='home'?1:Math.max(.68,1-depth*.055));}} aria-label="Center network"><LocateFixed size={14}/></button></aside>
    <footer className="flow-footer"><div><small>FLOW PORTFOLIO</small><strong>CINEMATIC NAVIGATION</strong></div><div className="flow-status">{level==='home'?'HOME / 06 CONNECTIONS':`${homeGraph.center.label} / ${graph.nodes.length} FOCUS NODES`}</div><div className="flow-footer-right">ESC / HOME · ARROWS / TRACE</div></footer>
  </main>;
}