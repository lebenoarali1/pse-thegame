import { ST } from './store';
import { $, clamp, iso } from './utils';
import { drawPerson } from './renderPeople';
import { VCARD } from './texts';
import { snd } from './sound';
import { beginRun } from './dialogues';
import { cam, newState, selC } from './state';
import { buildActs, mkUI } from './ui';
import { VW } from './renderLoop';
import type { VideoState } from './types';
import { readSave } from './persist';
import { SET, applyDiff, curDiff, nextDiff } from './settings';
import { setIntroMusic } from './music';
import { quickLoad } from './input';
/* vidéo d'introduction : vue à la première personne, avant le menu */
export let vd=1;
export const VID: VideoState={t:0,run:false,cb:null,fired:{} as Record<string, number>,last:0,tick:0};
export const VSLOW=.5;/* vitesse de la vidéo : 1 = normal, .5 = deux fois plus lent */
export const vcv=document.getElementById('vc') as HTMLCanvasElement,vg=vcv.getContext('2d') as CanvasRenderingContext2D;
export function vonce(k: string,t: number,fn: () => void){if(VID.t>=t&&!VID.fired[k]){VID.fired[k]=1;fn()}}
export function vwrap(g: CanvasRenderingContext2D,txt: string,x: number,y: number,mw: number,lh: number){const w=txt.split(' ');let l='';for(const a of w){const tt=l?l+' '+a:a;if(g.measureText(tt).width>mw&&l){g.fillText(l,x,y);y+=lh;l=a}else l=tt}if(l){g.fillText(l,x,y);y+=lh}return y}
export const vease=(k: number)=>k<0?0:k>1?1:k*k*(3-2*k);
export function vrr(g: CanvasRenderingContext2D,x: number,y: number,w: number,h: number,r: number){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
/* sous-titre en bas, fondu */
export function vsub(g: CanvasRenderingContext2D,W: number,H: number,txt: string,t0: number,t1: number,t: number,col?: string){if(t<t0||t>t1)return;const a=Math.min(1,(t-t0)/.25,(t1-t)/.25),sz=Math.round(clamp(W*.042,14,26));
  g.save();g.globalAlpha=a;g.font='italic 600 '+sz+'px Arial, sans-serif';g.textAlign='center';g.textBaseline='top';const mw=W*.86;
/* eslint-disable-next-line prefer-const */
  const words=txt.split(' ');let lines=[],l='';for(const w of words){const tt=l?l+' '+w:w;if(g.measureText(tt).width>mw&&l){lines.push(l);l=w}else l=tt}lines.push(l);
  const bh=lines.length*sz*1.3+16,y=H*.84-bh/2;g.fillStyle='rgba(0,0,0,.55)';g.fillRect(W*.05,y,W*.9,bh);g.fillStyle=col||'#fff';lines.forEach((s,i)=>g.fillText(s,W/2,y+8+i*sz*1.3));g.restore()}
/* vignette + paupières */
export function vvign(g: CanvasRenderingContext2D,W: number,H: number,k: number){const r=g.createRadialGradient(W/2,H*.5,Math.min(W,H)*.25,W/2,H*.5,Math.max(W,H)*.78);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,'rgba(0,0,0,'+(.55*k)+')');g.fillStyle=r;g.fillRect(0,0,W,H)}
export function vlid(g: CanvasRenderingContext2D,W: number,H: number,o: number){if(o<=0)return;g.fillStyle='#000';g.fillRect(0,0,W,H*.5*o);g.fillRect(0,H-H*.5*o,W,H*.5*o)}
export function vcup(g: CanvasRenderingContext2D,x: number,y: number,s: number,t: number,shake: boolean){g.save();g.translate(x+(shake?Math.sin(t*38)*1.6*s:0),y);g.scale(s,s);
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(0,2,46,12,0,0,7);g.fill();
  g.fillStyle='#f4f4f4';g.beginPath();g.moveTo(-34,-70);g.lineTo(34,-70);g.lineTo(26,0);g.lineTo(-26,0);g.closePath();g.fill();
  g.fillStyle='#dadada';g.beginPath();g.moveTo(34,-70);g.lineTo(26,0);g.lineTo(10,0);g.lineTo(18,-70);g.closePath();g.fill();
  g.fillStyle='#ef7757';g.fillRect(-31,-44,62,14);
  g.fillStyle='#3a2216';g.beginPath();g.ellipse(0,-70,34,9,0,0,7);g.fill();g.fillStyle='#5a3620';g.beginPath();g.ellipse(0,-70,30,7,0,0,7);g.fill();
  g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=3;for(let i=0;i<3;i++){g.beginPath();const bx=-12+i*12;g.moveTo(bx,-78);for(let k=1;k<=6;k++)g.lineTo(bx+Math.sin(t*2+i+k*.9)*5,-78-k*9);g.stroke()}
  g.restore()}
