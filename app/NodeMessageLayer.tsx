'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

type NodeInfo = {
  eyebrow: string;
  title?: string;
  summary: string;
  details?: string[];
  tags?: string[];
  href?: string;
  hrefLabel?: string;
};

const terminalIds = new Set([
  'jp-product','jp-workflow','jp-gmail','jp-resume','jp-tech','jp-link',
  'ia-radio','ia-stations','ia-audio','ia-presence','ia-context','ia-link',
  'pf-system','pf-camera','pf-interaction','pf-access','pf-stack','pf-link',
  'gp-archive','gp-ui','gp-ai','gp-deploy','gp-link',
  'pl-kivy','pl-ui','pl-actions','pl-debug','pl-link',
  'sg-ems','sg-monitor','sg-control','sg-reliability','sg-date',
  'ai-role','ai-dates','ai-tender','ai-products','ai-proposals','ai-followup','ai-support','ai-win',
  'al-role','al-dates','al-manpower','al-sap','al-quality','al-rca','al-systems','al-team',
  'sk-engineering','sk-problem','sk-web','sk-python','sk-tools','sk-apis','sk-ai','sk-people',
  'ph-root','ph-system','ph-build','ph-leverage','ph-document','ph-improve',
  'ab-profile','ab-location','ab-languages','ab-approach',
  'ed-btech','ed-12','ed-10','cr-web','cr-apprentice','cr-ai',
  'ct-email','ct-linkedin','ct-github','ct-phone','ct-location','ct-open'
]);

