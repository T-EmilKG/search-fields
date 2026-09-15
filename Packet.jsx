// Packet — standalone React component. No dependencies. MIT.
// A search field whose border carries a dashed neon streak while empty; the
// first keystroke bursts it inward.
//
// The border light is drawn on a canvas that sits BEHIND the capsule and is
// aligned to the capsule's MEASURED box (getBoundingClientRect), so the rim
// always traces the field exactly — at any width, container, or zoom. The
// field fill should be at least slightly translucent for the glow to show
// through at the edges; on a solid opaque fill the rim reads only faintly.
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

// The light. Draws to a canvas sized box.w+pad*2 by box.h+pad*2, with the
// capsule's top-left at (pad,pad). box is the MEASURED capsule size.
function useBorderLight(cv,o){
  const {on,boxW,boxH,radius,pad,speed=1,band=1,rim="#1F2023",rimWidth=1.5,
    tail=WARM,mid=CORE,cool=[72,231,236]}=o;
  const parts=useRef([]),clock=useRef(0),diss=useRef(on?0:1),wake=useRef(null),lit=useRef(on);
  const ramp=u=>u<0.5?l3(tail,mid,u/0.5):l3(mid,cool,(u-0.5)/0.5);
  useEffect(()=>{lit.current=on;if(wake.current)wake.current();},[on]);
  useEffect(()=>{
    const c=cv.current;if(!c||!boxW||!boxH)return;const ctx=c.getContext("2d");if(!ctx)return;
    const W=boxW+pad*2,H=boxH+pad*2,dpr=Math.min(2,window.devicePixelRatio||1);
    c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const inset=rimWidth/2;
    const g=outline(Math.max(1,boxW-rimWidth),Math.max(1,boxH-rimWidth),Math.max(0,radius-inset));
    const FRAC=0.15*band,vel=0.16*speed;
    // rim origin: capsule top-left is at (pad,pad); add inset so the stroke sits inside the edge
    const ox=pad+inset,oy=pad+inset;
    const steps=Math.max(200,Math.round(g.length/2)),rimPath=new Path2D();
    for(let i=0;i<=steps;i++){const p=g.at(i/steps*g.length),x=ox+p.x,y=oy+p.y;i?rimPath.lineTo(x,y):rimPath.moveTo(x,y);}
    rimPath.closePath();
    let raf=0,prev=performance.now(),idle=0;
    const frame=now=>{try{
      const dt=Math.min(0.05,(now-prev)/1000);prev=now;clock.current+=dt;
      const tg=lit.current?0:1;
      diss.current+=(tg-diss.current)*Math.min(1,(tg?4.2:2.4)*dt);
      const env=1-diss.current,cx=pad+boxW/2,cy=pad+boxH/2,keep=[];
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
          ctx.beginPath();ctx.moveTo(ox+A.x,oy+A.y);ctx.lineTo(ox+B.x,oy+B.y);ctx.stroke();}}
      ctx.globalCompositeOperation="lighter";
      for(const p of parts.current){const z=Math.max(0,1-p.age/p.life),zz=z*z,rd=0.8+boxH*0.05*zz;if(!(rd>0.3))continue;
        ctx.fillStyle=rgba(p.col,Math.min(1,0.85*zz*p.wt));ctx.beginPath();ctx.arc(p.x,p.y,rd,0,Math.PI*2);ctx.fill();}
      const busy=lit.current||parts.current.length>0||diss.current>0.01;idle=busy?0:idle+1;
      if(idle>24){raf=0;return;}
    }catch(e){}raf=requestAnimationFrame(frame);};
    raf=requestAnimationFrame(frame);
    wake.current=()=>{if(!raf){prev=performance.now();idle=0;raf=requestAnimationFrame(frame);}};
    return()=>{cancelAnimationFrame(raf);raf=0;};
  },[boxW,boxH,radius,pad,speed,band,rim,rimWidth]);
  return useCallback(()=>{
    if(!boxW||!boxH)return;
    const g=outline(Math.max(1,boxW-rimWidth),Math.max(1,boxH-rimWidth),Math.max(0,radius-rimWidth/2));
    const ox=pad+rimWidth/2,oy=pad+rimWidth/2;
    const len=0.15*band*g.length,head=(clock.current*0.16*speed*g.length)%g.length,cx=pad+boxW/2,cy=pad+boxH/2;
    for(let i=0;i<130;i++){const sPos=i/130*g.length;
      const d=((head-sPos)%g.length+g.length)%g.length,onArc=d<len;
      if(!onArc&&Math.random()>0.25)continue;if(onArc&&Math.random()>0.9)continue;
      const qp=g.at(sPos),x=ox+qp.x,y=oy+qp.y;
      let dx=cx-x,dy=cy-y;const L=Math.max(1,Math.hypot(dx,dy));dx/=L;dy/=L;
      const sp=90+Math.random()*170,u=onArc?1-d/len:0.2;
      parts.current.push({x,y,vx:dx*sp-qp.ny*(Math.random()*70-35),vy:dy*sp+qp.nx*(Math.random()*70-35),
        age:0,life:0.5+Math.random()*0.55,col:ramp(u),wt:onArc?0.85+Math.random()*0.15:0.4});}
    if(wake.current)wake.current();
  },[boxW,boxH,radius,pad,speed,band,rimWidth]);
}