/* mains : peau, manchette */
export function vhand(g: CanvasRenderingContext2D,x: number,y: number,s: number,rot: number,type: string,t: number){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);
  g.fillStyle='#f2f2f2';vrr(g,-44,26,88,70,10);g.fill();g.strokeStyle='rgba(0,0,0,.15)';g.stroke();
  g.fillStyle='#e8b896';vrr(g,-36,-30,72,66,22);g.fill();
  for(let i=0;i<4;i++){const dy=type==='type'?Math.max(0,Math.sin(t*14+i*1.9))*7:0;g.fillStyle='#e8b896';vrr(g,-36+i*18.5,-68-dy,15,50,7);g.fill();g.strokeStyle='rgba(120,70,40,.25)';g.stroke()}
  g.fillStyle='#dca884';vrr(g,-52,-18,18,40,8);g.fill();g.restore()}
/* scène 1 : mon bureau, 17h45 */
export function vDesk(g: CanvasRenderingContext2D,W: number,H: number,t: number){
  const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#1a2036');bg.addColorStop(.6,'#2b3350');bg.addColorStop(1,'#3b2f26');g.fillStyle=bg;g.fillRect(0,0,W,H);
  const bx=Math.sin(t*1.3)*3,by=Math.sin(t*2.6)*2;g.save();g.translate(bx,by);
  g.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<6;i++)g.fillRect(i*W/5-W*.05,0,W*.09,H*.08);
  const mw=W*.86,mh=mw*.62,mx=(W-mw)/2,my=H*.1;
  g.fillStyle='#10131c';vrr(g,mx-8,my-8,mw+16,mh+16,12);g.fill();g.fillStyle='#161b2a';g.fillRect(W/2-mw*.06,my+mh+8,mw*.12,H*.05);
  const sc=g.createLinearGradient(0,my,0,my+mh);sc.addColorStop(0,'#eef3fb');sc.addColorStop(1,'#d6e1f2');g.fillStyle=sc;g.fillRect(mx,my,mw,mh);
  const f=Math.max(9,mw*.036);g.textAlign='left';g.textBaseline='top';g.font='bold '+f+'px Arial';g.fillStyle='#1d3a6a';g.fillRect(mx,my,mw,f*2);g.fillStyle='#fff';g.fillText('Boîte de réception (37)',mx+8,my+f*.45);
  g.fillStyle='#4a5470';g.fillRect(mx+8,my+f*2.2,mw-16,1);
  const rows=[['Compta','Note de frais : encore vous',0],['RH','Bienvenue au séminaire Bien-être',0],['Cantine','Menu de lundi : poisson (?)',0],['DSI','Votre mot de passe expire',0]];
  const nw=t>3?vease((t-3)/.4):0,off=nw*(f*2.1);
  if(nw>0){g.fillStyle='#ff4b4b';g.fillRect(mx,my+f*2.4,mw,f*2.1*nw);if(nw>.6){g.fillStyle='#fff';g.font='bold '+f+'px Arial';g.fillText('DRH : Entretien à 18h00, sans badge',mx+8,my+f*3)}}
  rows.forEach((r,i)=>{const yy=my+f*2.4+off+i*f*2.1;if(yy>my+mh-f)return;g.fillStyle=i%2?'#e1e9f6':'#f2f6fc';g.fillRect(mx,yy,mw,f*2.1);g.fillStyle='#2b3550';g.font='bold '+f+'px Arial';g.fillText(String(r[0]),mx+8,yy+f*.5);g.font=f+'px Arial';g.fillStyle='#55607e';g.fillText(String(r[1]),mx+mw*.24,yy+f*.5)});
  if(t>4.3){const k=vease((t-4.3)/.35),pw=mw*.84,ph=mh*.62,px=mx+(mw-pw)/2,py=my+mh*.2+(1-k)*20;g.save();g.globalAlpha=k;g.fillStyle='rgba(0,0,0,.25)';g.fillRect(px+5,py+6,pw,ph);g.fillStyle='#fff';g.fillRect(px,py,pw,ph);g.fillStyle='#b32626';g.fillRect(px,py,pw,f*1.9);g.fillStyle='#fff';g.font='bold '+f+'px Arial';g.fillText('CONVOCATION',px+8,py+f*.4);
    g.fillStyle='#222';g.font=Math.round(f*1.02)+'px Arial';const body='Bonjour. Vous êtes convié(e) à un entretien à 18h00. Prévoir un carton. Merci de ne rien emporter : tout ce qui est sur votre bureau appartient désormais à l\'entreprise.';
    const n=Math.floor(clamp((t-4.7)*38,0,body.length));vwrap(g,body.slice(0,n),px+10,py+f*2.4,pw-20,f*1.35);g.restore()}
  g.restore();
  /* bureau et clavier */
  const dy=H*.64;const dk=g.createLinearGradient(0,dy,0,H);dk.addColorStop(0,'#6b4a30');dk.addColorStop(1,'#3d2a1b');g.fillStyle=dk;g.fillRect(0,dy,W,H-dy);
  g.fillStyle='#232733';g.beginPath();g.moveTo(W*.16,H*.72);g.lineTo(W*.84,H*.72);g.lineTo(W*.9,H*.86);g.lineTo(W*.1,H*.86);g.closePath();g.fill();
  g.fillStyle='#3a4052';for(let r=0;r<4;r++)for(let c=0;c<12;c++){const yy=H*.735+r*H*.03,xw=W*.0575*(1+r*.07);g.fillRect(W*.17+c*xw*.98-(r*W*.002)+(r*W*.002),yy,xw*.8,H*.02)}
  const typing=t<3.2;
  vhand(g,W*.36,H*.8+(typing?Math.sin(t*12)*2:0),Math.min(W,H)*.0021,.12,typing?'type':'rest',t);vhand(g,W*.62,H*.8+(typing?Math.cos(t*11)*2:0),Math.min(W,H)*.0021,-.12,typing?'type':'rest',t+1);
  vcup(g,W*.86,H*.7,Math.min(W,H)*.0038,t,t>4.3);
  g.fillStyle='#fff';g.font='bold '+Math.round(W*.05)+'px monospace';g.textAlign='left';g.textBaseline='top';const mm=Math.min(59,45+Math.floor(t*.15));g.fillStyle='#ff9a5a';g.fillText('17:'+mm+' VENDREDI',14,14)}
