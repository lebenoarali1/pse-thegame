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
export function vwrapC(g: CanvasRenderingContext2D,txt: string,x: number,y: number,mw: number,lh: number){let l='';for(const w of txt.split(' ')){const tt=l?l+' '+w:w;if(g.measureText(tt).width>mw&&l){g.fillText(l,x,y);y+=lh;l=w}else l=tt}g.fillText(l,x,y)}
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
  /* bandeau : entrée en glissade avec rebond, nom géant, rôle, pouvoirs, faiblesse */
  const ci=Math.round(th);if(lock>.4&&ci>=0&&ci<4&&t>T0){const ch=VCARD[ci],ap=i0===ci?clamp(fr/.16,0,1):1,bk=ap<1?1+2.2*Math.pow(ap-1,3)+1.2*Math.pow(ap-1,2):1;
    const bw=W*.94,bh=Math.max(200,H*.38),bxx=W*.03,byy=H*.55,slide=(1-Math.min(1,bk))*-W*.6;g.save();g.globalAlpha=Math.min(1,lock*1.6)*clamp(ap*2,0,1);g.translate(slide,0);
    g.fillStyle='rgba(6,8,18,.94)';g.fillRect(bxx,byy,bw,bh);
    g.fillStyle=ch.c;g.fillRect(bxx,byy,bw,6);g.fillRect(bxx,byy,8,bh);
    const f1=clamp(bh*.17,22,46),f2=clamp(bh*.06,12,17);g.textAlign='left';g.textBaseline='middle';
    g.font='900 '+f1+'px Arial Black, Impact, Arial, sans-serif';g.lineJoin='round';g.lineWidth=f1*.14;g.strokeStyle=ch.c;g.strokeText(ch.n,bxx+20,byy+bh*.14);g.fillStyle='#ffffff';g.fillText(ch.n,bxx+20,byy+bh*.14);
    g.font='900 '+f2+'px Arial';const rw=g.measureText(ch.r.toUpperCase()).width+18;g.fillStyle=ch.c;vrr(g,bxx+20,byy+bh*.27,rw,f2*1.7,f2*.85);g.fill();g.fillStyle='#0b0d18';g.textAlign='center';g.fillText(ch.r.toUpperCase(),bxx+20+rw/2,byy+bh*.27+f2*.85+1);
    g.textAlign='left';g.textBaseline='top';g.fillStyle='#ffffff';g.font='italic 700 '+f2*1.08+'px Arial';vwrap(g,ch.q,bxx+20,byy+bh*.39,bw-36,f2*1.35);
    let cx=bxx+20;const cy=byy+bh*.67;g.font='bold '+f2*.9+'px Arial';for(const pw0 of ch.p){const w=g.measureText(pw0).width+18;g.strokeStyle=ch.c;g.lineWidth=2;vrr(g,cx,cy,w,f2*1.7,f2*.85);g.stroke();g.fillStyle=ch.c;g.fillText(pw0,cx+9,cy+f2*.3);cx+=w+8}
    g.fillStyle='#ff8a8a';g.font='bold '+f2*.95+'px Arial';vwrap(g,'☠ '+ch.f,bxx+20,byy+bh*.8,bw-36,f2*1.25);g.restore()}
  g.fillStyle='rgba(255,255,255,.75)';g.font='bold '+Math.round(clamp(W*.035,12,18))+'px Arial';g.textAlign='left';g.textBaseline='top';g.fillText('● REC  17:'+Math.min(55,47+Math.floor((t-T0)/3))+'  ÉQUIPE '+(Math.min(4,Math.max(1,Math.round(th)+1)))+'/4',14,14)}

