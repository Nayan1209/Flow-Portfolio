'use client';
import{useEffect,useMemo,useRef,useState}from'react';
type L='home'|'projects'|'jobpilot'|'ironakhada'|'portfolio'|'photography'|'pylauncher'|'smartgrid'|'experience'|'analyser'|'ashok'|'skills'|'philosophy'|'about'|'education'|'certifications'|'contact';
type P={x:number;y:number};
type N={id:string;label:string;child?:L};
const label:Record<L,string>={home:'NAYAN ASATI',projects:'PROJECTS',jobpilot:'JOBPILOT AI',ironakhada:'IRON AKHADA',portfolio:'FLOW PORTFOLIO',photography:'GHOUL PHOTOGRAPHY',pylauncher:'PYLAUNCHER',smartgrid:'SMART GRID EMS',experience:'EXPERIENCE',analyser:'ANALYSER INSTRUMENT',ashok:'ASHOK LEYLAND',skills:'CAPABILITIES',philosophy:'THINKING',about:'ABOUT',education:'EDUCATION',certifications:'CERTIFICATIONS',contact:'CONTACT'};
const parent:Partial<Record<L,L>>={projects:'home',jobpilot:'projects',ironakhada:'projects',portfolio:'projects',photography:'projects',pylauncher:'projects',smartgrid:'projects',experience:'home',analyser:'experience',ashok:'experience',skills:'home',philosophy:'home',about:'home',education:'about',certifications:'about',contact:'home'};
const tree:Record<L,L[]>={home:['projects','experience','skills','philosophy','about','contact'],projects:['jobpilot','ironakhada','portfolio','photography','pylauncher','smartgrid'],experience:['analyser','ashok'],jobpilot:[],ironakhada:[],portfolio:[],photography:[],pylauncher:[],smartgrid:[],analyser:[],ashok:[],skills:[],philosophy:[],about:['education','certifications'],education:[],certifications:[],contact:[]};
const path=(l:L)=>{const a:L[]=[];for(let x:L|undefined=l;x;x=parent[x])a.unshift(x);return a};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export default function SmallFlow(){
 const[lev,setLev]=useState<L>('home'),[scale,setScale]=useState(1),[cam,setCam]=useState<P>({x:0,y:0});
 const ref=useRef<HTMLElement>(null),sr=useRef(1),cr=useRef<P>({x:0,y:0});
 useEffect(()=>{sr.current=scale},[scale]);useEffect(()=>{cr.current=cam},[cam]);
 const chain=useMemo(()=>path(lev),[lev]),kids=tree[lev];
 const pos=useMemo(()=>{const m=new Map<string,P>(),focus=lev==='home'?{x:0,y:0}:{x:Math.min(118,innerWidth*.08),y:0},step=lev==='home'?0:178;m.set('home',lev==='home'?{x:0,y:0}:{x:focus.x-Math.min(chain.length,4)*step,y:0});chain.slice(1).forEach((x,i)=>m.set(x,{x:focus.x-(chain.length-1-i)*step,y:0}));if(lev!=='home')m.set(lev,focus);kids.forEach((x,i)=>{const a=-Math.PI*.88+i/(Math.max(1,kids.length-1))*Math.PI*1.76;m.set(x,{x:(lev==='home'?0:focus.x)+Math.cos(a)*215,y:Math.sin(a)*220)});});if(lev==='home')kids.forEach((x,i)=>{const a=-Math.PI/2+i*Math.PI/3;m.set(x,{x:Math.cos(a)*Math.min(innerWidth*.27,330),y:Math.sin(a)*Math.min(innerHeight*.27,255)})});return m},[chain,kids,lev]);
 const nodes=useMemo<N[]>(()=>[{id:'home',label:'NAYAN ASATI'},...chain.slice(1).map(id=>({id,label:label[id]})),...kids.map(id=>({id,label:label[id],child:id}))],[chain,kids]);
 const go=(n:N)=>{if(n.id==='home'){setLev('home');setScale(1);setCam({x:0,y:0});return}if(n.child){setLev(n.child);setScale(clamp(.9-path(n.child).length*.025,.78,.9));setCam({x:0,y:0})}};
 const wheel=(e:React.WheelEvent)=>{e.preventDefault();const r=ref.current?.getBoundingClientRect();if(!r)return;const o={x:e.clientX-(r.left+r.width/2),y:e.clientY-(r.top+r.height/2)};setScale(s=>{const n=clamp(s*(e.deltaY<0?1.045:.955),.55,1.65),q=n/s;setCam(c=>({x:o.x-(o.x-c.x)*q,y:o.y-(o.y-c.y)*q}));return n})};
 return <main ref={ref} className="flow" tabIndex={0} onWheel={wheel}><section className="flow-stage"><div className="flow-world" style={{transform:`translate3d(${cam.x}px,${cam.y}px,0) scale(${scale})`}}>{nodes.map(n=>{const p=pos.get(n.id)!;return <button key={n.id} data-node={n.id} className={`flow-node ${n.id==='home'?'root-node':''} ${n.id===lev?'focus-node':''}`} style={{left:`calc(50% + ${p.x}px)`,top:`calc(50% + ${p.y}px)`,width:n.id==='home'?160:n.id===lev?150:90,height:n.id==='home'?160:n.id===lev?150:90}} onClick={()=>go(n)}><span className="node-core"><span>{n.label}</span></span></button>})}</div></section></main>;
}