/* scène 2 : je tourne la tête, les autres */
export function vPan(g: CanvasRenderingContext2D,W: number,H: number,t: number,T0: number,GAP: number){
  const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#171d33');bg.addColorStop(.45,'#2a3350');bg.addColorStop(.46,'#4b4a52');bg.addColorStop(1,'#2a2a31');g.fillStyle=bg;g.fillRect(0,0,W,H);
  const u=(t-T0)/GAP,i0=Math.floor(clamp(u,0,3.999)),fr=clamp(u,0,3.999)-i0,th=i0+vease((fr-.55)/.45)+(u>=4?0:0),span=W*.95;
  const bx=Math.sin(t*1.6)*4,by=Math.sin(t*3.1)*3;g.save();g.translate(bx,by);
  /* fenêtres, plafond, bureaux (parallaxe) */
  for(let k=-2;k<12;k++){const x=W/2+(k-th)*span*.55;g.fillStyle='#0d1530';g.fillRect(x,H*.1,W*.2,H*.26);g.fillStyle='#ff9a5a';g.globalAlpha=.25;g.fillRect(x,H*.28,W*.2,H*.08);g.globalAlpha=1}
  for(let k=-2;k<14;k++){const x=W/2+(k-th)*span*.8;g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x,0,W*.16,H*.03)}
  for(let k=-2;k<12;k++){const x=W/2+(k*.6-th)*span*1.25,y=H*.56;g.fillStyle='#2c2a31';g.fillRect(x,y,W*.3,H*.16);g.fillStyle='#1b3350';g.fillRect(x+W*.07,y-H*.07,W*.14,H*.07);g.fillStyle='#7fb4ff';g.globalAlpha=.55;g.fillRect(x+W*.075,y-H*.065,W*.13,H*.05);g.globalAlpha=1}
  const ids=['kevin','nadege','marc','jordan'],scl=[.78,.9,.88,.84];
  ids.forEach((id,i)=>{const cx=W/2+(i-th)*span,s=H*.5*scl[i]/54;if(cx<-W*.4||cx>W*1.4)return;
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(cx,H*.8,s*14,s*4.5,0,0,7);g.fill();
    drawPerson(g,cx,H*.8,{look:id,kind:id,dir:.78+Math.sin(t*.8+i)*.25,moving:false,s,ph:t,smoke:id==='nadege'})});
  g.restore();
  /* réticule et verrouillage */
  const near=Math.abs(th-Math.round(th)),lock=1-clamp(near/.18,0,1),cxr=W/2,cyr=H*.52,rr=Math.min(W,H)*.09*(1.25-.25*lock);
  g.strokeStyle=lock>.5?'#ffd23f':'rgba(255,255,255,.7)';g.lineWidth=2;g.beginPath();[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(q=>{g.moveTo(cxr+q[0]*rr,cyr+q[1]*rr*.6);g.lineTo(cxr+q[0]*rr,cyr+q[1]*(rr*.6-12*q[1]*-1*0)-q[1]*14);g.moveTo(cxr+q[0]*rr,cyr+q[1]*rr*.6);g.lineTo(cxr+q[0]*rr-q[0]*14,cyr+q[1]*rr*.6)});g.stroke();
  /* bandeau */
  const ci=Math.round(th);if(lock>.4&&ci>=0&&ci<4&&t>T0){const ch=VCARD[ci],k=clamp(fr<.55?(fr)/.2:1,0,1);
    const bw=W*.9,bh=Math.max(92,H*.17),bxx=W*.05,byy=H*.66;g.save();g.globalAlpha=Math.min(1,lock*1.6)*(i0===ci?clamp(fr/.12,0,1):1);
    g.fillStyle='rgba(8,10,22,.88)';g.fillRect(bxx,byy,bw,bh);g.fillStyle=ch.c;g.fillRect(bxx,byy,6,bh);
    const f1=clamp(bh*.26,18,34),f2=clamp(bh*.13,12,17);g.textAlign='left';g.textBaseline='top';g.fillStyle=ch.c;g.font='900 '+f1+'px Arial Black, Arial, sans-serif';g.fillText(ch.n,bxx+16,byy+8);const nw=g.measureText(ch.n).width;
    g.fillStyle='#aab3d0';g.font='bold '+f2+'px Arial';g.fillText(ch.r.toUpperCase(),bxx+24+nw,byy+8+f1*.3);g.fillStyle='#e8ecff';g.font='italic '+f2+'px Arial';vwrap(g,ch.q,bxx+16,byy+f1+14,bw-32,f2*1.3);g.restore()}
  g.fillStyle='rgba(255,255,255,.75)';g.font='bold '+Math.round(clamp(W*.035,12,18))+'px Arial';g.textAlign='left';g.textBaseline='top';g.fillText('● REC  17:'+Math.min(55,47+Math.floor((t-T0)/3))+'  ÉQUIPE '+(Math.min(4,Math.max(1,Math.round(th)+1)))+'/4',14,14)}
