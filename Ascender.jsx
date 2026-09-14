// Ascender — standalone React component, exported from the Search Field Gallery.
// Colours, typography and timings below are the gallery's live settings at the
// moment you copied this. No dependencies. MIT.
// Open speed 1.00 — live below.
import { useEffect, useRef, useState, useCallback } from "react";

const clamp01=u=>Math.min(1,Math.max(0,u));
const easeInOut=u=>u<0.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
const easeIn=u=>u*u*u;
const easeOut=u=>1-Math.pow(1-u,3);
function cubicBezier(x1,y1,x2,y2){
  const A=(a,b)=>1-3*b+3*a,B=(a,b)=>3*b-6*a,C=a=>3*a;
  const calc=(t,a,b)=>((A(a,b)*t+B(a,b))*t+C(a))*t;
  const slope=(t,a,b)=>3*A(a,b)*t*t+2*B(a,b)*t+C(a);
  return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;
    for(let i=0;i<8;i++){const sl=slope(t,x1,x2);if(sl===0)break;
      const err=calc(t,x1,x2)-x;if(Math.abs(err)<1e-5)break;t-=err/sl;}
    return calc(t,y1,y2);};}
const easeBrand=cubicBezier(0.75,0,0.12,1);
function useDriver(target,dur,ease){
  const [p,setP]=useState(target?1:0);
  const raf=useRef(0),from=useRef(target?1:0),t0=useRef(0);
  useEffect(()=>{cancelAnimationFrame(raf.current);from.current=p;t0.current=performance.now();
    const goal=target?1:0,span=Math.abs(goal-from.current)||1;
    const step=now=>{const u=clamp01((now-t0.current)/(dur*span));
      setP(from.current+(goal-from.current)*ease(u));
      if(u<1)raf.current=requestAnimationFrame(step);};
    raf.current=requestAnimationFrame(step);
    return()=>cancelAnimationFrame(raf.current);},[target,dur]);
  return p;}
function useOutside(ref,close,when){
  useEffect(()=>{if(!when)return;
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))close();};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);},[when,close]);}

const ROWS=[
  {k:"ask",icon:"arrow",label:"Ask about this",hint:"Enter"},
  {k:"src",icon:"search",label:"Search my sources",hint:"\u2318K"},
  {k:"r1",icon:"clock",pre:"Recent:",label:"retrieval latency"},
  {k:"r2",icon:"clock",pre:"Recent:",label:"embedding drift"},
];