/** Convocation de la DRH : grande feuille lisible, texte plus long, tapé progressivement */
const LETTER=['Bonjour,','Dans le cadre de la réorganisation « Cap 2030 », vous êtes convié(e) à un entretien individuel ce soir, 18h00, salle du Conseil, étage 2.','Prévoir un carton. Merci de ne rien emporter : tout ce qui est sur votre bureau appartient désormais à l\'entreprise, plante comprise.','Votre badge sera désactivé à l\'issue de l\'entretien. Nous vous remercions de votre compréhension.','Cordialement, la DRH (qui vous veut du bien).'];
export const LETTER_T0=4.8,LETTER_CPS=90;
export function vLetter(g: CanvasRenderingContext2D,W: number,H: number,t: number){
  if(t<4.3)return;const k=vease((t-4.3)/.35),pw=W*.92,ph=H*.7,px=(W-pw)/2,py=H*.08+(1-k)*30;
  g.save();g.globalAlpha=k;g.fillStyle='rgba(0,0,0,.45)';g.fillRect(px+6,py+8,pw,ph);g.fillStyle='#fffdf6';g.fillRect(px,py,pw,ph);
  const hb=clamp(ph*.12,34,60);g.fillStyle='#b32626';g.fillRect(px,py,pw,hb);g.fillStyle='#fff';g.textAlign='left';g.textBaseline='middle';g.font='900 '+Math.round(hb*.5)+'px Arial Black, Arial, sans-serif';g.fillText('CONVOCATION',px+14,py+hb/2);
  if(W>520){g.textAlign='right';g.font='bold '+Math.round(hb*.3)+'px Arial';g.fillText('URGENT · DRH',px+pw-14,py+hb/2)}
  /* mise en page : on réduit la police jusqu'à tout faire tenir */
  const full=LETTER.join(' ');let sz=clamp(Math.min(W*.05,ph*.075),13,30),lines: string[]=[];
  for(;sz>=12;sz-=1){g.font='600 '+sz+'px Arial';lines=[];for(const para of LETTER){let l='';for(const w of para.split(' ')){const tt=l?l+' '+w:w;if(g.measureText(tt).width>pw-32&&l){lines.push(l);l=w}else l=tt}lines.push(l);lines.push('')}
    if(lines.length*sz*1.32<=ph-hb-24)break}
  let n=Math.floor(clamp((t-LETTER_T0)*LETTER_CPS,0,full.length+10)),y=py+hb+16;g.textAlign='left';g.textBaseline='top';g.fillStyle='#14171f';g.font='600 '+sz+'px Arial';
  for(const l of lines){if(n<=0)break;const seg=l.slice(0,n);g.fillText(seg,px+16,y);n-=l.length+(l===''?0:1);y+=sz*1.32}
  g.restore()}
