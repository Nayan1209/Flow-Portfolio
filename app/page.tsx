'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Linkedin, Mail, MapPin, Minus, Phone, Plus, RotateCcw } from 'lucide-react';

type Level = 'home' | 'projects' | 'jobpilot' | 'ironakhada' | 'portfolio' | 'photography' | 'pylauncher' | 'smartgrid' | 'experience' | 'analyser' | 'ashok' | 'skills' | 'philosophy' | 'about' | 'education' | 'certifications' | 'contact';
type Kind = 'primary' | 'project' | 'detail' | 'satellite' | 'ancestor';
type Point = { x: number; y: number };
type Node = { id: string; label: string; description?: string; child?: Level; kind?: Kind; href?: string };
type Detail = { eyebrow: string; title: string; body: string; tags: string[]; links?: { label: string; href: string }[]; facts?: string[] };

const labels: Record<Level, string> = {
  home: 'ORIGIN', projects: 'PROJECTS', jobpilot: 'JOBPILOT AI', ironakhada: 'IRON AKHADA', portfolio: 'FLOW PORTFOLIO', photography: 'GHOUL PHOTOGRAPHY', pylauncher: 'PYLAUNCHER', smartgrid: 'SMART GRID EMS', experience: 'EXPERIENCE', analyser: 'ANALYSER INSTRUMENT', ashok: 'ASHOK LEYLAND', skills: 'CAPABILITIES', philosophy: 'THINKING', about: 'ABOUT', education: 'EDUCATION', certifications: 'CERTIFICATIONS', contact: 'CONTACT'
};

const parent: Partial<Record<Level, Level>> = {
  projects: 'home', jobpilot: 'projects', ironakhada: 'projects', portfolio: 'projects', photography: 'projects', pylauncher: 'projects', smartgrid: 'projects',
  experience: 'home', analyser: 'experience', ashok: 'experience', skills: 'home', philosophy: 'home', about: 'home', education: 'about', certifications: 'about', contact: 'home'
};

const node = (id: string, label: string, description?: string, child?: Level, kind: Kind = 'detail', href?: string): Node => ({ id, label, description, child, kind, href });

