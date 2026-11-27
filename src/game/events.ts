import { ST } from './store';
import { TL, getC, getE } from './state';
import { toast } from './messages';
import { snd } from './sound';
import { rnd } from './utils';
import { SMK } from './levelData';
/* événements */
export const EVENTS=[
 {t:TL*2/3,fn(){const e=getE('dg');if(e.ko)return;
   e.route=[{x:20.5,y:2.5,wait:.2},{x:18.5,y:5.5},{x:18.5,y:7.5},{x:3.5,y:7.5},{x:3.5,y:10.5},{x:2.5,y:11.5,warp:{f:1,x:21.5,y:8.5}},{x:17.5,y:8.5},{x:17.5,y:11.5},{x:20.5,y:10.5,wait:999,face:Math.PI}];
   e.loop=false;e.ri=0;e.path=[];e.scan=null;e.wait=0;e.state='patrol';
   toast("17h55 · Le DG quitte son bureau : réunion à préparer. Le bureau est libre !",'w');snd(440,.15,'triangle',.05)}},
 {t:TL*11/12,fn(){toast("17h58 · Dernière minute : il faut être dehors à 18h pile",'r');snd(300,.3,'sawtooth',.05)}}
];

export function fxTick(dt){
  const n=getC('nadege');
  if(n&&n.smoke&&n.joined&&n.f===ST.view&&Math.random()<dt*8)ST.P.push({f:n.f,x:n.x+.12,y:n.y-.12,z:34,vx:rnd(-.15,.35),vy:rnd(-.35,.1),vz:rnd(7,13),life:1.5,col:'rgba(225,225,238,.6)',sz:2,smoke:true});
  if(ST.S&&SMK[ST.view]&&ST.S.enemies.some(e=>e.state==='break'&&e.brk&&e.brk.arrived&&e.f===ST.view)){const k=SMK[ST.view];if(Math.random()<dt*16)ST.P.push({f:ST.view,x:k.x+rnd(-1.3,1.3),y:k.y+rnd(-1.3,1.3),z:rnd(10,40),vx:rnd(-.2,.2),vy:rnd(-.2,.2),vz:rnd(3,8),life:2.4,col:'rgba(200,200,212,.32)',sz:7,smoke:true})}
  for(const e of ST.S.enemies){if(e.state==='break'&&e.brk&&e.brk.arrived&&e.f===ST.view&&Math.random()<dt*7)ST.P.push({f:e.f,x:e.x+.12,y:e.y-.12,z:34,vx:rnd(-.15,.35),vy:rnd(-.35,.1),vz:rnd(7,13),life:1.5,col:'rgba(225,225,238,.6)',sz:2,smoke:true})}
  for(const p of ST.P){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(p.smoke){p.sz+=dt*2.2}else p.vz-=40*dt;if(p.z<0){p.z=0;p.vz=0}if(p.ring)p.age+=dt}
  ST.P=ST.P.filter(p=>p.life>0)}