/** Faux éléments de gameplay pendant la course finale : actions, cônes, alertes, minicarte */
export function vFake(g: CanvasRenderingContext2D,W: number,H: number,t: number){
  const acts:[number,string,string][]=[[.6,'🥤','Gobelet lancé : le garde file nettoyer'],[2.0,'🚬','Clope offerte : fumoir pour 60 s'],[3.4,'🗣️','Baratin : « disruptons votre verticale »'],[4.8,'💻','Porte piratée en 8 s'],[6.2,'💡','Lumière coupée : 60 s de répit'],[7.6,'📷','Caméra hors service']];
  const f=clamp(W*.04,13,20);
  /* barre d'actions en haut à droite */
  const bs=clamp(W*.085,30,48);acts.forEach((a,i)=>{const x=W-8-(acts.length-i)*(bs+5),on=t>=a[0]&&t<a[0]+1.2;g.fillStyle=on?'#ffb36b':'rgba(10,14,30,.75)';vrr(g,x,H*.2,bs,bs,8);g.fill();g.strokeStyle='rgba(255,255,255,.4)';g.stroke();g.font=Math.round(bs*.55)+'px Arial';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.fillText(a[1],x+bs/2,H*.2+bs/2+1)});
  /* bandeau d'action */
  for(const a of acts){const u=t-a[0];if(u<0||u>1.7)continue;const k=Math.min(1,u/.15,(1.7-u)/.2);g.save();g.globalAlpha=k;g.font='bold '+f+'px Arial';const w=Math.min(W*.92,g.measureText(a[2]).width+f*3.4);g.fillStyle='rgba(8,12,26,.9)';vrr(g,(W-w)/2,H*.3+(1-k)*14,w,f*2.4,10);g.fill();g.fillStyle='#ffb36b';g.fillRect((W-w)/2,H*.3+(1-k)*14,5,f*2.4);g.fillStyle='#fff';g.textAlign='left';g.textBaseline='middle';g.fillText(a[1]+' '+a[2],(W-w)/2+14,H*.3+(1-k)*14+f*1.2);g.restore()}
  /* garde dans le couloir avec cône balayant et jauge de détection */
  const gx=W*(.34+.04*Math.sin(t*.9)),gy=H*.56,gs=H*.0042,ang=-.2+Math.sin(t*1.7)*.5;
  g.save();g.fillStyle=(t>3.1&&t<4.6)?'rgba(255,70,70,.28)':'rgba(255,220,90,.22)';g.beginPath();g.moveTo(gx,gy-gs*30);g.lineTo(gx+Math.cos(ang-.45)*W*.5,gy-gs*30+Math.sin(ang-.45)*H*.4+H*.15);g.lineTo(gx+Math.cos(ang+.45)*W*.5,gy-gs*30+Math.sin(ang+.45)*H*.4+H*.15);g.closePath();g.fill();g.restore();
  drawPerson(g,gx,gy,{look:'vigile',kind:'vigile',dir:ang,moving:true,s:gs*1.1,ph:t});
  const det=t>3.1&&t<4.6?(t-3.1)/1.5:t>=4.6&&t<5.6?Math.max(0,1-(t-4.6)):0;if(det>0){g.fillStyle='#10131f';g.fillRect(gx-22,gy-gs*72,44,6);g.fillStyle=det>.6?'#ff5d5d':'#ffb347';g.fillRect(gx-22,gy-gs*72,44*det,6);if(det>.6){g.fillStyle='#ff5d5d';g.font='900 '+f*1.4+'px Arial';g.textAlign='center';g.fillText('!',gx,gy-gs*80)}}
  /* gobelet lancé */
  if(t>.5&&t<1.6){const u=(t-.5)/1.1;g.fillStyle='#e9eef7';g.beginPath();g.arc(W*.5+(gx-W*.5)*u,H*.85-(H*.85-gy)*u-Math.sin(u*3.14)*H*.22,6,0,7);g.fill()}
  /* minicarte */
  const mw=clamp(W*.28,86,150),mh=mw*.62,mx=10,my=H-mh-H*.2;g.fillStyle='rgba(8,12,26,.8)';g.fillRect(mx,my,mw,mh);g.strokeStyle='rgba(255,255,255,.35)';g.strokeRect(mx,my,mw,mh);
  g.fillStyle='rgba(255,255,255,.2)';g.fillRect(mx+6,my+mh*.4,mw-12,mh*.2);g.fillStyle='#ff8a3d';g.beginPath();g.arc(mx+mw*.15+((t*.1)%1)*mw*.7,my+mh*.5,4,0,7);g.fill();g.fillStyle='#ff5d5d';g.beginPath();g.arc(mx+mw*.55+Math.sin(t)*8,my+mh*.5,3,0,7);g.arc(mx+mw*.8,my+mh*.5,3,0,7);g.fill();
  g.fillStyle='#fff';g.font='bold '+Math.max(9,f*.6)+'px Arial';g.textAlign='left';g.textBaseline='top';g.fillText('ÉTAGE 2',mx+5,my+4)}
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
  g.restore();
  /* texte de fin : bandeau opaque, gros caractères, contraste maximal */
  {const k2=vease((t-.7)/.5),ts=Math.round(clamp(W*.052,17,32)),by=H*.7;g.save();g.globalAlpha=k2;g.fillStyle='rgba(0,0,0,.82)';g.fillRect(0,by,W,ts*5.4);g.fillStyle='#ff8a3d';g.fillRect(0,by,W,4);
   g.textAlign='center';g.textBaseline='top';g.font='900 '+ts+'px Arial';g.fillStyle='#ffffff';vwrapC(g,"Licenciés à 18h. Pas avant d'avoir fini de nuire.",W/2,by+ts*.6,W*.9,ts*1.3);
   g.font='bold '+Math.round(ts*.85)+'px Arial';g.fillStyle='#ffd2a8';vwrapC(g,'Récupérez la clé du DG et sortez tous ensemble avant 18h.',W/2,by+ts*3.1,W*.9,ts*1.2);g.restore()}

  vflash(g,W,H,t<.2?.9*(1-t/.2):0)}