const info: Record<string, NodeInfo> = {
  'jp-product': { eyebrow:'JOBPILOT AI / PRODUCT', summary:'A job opportunity tracking and outreach workspace designed around the complete application workflow.', details:['Covers opportunity discovery, tracking, outreach preparation and application execution.','The project is built as a practical workspace rather than a static job board.'], tags:['Job outreach','Workspace','Product system'] },
  'jp-workflow': { eyebrow:'JOBPILOT AI / WORKFLOW', summary:'Find → track → tailor → recruit → draft → approve → send.', details:['The workflow connects opportunity discovery to personalized outreach.','It is designed to reduce the repeated manual steps involved in a job search.'], tags:['Workflow','Automation','Outreach'] },
  'jp-gmail': { eyebrow:'JOBPILOT AI / GMAIL', summary:'Gmail integration supports live job scanning and automated outreach.', details:['Email becomes part of the same workspace instead of a disconnected final step.','The resume source describes live scanning and automated outreach integration.'], tags:['Gmail','Integration','Automation'] },
  'jp-resume': { eyebrow:'JOBPILOT AI / RESUME TAILORING', summary:'Role-aware resume and application preparation.', details:['The system includes resume tailoring as part of the outreach workflow.','The goal is to prepare application material around the opportunity rather than treating every application identically.'], tags:['Resume','Tailoring','Applications'] },
  'jp-tech': { eyebrow:'JOBPILOT AI / STACK', summary:'Next.js, React and TypeScript with AI-assisted development workflows.', tags:['Next.js','React','TypeScript','AI-assisted development'] },
  'jp-link': { eyebrow:'JOBPILOT AI / LIVE PROJECT', summary:'Open the deployed JobPilot AI workspace.', href:'https://jobpilot-ai-jade.vercel.app/', hrefLabel:'OPEN JOBPILOT AI' },

  'ia-radio': { eyebrow:'IRON AKHADA / RADIO', summary:'A time-based gym radio built around training atmosphere.', details:['The experience changes its musical identity with the time of day.','It is designed to feel like a live training station rather than a conventional music player.'], tags:['Gym radio','Time-based','Experience'] },
  'ia-stations': { eyebrow:'IRON AKHADA / STATIONS', summary:'Morning Hustle, Mid-Day Iron, Peak Power and Late Night Shred.', details:['Stations organize the experience around different training moods.','The interface presents the current station as part of the on-air experience.'], tags:['Morning Hustle','Mid-Day Iron','Peak Power','Late Night Shred'] },
  'ia-audio': { eyebrow:'IRON AKHADA / AUDIO', summary:'A rotating playlist streamed through Cloudflare R2.', details:['Audio delivery is separated from the visual interface.','The rotating playlist supports the time-aware radio concept.'], tags:['Audio','Cloudflare R2','Streaming'] },
  'ia-presence': { eyebrow:'IRON AKHADA / LIVE PRESENCE', summary:'Live listener presence, on-air display and clock.', details:['The interface communicates that the station is active now.','A live clock anchors the experience to real time.'], tags:['Live presence','On air','Clock'] },
  'ia-context': { eyebrow:'IRON AKHADA / CONTEXT', summary:'YouTube playlist source, local weather and time-aware presentation.', details:['External context is used to make the radio feel connected to the current moment.','Weather and time become part of the presentation instead of decorative extras.'], tags:['YouTube','Weather','Time-aware UI'] },
  'ia-link': { eyebrow:'IRON AKHADA / LIVE PROJECT', summary:'Open the deployed Iron Akhada experience.', href:'https://iron-akhada.vercel.app/', hrefLabel:'OPEN IRON AKHADA' },

  'pf-system': { eyebrow:'FLOW PORTFOLIO / SYSTEM', summary:'The portfolio is itself a navigable graph.', details:['Nayan is the permanent origin.','Projects, experience, capabilities, thinking, about and contact become connected regions rather than separate pages.'], tags:['Graph','Navigation','System'] },
  'pf-camera': { eyebrow:'FLOW PORTFOLIO / CAMERA', summary:'Persistent ancestry with progressive focus and spatial travel.', details:['Moving deeper into a branch keeps the path visible.','The camera travels through the graph rather than replacing the current screen.'], tags:['Camera','Ancestry','Spatial travel'] },
  'pf-interaction': { eyebrow:'FLOW PORTFOLIO / INTERACTION', summary:'Click, scroll, drag, hover, keyboard and touch interactions.', details:['Clicking opens branches.','Scrolling can travel toward a node.','Dragging pans the network.','Keyboard controls and touch behavior provide alternate paths through the system.'], tags:['Click','Scroll','Drag','Keyboard','Touch'] },
  'pf-access': { eyebrow:'FLOW PORTFOLIO / ACCESSIBILITY', summary:'Semantic controls, focus states and reduced-motion support.', details:['The interface uses buttons for nodes and visible focus states.','Reduced-motion preferences disable the animated motion system rather than leaving users with broken transitions.'], tags:['Accessibility','Focus','Reduced motion'] },
  'pf-stack': { eyebrow:'FLOW PORTFOLIO / STACK', summary:'Next.js 14, React 18, TypeScript and SVG/CSS.', details:['The graph uses DOM nodes with SVG connection lines and CSS motion.','The project is designed for Vercel deployment.'], tags:['Next.js 14','React 18','TypeScript','SVG','CSS'] },
  'pf-link': { eyebrow:'FLOW PORTFOLIO / ORIGINAL PORTFOLIO', summary:'Open the earlier deployed portfolio for reference.', href:'https://nayan-asati-portfolio.vercel.app/', hrefLabel:'OPEN ORIGINAL PORTFOLIO' },

  'gp-archive': { eyebrow:'GHOUL PHOTOGRAPHY / ARCHIVE', summary:'A cinematic photography portfolio and visual archive.', details:['The site is organized around photography collections and visual presentation.','The goal is a gallery experience rather than a generic portfolio grid.'], tags:['Photography','Archive','Visual design'] },
  'gp-ui': { eyebrow:'GHOUL PHOTOGRAPHY / INTERFACE', summary:'Responsive galleries with smooth navigation and a modern layout.', details:['Built with HTML, CSS and JavaScript.','The interface prioritizes responsive browsing and cinematic presentation.'], tags:['HTML5','CSS3','JavaScript','Responsive'] },
  'gp-ai': { eyebrow:'GHOUL PHOTOGRAPHY / AI ASSISTANCE', summary:'AI tools were used for design, debugging and troubleshooting.', details:['AI assistance was used during development rather than presented as the product itself.'], tags:['AI tools','Debugging','Troubleshooting'] },
  'gp-deploy': { eyebrow:'GHOUL PHOTOGRAPHY / DEPLOYMENT', summary:'Deployed on Vercel with Google Search Console indexing started.', details:['The project is live on Vercel.','Search Console work was started to make the site discoverable.'], tags:['Vercel','Google Search Console'] },
  'gp-link': { eyebrow:'GHOUL PHOTOGRAPHY / LIVE PROJECT', summary:'Open the deployed photography portfolio.', href:'https://ghoul-photography.vercel.app/', hrefLabel:'OPEN GHOUL PHOTOGRAPHY' },

  'pl-kivy': { eyebrow:'PYLAUNCHER / KIVY', summary:'A Python/Kivy minimalist Android launcher.', details:['The launcher replaces a conventional home-screen presentation with a clean, text-only interface.'], tags:['Python','Kivy','Android'] },
  'pl-ui': { eyebrow:'PYLAUNCHER / TEXT UI', summary:'A clean, text-only home-screen aesthetic.', details:['The visual direction intentionally removes heavy launcher chrome.','The result is a minimalist interface centered on text and actions.'], tags:['Minimalism','Text UI','Android'] },
  'pl-actions': { eyebrow:'PYLAUNCHER / AUTOMATION', summary:'Automated builds and deployment through GitHub Actions.', details:['Build and deployment work is automated through GitHub Actions.','This keeps the project repeatable instead of relying on manual packaging.'], tags:['GitHub Actions','CI','Automation'] },
  'pl-debug': { eyebrow:'PYLAUNCHER / DEBUGGING', summary:'AI-assisted debugging across rendering, labels, Python and NDK compatibility.', details:['AI tools were used to investigate rendering crashes and app-label resolution issues.','Compatibility problems across Python and NDK versions were also debugged during development.'], tags:['Debugging','Python','NDK','AI assistance'] },
  'pl-link': { eyebrow:'PYLAUNCHER / GITHUB', summary:'Open the PyLauncher repository.', href:'https://github.com/Nayan1209/pylauncher', hrefLabel:'OPEN GITHUB REPOSITORY' },

  'sg-ems': { eyebrow:'SMART GRID EMS / ENERGY MANAGEMENT', summary:'A Smart Grid Energy Management System integrating renewable generation and storage for optimized performance.', details:['Final-year project completed Jan 2024 – May 2024.','The system combines renewable energy and storage with operational decision-making.'], tags:['Smart Grid','EMS','Renewables','Storage'] },
  'sg-monitor': { eyebrow:'SMART GRID EMS / MONITORING', summary:'Real-time monitoring and load forecasting.', details:['Monitoring provides visibility into system behavior.','Load forecasting supports better demand–supply decisions.'], tags:['Monitoring','Load forecasting','Real time'] },
  'sg-control': { eyebrow:'SMART GRID EMS / ADAPTIVE CONTROL', summary:'Demand–supply balancing through adaptive control.', details:['Adaptive control was used to respond to changing system conditions.','The objective is optimized performance rather than static scheduling.'], tags:['Adaptive control','Demand','Supply'] },
  'sg-reliability': { eyebrow:'SMART GRID EMS / RELIABILITY', summary:'Fault detection, self-healing and demand response strategies.', details:['Reliability features were designed around detecting abnormal conditions and recovering intelligently.','Demand response is part of the overall energy-management strategy.'], tags:['Fault detection','Self-healing','Demand response'] },
  'sg-date': { eyebrow:'SMART GRID EMS / CAPSTONE', summary:'Jan 2024 – May 2024 · Electrical Engineering final-year project.', details:['Developed as the B.Tech Electrical Engineering final-year project.'], tags:['B.Tech','Electrical Engineering','2024'] },

  'ai-role': { eyebrow:'ANALYSER INSTRUMENT / ROLE', summary:'Engineer at Analyser Instrument Company Private Limited, Kota, India.', details:['Employment period: November 2025 – June 2026.','The role combined technical compliance, proposal work, customer support and industrial analyser knowledge.'], tags:['Engineer','Kota','11/2025–06/2026'] },
  'ai-dates': { eyebrow:'ANALYSER INSTRUMENT / PERIOD', summary:'November 2025 — June 2026.', details:['Proposal and technical compliance engineering during this period.'], tags:['11/2025','06/2026'] },
  'ai-tender': { eyebrow:'ANALYSER INSTRUMENT / TENDER COMPLIANCE', summary:'Prepared and reviewed technical compliance documents against tender specifications and customer requirements.', details:['Aligned product information with tender requirements.','Supported bid preparation with detailed technical documentation.','Achieved 90% technical scoring in tender work.'], tags:['Tender','Compliance','Technical documentation'] },
  'ai-products': { eyebrow:'ANALYSER INSTRUMENT / INDUSTRIAL ANALYSERS', summary:'Worked with industrial analysers, including working principles, measurement ranges and application suitability.', details:['Developed hands-on product knowledge.','Used that understanding to support technically appropriate proposals and customer responses.'], tags:['Industrial analysers','Measurement ranges','Applications'] },
  'ai-proposals': { eyebrow:'ANALYSER INSTRUMENT / PROPOSALS', summary:'Collaborated cross-functionally to produce accurate, competitive technical proposals.', details:['Worked across teams to turn requirements into technically defensible proposals.','Balanced customer requirements with product offerings and project needs.'], tags:['Cross-functional','Proposals','Client requirements'] },
  'ai-followup': { eyebrow:'ANALYSER INSTRUMENT / CLIENT FOLLOW-UP', summary:'Handled tender and enquiry follow-ups, ensuring timely client responses and engagement.', details:['Tracked outstanding enquiries and tender communication.','Kept technical responses aligned with customer timelines.'], tags:['Client follow-up','Enquiries','Tenders'] },
  'ai-support': { eyebrow:'ANALYSER INSTRUMENT / TECHNICAL SUPPORT', summary:'Resolved customer queries and clarified product specifications.', details:['Provided technical explanations around product specifications.','Used product knowledge to support customer decision-making.'], tags:['Technical support','Customers','Specifications'] },
  'ai-win': { eyebrow:'ANALYSER INSTRUMENT / RESULT', summary:'Achieved 90% technical scoring in tender submission work.', details:['This is the clearest quantified result in the role.','The score reflects detailed, data-backed technical compliance and proposal work.'], tags:['90% technical','Tender','Result'] },

  'al-role': { eyebrow:'ASHOK LEYLAND / ROLE', summary:'Graduate Apprentice Trainee at Ashok Leyland, Pantnagar, India.', details:['Employment period: August 2024 – July 2025.','The role combined production leadership, quality improvement, process monitoring and hands-on industrial systems work.'], tags:['Graduate Apprentice Trainee','Pantnagar','08/2024–07/2025'] },
  'al-dates': { eyebrow:'ASHOK LEYLAND / PERIOD', summary:'August 2024 — July 2025.', details:['Manufacturing and production operations during the apprenticeship period.'], tags:['08/2024','07/2025'] },
  'al-manpower': { eyebrow:'ASHOK LEYLAND / LEADERSHIP', summary:'Managed more than 100 people while leading shift operations to meet production targets.', details:['Maintained production targets while protecting quality standards and team efficiency.','Built and managed a high-performing team on the shop floor.'], tags:['100+ manpower','Shift operations','Leadership'] },
  'al-sap': { eyebrow:'ASHOK LEYLAND / PROCESS MONITORING', summary:'Used SAP NetWeaver and Siemens HMI for process monitoring and downtime reduction.', details:['Monitored production processes using plant systems.','Used operational data and process visibility to improve efficiency and minimize downtime.'], tags:['SAP NetWeaver','Siemens HMI','Downtime'] },
  'al-quality': { eyebrow:'ASHOK LEYLAND / QUALITY', summary:'Implemented enhanced inspection and preventive measures to improve product quality and reduce rejection rates.', details:['Focused on prevention rather than only correcting defects after they occurred.','Improved inspection discipline and product quality.'], tags:['Quality','Inspection','Prevention','Rejection reduction'] },
  'al-rca': { eyebrow:'ASHOK LEYLAND / ROOT-CAUSE ANALYSIS', summary:'Resolved customer complaints and reduced repeat issues.', details:['Applied root-cause analysis to understand why issues occurred.','Used findings to reduce recurrence and improve customer satisfaction.'], tags:['RCA','Customer complaints','Continuous improvement'] },
  'al-systems': { eyebrow:'ASHOK LEYLAND / INDUSTRIAL SYSTEMS', summary:'Worked hands-on with pneumatic, hydraulic and electrical systems.', details:['Maintained reliable operations while working across multiple industrial disciplines.','This combined electrical engineering knowledge with practical manufacturing exposure.'], tags:['Pneumatic','Hydraulic','Electrical'] },
  'al-team': { eyebrow:'ASHOK LEYLAND / TEAM', summary:'Built and managed a high-performing production team.', details:['Combined manpower management with hands-on operational responsibility.','The focus was consistent output, quality and reliable shift execution.'], tags:['Team management','Production','Quality'] },

  'sk-engineering': { eyebrow:'CAPABILITIES / ENGINEERING', summary:'Manufacturing processes, failure analysis, line balancing, 5S and lean manufacturing.', details:['Engineering and manufacturing knowledge comes from the B.Tech foundation and shop-floor experience.','This is paired with engineering documentation and practical process thinking.'], tags:['Manufacturing','Failure analysis','5S','Lean'] },
  'sk-problem': { eyebrow:'CAPABILITIES / PROBLEM SOLVING', summary:'Root-cause analysis, process improvement, critical thinking and engineering documentation.', details:['The approach is to identify the mechanism behind a problem before choosing a fix.','Documentation turns the solution into something repeatable.'], tags:['RCA','Process improvement','Critical thinking'] },
  'sk-web': { eyebrow:'CAPABILITIES / WEB', summary:'JavaScript, HTML5, CSS3, React (Vite) and Bootstrap.', details:['Used across responsive websites and interactive portfolio work.'], tags:['JavaScript','HTML5','CSS3','React','Bootstrap'] },
  'sk-python': { eyebrow:'CAPABILITIES / PYTHON', summary:'Python, FastAPI and Kivy application development.', details:['Python spans backend/API work with FastAPI and application development with Kivy.','PyLauncher is the clearest shipped example.'], tags:['Python','FastAPI','Kivy'] },
  'sk-tools': { eyebrow:'CAPABILITIES / PLATFORMS', summary:'Git, GitHub, GitHub Actions, Vercel, Netlify, Render and Formspree.', details:['Source control, CI, deployment and form infrastructure are part of the end-to-end workflow.'], tags:['Git','GitHub','Actions','Vercel','Netlify','Render'] },
  'sk-apis': { eyebrow:'CAPABILITIES / APIS', summary:'REST APIs and product integrations.', details:['API knowledge supports practical integrations between interfaces, services and external platforms.'], tags:['REST','Integration','Backend'] },
  'sk-ai': { eyebrow:'CAPABILITIES / AI TOOLS', summary:'AI-assisted development, debugging and troubleshooting workflows.', details:['AI is used as engineering leverage for implementation and debugging.','The portfolio and PyLauncher both reflect this workflow.'], tags:['AI-assisted development','Debugging','Troubleshooting'] },
  'sk-people': { eyebrow:'CAPABILITIES / COLLABORATION', summary:'Teamwork, collaboration and manpower management.', details:['Experience spans cross-functional proposal teams and 100+ person manufacturing operations.'], tags:['Teamwork','Collaboration','Manpower management'] },

  'ph-root': { eyebrow:'THINKING / FIND THE ROOT', summary:'Start with the underlying problem, not the visible symptom.', details:['Root-cause analysis is a recurring engineering habit from manufacturing into software.','The goal is to fix the mechanism that creates the problem.'], tags:['Root cause','Diagnosis'] },
  'ph-system': { eyebrow:'THINKING / SEE THE SYSTEM', summary:'Think across frontend, backend, operations, deployment and people.', details:['Good engineering decisions account for the whole system, not just the visible interface.'], tags:['Systems thinking','Architecture'] },
  'ph-build': { eyebrow:'THINKING / BUILD PRACTICALLY', summary:'Prefer working software and measurable improvement over decoration.', details:['The portfolio is intentionally interactive, but the interaction exists to communicate structure and work.'], tags:['Practicality','Shipping','Outcomes'] },
  'ph-leverage': { eyebrow:'THINKING / USE LEVERAGE', summary:'Use AI tools to accelerate implementation while keeping engineering judgment human.', details:['AI is treated as a force multiplier for coding and debugging, not as a replacement for technical responsibility.'], tags:['AI','Leverage','Judgment'] },
  'ph-document': { eyebrow:'THINKING / DOCUMENT', summary:'Make decisions, requirements and systems understandable.', details:['Clear documentation supports collaboration, maintenance and repeatability.'], tags:['Documentation','Clarity'] },
  'ph-improve': { eyebrow:'THINKING / ITERATE', summary:'Test, learn, fix the root cause and improve the next version.', details:['Iteration is a deliberate engineering loop rather than endless visual tweaking.'], tags:['Iteration','Testing','Continuous improvement'] },

  'ab-profile': { eyebrow:'ABOUT / PROFILE', summary:'Self-taught developer with an engineering and manufacturing foundation.', details:['Builds products end-to-end across frontend, backend and deployment.','Combines software development with root-cause analysis, process documentation and cross-functional coordination.'], tags:['Engineer','Developer','Builder'] },
  'ab-location': { eyebrow:'ABOUT / BASE', summary:'Sagar, Madhya Pradesh, India.', details:['Professional background spans Sagar, Haridwar, Pantnagar and Kota.'], tags:['Sagar','Madhya Pradesh','India'] },
  'ab-languages': { eyebrow:'ABOUT / LANGUAGES', summary:'Hindi — Native. English — Professional.', tags:['Hindi','English'] },
  'ab-approach': { eyebrow:'ABOUT / APPROACH', summary:'Engineering discipline plus end-to-end software delivery.', details:['Manufacturing experience contributes process discipline.','Software work contributes product-building and deployment experience.'], tags:['Engineering','Software','Operations'] },

  'ed-btech': { eyebrow:'EDUCATION / B.TECH ELECTRICAL', summary:'Gurukul Kangri Vishwavidyalaya, Haridwar · May 2024 · 70.57%.', details:['Bachelor of Technology in Electrical Engineering.','The degree is the formal engineering foundation behind the later manufacturing and software work.'], tags:['B.Tech','Electrical Engineering','70.57%'] },
  'ed-12': { eyebrow:'EDUCATION / 12TH CBSE PCM', summary:'Green Valley School, Bhopal · April 2020 · 68.80%.', details:['Class 12 with Physics, Chemistry and Mathematics.'], tags:['CBSE','PCM','68.80%'] },
  'ed-10': { eyebrow:'EDUCATION / 10TH CBSE', summary:'Paras Vidya Vihar, Sagar · April 2018 · 69.80%.', details:['Class 10 CBSE education.'], tags:['CBSE','69.80%'] },

  'cr-web': { eyebrow:'CERTIFICATION / WEB DEVELOPMENT', summary:'CSS, Bootstrap, JavaScript and PHP Stack Complete Course — Proper Dot Institute — 8 Dec 2022.', tags:['CSS','Bootstrap','JavaScript','PHP'] },
  'cr-apprentice': { eyebrow:'CERTIFICATION / MANUFACTURING', summary:'Apprenticeship in Manufacturing Industry — Ashok Leyland, Pantnagar Unit — Aug 2024 to Jul 2025.', details:['One-year practical manufacturing apprenticeship.'], tags:['Manufacturing','Ashok Leyland','2024–2025'] },
  'cr-ai': { eyebrow:'CERTIFICATION / AI TOOLS', summary:'AI Tools Workshop — United Latino Students Association — Dec 2025.', details:['Workshop exposure to AI tools supporting modern development workflows.'], tags:['AI tools','Workshop','2025'] },

  'ct-email': { eyebrow:'CONTACT / EMAIL', summary:'nayanasati2001@gmail.com', details:['Best channel for a direct professional message.'], tags:['Email'], href:'mailto:nayanasati2001@gmail.com', hrefLabel:'SEND EMAIL' },
  'ct-linkedin': { eyebrow:'CONTACT / LINKEDIN', summary:'Professional profile and career network.', tags:['LinkedIn'], href:'https://linkedin.com/in/nayan-1209-asati', hrefLabel:'OPEN LINKEDIN' },
  'ct-github': { eyebrow:'CONTACT / GITHUB', summary:'Code, repositories and shipped software.', tags:['GitHub'], href:'https://github.com/Nayan1209', hrefLabel:'OPEN GITHUB' },
  'ct-phone': { eyebrow:'CONTACT / PHONE', summary:'+91 6262055238', details:['Available as a direct professional contact channel.'], tags:['Phone'], href:'tel:+916262055238', hrefLabel:'CALL' },
  'ct-location': { eyebrow:'CONTACT / LOCATION', summary:'Sagar, Madhya Pradesh, India.', tags:['India','Madhya Pradesh'] },
  'ct-open': { eyebrow:'CONTACT / OPEN TO', summary:'Business excellence, operational excellence and technical/development opportunities.', details:['The supplied resume states interest in Business Excellence and Operational Excellence programs as well as technical/development roles.'], tags:['Business Excellence','Operational Excellence','Development'] }
};