const children: Record<Level, Node[]> = {
  home: [
    node('projects', 'PROJECTS', 'Five shipped products and one engineering capstone.', 'projects', 'primary'),
    node('experience', 'EXPERIENCE', 'Proposal engineering and manufacturing operations.', 'experience', 'primary'),
    node('skills', 'CAPABILITIES', 'Engineering, software and problem-solving.', 'skills', 'primary'),
    node('philosophy', 'THINKING', 'How I approach problems and systems.', 'philosophy', 'primary'),
    node('about', 'ABOUT', 'Engineering foundation, education and credentials.', 'about', 'primary'),
    node('contact', 'CONTACT', 'Open a professional connection.', 'contact', 'primary'),
    node('jobpilot', 'JOBPILOT AI', 'Job Outreach Workspace', 'jobpilot', 'satellite'),
    node('ironakhada', 'IRON AKHADA', 'Desi Strength Radio', 'ironakhada', 'satellite'),
    node('portfolio', 'FLOW PORTFOLIO', 'This interactive system', 'portfolio', 'satellite'),
    node('photography', 'GHOUL PHOTO', 'Photography archive', 'photography', 'satellite'),
    node('pylauncher', 'PYLAUNCHER', 'Minimalist Android launcher', 'pylauncher', 'satellite'),
    node('smartgrid', 'SMART GRID EMS', 'Final-year engineering project', 'smartgrid', 'satellite'),
    node('analyser', 'ANALYSER', 'Engineer · 11/2025–06/2026', 'analyser', 'satellite'),
    node('ashok', 'ASHOK LEYLAND', 'Graduate Apprentice · 08/2024–07/2025', 'ashok', 'satellite')
  ],
  projects: [
    node('jobpilot', 'JOBPILOT AI', 'Job Outreach Workspace · 2026', 'jobpilot', 'project'),
    node('ironakhada', 'IRON AKHADA', 'Desi Strength Radio · 2026', 'ironakhada', 'project'),
    node('portfolio', 'NAYAN ASATI PORTFOLIO', 'Personal Portfolio Website · 2026', 'portfolio', 'project'),
    node('photography', 'GHOUL PHOTOGRAPHY', 'Photography Portfolio · 2026', 'photography', 'project'),
    node('pylauncher', 'PYLAUNCHER', 'Minimalist Android Launcher · 2026', 'pylauncher', 'project'),
    node('smartgrid', 'SMART GRID EMS', 'Final Year Project · Jan–May 2024', 'smartgrid', 'project')
  ],
  jobpilot: [
    node('jp-product', 'PRODUCT', 'Job opportunity tracking and outreach workspace.'),
    node('jp-workflow', 'WORKFLOW', 'Find → track → tailor → recruit → draft → approve → send.'),
    node('jp-gmail', 'GMAIL', 'Live job scanning and automated outreach integration.'),
    node('jp-resume', 'RESUME TAILORING', 'Role-aware resume and application preparation.'),
    node('jp-tech', 'STACK', 'Next.js, React, TypeScript and AI-assisted workflows.'),
    node('jp-link', 'LIVE PROJECT', 'Open the deployed application.', undefined, 'detail', 'https://jobpilot-ai-jade.vercel.app/')
  ],
  ironakhada: [
    node('ia-radio', 'RADIO', 'A time-based gym radio built around training atmosphere.'),
    node('ia-stations', 'STATIONS', 'Morning Hustle, Mid-Day Iron, Peak Power and Late Night Shred.'),
    node('ia-audio', 'AUDIO', 'Rotating playlist streamed through Cloudflare R2.'),
    node('ia-presence', 'LIVE PRESENCE', 'Live listener presence, on-air display and clock.'),
    node('ia-context', 'CONTEXT', 'YouTube playlist source, local weather and time-aware presentation.'),
    node('ia-link', 'LIVE PROJECT', 'Open Iron Akhada.', undefined, 'detail', 'https://iron-akhada.vercel.app/')
  ],
  portfolio: [
    node('pf-system', 'SYSTEM', 'The portfolio is itself a navigable graph.'),
    node('pf-camera', 'CAMERA', 'Persistent ancestry with progressive focus and spatial travel.'),
    node('pf-interaction', 'INTERACTION', 'Click, scroll, drag, hover, keyboard and touch.'),
    node('pf-access', 'ACCESSIBILITY', 'Semantic controls, focus states and reduced motion.'),
    node('pf-stack', 'STACK', 'Next.js 14, React 18, TypeScript and SVG/CSS.'),
    node('pf-link', 'ORIGINAL PORTFOLIO', 'Open the earlier deployed portfolio.', undefined, 'detail', 'https://nayan-asati-portfolio.vercel.app/')
  ],
  photography: [
    node('gp-archive', 'ARCHIVE', 'A cinematic photography portfolio and visual archive.'),
    node('gp-ui', 'INTERFACE', 'Responsive galleries with smooth navigation and modern layout.'),
    node('gp-ai', 'AI ASSISTANCE', 'AI tools used for design, debugging and troubleshooting.'),
    node('gp-deploy', 'DEPLOYMENT', 'Deployed on Vercel with Google Search Console indexing started.'),
    node('gp-link', 'LIVE PROJECT', 'Open Ghoul Photography.', undefined, 'detail', 'https://ghoul-photography.vercel.app/')
  ],
  pylauncher: [
    node('pl-kivy', 'KIVY', 'Python-based minimalist Android launcher.'),
    node('pl-ui', 'TEXT UI', 'Clean, text-only home-screen aesthetic.'),
    node('pl-actions', 'AUTOMATION', 'Automated builds and deployment through GitHub Actions.'),
    node('pl-debug', 'DEBUGGING', 'AI-assisted debugging across rendering, labels, Python and NDK compatibility.'),
    node('pl-link', 'GITHUB', 'Open the PyLauncher repository.', undefined, 'detail', 'https://github.com/Nayan1209/pylauncher')
  ],
  smartgrid: [
    node('sg-ems', 'ENERGY MANAGEMENT', 'Smart Grid EMS integrating renewable generation and storage.'),
    node('sg-monitor', 'MONITORING', 'Real-time monitoring and load forecasting.'),
    node('sg-control', 'ADAPTIVE CONTROL', 'Demand–supply balancing through adaptive control.'),
    node('sg-reliability', 'RELIABILITY', 'Fault detection, self-healing and demand response strategies.'),
    node('sg-date', 'CAPSTONE', 'Jan 2024 – May 2024 · Electrical Engineering')
  ],
  experience: [
    node('analyser', 'ENGINEER', 'Analyser Instrument Company Private Limited · Kota · 11/2025–06/2026', 'analyser', 'project'),
    node('ashok', 'GRADUATE APPRENTICE', 'Ashok Leyland · Pantnagar · 08/2024–07/2025', 'ashok', 'project'),
    node('ex-compliance', 'TECHNICAL COMPLIANCE', 'Prepared and reviewed tender documentation against specifications and customer requirements.'),
    node('ex-analyser', 'INDUSTRIAL ANALYSERS', 'Worked with measurement ranges, working principles and application suitability.'),
    node('ex-cross', 'CROSS-FUNCTIONAL', 'Produced accurate and competitive technical proposals with multiple teams.'),
    node('ex-support', 'CUSTOMER SUPPORT', 'Handled enquiries, follow-ups, product questions and specification clarification.'),
    node('ex-quality', 'QUALITY IMPROVEMENT', 'Root-cause analysis, preventive measures and process monitoring.')
  ],
  analyser: [
    node('ai-role', 'ENGINEER', 'Analyser Instrument Company Private Limited · Kota, India.'),
    node('ai-dates', '11/2025 — 06/2026', 'Proposal and technical compliance engineering.'),
    node('ai-tender', 'TENDER COMPLIANCE', 'Prepared and reviewed technical compliance documents against tender specifications and customer requirements.'),
    node('ai-products', 'INDUSTRIAL ANALYSERS', 'Built hands-on knowledge of industrial analysers, measurement ranges and application suitability.'),
    node('ai-proposals', 'PROPOSALS', 'Collaborated cross-functionally to produce accurate, competitive technical proposals.'),
    node('ai-followup', 'CLIENT FOLLOW-UP', 'Handled tender and enquiry follow-ups, ensuring timely client responses and engagement.'),
    node('ai-support', 'TECHNICAL SUPPORT', 'Resolved customer queries and clarified product specifications.'),
    node('ai-win', '90% TECHNICAL', 'Achieved 90% technical scoring in tender submission work.')
  ],
  ashok: [
    node('al-role', 'GRADUATE APPRENTICE TRAINEE', 'Ashok Leyland · Pantnagar, India.'),
    node('al-dates', '08/2024 — 07/2025', 'Manufacturing and production operations.'),
    node('al-manpower', '100+ MANPOWER', 'Managed more than 100 people while leading shift operations to meet production targets.'),
    node('al-sap', 'SAP NETWEAVER', 'Used SAP NetWeaver and Siemens HMI for process monitoring and downtime reduction.'),
    node('al-quality', 'REJECTION REDUCTION', 'Implemented enhanced inspection and preventive measures to improve product quality.'),
    node('al-rca', 'ROOT-CAUSE ANALYSIS', 'Resolved customer complaints and reduced repeat issues.'),
    node('al-systems', 'PNEUMATIC · HYDRAULIC · ELECTRICAL', 'Worked hands-on with industrial systems while maintaining reliable operations.'),
    node('al-team', 'TEAM LEADERSHIP', 'Built and managed a high-performing production team.')
  ],
  skills: [
    node('sk-engineering', 'ENGINEERING', 'Manufacturing processes, failure analysis, line balancing, 5S and lean manufacturing.'),
    node('sk-problem', 'PROBLEM SOLVING', 'Root-cause analysis, process improvement, critical thinking and engineering documentation.'),
    node('sk-web', 'WEB', 'JavaScript, HTML5, CSS3, React (Vite) and Bootstrap.'),
    node('sk-python', 'PYTHON', 'Python, FastAPI and Kivy application development.'),
    node('sk-tools', 'PLATFORMS', 'Git, GitHub, GitHub Actions, Vercel, Netlify, Render and Formspree.'),
    node('sk-apis', 'APIS', 'REST APIs and product integrations.'),
    node('sk-ai', 'AI TOOLS', 'AI-assisted development, debugging and troubleshooting workflows.'),
    node('sk-people', 'COLLABORATION', 'Teamwork, collaboration and manpower management.')
  ],
  philosophy: [
    node('ph-root', 'FIND THE ROOT', 'Start with the underlying problem, not the visible symptom.'),
    node('ph-system', 'SEE THE SYSTEM', 'Think across frontend, backend, operations, deployment and people.'),
    node('ph-build', 'BUILD PRACTICALLY', 'Prefer working software and measurable improvement over decoration.'),
    node('ph-leverage', 'USE LEVERAGE', 'Use AI tools to accelerate implementation while keeping engineering judgment human.'),
    node('ph-document', 'DOCUMENT', 'Make decisions, requirements and systems understandable.'),
    node('ph-improve', 'ITERATE', 'Test, learn, fix the root cause and improve the next version.')
  ],
  about: [
    node('ab-profile', 'PROFILE', 'Self-taught developer with an engineering and manufacturing foundation.'),
    node('ab-education', 'EDUCATION', 'B.Tech Electrical Engineering · Gurukul Kangri Vishwavidyalaya · 70.57%', 'education', 'detail'),
    node('ab-cert', 'CERTIFICATIONS', 'Development course, manufacturing apprenticeship and AI tools workshop.', 'certifications', 'detail'),
    node('ab-location', 'BASE', 'Sagar, Madhya Pradesh, India.'),
    node('ab-languages', 'LANGUAGES', 'Hindi · Native | English · Professional'),
    node('ab-approach', 'APPROACH', 'Engineering discipline plus end-to-end software delivery.')
  ],
  education: [
    node('ed-btech', 'B.TECH ELECTRICAL', 'Gurukul Kangri Vishwavidyalaya, Haridwar · 05/2024 · 70.57%'),
    node('ed-12', '12TH · CBSE PCM', 'Green Valley School, Bhopal · 04/2020 · 68.80%'),
    node('ed-10', '10TH · CBSE', 'Paras Vidya Vihar, Sagar · 04/2018 · 69.80%')
  ],
  certifications: [
    node('cr-web', 'WEB DEVELOPMENT', 'CSS, Bootstrap, JavaScript and PHP Stack Complete Course · Proper Dot Institute · 08 Dec 2022'),
    node('cr-apprentice', 'MANUFACTURING', 'Apprenticeship in Manufacturing Industry · Ashok Leyland, Pantnagar · Aug 2024–Jul 2025'),
    node('cr-ai', 'AI TOOLS', 'AI Tools Workshop · United Latino Students Association · Dec 2025')
  ],
  contact: [
    node('ct-email', 'EMAIL', 'nayanasati2001@gmail.com', undefined, 'detail', 'mailto:nayanasati2001@gmail.com'),
    node('ct-linkedin', 'LINKEDIN', 'Professional profile.', undefined, 'detail', 'https://linkedin.com/in/nayan-1209-asati'),
    node('ct-github', 'GITHUB', 'Code and repositories.', undefined, 'detail', 'https://github.com/Nayan1209'),
    node('ct-phone', 'PHONE', '+91 6262055238', undefined, 'detail', 'tel:+916262055238'),
    node('ct-location', 'LOCATION', 'Sagar, Madhya Pradesh, India.'),
    node('ct-open', 'OPEN TO', 'Business excellence, operational excellence and technical/development opportunities.')
  ]
};