export function vflash(g: CanvasRenderingContext2D,W: number,H: number,a: number){if(a>0){g.fillStyle='rgba(255,255,255,'+Math.min(1,a)+')';g.fillRect(0,0,W,H)}}
/* montage : bureau 0-7, panorama 7-17, téléphone 17-22, course 22-28, titre */
export const VT={desk:11,pan:11,gap:2.5,phone:21.5,run:26.5,title:35.5};
export function drawVid(W: number,H: number,t: number){
  const g=vg;g.setTransform(vd,0,0,vd,0,0);g.globalAlpha=1;g.textAlign='left';
  let lid=0,dip=0;
  if(t<VT.desk){vDesk(g,W,H,t);vLetter(g,W,H,t);lid=t<.9?1-vease(t/.9):0;
    vsub(g,W,H,'17h45. Vendredi. Plus que quinze minutes à faire semblant.',1,3.2,t);vsub(g,W,H,'Je n\'avais pas prévu que le plus long serait le dernier quart d\'heure.',9.7,10.9,t,'#ffd2a8');dip=t>10.6?(t-10.6)/.4:0}
  else if(t<VT.phone){const tt=t-VT.pan;vPan(g,W,H,t,VT.pan+.4,VT.gap);dip=tt<.3?1-tt/.3:t>VT.phone-.4?(t-(VT.phone-.4))/.4:0;
    ;void 0}
  else if(t<VT.run){const tt=t-VT.phone;vPhone(g,W,H,tt);dip=tt<.15?1-tt/.15:t>VT.run-.4?(t-(VT.run-.4))/.4:0;
    vsub(g,W,H,'Un message anonyme. Sûrement un RH sympa. Ça n\'existe pas.',VT.phone+.9,VT.phone+3.2,t);vsub(g,W,H,'Quatre licenciés, une clé, quinze minutes.',VT.phone+3.6,VT.run-.3,t,'#ffd2a8')}
  else if(t<VT.title){const tt=t-VT.run;vRun(g,W,H,tt);vFake(g,W,H,tt);dip=tt<.15?1-tt/.15:t>VT.title-.15?(t-(VT.title-.15))/.15:0;
    vsub(g,W,H,'Le plan : monter, ouvrir le coffre, sortir. Il ne tiendra pas jusqu\'à l\'étage 1.',VT.run+.3,VT.run+3.2,t);vsub(g,W,H,'Chaque action compte. Chaque seconde aussi.',VT.run+5.6,VT.run+8.8,t,'#ffd2a8')}
  else{vTitle(g,W,H,t-VT.title)}
  if(t<VT.title){vvign(g,W,H,1);vlid(g,W,H,lid);if(dip>0){g.fillStyle='rgba(0,0,0,'+Math.min(1,dip)+')';g.fillRect(0,0,W,H)}
    if(t>1.5&&t<VT.title){g.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<4;i++)g.fillRect(0,(t*90+i*H/4)%H,W,2)}}}
let vSz={w:0,h:0,k:0};
/** Taille du canvas mesurée une seule fois (et au redimensionnement), résolution plafonnée pour la fluidité sur mobile */
function vidSize(force: boolean){if(force||!vSz.w){const r=$('vid').getBoundingClientRect(),d=Math.min(1.25,devicePixelRatio||1);vSz={w:Math.max(2,Math.round(r.width)),h:Math.max(2,Math.round(r.height)),k:d};vd=d;
  vcv.width=Math.round(vSz.w*d);vcv.height=Math.round(vSz.h*d)}return vSz}