/* scène 3 : le téléphone */
export function vPhone(g: CanvasRenderingContext2D,W: number,H: number,t: number){
  const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#10131f');bg.addColorStop(1,'#222a40');g.fillStyle=bg;g.fillRect(0,0,W,H);
  const sh=t<.6?(Math.random()-.5)*(.6-t)*30:0,pw=W*.68,ph=pw*1.9,px=(W-pw)/2+sh,py=H*.12+Math.sin(t*1.4)*3+sh*.5;
  g.fillStyle='#e8b896';vrr(g,px-W*.1,py+ph*.55,W*.14,ph*.5,30);g.fill();vrr(g,px+pw-W*.04,py+ph*.5,W*.14,ph*.6,30);g.fill();vrr(g,px+pw-W*.02,py+ph*.2,W*.09,ph*.1,16);g.fill();
  g.fillStyle='#07080d';vrr(g,px,py,pw,ph,26);g.fill();g.fillStyle='#10161f';vrr(g,px+7,py+7,pw-14,ph-14,20);g.fill();
  const f=clamp(pw*.052,11,17);g.textAlign='left';g.textBaseline='top';g.fillStyle='#8aa0c8';g.font='bold '+f+'px Arial';g.fillText('Numéro inconnu',px+20,py+22);g.fillStyle='#2a3350';g.fillRect(px+14,py+22+f*1.6,pw-28,1);
  const msgs:[number,string][]=[[.7,'La clé du coffre du DG, étage 2. Dedans, de quoi le faire plier.'],[2.1,'Vous êtes quatre sur la liste. Sortez par le monte-charge avant 18h.'],[3.6,'Ne répondez pas. Ne montez pas en ascenseur. Ne croyez personne.']];
  let yy=py+22+f*2.6;msgs.forEach(m=>{if(t<m[0])return;const k=vease((t-m[0])/.3),bw=pw*.78;g.save();g.globalAlpha=k;g.font=f+'px Arial';const lines=[];let l='';m[1].split(' ').forEach(w=>{const tt=l?l+' '+w:w;if(g.measureText(tt).width>bw-20&&l){lines.push(l);l=w}else l=tt});lines.push(l);
    const bh=lines.length*f*1.3+14;g.fillStyle='#2d5f9e';vrr(g,px+16,yy+(1-k)*10,bw,bh,12);g.fill();g.fillStyle='#fff';lines.forEach((s,i)=>g.fillText(s,px+26,yy+(1-k)*10+7+i*f*1.3));g.restore();yy+=bh+10});
  const ph2=t<.4?(.4-t)*2:0;if(ph2>0){g.fillStyle='rgba(255,255,255,'+ph2+')';g.fillRect(0,0,W,H)}}
