import { ST } from './store';
import { $, H, OFFX, OFFY, W, clamp, iso, lerp } from './utils';
import { TERMS, cam, selC } from './state';
import { FLOORC, LIGHTS, lightSpr } from './renderFloors';
import { enemyVisible } from './visibility';
import { CAFE, SMK, VENTS, ch } from './levelData';
import { WH, drawTile, tallH } from './renderShapes';
import { ACT, CCOL, ROLE } from './castData';
import { conePoly } from './pathing';
import { SWITCH } from './pcMenu';
import { bubble, drawBar, drawBody, drawCamera, drawPerson } from './renderPeople';
/* boucle de rendu */
export const cv: HTMLCanvasElement=$('cv'),ctx=cv.getContext('2d') as CanvasRenderingContext2D,lc=document.createElement('canvas'),lctx=lc.getContext('2d') as CanvasRenderingContext2D;
export let VW=0,VH=0,DPR=1;
export function resize(){DPR=Math.min(2,window.devicePixelRatio||1);VW=window.innerWidth;VH=window.innerHeight;cv.width=VW*DPR;cv.height=VH*DPR;lc.width=cv.width;lc.height=cv.height}
window.addEventListener('resize',resize);

export function render(dt: number){
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0b0f1a';ctx.fillRect(0,0,cv.width,cv.height);
  const sc=selC();
  if(!cam.free&&sc){const [tx,ty]=iso(sc.x,sc.y,0);const k=1-Math.pow(.0006,dt);cam.x=lerp(cam.x,tx,k);cam.y=lerp(cam.y,ty+(VH<VW*1.15?-10:40),k)}
  const T=DPR*ST.zoom;
  ctx.setTransform(T,0,0,T,(VW/2-cam.x*ST.zoom)*DPR,(VH/2-cam.y*ST.zoom)*DPR);
  ctx.drawImage(FLOORC[ST.view],-OFFX,-OFFY);
  /* mur : hauteur animée (cutaway) */
  const ents=[];for(const c of ST.S.chars)if(c.f===ST.view&&!c.hide)ents.push(c);for(const e of ST.S.enemies)if(e.f===ST.view&&!e.ko&&e.type!=='camera'&&enemyVisible(e))ents.push(e);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const c=ch(ST.view,i,j),base=tallH(c,i,j);if(!base){WH[ST.view][j*W+i]=0;continue}
    let occl=false;if(!(j===H-1||i===W-1))for(const e of ents){const di=i-Math.floor(e.x),dj=j-Math.floor(e.y);if(di>=0&&dj>=0&&di+dj>0&&di+dj<=4&&Math.abs(di-dj)<=1){occl=true;break}}
    const tg=occl?Math.min(base,9):base,k=j*W+i;if(!WH[ST.view][k])WH[ST.view][k]=base;WH[ST.view][k]=lerp(WH[ST.view][k],tg,clamp(dt*14,0,1))}
  /* chemin prévisualisé */
  if(sc&&sc.f===ST.view&&sc.path.length){ctx.strokeStyle=CCOL[sc.id];ctx.globalAlpha=.8;ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();let p=iso(sc.x,sc.y);ctx.moveTo(p[0],p[1]);for(const q of sc.path){p=iso(q[0],q[1]);ctx.lineTo(p[0],p[1])}ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=CCOL[sc.id];ctx.beginPath();ctx.ellipse(p[0],p[1],8,4,0,0,7);ctx.fill();ctx.globalAlpha=1}
  /* cônes */
  if(ST.showCones)for(const e of ST.S.enemies){if(e.ko||e.f!==ST.view||(e.type==='camera'&&e.off)||!enemyVisible(e))continue;
    const pts=conePoly(e),o=iso(e.x,e.y,12);const dg=e.calm?(e.det>.1?[255,150,60]:[90,220,120]):e.state==='chase'?[255,60,60]:e.det>.1||e.state==='look'?[255,150,60]:e.talk>0?[90,160,255]:[255,225,90];
    const gr=ctx.createRadialGradient(o[0],o[1],4,o[0],o[1],e.range*32);gr.addColorStop(0,'rgba('+dg+','+(.42+e.det*.2)+')');gr.addColorStop(1,'rgba('+dg+',.05)');
    ctx.beginPath();pts.forEach((q,n)=>{const p=iso(q[0],q[1],0);n?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.closePath();ctx.fillStyle=gr;ctx.fill();
    ctx.strokeStyle='rgba('+dg+',.35)';ctx.lineWidth=1;ctx.stroke()}
  /* objets triés */
  const D=[];
  for(const p of ST.S.puddles)if(p.f===ST.view)D.push({d:p.x+p.y-5,fn:()=>{const[fx,fy]=iso(p.x,p.y);ctx.fillStyle='rgba(120,200,255,.45)';ctx.beginPath();ctx.ellipse(fx,fy,22,10,0,0,7);ctx.fill();ctx.strokeStyle='rgba(220,245,255,.8)';ctx.lineWidth=1.5;ctx.beginPath();const r=(ST.S.t*8+p.x*3)%10;ctx.ellipse(fx,fy,8+r,3.5+r*.4,0,0,7);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(fx-8,fy-2,5,1.5)}});
  if(CAFE[ST.view]){const k=CAFE[ST.view]!;D.push({d:k.x+k.y,fn:()=>{const[fx,fy]=iso(k.x,k.y);ctx.strokeStyle='rgba(205,150,90,.6)';ctx.setLineDash([5,4]);ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(fx,fy,56,28,0,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#4b525e';ctx.fillRect(fx-2,fy-30,4,30);ctx.fillStyle='#f6e7d0';ctx.fillRect(fx-22,fy-44,44,13);ctx.fillStyle='#8a5b35';ctx.fillRect(fx-22,fy-44,44,3);ctx.fillStyle='#3a2a1f';ctx.font='bold 7px sans-serif';ctx.textAlign='center';ctx.fillText('CAFÉTÉRIA',fx,fy-34);
    ctx.fillStyle='#fff';ctx.fillRect(fx+14,fy-10,7,8);ctx.fillStyle='#8a5b35';ctx.fillRect(fx+15,fy-9,5,3)}})}
  if(SMK[ST.view]){const k=SMK[ST.view]!;D.push({d:k.x+k.y,fn:()=>{const[fx,fy]=iso(k.x,k.y);ctx.strokeStyle='rgba(255,140,60,.55)';ctx.setLineDash([5,4]);ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(fx,fy,50,25,0,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#4b525e';ctx.fillRect(fx-2,fy-30,4,30);ctx.fillStyle='#f1f1f1';ctx.fillRect(fx-17,fy-42,34,12);ctx.fillStyle='#c0392b';ctx.fillRect(fx-17,fy-42,34,3);ctx.fillStyle='#222';ctx.font='bold 7px sans-serif';ctx.textAlign='center';ctx.fillText('FUMOIR',fx,fy-32);
    ctx.fillStyle='#777';ctx.beginPath();ctx.ellipse(fx+22,fy-4,7,3.5,0,0,7);ctx.fill();ctx.fillStyle='#ff7a3a';ctx.beginPath();ctx.arc(fx+22,fy-5,1.6,0,7);ctx.fill()}})}
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const c=ch(ST.view,i,j);if(c==='.'||c===' '||c==='V'||c==='X')continue;D.push({d:i+j+1+(c==='#'?-.2:0),fn:()=>drawTile(ctx,ST.view,i,j,c)})}
  for(const e of ST.S.enemies){if(e.f!==ST.view)continue;
    if(e.ko){if(!e.hidden)D.push({d:e.x+e.y,fn:()=>drawBody(ctx,e)});continue}
    if(e.type==='camera'){D.push({d:e.x+e.y,fn:()=>drawCamera(ctx,e)});continue}
    if(!enemyVisible(e))continue;
    D.push({d:e.x+e.y,fn:()=>{const[fx,fy]=iso(e.x,e.y);drawPerson(ctx,fx,fy,{look:e.type,kind:e.type,dir:e.face,moving:e.moving&&!e.calm,dance:!!e.dance&&ST.S.t>=e.dance.at,sit:e.calm&&e.state==='patrol'&&!e.moving,boxers:e.uniformTaken,ph:e.name.length,smoke:e.state==='break'&&!!e.brk&&e.brk.arrived});
      ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='600 10px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillText(ROLE[e.type],fx,fy+11);
      if(e.det>.02)drawBar(ctx,fx,fy-62,22,Math.min(1,e.det),e.det>.6?'#ff5d5d':'#ffb347');
      if(e.state==='chase'){ctx.fillStyle='#ff3b3b';ctx.font='bold 20px sans-serif';ctx.fillText('!',fx,fy-66)}
      else if(e.state==='look'){ctx.fillStyle='#ffb347';ctx.font='bold 18px sans-serif';ctx.fillText('?',fx,fy-66)}
      if(e.talk>0){if(e.talk>1e8){ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('💬',fx,fy-64)}else drawBar(ctx,fx,fy-62,22,Math.min(1,e.talk/10),'#5aa0ff')}
      if(e.sayT>0&&e.say)bubble(ctx,fx,fy-70,e.say)}})}
  for(const c of ST.S.chars){if(c.f!==ST.view||c.hide)continue;
    D.push({d:c.x+c.y,fn:()=>{const[fx,fy]=iso(c.x,c.y);const l=c.disguise||c.id;
      if(c.id===ST.S.sel&&c.joined){ctx.strokeStyle=CCOL[c.id];ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(fx,fy,17+Math.sin(ST.S.t*5)*1.2,8,0,0,7);ctx.stroke()}
      drawPerson(ctx,fx,fy,{look:l,kind:c.disguise?(c.disguise==='manager'?'manager':'vigile'):c.id,dir:c.face,moving:c.moving&&!(c.busy),idle:(c.idleT||0)>1.5,s:c.small?(ST.S.age===7?.7:.82):1,smoke:c.smoke,hair:(c.id==='kevin'&&ST.S.age===77)?'#e9e9f2':undefined,bodies:ST.S.enemies.some(e=>e.hidden)&&c.id==='jordan'});
      ctx.fillStyle=CCOL[c.id];ctx.font='700 12px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillText(c.joined?c.name:'',fx,fy+14);
      if(!c.joined){const bb=Math.sin(ST.S.t*4)*2;ctx.fillStyle='#ffd166';ctx.beginPath();ctx.arc(fx,fy-60+bb,9,0,7);ctx.fill();ctx.fillStyle='#1a1020';ctx.font='700 13px sans-serif';ctx.fillText('!',fx,fy-55.5+bb)}
      if(c.busy&&c.busy.max){const col=c.busy.k==='hack'?(c.busy.slow?'#ff8ad8':'#4ee3f0'):'#ffd166';drawBar(ctx,fx,fy-62,28,c.busy.t/c.busy.max,col)}
      if(c.run&&c.moving){ctx.fillStyle='#ff8a4c';ctx.font='700 11px sans-serif';ctx.fillText('»',fx+16,fy-20)}
      if(c.sayT>0&&c.say)bubble(ctx,fx,fy-(c.busy&&c.busy.max?68:62),c.say,CCOL[c.id])}})}
  /* interrupteur de l'étage (E3-10) */
  {const sw=SWITCH[ST.view];if(sw)D.push({d:sw.x+sw.y+3,fn:()=>{const[fx,fy]=iso(sw.x,sw.y,0);const off=((ST.S.team.lightsOff||{})[ST.view]||0)>ST.S.t;
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(fx,fy+2,12,6,0,0,7);ctx.fill();
    ctx.fillStyle=off?'#ffd166':'#3a4560';ctx.strokeStyle='#9fb0d0';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(fx-9,fy-30,18,26,3);ctx.fill();ctx.stroke();
    ctx.fillStyle=off?'#1a1020':'#ffd166';ctx.font='700 14px sans-serif';ctx.textAlign='center';ctx.fillText('⚡',fx,fy-12);
    if(off||ST.S.t%6<3){ctx.fillStyle='#e8eefc';ctx.font='700 11px "Barlow Condensed",sans-serif';ctx.fillText('Interrupteur',fx,fy-35)}}})}
  /* particules et projectiles */
  for(const p of ST.P){if(p.f!==ST.view)continue;D.push({d:p.x+p.y+.1,fn:()=>{const[fx,fy]=iso(p.x,p.y,p.z);
    if(p.ring&&p.sz>0){const k=p.age!/(p.age!+p.life);ctx.strokeStyle='rgba(255,170,90,'+(.85*(1-k))+')';ctx.lineWidth=3-2*k;ctx.beginPath();ctx.ellipse(fx,fy,p.sz*45*k,p.sz*22.6*k,0,0,7);ctx.stroke()}
    else if(p.ring){ctx.strokeStyle='rgba(255,224,138,'+(1-p.age!/.7)+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(fx,fy,10+p.age!*90,5+p.age!*45,0,0,7);ctx.stroke()}
    else{ctx.globalAlpha=clamp(p.life*2,0,1);ctx.fillStyle=p.col;ctx.beginPath();ctx.arc(fx,fy,p.sz,0,7);ctx.fill();ctx.globalAlpha=1}}})}
  for(const p of ST.PR){if(p.f!==ST.view)continue;const t=clamp(p.t/p.dur,0,1),x=lerp(p.x0,p.x1,t),y=lerp(p.y0,p.y1,t);D.push({d:x+y+.2,fn:()=>{const[fx,fy]=iso(x,y,10+Math.sin(t*Math.PI)*46);if(p.kind==='clope'){ctx.fillStyle='#f4f4f4';ctx.fillRect(fx-4,fy-1,8,2.4);ctx.fillStyle='#ff7a3a';ctx.fillRect(fx+3,fy-1,2,2.4)}else{ctx.fillStyle='#ffe08a';ctx.beginPath();ctx.arc(fx,fy,4,0,7);ctx.fill();ctx.strokeStyle='#8a6a1c';ctx.stroke()}}})}
  D.sort((a,b)=>a.d-b.d);for(const o of D)o.fn();
  /* vents/X animés */
  for(const v of VENTS)if(v.f===ST.view){const[fx,fy]=iso(v.x+.5,v.y+.5);ctx.fillStyle='rgba(255,138,76,'+(.25+.15*Math.sin(ST.S.t*4))+')';ctx.beginPath();ctx.ellipse(fx,fy,20,10,0,0,7);ctx.fill()}
  if(ST.view===0){const[fx,fy]=iso(21.5,12.5,0);ctx.fillStyle='rgba(255,209,102,.9)';ctx.font='700 13px "Barlow Condensed",sans-serif';ctx.textAlign='center';ctx.fillText(ST.S.team.key?'SORTIE · ascenseur de service':'ascenseur de service',fx,fy-12)}
  /* cibles possibles */
  if(ST.pend&&sc){const a=ACT[sc.id].find(q=>q.k===ST.pend!.k)!;
    if(a.mode==='enemy')for(const e of ST.S.enemies){if(e.f!==ST.view||e.ko||e.type==='camera'||!enemyVisible(e))continue;const[fx,fy]=iso(e.x,e.y);ctx.strokeStyle='#ff8a4c';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.ellipse(fx,fy,19,9,0,0,7);ctx.stroke();ctx.setLineDash([])}
    if(a.mode==='hack'){for(const k in TERMS){const[f,x,y]=k.split(',').map(Number);if(f!==ST.view)continue;const[fx,fy]=iso(x+.5,y+.5);ctx.strokeStyle='#4ee3f0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(fx,fy,20,10,0,0,7);ctx.stroke()}}
          if(a.mode==='tile'){const[fx,fy]=iso(sc.x,sc.y);ctx.strokeStyle='rgba(255,224,138,.5)';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.beginPath();ctx.ellipse(fx,fy+16,9.5*32,9.5*16,0,0,7);ctx.stroke();ctx.setLineDash([])}}
  /* lumière */
  const dark=((ST.S.team.lightsOff||{})[ST.view]||0)>ST.S.t;const dk=dark?.9:ST.view===2?.52:.56;
  lctx.setTransform(1,0,0,1,0,0);lctx.globalCompositeOperation='source-over';lctx.clearRect(0,0,lc.width,lc.height);lctx.fillStyle='rgba(8,12,30,'+dk+')';lctx.fillRect(0,0,lc.width,lc.height);
  lctx.setTransform(T,0,0,T,(VW/2-cam.x*ST.zoom)*DPR,(VH/2-cam.y*ST.zoom)*DPR);lctx.globalCompositeOperation='destination-out';
  if(!dark)for(const l of LIGHTS[ST.view]){const[sx,sy]=iso(l[0],l[1],20);lctx.globalAlpha=.9;lctx.drawImage(lightSpr,sx-240,sy-120,480,240)}
  for(const c of ST.S.chars)if(c.f===ST.view&&!c.hide){const[sx,sy]=iso(c.x,c.y,10);lctx.globalAlpha=.8;lctx.drawImage(lightSpr,sx-70,sy-36,140,72)}
  for(const e of ST.S.enemies)if(e.f===ST.view&&e.state==='chase'){const[sx,sy]=iso(e.x,e.y,10);lctx.globalAlpha=.6;lctx.drawImage(lightSpr,sx-90,sy-45,180,90)}
  lctx.globalAlpha=1;lctx.globalCompositeOperation='source-over';
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(lc,0,0);
  ctx.setTransform(T,0,0,T,(VW/2-cam.x*ST.zoom)*DPR,(VH/2-cam.y*ST.zoom)*DPR);ctx.globalCompositeOperation='lighter';
  if(!dark)for(const l of LIGHTS[ST.view])if(l[2]){const[sx,sy]=iso(l[0],l[1],14);ctx.globalAlpha=.22;ctx.fillStyle=l[2];ctx.save();ctx.translate(sx,sy);ctx.scale(1,.5);ctx.beginPath();ctx.arc(0,0,120,0,7);ctx.globalAlpha=.09;ctx.fill();ctx.restore()}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
}