export default function NodeMessageLayer() {
  const [nodeId, setNodeId] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const button = target?.closest<HTMLElement>('[data-node]');
      if (!button) return;
      const id = button.dataset.node;
      if (!id || !terminalIds.has(id)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setNodeId(id);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!nodeId) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setNodeId(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [nodeId]);

  if (!nodeId) return null;
  const button = document.querySelector<HTMLElement>(`[data-node="${CSS.escape(nodeId)}"]`);
  const label = button?.querySelector('.node-core > span')?.textContent?.trim() || nodeId;
  const item = info[nodeId] ?? { eyebrow: 'FLOW / NODE', summary: button?.getAttribute('aria-label')?.replace(`${label} — `, '') || 'Explore this node for more information.' };
  const context = document.querySelector('.flow-header-center strong')?.textContent || 'FLOW';

  return (
    <div className="node-message-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setNodeId(null); }}>
      <section className="node-message" role="dialog" aria-modal="true" aria-labelledby="node-message-title">
        <div className="node-message-top"><span>{item.eyebrow}</span><button className="node-message-close" onClick={() => setNodeId(null)} aria-label="Close message"><X size={16}/></button></div>
        <div className="node-message-context">TRACE / {context}</div>
        <h2 id="node-message-title">{item.title || label}</h2>
        <p className="node-message-summary">{item.summary}</p>
        {item.details && <div className="node-message-details">{item.details.map((detail) => <p key={detail}>{detail}</p>)}</div>}
        {item.tags && <div className="node-message-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
        {item.href && <a className="node-message-action" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>{item.hrefLabel || 'OPEN'}<ExternalLink size={13}/></a>}
        <div className="node-message-footer"><span>ESC TO CLOSE</span><span>NODE / {nodeId.toUpperCase()}</span></div>
      </section>
    </div>
  );
}