/* scène 4 : course dans le couloir */
export function vRun(g: CanvasRenderingContext2D,W: number,H: number,t: number){
  const vx=W/2+Math.sin(t*3)*6,vy=H*.45+Math.abs(Math.sin(t*9))*7,sp=t*1.9,sw=Math.sin(t*4.5)*4;
  g.fillStyle='#0a0d18';g.fillRect(0,0,W,H);
  const cl=g.createLinearGradient(0,0,0,H);cl.addColorStop(0,'#1b2038');cl.addColorStop(.5,'#2d3454');cl.addColorStop(1,'#16192b');g.fillStyle=cl;g.fillRect(0,0,W,H);
  const hw=W*.5,hh=H*.5;
  /* sol, plafond, murs */
  g.fillStyle='#3b3a45';g.beginPath();g.moveTo(0,H);g.lineTo(W,H);g.lineTo(vx+W*.05,vy+H*.04);g.lineTo(vx-W*.05,vy+H*.04);g.closePath();g.fill();
  g.fillStyle='#252a44';g.beginPath();g.moveTo(0,0);g.lineTo(W,0);g.lineTo(vx+W*.05,vy-H*.04);g.lineTo(vx-W*.05,vy-H*.04);g.closePath();g.fill();
  g.fillStyle='#3a4366';g.beginPath();g.moveTo(0,0);g.lineTo(vx-W*.05,vy-H*.04);g.lineTo(vx-W*.05,vy+H*.04);g.lineTo(0,H);g.closePath();g.fill();
  g.fillStyle='#323a5b';g.beginPath();g.moveTo(W,0);g.lineTo(vx+W*.05,vy-H*.04);g.lineTo(vx+W*.05,vy+H*.04);g.lineTo(W,H);g.closePath();g.fill();
  for(let k=0;k<9;k++){const z=((k-sp)%9+9)%9,d=1/(z*.55+.35),sc=clamp(d,.05,6);const x0=vx-W*.05-(W*.45)*(sc-.1)/1.6,x1=vx+W*.05+(W*.45)*(sc-.1)/1.6,y0=vy-H*.04-(H*.46)*(sc-.1)/1.6,y1=vy+H*.04+(H*.46)*(sc-.1)/1.6;
    const a=clamp(1.3-z/9,0,1);g.strokeStyle='rgba(255,138,61,'+(a*.5)+')';g.lineWidth=2+sc*1.2;g.strokeRect(x0,y0,x1-x0,y1-y0);
    g.fillStyle='rgba(255,255,255,'+(a*.5)+')';g.fillRect(vx-(x1-x0)*.1,y0+2,(x1-x0)*.2,3+sc*1.5);
    if(k%2===0){g.fillStyle='rgba(180,40,40,'+(a*.8)+')';g.fillRect(x0+(x1-x0)*.04,vy-(y1-y0)*.05,(x1-x0)*.06,(y1-y0)*.35)}}
  /* porte du DG au fond qui grossit */
  const k=clamp((t-2.4)/3.2,0,1),dw=W*(.1+.55*k*k),dh=dw*1.7;g.fillStyle='#7a1c1c';g.fillRect(vx-dw/2+sw*k,vy+H*.04-dh+dh*.25*k*k,dw,dh);g.fillStyle='#e8e0d0';g.font='bold '+Math.max(9,dw*.14)+'px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('DG',vx+sw*k,vy+H*.04-dh*.8+dh*.25*k*k);
  /* traits de vitesse */
  g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=1;for(let i=0;i<26;i++){const a=i/26*6.283+t*.2,r0=Math.max(W,H)*(.25+((i*37)%10)/40),r1=r0+Math.max(W,H)*.3;g.beginPath();g.moveTo(vx+Math.cos(a)*r0,vy+Math.sin(a)*r0*.8);g.lineTo(vx+Math.cos(a)*r1,vy+Math.sin(a)*r1*.8);g.stroke()}
  /* chrono */
  const sec=Math.floor(t*1.6),s=Math.max(0,60-Math.floor(t*10));g.fillStyle=t>3.5?'#ff4b4b':'#ffb36b';g.font='900 '+Math.round(clamp(W*.11,30,60))+'px monospace';g.textAlign='center';g.textBaseline='top';g.fillText('17:'+(58+(t>4?1:0))+':'+String(Math.max(0,59-Math.floor(t*6)%60)).padStart(2,'0'),W/2,H*.05);
  /* bras et souffle */
  vhand(g,W*.14,H*.96+Math.sin(t*9)*10,Math.min(W,H)*.0022,.5,'rest',t);vhand(g,W*.86,H*.96-Math.sin(t*9)*10,Math.min(W,H)*.0022,-.5,'rest',t)}
