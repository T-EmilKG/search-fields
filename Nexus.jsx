// Nexus — standalone React component, exported from the Search Field Gallery.
// Colours, typography and timings below are the gallery's live settings at the
// moment you copied this. No dependencies. MIT.
// Morph 1.00 · drift 1.00 · band 1.00 · panel 1.00 — all live below.
import { useEffect, useRef, useState, useCallback } from "react";

function outline(w,h,r0){const r=Math.min(r0,w/2,h/2),sw=Math.max(0,w-2*r),sh=Math.max(0,h-2*r),q=Math.PI*r/2,length=2*sw+2*sh+4*q;
function at(s0){let s=s0%length;if(s<0)s+=length;
 if(s<sw)return{x:r+s,y:0,nx:0,ny:-1};s-=sw;
 if(s<q){const t=-Math.PI/2+s/r;return{x:w-r+r*Math.cos(t),y:r+r*Math.sin(t),nx:Math.cos(t),ny:Math.sin(t)};}s-=q;
 if(s<sh)return{x:w,y:r+s,nx:1,ny:0};s-=sh;
 if(s<q){const t=s/r;return{x:w-r+r*Math.cos(t),y:h-r+r*Math.sin(t),nx:Math.cos(t),ny:Math.sin(t)};}s-=q;
 if(s<sw)return{x:w-r-s,y:h,nx:0,ny:1};s-=sw;
 if(s<q){const t=Math.PI/2+s/r;return{x:r+r*Math.cos(t),y:h-r+r*Math.sin(t),nx:Math.cos(t),ny:Math.sin(t)};}s-=q;
 if(s<sh)return{x:0,y:h-r-s,nx:-1,ny:0};s-=sh;
 const t=Math.PI+s/r;return{x:r+r*Math.cos(t),y:r+r*Math.sin(t),nx:Math.cos(t),ny:Math.sin(t)};}
return{w,h,r,length,at};}
const rgba=(c,a)=>"rgba("+c[0]+","+c[1]+","+c[2]+","+a+")";
const l3=(a,b,t)=>[Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t),Math.round(a[2]+(b[2]-a[2])*t)];
const WARM=[255,138,92],CORE=[245,246,255];

