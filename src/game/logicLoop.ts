import { ST } from './store';
import { EVENTS } from './events';
import { TL, getE } from './state';
import { fail, say, toast, win } from './messages';
import { updateDoors } from './movement';
import { los } from './pathing';
import { recruit } from './dialogues';
import { updateChar } from './updateChars';
import { detect, updateEnemy } from './enemiesAi';
import { pcTick } from './pcMenu';
import { snd } from './sound';
import { rnd } from './utils';
import { hear, smokeBreak } from './noise';
/* boucle logique */
export function update(dt){
  if(ST.S.over)return;
  ST.S.t+=dt;
  for(const ev of EVENTS)if(!ST.S.ev[ev.t]&&ST.S.t>=ev.t){ST.S.ev[ev.t]=1;ev.fn()}
  if(ST.S.t>=TL&&!ST.noLimit){fail('18h00. Trop tard.',"Les portes se verrouillent, les badges sont coupés. L'équipe est officiellement licenciée, avec la reconnaissance chaleureuse de la direction et un pot de départ sans alcool.");return}
  updateDoors();
  for(const n of ST.S.chars){if(n.joined||ST.S.talked[n.id])continue;
    for(const c of ST.S.chars){if(!c.joined||c.f!==n.f||c.hide)continue;
      if(Math.hypot(c.x-n.x,c.y-n.y)<2.6&&los(n.f,c.x,c.y,n.x,n.y)){c.path=[];c.order=null;c.run=false;recruit(n,c);return}}}
  for(const c of ST.S.chars)updateChar(c,dt);
  for(const e of ST.S.enemies)updateEnemy(e,dt);
  detect(dt);pcTick();
  for(let i=ST.S.puddles.length-1;i>=0;i--){const p=ST.S.puddles[i];p.t+=dt;if(p.t>90){ST.S.puddles.splice(i,1);continue}
    for(const e of ST.S.enemies){if(e.f!==p.f||e.ko||e.type==='camera'||e.calm)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<.95){
      e.ko=true;e.koT=0;e.koDur=35;e.state='ko';e.path=[];e.det=0;e.talk=0;say(e,'Aaah !',1.8);snd(150,.25,'sine',.08);toast(e.name+' glisse sur la flaque','g');
      for(let k=0;k<10;k++)ST.P.push({f:e.f,x:e.x,y:e.y,z:34,vx:rnd(-1.2,1.2),vy:rnd(-1.2,1.2),vz:rnd(10,30),life:.8,col:'#ffd54a',sz:2.4});ST.S.puddles.splice(i,1);break}}}
  if(ST.S.alertT>0)ST.S.alertT-=dt;
  for(const p of ST.PR){p.t+=dt;if(p.t>=p.dur&&!p.done){p.done=true;if(p.kind==='clope')smokeBreak(getE(p.eid));else hear(p.f,p.x1,p.y1,7);snd(180,.2,'square',.06,-60);
      for(let i=0;i<8;i++)ST.P.push({f:p.f,x:p.x1,y:p.y1,z:4,vx:rnd(-1.5,1.5),vy:rnd(-1.5,1.5),vz:rnd(8,20),life:.6,col:'#ffe08a',sz:2});
      ST.P.push({f:p.f,x:p.x1,y:p.y1,z:0,vx:0,vy:0,vz:0,life:.7,col:'#ffe08a',sz:0,ring:true,age:0})}}
  ST.PR=ST.PR.filter(p=>!p.done);
  /* victoire */
  if(ST.S.team.key&&ST.S.chars.every(c=>c.out||c.joined)&&ST.S.chars.some(c=>!c.out)){const x=getXY();let ok=true;for(const c of ST.S.chars)if(!c.out&&(c.f!==0||Math.hypot(c.x-x[0],c.y-x[1])>3.4||c.hide))ok=false;if(ok)win()}
}
export function getXY(){return [21.5,12.5]}