export function vTitle(g: CanvasRenderingContext2D,W: number,H: number,t: number){
  const bg=g.createRadialGradient(W/2,H*.4,10,W/2,H*.45,Math.max(W,H)*.8);bg.addColorStop(0,'#1c2440');bg.addColorStop(1,'#060912');g.fillStyle=bg;g.fillRect(0,0,W,H);
  g.strokeStyle='rgba(120,140,200,.08)';g.lineWidth=1;for(let i=-20;i<40;i++){g.beginPath();g.moveTo(i*60-((t*10)%60),0);g.lineTo(i*60-((t*10)%60)+H*1.7,H);g.stroke();g.beginPath();g.moveTo(i*60+((t*10)%60),0);g.lineTo(i*60+((t*10)%60)-H*1.7,H);g.stroke()}
  const k=1-Math.pow(1-clamp(t/.35,0,1),3),sh=t<.5?(.5-t)*18:0;
  g.save();g.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh);g.textAlign='center';g.textBaseline='middle';g.translate(W/2,H*.42);g.scale(1.7-.7*k,1.7-.7*k);g.globalAlpha=k;
  const fs=Math.round(Math.min(W/5.5,120));g.font='900 '+fs+'px Impact, Arial Black, sans-serif';g.lineJoin='round';g.lineWidth=fs*.1;g.strokeStyle='#000';g.strokeText('PLAN',0,-fs*.55);g.strokeText('SOCIAL',0,fs*.55);g.fillStyle='#fff';g.fillText('PLAN',0,-fs*.55);g.fillStyle='#ff8a3d';g.fillText('SOCIAL',0,fs*.55);
  g.font='bold '+Math.round(Math.max(13,fs*.16))+'px Arial';g.lineWidth=0;g.fillStyle='#aab3d0';g.fillText("Licenciés à 18h. Pas avant d'avoir fini de nuire.",0,fs*1.3);g.restore();
  vflash(g,W,H,t<.2?.9*(1-t/.2):0)}