function cssColor(v){if(typeof v!=="string"||v.indexOf("var(")<0)return v;var m=v.match(/,\s*([^)]*\)|[^),]+)\)\s*$/);return m?m[1].trim():v;}
function useBorderLight(cv,o){
  const {on,w,h,radius,pad,speed=1,band=1,rim="#1F2023",rimWidth=1.5,
    tail=WARM,mid=CORE,cool=[72,231,236]}=o;
  const parts=useRef([]),clock=useRef(0),diss=useRef(on?0:1),wake=useRef(null),lit=useRef(on);
  const ramp=u=>u<0.5?l3(tail,mid,u/0.5):l3(mid,cool,(u-0.5)/0.5);
  useEffect(()=>{lit.current=on;if(wake.current)wake.current();},[on]);
  useEffect(()=>{
    const c=cv.current;if(!c||!w||!h)return;const ctx=c.getContext("2d");if(!ctx)return;
    const W=w,H=h+pad*2,dpr=Math.min(2,window.devicePixelRatio||1);
    c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const inset=rimWidth/2;
    const g=outline(Math.max(1,w-pad*2-rimWidth),Math.max(1,h-rimWidth),Math.max(0,radius-inset));
    const FRAC=0.15*band,vel=0.16*speed;
    const steps=Math.max(200,Math.round(g.length/2)),rimPath=new Path2D();
    for(let i=0;i<=steps;i++){const p=g.at(i/steps*g.length),x=pad+inset+p.x,y=pad+inset+p.y;i?rimPath.lineTo(x,y):rimPath.moveTo(x,y);}
    rimPath.closePath();
    let raf=0,prev=performance.now(),idle=0;
    const frame=now=>{try{
      const dt=Math.min(0.05,(now-prev)/1000);prev=now;clock.current+=dt;
      const tg=lit.current?0:1;
      diss.current+=(tg-diss.current)*Math.min(1,(tg?4.2:2.4)*dt);
      const env=1-diss.current,cx=pad+g.w/2,cy=pad+g.h/2,keep=[];
      for(const p of parts.current){p.age+=dt;if(p.age>p.life)continue;
        p.vx+=(cx-p.x)*dt*4.2;p.vy+=(cy-p.y)*dt*4.2;p.vx*=0.94;p.vy*=0.94;p.x+=p.vx*dt;p.y+=p.vy*dt;keep.push(p);}
      parts.current=keep;
        ctx.clearRect(0,0,W,H);
      ctx.globalCompositeOperation="source-over";ctx.strokeStyle=cssColor(rim);ctx.lineWidth=rimWidth;ctx.stroke(rimPath);
      ctx.lineCap="round";
      if(env>0.02){ctx.globalCompositeOperation="lighter";
        const len=FRAC*g.length,head=(clock.current*vel*g.length)%g.length,TK=26,tl=(len/TK)*0.5;
        for(let i=0;i<TK;i++){const a=i/(TK-1),b=Math.sin(a*Math.PI)*Math.pow(a,0.8);if(b<0.03)continue;
          const s0=head-len+i*(len/TK),A=g.at(s0),B=g.at(s0+tl);
          ctx.strokeStyle=rgba(ramp(a),b*env);ctx.lineWidth=1.4+3.2*b;
          ctx.beginPath();ctx.moveTo(pad+inset+A.x,pad+inset+A.y);ctx.lineTo(pad+inset+B.x,pad+inset+B.y);ctx.stroke();}}
      ctx.globalCompositeOperation="lighter";
      for(const p of parts.current){const z=Math.max(0,1-p.age/p.life),zz=z*z,rd=0.8+h*0.05*zz;if(!(rd>0.3))continue;
        ctx.fillStyle=rgba(p.col,Math.min(1,0.85*zz*p.wt));ctx.beginPath();ctx.arc(p.x,p.y,rd,0,Math.PI*2);ctx.fill();}
      const busy=lit.current||parts.current.length>0||diss.current>0.01;idle=busy?0:idle+1;
      if(idle>24){raf=0;return;}
    }catch(e){}raf=requestAnimationFrame(frame);};
    raf=requestAnimationFrame(frame);
    wake.current=()=>{if(!raf){prev=performance.now();idle=0;raf=requestAnimationFrame(frame);}};
    return()=>{cancelAnimationFrame(raf);raf=0;};
  },[w,h,radius,pad,speed,band,rim,rimWidth]);
  return useCallback(()=>{
    if(!w||!h)return;const inset=rimWidth/2;
    const g=outline(Math.max(1,w-pad*2-rimWidth),Math.max(1,h-rimWidth),Math.max(0,radius-inset));
    const len=0.15*band*g.length,head=(clock.current*0.16*speed*g.length)%g.length,cx=pad+g.w/2,cy=pad+g.h/2;
    for(let i=0;i<130;i++){const sPos=i/130*g.length;
      const d=((head-sPos)%g.length+g.length)%g.length,onArc=d<len;
      if(!onArc&&Math.random()>0.25)continue;if(onArc&&Math.random()>0.9)continue;
      const q=g.at(sPos),x=pad+inset+q.x,y=pad+inset+q.y;
      let dx=cx-x,dy=cy-y;const L=Math.max(1,Math.hypot(dx,dy));dx/=L;dy/=L;
      const sp=90+Math.random()*170,u=onArc?1-d/len:0.2;
      parts.current.push({x,y,vx:dx*sp-q.ny*(Math.random()*70-35),vy:dy*sp+q.nx*(Math.random()*70-35),
        age:0,life:0.5+Math.random()*0.55,col:ramp(u),wt:onArc?0.85+Math.random()*0.15:0.4});}
    if(wake.current)wake.current();
  },[w,h,radius,pad,speed,band,rimWidth]);
}

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

