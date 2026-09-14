// Iris — standalone React component, exported from the Search Field Gallery.
// Colours, typography and timings below are the gallery's live settings at the
// moment you copied this. No dependencies. MIT.
// Morph speed 1.00 — live below.
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

export default function Iris({
  height=68, radius=34, placeholder="start typing...",
    fill="#FAFAFA", border="#F4F4F5", morph=1.00,
  font="Poppins", fontSize=16,
   textColor="#71717A", iconColor="#9CA3AF", placeholderColor="#4B5563",
}){
  const host=useRef(null),input=useRef(null);
  const [w,setW]=useState(0);
  const [open,setOpen]=useState(false);
  const [text,setText]=useState("");
  useEffect(()=>{const el=host.current;if(!el)return;
    const ro=new ResizeObserver(e=>setW(e[0].contentRect.width));
    ro.observe(el);setW(el.getBoundingClientRect().width);return()=>ro.disconnect();},[]);
  const close=useCallback(()=>{setOpen(false);setText("");},[]);
  useOutside(host,close,open);

  const p=useDriver(open,1000/morph,easeInOut);
  const W=height+(Math.max(height,w)-height)*p;

  const pl=24,pr=12,gap=14,icon=20;
  const avail=Math.max(0,W-(pl+icon+gap)-pr);
  const shown=text?text.length:Math.floor(avail/(fontSize*0.52));
  const hint=text?"":placeholder.slice(0,Math.min(placeholder.length,shown));

  return(
    <div ref={host} style={{width:"100%"}}>
      <div onMouseDown={e=>{
          if(!open){setOpen(true);setTimeout(()=>{if(input.current)input.current.focus();},700);return;}
          e.preventDefault();input.current.focus();}}
        style={{boxSizing:"border-box",display:"flex",alignItems:"center",gap,width:W,height,
          padding:"0 "+pr+"px 0 "+pl+"px",borderRadius:radius,background:fill,
          border:"1px solid "+border,overflow:"hidden",cursor:open?"text":"pointer"}}>
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none"
        stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flex:"none"}}>
        <path d="M17 17L21 21"/><path d="M12 3.06189C11.6724 3.02104 11.3387 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11C19 10.6613 18.979 10.3276 18.9381 10"/><path d="M17.5 2.9375V4.5M17.5 4.5V6.0625M17.5 4.5H16.25M17.5 4.5H18.75M20 4.5L18.9156 4.13852C18.4179 3.97263 18.0274 3.58211 17.8615 3.08443L17.5 2L17.1385 3.08443C16.9726 3.58211 16.5821 3.97263 16.0844 4.13852L15 4.5L16.0844 4.86148C16.5821 5.02737 16.9726 5.41789 17.1385 5.91557L17.5 7L17.8615 5.91557C18.0274 5.41789 18.4179 5.02737 18.9156 4.86148L20 4.5Z"/>
      </svg>
        <div style={{position:"relative",flex:1,minWidth:0,height:28}}>
          <input ref={input} value={text} spellCheck={false} tabIndex={open?0:-1} aria-label={placeholder}
            onChange={e=>setText(e.target.value)}
            style={{position:"absolute",inset:0,width:"100%",height:"100%",background:"transparent",
              border:0,outline:"none",padding:0,margin:0,
              font:"400 "+fontSize+"px/28px "+font,color:"transparent",caretColor:textColor}}/>
          <span style={{position:"absolute",left:0,top:0,height:"100%",display:"flex",alignItems:"center",
            whiteSpace:"pre",pointerEvents:"none",overflow:"hidden",maxWidth:"100%",
            font:"400 "+fontSize+"px/28px "+font,color:textColor}}>
            {text||<span style={{color:placeholderColor}}>{hint}</span>}
          </span>
        </div>
      </div>
    </div>);
}