export function vflash(g: CanvasRenderingContext2D,W: number,H: number,a: number){if(a>0){g.fillStyle='rgba(255,255,255,'+Math.min(1,a)+')';g.fillRect(0,0,W,H)}}
/* montage : bureau 0-7, panorama 7-17, téléphone 17-22, course 22-28, titre */
export const VT={desk:7,pan:7,gap:2.5,phone:17,run:22,title:28};
export function drawVid(W: number,H: number,t: number){
  const g=vg;g.setTransform(vd,0,0,vd,0,0);g.globalAlpha=1;g.textAlign='left';
  let lid=0,dip=0;
  if(t<VT.desk){vDesk(g,W,H,t);lid=t<.9?1-vease(t/.9):0;
    vsub(g,W,H,'17h45. Vendredi. Plus que quinze minutes à faire semblant.',1,3.2,t);vsub(g,W,H,'Je n\'avais pas prévu que le plus long serait le dernier quart d\'heure.',5.2,6.9,t,'#ffd2a8');dip=t>6.6?(t-6.6)/.4:0}
  else if(t<VT.phone){const tt=t-VT.pan;vPan(g,W,H,t,VT.pan+.4,VT.gap);dip=tt<.3?1-tt/.3:t>VT.phone-.4?(t-(VT.phone-.4))/.4:0;
    vsub(g,W,H,'Je les connais tous. Eux aussi sont sur la liste.',VT.pan+.5,VT.pan+2.4,t)}
  else if(t<VT.run){const tt=t-VT.phone;vPhone(g,W,H,tt);dip=tt<.15?1-tt/.15:t>VT.run-.4?(t-(VT.run-.4))/.4:0;
    vsub(g,W,H,'Un message anonyme. Sûrement un RH sympa. Ça n\'existe pas.',VT.phone+.9,VT.phone+3.2,t);vsub(g,W,H,'Quatre licenciés, une clé, quinze minutes.',VT.phone+3.6,VT.run-.3,t,'#ffd2a8')}
  else if(t<VT.title){const tt=t-VT.run;vRun(g,W,H,tt);dip=tt<.15?1-tt/.15:t>VT.title-.15?(t-(VT.title-.15))/.15:0;
    vsub(g,W,H,'Le plan : monter, ouvrir le coffre, sortir. Il ne tiendra pas jusqu\'à l\'étage 1.',VT.run+.6,VT.run+3.2,t)}
  else{vTitle(g,W,H,t-VT.title)}
  if(t<VT.title){vvign(g,W,H,1);vlid(g,W,H,lid);if(dip>0){g.fillStyle='rgba(0,0,0,'+Math.min(1,dip)+')';g.fillRect(0,0,W,H)}
    if(t>1.5&&t<VT.title){g.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<4;i++)g.fillRect(0,(t*90+i*H/4)%H,W,2)}}}
export function vidFrame(t: number){const r=$('vid').getBoundingClientRect(),W=Math.max(2,Math.round(r.width)),H=Math.max(2,Math.round(r.height)),d=Math.min(2,devicePixelRatio||1);vd=d;
  if(vcv.width!==Math.round(W*d)||vcv.height!==Math.round(H*d)){vcv.width=Math.round(W*d);vcv.height=Math.round(H*d)}drawVid(W,H,t)}