export default function Ascender({
  height=68, radius=34, placeholder="start typing...",
  fill="#FAFAFA", border="#E4E4E7", openSpeed=1.00,
  panelBg="#F4F4F5", panelRim="#E4E4E7", rowRule="#E4E4E7",
  chipBg="#F4F4F5", chipRim="#E4E4E7", chipText="#71717A",
  font="Poppins", fontSize=16,
  textColor="#71717A", iconColor="#9CA3AF",
  mutedColor="#71717A", dimColor="#71717A", faintColor="#4B5563", rowColor="#52525B",
}){
  const host=useRef(null),input=useRef(null);
  const [open,setOpen]=useState(false);
  const [text,setText]=useState("");
  const close=useCallback(()=>setOpen(false),[]);
  useOutside(host,close,open);

  const p=useDriver(open,1000/openSpeed,easeBrand);
  const rowP=i=>easeOut(clamp01((p-i*0.12)/0.55));
  // soft edge over the clip line so the panel fades in rather than sliding
  // out from a hard cut; shrinks to nothing once fully open
  const feather=Math.round((1-p)*64);
  const mask="linear-gradient(to bottom, transparent 0px, #000 "+feather+"px)";
  const icon=20;

  const Ico=({kind})=>{
    const c=dimColor;
    if(kind==="arrow")return(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{flex:"none"}}>
      <path d="M15 5 L20 10 L15 15" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 10 H8 a4 4 0 0 0 -4 4 v5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    if(kind==="clock")return(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{flex:"none"}}>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/>
      <path d="M12 7 V12 L15.5 14" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
    return(<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flex:"none"}}>
      <path d="M17 17L21 21"/><path d="M12 3.06189C11.6724 3.02104 11.3387 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11C19 10.6613 18.979 10.3276 18.9381 10"/><path d="M17.5 2.9375V4.5M17.5 4.5V6.0625M17.5 4.5H16.25M17.5 4.5H18.75M20 4.5L18.9156 4.13852C18.4179 3.97263 18.0274 3.58211 17.8615 3.08443L17.5 2L17.1385 3.08443C16.9726 3.58211 16.5821 3.97263 16.0844 4.13852L15 4.5L16.0844 4.86148C16.5821 5.02737 16.9726 5.41789 17.1385 5.91557L17.5 7L17.8615 5.91557C18.0274 5.41789 18.4179 5.02737 18.9156 4.86148L20 4.5Z"/></svg>);
  };

  return(
    <div ref={host} style={{width:"100%",display:"flex",flexDirection:"column",gap:36,boxSizing:"border-box"}}>
      <div style={{display:"grid",gridTemplateRows:p+"fr",opacity:p}}>
        <div style={{overflow:"hidden",minHeight:0,maskImage:mask,WebkitMaskImage:mask}}>
          <div style={{background:panelBg,border:"1px solid "+panelRim,borderRadius:16,
            display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"14px 20px 10px",font:"600 11px "+font,textTransform:"uppercase",
              letterSpacing:"0.04em",color:faintColor}}>Suggestions</div>
            <div style={{height:1,width:"100%",background:panelRim}}/>
            {ROWS.map((r,i)=>{const rp=rowP(i);return(
              <div key={r.k}>
                {i>0&&<div style={{height:1,width:"100%",background:rowRule}}/>}
                <button onMouseDown={e=>{e.preventDefault();setText(r.label);input.current.focus();}}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"13px 20px",width:"100%",background:"transparent",border:0,cursor:"pointer",
                    font:"400 14px "+font,textAlign:"left",
                    opacity:rp,transform:"translateY("+((1-rp)*16).toFixed(2)+"px)"}}>
                  <span style={{display:"flex",alignItems:"center",gap:10}}>
                    <Ico kind={r.icon}/>
                    {r.pre
                      ? <span style={{display:"flex",gap:6}}>
                          <span style={{color:dimColor}}>{r.pre}</span>
                          <span style={{color:mutedColor}}>{r.label}</span>
                        </span>
                      : <span style={{color:rowColor,fontWeight:500}}>{r.label}</span>}
                  </span>
                  {r.hint?<span style={{background:chipBg,border:"1px solid "+chipRim,borderRadius:6,
                    padding:"3px 9px",fontWeight:500,fontSize:12,color:chipText}}>{r.hint}</span>:null}
                </button>
              </div>);})}
          </div>
        </div>
      </div>

      <div onMouseDown={e=>{if(e.target.closest("button"))return;e.preventDefault();input.current.focus();}}
        style={{boxSizing:"border-box",display:"flex",alignItems:"center",gap:14,height,
          padding:"0 12px 0 24px",borderRadius:radius,background:fill,border:"1px solid "+border,
          overflow:"hidden",cursor:"text"}}>
        <button onMouseDown={e=>{e.preventDefault();e.stopPropagation();setOpen(!open);input.current.focus();}}
          aria-label="Show suggestions"
          style={{background:"transparent",border:0,padding:0,cursor:"pointer",display:"flex",flex:"none"}}>
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke={open?textColor:iconColor}
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 17L21 21"/><path d="M12 3.06189C11.6724 3.02104 11.3387 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11C19 10.6613 18.979 10.3276 18.9381 10"/><path d="M17.5 2.9375V4.5M17.5 4.5V6.0625M17.5 4.5H16.25M17.5 4.5H18.75M20 4.5L18.9156 4.13852C18.4179 3.97263 18.0274 3.58211 17.8615 3.08443L17.5 2L17.1385 3.08443C16.9726 3.58211 16.5821 3.97263 16.0844 4.13852L15 4.5L16.0844 4.86148C16.5821 5.02737 16.9726 5.41789 17.1385 5.91557L17.5 7L17.8615 5.91557C18.0274 5.41789 18.4179 5.02737 18.9156 4.86148L20 4.5Z"/>
          </svg>
        </button>
        <div style={{position:"relative",flex:1,minWidth:0,height:28}}>
          <input ref={input} value={text} spellCheck={false} aria-label={placeholder}
            onChange={e=>setText(e.target.value)}
            style={{position:"absolute",inset:0,width:"100%",height:"100%",background:"transparent",
              border:0,outline:"none",padding:0,margin:0,
              font:"400 "+fontSize+"px/28px "+font,color:"transparent",caretColor:textColor}}/>
          <span style={{position:"absolute",left:0,top:0,height:"100%",display:"flex",alignItems:"center",
            whiteSpace:"pre",pointerEvents:"none",overflow:"hidden",maxWidth:"100%",
            font:"400 "+fontSize+"px/28px "+font,color:textColor}}>
            {text||<span style={{color:faintColor}}>{placeholder}</span>}
          </span>
        </div>
      </div>
    </div>);
}