addEventListener('resize',()=>{vSz.w=0});
export function vidFrame(t: number){const z=vidSize(false);vd=z.k;drawVid(z.w,z.h,t)}
/* Temps d'arrêt (instant de la vidéo, durée réelle en secondes) : le texte reste lisible avant chaque changement de scène */
export const HOLDS: [number,number][]=[[3.0,2.6],[10.8,3.6],[11.9,1.6],[14.4,1.6],[16.9,1.6],[19.4,1.6],[24.5,2.6],[26.1,2.4],[35.0,2.2]];
export function vidLoop(now: number){if(!VID.run)return;const dt=Math.min(.05,(now-VID.last)/1000);VID.last=now;
  if(VID.hold&&VID.hold>0){if(!VID.drawn){vidFrame(VID.t);VID.drawn=true}VID.hold-=dt;if(VID.hold<=0)VID.drawn=false;requestAnimationFrame(vidLoop);return}
  VID.t+=dt*VSLOW;const t=VID.t;
  VID.held=VID.held||{};for(const [ht,hd] of HOLDS){if(t>=ht&&!VID.held[ht]){VID.held[ht]=1;VID.hold=hd;VID.t=ht;VID.drawn=false}}
  setIntroMusic(t<VT.run?'tension':t<VT.title?'chase':null);
  vidFrame(t);
  if(t<VT.desk){while(VID.tick<t&&t<3.2){VID.tick+=.13;snd(900+Math.random()*300,.025,'square',.012)}}
  vonce('ping',3,()=>{snd(880,.18,'triangle',.06);setTimeout(()=>snd(660,.3,'triangle',.06),160)});
  vonce('sting',4.3,()=>{snd(110,.9,'sawtooth',.06,-30)});
  vonce('whoosh1',10.9,()=>snd(400,.5,'sawtooth',.03,-300));
  for(let i=0;i<4;i++)vonce('p'+i,VT.pan+.4+i*VT.gap+1,()=>{snd(300+i*50,.12,'triangle',.05,200)});
  vonce('buzz',VT.phone+.02,()=>{snd(90,.5,'square',.06);setTimeout(()=>snd(90,.5,'square',.06),600)});
  if(t>VT.run&&t<VT.title){while(VID.tick<t){VID.tick+=.32;snd(75,.07,'square',.07,-20)}}
  vonce('title',VT.title,()=>{snd(330,.5,'triangle',.06);setTimeout(()=>snd(494,.5,'triangle',.06),150);setTimeout(()=>snd(659,.9,'triangle',.07),300);$('vGo').style.display='block'});
  requestAnimationFrame(vidLoop)}
export function playVid(cb: () => void){vSz.w=0;VID.t=0;VID.tick=0;VID.hold=0;VID.held={};VID.fired={};VID.cb=cb;VID.run=true;VID.last=performance.now();$('vid').classList.add('show');$('vGo').style.display='none';requestAnimationFrame(vidLoop)}
export function endVid(){if(!VID.run)return;VID.run=false;setIntroMusic(null);$('vid').classList.remove('show');const f=VID.cb;VID.cb=null;if(f)f()}
export const realStart=()=>{$('intro').classList.remove('show');ST.started=true;ST.paused=false;try{if(!ST.AC)ST.AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){};beginRun()};
$('bStart').onclick=()=>{try{if(!ST.AC)ST.AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){};realStart()};
const showDiff=()=>{$('bDiff').textContent='Difficulté : '+curDiff().n};
applyDiff();ST.showCones=SET.cones;ST.muted=SET.muted;$('bCones').classList.toggle('on',ST.showCones);showDiff();
$('bDiff').onclick=()=>{nextDiff();showDiff()};
$('ver').textContent='Version '+__APP_VERSION__+' · '+__BUILD_DATE__;
if(readSave())$('bResume').style.display='';
$('bResume').onclick=()=>{try{if(!ST.AC)ST.AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){};realStart();ST.lastSave=readSave()?.json??null;quickLoad()};
$('vSkip').onclick=endVid;$('vGo').onclick=endVid;
window.addEventListener('pointerdown',()=>{try{if(!ST.AC)ST.AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}},{once:true});

export function startGame(){ST.S=newState();ST.lastSave=null;ST.pend=null;ST.P=[];ST.PR=[];ST.view=0;mkUI();buildActs();const c=selC(),p=iso(c.x,c.y);cam.x=p[0];cam.y=p[1];cam.free=false;$('end').classList.remove('show');$('ban').style.display='none';ST.paused=false;ST.zoom=VW<620?.8:1;ST.started=true;ST.dlg=null;$('dlg').classList.remove('show');document.body.classList.remove('indlg');beginRun()}