export default function Packet({
  height=68, radius=34, placeholder="start typing...",
  fill="rgba(250,250,250,0.85)", border="#f4f4f5",
  speed=1.00, band=1.00,
  lightHead=[72,231,236], lightCore=[245,246,255], lightTail=[255,138,92],
  font="Poppins", fontSize=16,
  textColor="#71717a", iconColor="#9ca3af", placeholderColor="#4b5563",
}){
  const host=useRef(null),field=useRef(null),cv=useRef(null),input=useRef(null);
  const [box,setBox]=useState({w:0,h:height});
  const [text,setText]=useState("");
  const pad=26;

  // measure the capsule's real rendered box; the rim is drawn to exactly this
  useEffect(()=>{const el=field.current;if(!el)return;
    const read=()=>{const r=el.getBoundingClientRect();
      setBox(p=>Math.abs(p.w-r.width)<0.5&&Math.abs(p.h-r.height)<0.5?p:{w:r.width,h:r.height});};
    const ro=new ResizeObserver(read);ro.observe(el);read();return()=>ro.disconnect();},[]);

  const burst=useBorderLight(cv,{on:text.length===0,boxW:box.w,boxH:box.h,radius,pad,
    speed,band,rim:border,rimWidth:1.5,cool:lightHead,mid:lightCore,tail:lightTail});

  const inset=Math.round(height*0.353),gap=Math.round(height*0.206),icon=Math.round(height*0.294);

  return(
    <div ref={host} style={{position:"relative",width:"100%",margin:(-pad)+"px 0"}}>
      <div style={{position:"relative",padding:pad}}>
        <canvas ref={cv} style={{position:"absolute",left:0,top:0,
          width:box.w+pad*2,height:box.h+pad*2,pointerEvents:"none"}}/>
        <div ref={field} onMouseDown={e=>{e.preventDefault();input.current.focus();}}
          style={{position:"relative",boxSizing:"border-box",display:"flex",alignItems:"center",gap,
            height,padding:"0 "+inset+"px",borderRadius:radius,background:fill,cursor:"text",overflow:"hidden"}}>
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none"
        stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flex:"none"}}>
        <path d="M17 17L21 21"/><path d="M12 3.06189C11.6724 3.02104 11.3387 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11C19 10.6613 18.979 10.3276 18.9381 10"/><path d="M17.5 2.9375V4.5M17.5 4.5V6.0625M17.5 4.5H16.25M17.5 4.5H18.75M20 4.5L18.9156 4.13852C18.4179 3.97263 18.0274 3.58211 17.8615 3.08443L17.5 2L17.1385 3.08443C16.9726 3.58211 16.5821 3.97263 16.0844 4.13852L15 4.5L16.0844 4.86148C16.5821 5.02737 16.9726 5.41789 17.1385 5.91557L17.5 7L17.8615 5.91557C18.0274 5.41789 18.4179 5.02737 18.9156 4.86148L20 4.5Z"/>
      </svg>
          <div style={{position:"relative",flex:1,minWidth:0,height:28}}>
            <input ref={input} value={text} spellCheck={false} aria-label={placeholder}
              onChange={e=>{const v=e.target.value;if(!text&&v)burst();setText(v);}}
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
      </div>
    </div>);
}