const details: Record<Level, Detail> = {
  home: { eyebrow: 'NAYAN ASATI / ORIGIN', title: 'Creative engineer. Technical architect.', body: 'An electrical engineer who moved from manufacturing and proposal engineering into end-to-end software building. Explore the work as a connected system rather than a list of pages.', tags: ['Engineering', 'Software', 'Systems thinking', 'Product'] },
  projects: { eyebrow: 'NAYAN ASATI / SELECTED WORK', title: 'Things I actually built.', body: 'A portfolio of shipped software, product experiments and an engineering capstone. Each project opens into the decisions, technology and live links behind it.', tags: ['JobPilot AI', 'Iron Akhada', 'Flow Portfolio', 'Ghoul Photography', 'PyLauncher', 'Smart Grid EMS'] },
  jobpilot: { eyebrow: 'PROJECT / JOBPILOT AI', title: 'Job outreach as a complete workflow.', body: 'A job opportunity tracking and outreach workspace covering discovery, tracking, email generation, resume tailoring, recruiter discovery and sending. Gmail integration supports live job scanning and automated outreach.', tags: ['Next.js', 'React', 'TypeScript', 'Gmail', 'AI'], links: [{ label: 'LIVE PROJECT', href: 'https://jobpilot-ai-jade.vercel.app/' }] },
  ironakhada: { eyebrow: 'PROJECT / IRON AKHADA', title: 'Desi Strength Radio.', body: 'A time-based gym radio experience that rotates a playlist by training mood, with live clock and on-air display, YouTube playlist sourcing and local weather context.', tags: ['Next.js', 'React', 'TypeScript', 'Cloudflare'], links: [{ label: 'LIVE PROJECT', href: 'https://iron-akhada.vercel.app/' }] },
  portfolio: { eyebrow: 'PROJECT / PERSONAL PORTFOLIO', title: 'A portfolio that behaves like a network.', body: 'The interface is the navigation system: the visitor travels from the origin into projects, experience, capabilities and the thinking behind the work. The older deployed portfolio is preserved as a project reference.', tags: ['Next.js', 'React', 'TypeScript', 'SVG', 'Interaction'], links: [{ label: 'OPEN ORIGINAL', href: 'https://nayan-asati-portfolio.vercel.app/' }] },
  photography: { eyebrow: 'PROJECT / GHOUL PHOTOGRAPHY', title: 'A cinematic visual archive.', body: 'A fully responsive photography portfolio built with HTML, CSS and JavaScript, designed around smooth collection browsing and modern visual presentation. Deployed on Vercel with indexing started through Google Search Console.', tags: ['HTML5', 'CSS3', 'JavaScript', 'AI tools', 'Vercel'], links: [{ label: 'LIVE PROJECT', href: 'https://ghoul-photography.vercel.app/' }] },
  pylauncher: { eyebrow: 'PROJECT / PYLAUNCHER', title: 'Minimalist Android launcher.', body: 'A Python/Kivy home-screen launcher with a clean text-only aesthetic. Builds and deployment are automated through GitHub Actions, with AI-assisted debugging used across rendering, app labels and Python/NDK compatibility.', tags: ['Python', 'Kivy', 'Android', 'GitHub Actions'], links: [{ label: 'OPEN GITHUB', href: 'https://github.com/Nayan1209/pylauncher' }] },
  smartgrid: { eyebrow: 'ENGINEERING / FINAL YEAR PROJECT', title: 'Optimizing Smart Grid EMS.', body: 'A Smart Grid Energy Management System integrating renewable energy and storage for optimized performance, with real-time monitoring, load forecasting, adaptive control, fault detection, self-healing and demand response strategies.', tags: ['Smart Grid', 'Energy Management', 'Renewables', 'Storage'], facts: ['Jan 2024 – May 2024', 'B.Tech Electrical Engineering'] },
  experience: { eyebrow: 'NAYAN ASATI / EXPERIENCE', title: 'Engineering in practice.', body: 'Two roles shaped the way I work: proposal and technical compliance engineering at Analyser Instrument Company, followed by hands-on manufacturing leadership at Ashok Leyland.', tags: ['Proposal engineering', 'Manufacturing', 'Quality', 'Leadership'] },
  analyser: { eyebrow: 'EXPERIENCE / ENGINEER', title: 'Technical proposals with engineering accountability.', body: 'At Analyser Instrument Company Private Limited in Kota, I prepared and reviewed technical compliance documents, learned industrial analyser applications, coordinated proposals, handled client follow-ups and provided technical support. I achieved 90% technical scoring in tender work.', tags: ['11/2025–06/2026', 'Kota, India', 'Tender compliance', 'Industrial analysers', '90% technical'] },
  ashok: { eyebrow: 'EXPERIENCE / GRADUATE APPRENTICE TRAINEE', title: 'Production leadership on the shop floor.', body: 'At Ashok Leyland in Pantnagar, I managed 100+ manpower during shift operations, used SAP NetWeaver and Siemens HMI for process monitoring, improved inspection and preventive measures, applied root-cause analysis to customer complaints and worked hands-on with pneumatic, hydraulic and electrical systems.', tags: ['08/2024–07/2025', 'Pantnagar, India', '100+ manpower', 'SAP NetWeaver', 'Siemens HMI', 'RCA'] },
  skills: { eyebrow: 'NAYAN ASATI / CAPABILITIES', title: 'Engineering discipline meets software delivery.', body: 'My stack spans manufacturing problem-solving, web development, Python applications, APIs, source control, cloud platforms and AI-assisted development workflows.', tags: ['Python', 'JavaScript', 'React', 'FastAPI', 'Kivy', 'GitHub', 'Vercel'] },
  philosophy: { eyebrow: 'NAYAN ASATI / THINKING', title: 'Find the root. Build the system. Ship.', body: 'I prefer root-cause thinking over surface fixes, systems over isolated screens, and useful software over decoration. AI is leverage; judgment remains the engineer’s job.', tags: ['Root cause', 'Systems', 'Practicality', 'Iteration'] },
  about: { eyebrow: 'NAYAN ASATI / ABOUT', title: 'Engineer at the core.', body: 'Electrical engineering, manufacturing operations and self-taught software development are not separate chapters here. They are one way of seeing problems: understand the system, make the process better, then build the tool.', tags: ['B.Tech Electrical', 'Developer', 'Manufacturing', 'Sagar, MP'] },
  education: { eyebrow: 'BACKGROUND / EDUCATION', title: 'Electrical engineering foundation.', body: 'Formal engineering training provides the analytical base behind the software and operations work.', tags: ['Gurukul Kangri Vishwavidyalaya', '70.57%', 'CBSE'] },
  certifications: { eyebrow: 'BACKGROUND / CERTIFICATIONS', title: 'Learning through practice.', body: 'Development fundamentals, manufacturing apprenticeship and an AI tools workshop complement the formal engineering degree.', tags: ['2022', '2024–2025', '2025'] },
  contact: { eyebrow: 'NAYAN ASATI / CONTACT', title: 'Open a connection.', body: 'Pick a channel. The network stays intact while the relevant action opens.', tags: ['Email', 'LinkedIn', 'GitHub', 'Phone'] }
};