export default function Nexus({
  height=68, radius=34, placeholder="start typing...",
  fill="#FAFAFA", border="#F4F4F5",  morph=1.00, speed=1.00, band=1.00, openSpeed=1.00,
  lightHead=[72,231,236], lightCore=[245,246,255], lightTail=[255,138,92],
  panelBg="#F4F4F5", panelRim="#E4E4E7", rowRule="#E4E4E7",
  chipBg="#F4F4F5", chipRim="#E4E4E7", chipText="#71717A",  
  font="Poppins", fontSize=16,
  textColor="#71717A", iconColor="#9CA3AF", placeholderColor="#4B5563",
  mutedColor="#71717A", dimColor="#71717A", rowColor="#52525B",
}){
  const host=useRef(null),cv=useRef(null),input=useRef(null);
  const [w,setW]=useState(0);
  const [open,setOpen]=useState(false);
  const [panel,setPanel]=useState(false);
  const [text,setText]=useState("");
  const pad=26, icon=20, pl=24, pr=12, gap=14;

  useEffect(()=>{const el=host.current;if(!el)return;
    const ro=new ResizeObserver(e=>setW(e[0].contentRect.width));
    ro.observe(el);setW(el.getBoundingClientRect().width);return()=>ro.disconnect();},[]);

  const close=useCallback(()=>{setPanel(false);setOpen(false);setText("");},[]);
  useOutside(host,close,open);

  const p=useDriver(open,1000/morph,easeInOut);
  const q=useDriver(panel,1000/openSpeed,easeBrand);
  const rowP=i=>easeOut(clamp01((q-i*0.12)/0.55));
  const feather=Math.round((1-q)*64);
  const mask="linear-gradient(to bottom, transparent 0px, #000 "+feather+"px)";

  const innerFull=Math.max(height,w-pad*2);
  const W=height+(innerFull-height)*p;
  // the rim is only lit once the morph has finished, so the canvas isn't
  // rebuilt on every frame of the width animation
  const settled=p>0.995;

  const burst=useBorderLight(cv,{on:settled&&text.length===0,w:settled?w:0,h:height,
    radius,pad,speed,band,rim:border,rimWidth:1.5,
    cool:lightHead,mid:lightCore,tail:lightTail});

  const focusSoon=()=>setTimeout(()=>{if(input.current)input.current.focus();},700/morph);

  const avail=Math.max(0,W-(pl+icon+gap)-pr);
  const shown=text?text.length:Math.floor(avail/(fontSize*0.52));
  const hint=text?"":placeholder.slice(0,Math.min(placeholder.length,shown));

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
    <div ref={host} style={{width:"100%",display:"flex",flexDirection:"column",gap:36+pad,boxSizing:"border-box"}}>
      <div style={{display:"grid",gridTemplateRows:q+"fr",opacity:q}}>
        <div style={{overflow:"hidden",minHeight:0,maskImage:mask,WebkitMaskImage:mask}}>
          <div style={{background:panelBg,border:"1px solid "+panelRim,borderRadius:16,
            display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"14px 20px 10px",font:"600 11px "+font,textTransform:"uppercase",
              letterSpacing:"0.04em",color:placeholderColor}}>Suggestions</div>
            <div style={{height:1,width:"100%",background:panelRim}}/>
            {ROWS.map((r,i)=>{const rp=rowP(i);return(
              <div key={r.k}>
                {i>0&&<div style={{height:1,width:"100%",background:rowRule}}/>}
                <button onMouseDown={e=>{e.preventDefault();if(!text)burst();setText(r.label);input.current.focus();}}
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

      <div style={{position:"relative",width:"100%",margin:(-pad)+"px 0"}}>
        <div style={{position:"relative",padding:pad}}>
          <canvas ref={cv} style={{position:"absolute",left:0,top:0,width:w,height:height+pad*2,
            pointerEvents:"none",opacity:settled?1:0}}/>
          <div onMouseDown={e=>{
              if(!open){setOpen(true);focusSoon();return;}
              if(e.target.closest("button"))return;
              e.preventDefault();input.current.focus();}}
            style={{position:"relative",boxSizing:"border-box",display:"flex",alignItems:"center",gap,
              width:W,height,padding:"0 "+pr+"px 0 "+pl+"px",borderRadius:radius,background:fill,
              border:"1px solid "+(settled?"transparent":border),
              overflow:"hidden",cursor:open?"text":"pointer"}}>
            <button onMouseDown={e=>{e.preventDefault();e.stopPropagation();
                if(!open){setOpen(true);focusSoon();return;}
                setPanel(!panel);input.current.focus();}}
              aria-label={open?"Show suggestions":"Open search"}
              style={{background:"transparent",border:0,padding:0,cursor:"pointer",display:"flex",flex:"none"}}>
              <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke={panel?textColor:iconColor}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 17L21 21"/><path d="M12 3.06189C11.6724 3.02104 11.3387 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11C19 10.6613 18.979 10.3276 18.9381 10"/><path d="M17.5 2.9375V4.5M17.5 4.5V6.0625M17.5 4.5H16.25M17.5 4.5H18.75M20 4.5L18.9156 4.13852C18.4179 3.97263 18.0274 3.58211 17.8615 3.08443L17.5 2L17.1385 3.08443C16.9726 3.58211 16.5821 3.97263 16.0844 4.13852L15 4.5L16.0844 4.86148C16.5821 5.02737 16.9726 5.41789 17.1385 5.91557L17.5 7L17.8615 5.91557C18.0274 5.41789 18.4179 5.02737 18.9156 4.86148L20 4.5Z"/>
              </svg>
            </button>
            <div style={{position:"relative",flex:1,minWidth:0,height:28}}>
              <input ref={input} value={text} spellCheck={false} tabIndex={open?0:-1} aria-label={placeholder}
                onChange={e=>{const v=e.target.value;if(!text&&v)burst();setText(v);}}
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
        </div>
      </div>
    </div>);
}
