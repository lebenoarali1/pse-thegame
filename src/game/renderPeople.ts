import { ST } from './store';
import { APP } from './castData';
import { clamp, iso } from './utils';
import { rr } from './renderShapes';
import type { Enemy, PersonOpts } from './types';
/* rendu : personnages */
export function drawPerson(g: CanvasRenderingContext2D,fx: number,fy: number,o: PersonOpts){
  const a=APP[o.look],s=o.s||1,mv=o.moving,t=ST.S.t+(o.ph||0),sw=o.dance?Math.sin(t*9)*5:mv?Math.sin(t*10)*4:o.idle?Math.sin(t*2.4)*2:0,bob=o.dance?Math.abs(Math.sin(t*9))*3.5:mv?Math.abs(Math.sin(t*10))*1.6:o.idle?(Math.sin(t*2.4)+1)*1.5:0,up=o.dance?12+Math.sin(t*9)*3:0;
  const sdx=Math.cos(o.dir)-Math.sin(o.dir),sdy=Math.cos(o.dir)+Math.sin(o.dir),away=sdy<-.35,ex=clamp(sdx,-1,1);
/* eslint-disable-next-line prefer-const */
  let body=a.body,legs=a.legs,skin=a.skin;
  if(o.boxers){body='#f6dede';legs=a.skin}
  g.save();g.translate(fx+(o.dance?Math.sin(t*4.5)*3:0),fy);g.scale(s,s);if(o.idle&&!mv)g.rotate(Math.sin(t*1.7)*.06);if(o.dance)g.rotate(Math.sin(t*4.5)*.1);
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(0,0,11,5,0,0,7);g.fill();
  if(o.sit){g.strokeStyle='#2b2f3a';g.lineWidth=2;g.beginPath();g.moveTo(-9,-1);g.lineTo(9,-1);g.moveTo(0,-1);g.lineTo(0,-9);g.stroke();g.fillStyle='#4a5063';g.beginPath();g.ellipse(0,-9,11,5.5,0,0,7);g.fill();g.translate(0,5);if(!away){g.fillStyle='#3a3f4d';rr(g,-8,-34,16,17,4);g.fill()}}
  if(o.kind==='jordan'){ /* chariot de ménage */
    const cx=-ex*17,cy=3;g.fillStyle='#2e6fb5';g.fillRect(cx-8,cy-14,16,11);g.fillStyle='#cfd8e3';g.fillRect(cx-8,cy-17,16,4);g.fillStyle='#222';g.beginPath();g.arc(cx-5,cy-2,2,0,7);g.arc(cx+5,cy-2,2,0,7);g.fill();
    if(o.bodies){g.fillStyle='#e9b4b4';g.beginPath();g.arc(cx,cy-18,5,0,7);g.fill()}}
  if(o.kind==='kevin'&&!away){g.fillStyle='#394a7a';rr(g,-8,-34-bob,16,18,4);g.fill()}
  g.strokeStyle=legs;g.lineWidth=5;g.lineCap='round';
  g.beginPath();if(o.sit){g.moveTo(-3,-12);g.lineTo(-3+ex*6,-9);g.moveTo(3,-12);g.lineTo(3+ex*6,-9)}else{g.moveTo(-3,-12-bob);g.lineTo(-3+sw,-1);g.moveTo(3,-12-bob);g.lineTo(3-sw,-1)}g.stroke();
  const bw=o.kind==='beaugosse'?20:o.kind==='dg'?19:15;
  g.fillStyle=body;rr(g,-bw/2,-31-bob,bw,20+(o.kind==='dg'?3:0),5);g.fill();
  g.strokeStyle=body;g.lineWidth=4;g.beginPath();g.moveTo(-bw/2+1,-28-bob);g.lineTo(-bw/2-3-sw*.4,-16-bob-up);g.moveTo(bw/2-1,-28-bob);g.lineTo(bw/2+3+sw*.4,-16-bob-up);g.stroke();
  g.fillStyle=skin;g.beginPath();g.arc(-bw/2-3-sw*.4,-15-bob-up,2.4,0,7);g.arc(bw/2+3+sw*.4,-15-bob-up,2.4,0,7);g.fill();
  if(o.sit&&away){g.fillStyle='rgba(58,63,77,.95)';rr(g,-8.5,-33,17,18,4);g.fill()}
  if(o.boxers){g.fillStyle='#e0566b';g.font='8px sans-serif';g.textAlign='center';g.fillText('♥ ♥',0,-18)}
  const k=o.kind;
  if(k==='marc'||k==='manager'){g.fillStyle=k==='marc'?'#e5484d':'#b33';g.beginPath();g.moveTo(0,-30-bob);g.lineTo(2.5,-22-bob);g.lineTo(0,-17-bob);g.lineTo(-2.5,-22-bob);g.fill();g.fillStyle='#fff';g.fillRect(-2,-31-bob,4,3)}
  if(k==='jordan'){g.fillStyle='#55657a';g.beginPath();g.arc(0,-31-bob,5,3.14,0);g.fill()}
  if(k==='nadege'){g.fillStyle='#e9d8ff';g.font='bold 7px sans-serif';g.textAlign='center';g.fillText('</>',0,-20-bob)}
  if(k==='vigile'){g.fillStyle='#e8c14a';g.fillRect(-6,-27-bob,4,3)}
  if(k==='dg'){g.fillStyle='#e6c34a';g.beginPath();g.moveTo(0,-30-bob);g.lineTo(2,-22-bob);g.lineTo(0,-16-bob);g.lineTo(-2,-22-bob);g.fill()}
  if(k==='assistante'){g.fillStyle='#fff';g.fillRect(-5,-30-bob,10,2)}
  /* tête */
  const hy=-37-bob;g.fillStyle=skin;g.beginPath();g.arc(0,hy,7.3,0,7);g.fill();
  g.fillStyle=o.hair||a.hair;
  if(k==='jordan'||k==='kevin'||k==='vigile'){ /* casquette */
    g.fillStyle=k==='vigile'?'#1c2a46':k==='kevin'?'#e04a3a':'#55657a';g.beginPath();g.arc(0,hy-1,7.6,3.14,0);g.fill();g.fillRect(-7.5,hy-2,15,2);
    g.beginPath();g.ellipse(ex*5.5,hy+0,5,1.8,0,0,7);if(!away)g.fill()}
  else if(k==='nadege'){g.beginPath();g.arc(0,hy-1,7.6,3.3,6.1);g.fill();g.beginPath();g.arc(0,hy-9,4.2,0,7);g.fill()}
  else if(k==='drh'){g.beginPath();g.arc(0,hy-1,7.6,3.4,6);g.fill();g.beginPath();g.arc(-ex*3,hy-9,3.6,0,7);g.fill()}
  else if(k==='assistante'){g.beginPath();g.arc(0,hy-1,7.8,3.2,6.2);g.fill();g.fillRect(-8,hy-2,3,9);g.fillRect(5,hy-2,3,9)}
  else if(k==='dg'){g.beginPath();g.arc(0,hy-2,7,3.4,6.0);g.fill()}
  else{g.beginPath();g.arc(0,hy-1.5,7.4,3.3,6.1);g.fill()}
  if(!away){
    g.fillStyle='#1a1a22';
    if(k==='beaugosse'||k==='nadege'){g.fillStyle=k==='beaugosse'?'#0a0a0d':'#6a4cd6';g.fillRect(-6+ex*2,hy-2,12,3.2);if(k==='nadege'){g.fillStyle='rgba(255,255,255,.7)';g.fillRect(-5+ex*2,hy-1.5,4,1.2)}}
    else{g.beginPath();g.arc(-2.4+ex*2.4,hy,1.1,0,7);g.arc(2.4+ex*2.4,hy,1.1,0,7);g.fill()}
    if(o.ko){g.strokeStyle='#222';g.lineWidth=1;g.beginPath();g.moveTo(-4,hy-2);g.lineTo(-1,hy+1);g.moveTo(-1,hy-2);g.lineTo(-4,hy+1);g.moveTo(1,hy-2);g.lineTo(4,hy+1);g.moveTo(4,hy-2);g.lineTo(1,hy+1);g.stroke()}
  }
  if(o.smoke&&!away){g.fillStyle='#f4f4f4';g.fillRect(ex*6-1,hy+3,6,1.7);g.fillStyle='#ff7a3a';g.fillRect(ex*6+4.6,hy+3,1.7,1.7)}
  g.restore();
}
export function drawBody(g: CanvasRenderingContext2D,e: Enemy){ /* assommé */
  const [fx,fy]=iso(e.x,e.y);
  g.save();g.translate(fx,fy);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(0,0,17,6,0,0,7);g.fill();g.restore();
  g.save();g.translate(fx,fy-4);g.rotate(-1.45);drawPerson(g,0,0,{look:e.type,kind:e.type,dir:0,moving:false,boxers:e.uniformTaken,ko:true,s:.9});g.restore();
  const ns=Math.max(1,Math.ceil(5*(1-(e.koT||0)/(e.koDur||30))));for(let k=0;k<ns;k++){const an=ST.S.t*3+k*6.283/ns,sx=fx+Math.cos(an)*13,sy=fy-22+Math.sin(an)*3.5;g.fillStyle='#ffd54a';g.font='10px sans-serif';g.textAlign='center';g.fillText('★',sx,sy)}
}
export function drawCamera(g: CanvasRenderingContext2D,e: Enemy){
  const [fx,fy]=iso(e.x,e.y);g.save();g.translate(fx,fy-30);
  g.fillStyle='#39414e';g.fillRect(-3,0,6,10);g.fillStyle=e.off?'#4a4f58':'#d6dbe4';rr(g,-8,-6,16,9,2);g.fill();
  const sd=Math.cos(e.face)-Math.sin(e.face);g.fillStyle=e.off?'#222':'#101419';g.beginPath();g.arc(clamp(sd,-1,1)*6,-1.5,3,0,7);g.fill();
  g.fillStyle=e.off?'#555':(Math.floor(ST.S.t*2)%2?'#ff4d4d':'#7a1f1f');g.beginPath();g.arc(-5,-4,1.6,0,7);g.fill();g.restore();
}
export function bubble(g: CanvasRenderingContext2D,x: number,y: number,text: string,col?: string){
  g.save();g.font='600 12px "Barlow Condensed",sans-serif';const w=g.measureText(text).width+12;
  g.translate(x,y);g.fillStyle='rgba(255,255,255,.94)';rr(g,-w/2,-18,w,18,6);g.fill();g.beginPath();g.moveTo(-3,0);g.lineTo(3,0);g.lineTo(0,5);g.closePath();g.fill();
  g.fillStyle=col||'#1a1d26';g.textAlign='center';g.fillText(text,0,-5);g.restore();
}
export function drawBar(g: CanvasRenderingContext2D,x: number,y: number,w: number,v: number,col: string,bg?: string){g.fillStyle=bg||'rgba(0,0,0,.55)';g.fillRect(x-w/2,y,w,4);g.fillStyle=col;g.fillRect(x-w/2,y,w*v,4)}
