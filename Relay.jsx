// Relay — standalone React component, exported from the Search Field Gallery.
// Colours, typography and timings below are the gallery's live settings at the
// moment you copied this. No dependencies. MIT.
// Border speed 1.35 — live below. Click the equaliser to light the border.
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

export default function Relay({
  height=160, radius=24, placeholder="Write a message…",
  fill="var(--token-92ad8f0d-602f-4238-959e-9119bc61089d, rgb(250, 250, 250))", border="rgba(244, 244, 245, 0)", speed=1.35,
  lightHead=[72,231,236], lightCore=[245,246,255], lightTail=[255,138,92],
  font="Poppins", fontSize=16,
  textColor="var(--token-3daabe86-e5bd-4959-be05-20e0031aa4b5, rgb(113, 113, 122))", iconColor="rgb(156, 163, 175)", placeholderColor="rgb(75, 85, 99)",
}){
  const host=useRef(null),box=useRef(null),cv=useRef(null),input=useRef(null);
  const [w,setW]=useState(0);
  const [size,setSize]=useState({w:0,h:height});
  const [text,setText]=useState("");
  const [voice,setVoice]=useState(false);
  const pad=26;

  useEffect(()=>{const el=host.current;if(!el)return;
    const ro=new ResizeObserver(e=>setW(e[0].contentRect.width));
    ro.observe(el);setW(el.getBoundingClientRect().width);return()=>ro.disconnect();},[]);

  // measure the composer's real border box so the rim always matches it
  useEffect(()=>{const el=box.current;if(!el)return;
    const read=()=>{const r=el.getBoundingClientRect();
      setSize(p=>Math.abs(p.w-r.width)<0.5&&Math.abs(p.h-r.height)<0.5?p:{w:r.width,h:r.height});};
    const ro=new ResizeObserver(read);ro.observe(el);read();return()=>ro.disconnect();},[]);

  const cw=size.w?size.w+pad*2:w, ch=size.h||height;
  useBorderLight(cv,{on:voice,w:cw,h:ch,radius,pad,speed,band:1,rim:border,rimWidth:1,
    cool:lightHead,mid:lightCore,tail:lightTail});

  const bars=[8,14,11,16,9];

  return(
    <div ref={host} style={{position:"relative",width:"100%",margin:(-pad)+"px 0"}}>
      <style>{"@keyframes relayEq{from{transform:scaleY(0.45)}to{transform:scaleY(1)}}"}</style>
      <div style={{position:"relative",padding:pad}}>
        <canvas ref={cv} style={{position:"absolute",left:0,top:0,width:cw,height:ch+pad*2,pointerEvents:"none"}}/>
        <div ref={box}
          onMouseDown={e=>{if(e.target.closest("button"))return;e.preventDefault();input.current.focus();}}
          style={{position:"relative",boxSizing:"border-box",background:fill,borderRadius:radius,
            height,padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between",
            width:"100%",cursor:"text"}}>
          <div style={{display:"flex",paddingLeft:8,width:"100%"}}>
            <div style={{position:"relative",flex:1,minWidth:0,height:28}}>
              <input ref={input} value={text} spellCheck={false} aria-label={placeholder}
                onChange={e=>setText(e.target.value)}
                style={{position:"absolute",inset:0,width:"100%",height:"100%",background:"transparent",
                  border:0,outline:"none",padding:0,margin:0,
                  font:"400 "+fontSize+"px/28px "+font,color:"transparent",caretColor:textColor}}/>
              <span style={{position:"absolute",left:0,top:0,height:"100%",display:"flex",alignItems:"center",
                whiteSpace:"pre",pointerEvents:"none",overflow:"hidden",maxWidth:"100%",
                font:"400 "+fontSize+"px/28px "+font,color:textColor}}>
                {text||<span style={{color:placeholderColor}}>{placeholder}</span>}
              </span>
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
            <button aria-label="Add" style={{width:36,height:36,borderRadius:18,border:0,background:"transparent",
              display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5 V19 M5 12 H19" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <button onClick={()=>setVoice(!voice)} aria-label="Voice control"
              style={{width:36,height:36,borderRadius:18,border:0,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
                background:voice?"rgba(128,128,128,0.22)":"transparent"}}>
              <span style={{display:"flex",gap:2,alignItems:"center",height:16,width:21}}>
                {bars.map((bh,i)=>(<span key={i} style={{width:2,height:bh,borderRadius:1,
                  background:voice?textColor:iconColor,transformOrigin:"center",
                  animation:voice?"relayEq 900ms ease-in-out infinite alternate":"none",
                  animationDelay:(i*90)+"ms"}}/>))}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>);
}