/* Temps d'arrêt (instant de la vidéo, durée réelle en secondes) : le texte reste lisible avant chaque changement de scène */
export const HOLDS: [number,number][]=[[3.0,2.6],[6.8,2.8],[9.3,2.6],[20.0,2.6],[21.6,2.8],[25.0,2.8]];
export function vidLoop(now: number){if(!VID.run)return;const dt=Math.min(.05,(now-VID.last)/1000);VID.last=now;
  if(VID.hold&&VID.hold>0){VID.hold-=dt;vidFrame(VID.t);requestAnimationFrame(vidLoop);return}
  VID.t+=dt*VSLOW;const t=VID.t;
  VID.held=VID.held||{};for(const [ht,hd] of HOLDS){if(t>=ht&&!VID.held[ht]){VID.held[ht]=1;VID.hold=hd;VID.t=ht}}
  setIntroMusic(t<VT.run?'tension':t<VT.title?'chase':null);
  vidFrame(t);
  if(t<VT.desk){while(VID.tick<t&&t<3.2){VID.tick+=.13;snd(900+Math.random()*300,.025,'square',.012)}}
  vonce('ping',3,()=>{snd(880,.18,'triangle',.06);setTimeout(()=>snd(660,.3,'triangle',.06),160)});
  vonce('sting',4.3,()=>{snd(110,.9,'sawtooth',.06,-30)});
  vonce('whoosh1',6.8,()=>snd(400,.5,'sawtooth',.03,-300));
  for(let i=0;i<4;i++)vonce('p'+i,VT.pan+.4+i*VT.gap+1,()=>{snd(300+i*50,.12,'triangle',.05,200)});
  vonce('buzz',VT.phone+.02,()=>{snd(90,.5,'square',.06);setTimeout(()=>snd(90,.5,'square',.06),600)});
  if(t>VT.run&&t<VT.title){while(VID.tick<t){VID.tick+=.32;snd(75,.07,'square',.07,-20)}}
  vonce('title',VT.title,()=>{snd(330,.5,'triangle',.06);setTimeout(()=>snd(494,.5,'triangle',.06),150);setTimeout(()=>snd(659,.9,'triangle',.07),300);$('vGo').style.display='block'});
  requestAnimationFrame(vidLoop)}
export function playVid(cb: () => void){VID.t=0;VID.tick=0;VID.hold=0;VID.held={};VID.fired={};VID.cb=cb;VID.run=true;VID.last=performance.now();$('vid').classList.add('show');$('vGo').style.display='none';requestAnimationFrame(vidLoop)}
export function endVid(){if(!VID.run)return;VID.run=false;setIntroMusic(null);$('vid').classList.remove('show');const f=VID.cb;VID.cb=null;if(f)f()}
export const realStart=()=>{$('intro').classList.remove('show');ST.started=true;ST.paused=false;try{if(!ST.AC)ST.AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){};beginRun()};
$('bStart').onclick=()=>{try{if(!ST.AC)ST.AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){};realStart()};
const showDiff=()=>{$('bDiff').textContent='Difficulté : '+curDiff().n+' · '+curDiff().desc};
applyDiff();ST.showCones=SET.cones;ST.muted=SET.muted;$('bCones').classList.toggle('on',ST.showCones);showDiff();
$('bDiff').onclick=()=>{nextDiff();showDiff()};
$('ver').textContent='Version '+__APP_VERSION__+' · '+__BUILD_DATE__;
if(readSave())$('bResume').style.display='';
$('bResume').onclick=()=>{try{if(!ST.AC)ST.AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){};realStart();ST.lastSave=readSave()?.json??null;quickLoad()};
$('vSkip').onclick=endVid;$('vGo').onclick=endVid;
window.addEventListener('pointerdown',()=>{try{if(!ST.AC)ST.AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}},{once:true});

export function startGame(){ST.S=newState();ST.lastSave=null;ST.pend=null;ST.P=[];ST.PR=[];ST.view=0;mkUI();buildActs();const c=selC(),p=iso(c.x,c.y);cam.x=p[0];cam.y=p[1];cam.free=false;$('end').classList.remove('show');$('ban').style.display='none';ST.paused=false;ST.zoom=VW<620?.8:1;ST.started=true;ST.dlg=null;$('dlg').classList.remove('show');document.body.classList.remove('indlg');beginRun()}