const pathTo = (level: Level) => { const path: Level[] = []; let current: Level | undefined = level; while (current) { path.unshift(current); current = parent[current]; } return path; };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function Home() {
  const [level, setLevel] = useState<Level>('home');
  const [scale, setScale] = useState(1);
  const [camera, setCamera] = useState<Point>({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState('nayan');
  const [moving, setMoving] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const cameraRef = useRef(camera);
  const scaleRef = useRef(scale);
  const animationRef = useRef<number | null>(null);
  const dragRef = useRef({ active: false, id: -1, startX: 0, startY: 0, cameraX: 0, cameraY: 0, lastX: 0, lastY: 0, lastTime: 0 });
  const velocity = useRef<Point>({ x: 0, y: 0 });

  const path = useMemo(() => pathTo(level), [level]);
  const active = children[level];
  const mobile = viewport.width < 720;
  const compact = viewport.width < 980;
  const minZoom = mobile ? 0.58 : 0.55;

  useEffect(() => { cameraRef.current = camera; }, [camera]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const element = stage.current; if (!element) return;
    const observer = new ResizeObserver(([entry]) => setViewport({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element); return () => observer.disconnect();
  }, []);
  useEffect(() => () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); }, []);

  const positions = useMemo(() => {
    const map = new Map<string, Point>(); const w = viewport.width; const h = viewport.height;
    if (level === 'home') {
      map.set('nayan', { x: 0, y: 0 });
      const primary = ['projects', 'experience', 'skills', 'philosophy', 'about', 'contact'];
      const rx = mobile ? Math.min(w * .32, 145) : Math.min(w * .27, 330);
      const ry = mobile ? Math.min(h * .29, 185) : Math.min(h * .27, 255);
      primary.forEach((id, index) => { const angle = -Math.PI / 2 + index * Math.PI / 3; map.set(id, { x: Math.cos(angle) * rx, y: Math.sin(angle) * ry }); });
      const satellites = mobile
        ? [['jobpilot', -.40, -.34], ['ironakhada', .40, -.34], ['portfolio', -.40, .30], ['photography', .40, .30], ['pylauncher', 0, .43], ['smartgrid', 0, -.45], ['analyser', -.44, .02], ['ashok', .44, .02]]
        : [['jobpilot', -330, -205], ['ironakhada', -385, -10], ['portfolio', -310, 210], ['photography', 320, -5], ['pylauncher', 370, 205], ['smartgrid', 0, -350], ['analyser', -145, -315], ['ashok', 145, -315]];
      satellites.forEach(([id, x, y]) => map.set(id as string, { x: mobile ? (x as number) * w : x as number, y: mobile ? (y as number) * h : y as number }));
      return map;
    }
    const focusX = mobile ? 34 : compact ? 78 : 118;
    const step = mobile ? 104 : compact ? 142 : 178;
    map.set('nayan', { x: focusX - Math.min(path.length, 4) * step, y: 0 });
    path.slice(1).forEach((id, index) => map.set(id, { x: focusX - (path.length - 1 - index) * step, y: 0 }));
    map.set(level, { x: focusX, y: 0 });
    const rx = mobile ? Math.min(w * .28, 138) : compact ? 170 : 215;
    const ry = mobile ? Math.min(h * .22, 138) : compact ? 185 : 220;
    active.forEach((item, index) => { const angle = -Math.PI * .88 + (index / Math.max(1, active.length - 1)) * Math.PI * 1.76; map.set(item.id, { x: focusX + Math.cos(angle) * rx, y: Math.sin(angle) * ry }); });
    return map;
  }, [active, compact, level, mobile, path, viewport]);

  const visible = useMemo(() => {
    const map = new Map<string, Node>();
    map.set('nayan', node('nayan', 'NAYAN ASATI', undefined, undefined, 'primary'));
    path.slice(1).forEach(id => map.set(id, node(id, labels[id], undefined, undefined, 'ancestor')));
    active.forEach(item => map.set(item.id, item));
    return [...map.values()];
  }, [active, path]);

  const sizeOf = useCallback((item: Node) => {
    if (item.id === 'nayan') return mobile ? 118 : 160;
    if (item.id === level) return mobile ? 106 : 150;
    if (item.kind === 'primary') return mobile ? 72 : 94;
    if (item.kind === 'project') return mobile ? 90 : 108;
    if (item.kind === 'ancestor') return mobile ? 66 : 82;
    if (item.kind === 'satellite') return mobile ? 56 : 64;
    return mobile ? 72 : 82;
  }, [level, mobile]);

  const reset = useCallback(() => { setScale(level === 'home' ? 1 : mobile ? .76 : .86); setCamera({ x: 0, y: 0 }); }, [level, mobile]);
  const navigate = useCallback((item: Node) => {
    if (item.id === 'nayan') { setLevel('home'); setSelected('nayan'); setScale(1); setCamera({ x: 0, y: 0 }); return; }
    if (item.child) { const depth = pathTo(item.child).length - 1; setLevel(item.child); setSelected(item.id); setScale(reduced ? .92 : clamp(.90 - depth * .025, .78, .90)); setCamera({ x: 0, y: 0 }); return; }
    if (item.href) window.open(item.href, '_blank', 'noopener,noreferrer');
    setSelected(item.id);
  }, [reduced]);

  const zoom = useCallback((factor: number, origin?: Point) => {
    setScale(current => { const next = clamp(current * factor, minZoom, 1.65); if (origin) { const ratio = next / current; setCamera(previous => ({ x: origin.x - (origin.x - previous.x) * ratio, y: origin.y - (origin.y - previous.y) * ratio })); } return next; });
  }, [minZoom]);

  const animateTo = useCallback((target: Point, targetScale: number) => {
    if (reduced) { setCamera(target); setScale(targetScale); return; }
    const fromCamera = cameraRef.current; const fromScale = scaleRef.current; const start = performance.now();
    const frame = (now: number) => { const p = clamp((now - start) / 650, 0, 1); const e = 1 - Math.pow(1 - p, 4); setCamera({ x: fromCamera.x + (target.x - fromCamera.x) * e, y: fromCamera.y + (target.y - fromCamera.y) * e }); setScale(fromScale + (targetScale - fromScale) * e); if (p < 1) animationRef.current = requestAnimationFrame(frame); };
    if (animationRef.current) cancelAnimationFrame(animationRef.current); animationRef.current = requestAnimationFrame(frame);
  }, [reduced]);

  const hitNode = useCallback((clientX: number, clientY: number) => {
    const rect = stage.current?.getBoundingClientRect(); if (!rect) return null;
    const local = { x: clientX - (rect.left + rect.width / 2), y: clientY - (rect.top + rect.height / 2) };
    for (const item of [...visible].reverse()) { const point = positions.get(item.id); if (!point) continue; const size = sizeOf(item); const x = point.x * scaleRef.current + cameraRef.current.x; const y = point.y * scaleRef.current + cameraRef.current.y; if (Math.hypot(local.x - x, local.y - y) <= size * scaleRef.current / 2 + 18) return item; }
    return null;
  }, [positions, sizeOf, visible]);

  const focusNode = useCallback((item: Node) => {
    const point = positions.get(item.id); if (!point) return;
    if (item.child) { navigate(item); return; }
    setSelected(item.id); const targetScale = clamp(scaleRef.current * (mobile ? 1.08 : 1.12), .72, 1.25); animateTo({ x: -point.x * targetScale, y: -point.y * targetScale }, targetScale);
  }, [animateTo, mobile, navigate, positions]);

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    event.preventDefault(); const rect = stage.current?.getBoundingClientRect(); if (!rect) return;
    const origin = { x: event.clientX - (rect.left + rect.width / 2), y: event.clientY - (rect.top + rect.height / 2) }; const item = hitNode(event.clientX, event.clientY);
    if (item && event.deltaY < -22) { focusNode(item); return; } zoom(event.deltaY < 0 ? 1.045 : .955, origin);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if ((event.target as Element).closest('[data-node],button,a')) return;
    dragRef.current = { active: true, id: event.pointerId, startX: event.clientX, startY: event.clientY, cameraX: cameraRef.current.x, cameraY: cameraRef.current.y, lastX: event.clientX, lastY: event.clientY, lastTime: performance.now() }; velocity.current = { x: 0, y: 0 }; setMoving(true); event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current; if (!drag.active || drag.id !== event.pointerId) return; const now = performance.now(); const dt = Math.max(8, now - drag.lastTime); velocity.current = { x: (event.clientX - drag.lastX) / dt * 16, y: (event.clientY - drag.lastY) / dt * 16 }; drag.lastX = event.clientX; drag.lastY = event.clientY; drag.lastTime = now; const next = { x: drag.cameraX + event.clientX - drag.startX, y: drag.cameraY + event.clientY - drag.startY }; setCamera(next);
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current; if (!drag.active || drag.id !== event.pointerId) return; drag.active = false; setMoving(false); if (reduced) return;
    const coast = () => { velocity.current.x *= .90; velocity.current.y *= .90; if (Math.abs(velocity.current.x) + Math.abs(velocity.current.y) < .2) return; setCamera(current => ({ x: current.x + velocity.current.x, y: current.y + velocity.current.y })); animationRef.current = requestAnimationFrame(coast); }; animationRef.current = requestAnimationFrame(coast);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' || event.key === 'Home') { event.preventDefault(); setLevel('home'); setSelected('nayan'); setScale(1); setCamera({ x: 0, y: 0 }); return; }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1.08); return; }
    if (event.key === '-') { event.preventDefault(); zoom(.92); return; }
    if (event.key === 'Backspace' && level !== 'home') { event.preventDefault(); const previous = parent[level] ?? 'home'; setLevel(previous); setSelected(previous === 'home' ? 'nayan' : previous); setScale(previous === 'home' ? 1 : mobile ? .76 : .86); setCamera({ x: 0, y: 0 }); }
  };

  const edges = useMemo(() => {
    const result: Array<{ key: string; a: string; b: string; active?: boolean; secondary?: boolean }> = [];
    path.slice(1).forEach((id, index) => result.push({ key: `path-${id}`, a: path[index], b: id, active: selected === id || hovered === id }));
    active.forEach(item => result.push({ key: `child-${item.id}`, a: level, b: item.id, active: selected === item.id || hovered === item.id }));
    if (level === 'home') {
      [['projects', 'jobpilot'], ['projects', 'ironakhada'], ['projects', 'portfolio'], ['projects', 'photography'], ['projects', 'pylauncher'], ['projects', 'smartgrid'], ['experience', 'analyser'], ['experience', 'ashok']].forEach(([a, b]) => result.push({ key: `secondary-${b}`, a, b, secondary: true }));
    }
    return result;
  }, [active, hovered, level, path, selected]);

  const activeItem = visible.find(item => item.id === (hovered ?? selected));
  const detail = details[level];

  return (
    <main className={`flow ${moving ? 'is-moving' : ''} ${reduced ? 'motion-reduced' : ''}`} ref={stage} tabIndex={0} onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onKeyDown={handleKeyDown} aria-label="Nayan Asati interactive portfolio network">
      <div className="flow-atmosphere" aria-hidden="true"><div className="atmosphere-grid"/><div className="atmosphere-orbit orbit-one"/><div className="atmosphere-orbit orbit-two"/><div className="atmosphere-noise"/><div className="atmosphere-vignette"/></div>
      <header className="flow-header">
        <button className="flow-wordmark" onClick={() => navigate(node('nayan', 'NAYAN ASATI'))} aria-label="Return to origin">NAYAN<i>.</i></button>
        <div className="flow-header-center"><span>FLOW / 2026</span><b/><strong>{labels[level]}</strong></div>
        <div className="flow-header-meta"><span>CREATIVE ENGINEER</span><span>TECHNICAL ARCHITECT</span></div>
      </header>

      <div className="flow-trace" aria-label="Current navigation path">{path.map((id, index) => <span key={`${id}-${index}`} className={index === path.length - 1 ? 'current' : ''}>{labels[id]}{index < path.length - 1 && <b>→</b>}</span>)}</div>

      <section className="flow-stage" aria-label="Interactive network. Drag to pan, scroll to zoom, click nodes to explore.">
        <div className="flow-world" style={{ transform: `translate3d(${camera.x}px,${camera.y}px,0) scale(${scale})` }}>
          <svg className="flow-lines" viewBox="-800 -500 1600 1000" aria-hidden="true">{edges.map(edge => { const a = positions.get(edge.a); const b = positions.get(edge.b); if (!a || !b) return null; return <line key={edge.key} className={`${edge.active ? 'active ' : ''}${edge.secondary ? 'secondary' : ''}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>; })}</svg>
          <div className="flow-origin-mark" aria-hidden="true"/>
          {visible.map(item => {
            const point = positions.get(item.id); if (!point) return null; const root = item.id === 'nayan'; const focused = item.id === level; const ancestor = path.includes(item.id as Level); const activeClass = hovered === item.id || selected === item.id || focused;
            return <button key={item.id} data-node={item.id} className={`flow-node ${root ? 'root-node ' : ''}${focused ? 'focus-node ' : ''}${ancestor ? 'ancestor-node ' : ''}${item.kind ?? ''}${activeClass ? ' is-active' : ''}`} style={{ left: `calc(50% + ${point.x}px)`, top: `calc(50% + ${point.y}px)`, width: sizeOf(item), height: sizeOf(item) }} onClick={() => navigate(item)} onDoubleClick={() => focusNode(item)} onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(item.id)} onBlur={() => setHovered(null)} aria-label={`${item.label}${item.description ? ` — ${item.description}` : ''}`}>
              <span className="node-ring" aria-hidden="true"/><span className="node-pulse" aria-hidden="true"/><span className="node-core"><span>{item.label}</span>{root && <small>ORIGIN / ENGINEER</small>}</span>{item.description && <span className="node-description">{item.description}</span>}
            </button>;
          })}
        </div>
      </section>

      <div className="flow-intro"><span>PERSONAL SYSTEM / 01</span><p>Explore the work. Follow the connections.</p></div>
      <div className="flow-guide" aria-hidden="true"><span>SCROLL</span><i>TRAVEL</i><span>DRAG</span><i>PAN</i><span>CLICK</span><i>OPEN</i></div>
      {level !== 'home' && <button className="flow-back" onClick={() => { const previous = parent[level] ?? 'home'; setLevel(previous); setSelected(previous === 'home' ? 'nayan' : previous); setScale(previous === 'home' ? 1 : mobile ? .76 : .86); setCamera({ x: 0, y: 0 }); }}><ArrowLeft size={14}/><span>BACK</span></button>}

      <aside className="flow-detail" aria-live="polite">
        <div className="detail-index"><span>{detail.eyebrow}</span><span>{String(path.length).padStart(2, '0')}</span></div>
        <h1>{activeItem?.id && activeItem.id !== 'nayan' && hovered ? activeItem.label : detail.title}</h1>
        <p>{hovered && activeItem?.description ? activeItem.description : detail.body}</p>
        {detail.facts && <div className="detail-facts">{detail.facts.map(fact => <span key={fact}>{fact}</span>)}</div>}
        <div className="detail-tags">{detail.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        {detail.links && <div className="detail-links">{detail.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={12}/></a>)}</div>}
      </aside>

      <aside className="flow-stats" aria-hidden="true"><span><b>05</b> SHIPPED SOFTWARE</span><span><b>02</b> ENGINEERING ROLES</span><span><b>01</b> CAPSTONE SYSTEM</span></aside>
      <aside className="flow-controls" aria-label="Graph controls"><button onClick={() => zoom(.9)} aria-label="Zoom out"><Minus size={14}/></button><span>{Math.round(scale * 100)}%</span><button onClick={() => zoom(1.1)} aria-label="Zoom in"><Plus size={14}/></button><button onClick={reset} aria-label="Reset view"><RotateCcw size={14}/></button></aside>

      <footer className="flow-footer"><div><span>FLOW / NAYAN ASATI</span><strong>ENGINEER × DEVELOPER × BUILDER</strong></div><div className="footer-status"><i/><span>{level === 'home' ? 'SYSTEM READY' : 'TRACE ACTIVE'}</span></div><div className="footer-right"><a href="mailto:nayanasati2001@gmail.com" aria-label="Email Nayan"><Mail size={13}/></a><a href="https://www.linkedin.com/in/nayan-1209-asati" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={13}/></a><a href="https://github.com/Nayan1209" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={13}/></a><a href="tel:+916262055238" aria-label="Phone"><Phone size={13}/></a><span>© 2026</span></div></footer>
    </main>
  );
}
