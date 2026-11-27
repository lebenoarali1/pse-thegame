import { ST } from './store';
import { ch, isDoor } from './levelData';
import { say } from './messages';
import { DOORS } from './state';
import type { Character } from './types';
/* déplacement */
export function doorOpenFor(e: any){return true}
export function stepEntity(e: any,dt: any,speed: any,isChar: boolean){
  e.moving=false;if(!e.path||!e.path.length)return;
  let rem=speed*dt;
  while(rem>0&&e.path.length){
    const [tx,ty]=e.path[0],dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy);
    if(isChar){const ti=Math.floor(tx),tj=Math.floor(ty),c=ch(e.f,ti,tj);
      if(isDoor(c)&&!ST.S.dOpen[e.f+','+ti+','+tj]&&!(Math.floor(e.x)===ti&&Math.floor(e.y)===tj)){
        e.stall+=dt;if(e.stall>3.2){e.path=[];e.order=null;e.stall=0;say(e,'Verrouillé.',1.8)}return}}
    e.stall=0;
    if(d<=rem){e.x=tx;e.y=ty;e.path.shift();rem-=d;e.moving=true;if(d>.001)e.face=Math.atan2(dy,dx)}
    else{e.x+=dx/d*rem;e.y+=dy/d*rem;e.face=Math.atan2(dy,dx);rem=0;e.moving=true}
  }
}
export function accLevel(c: Character){if(c.id==='jordan'&&c.f<=1)return 1;if(c.disguise==='manager')return 2;if(c.disguise==='vigile')return 1;return 0}
export function updateDoors(){ST.S.dLatch=ST.S.dLatch||{};ST.S.puddles=ST.S.puddles||[];
  for(const d of DOORS){const k=d.f+','+d.x+','+d.y,cx=d.x+.5,cy=d.y+.5;let open=false;
    if(d.l<=2&&(ST.S.doorHack[k]||0)>ST.S.t)open=true;
    if(!open)for(const c of ST.S.chars){if(!c.joined||c.f!==d.f||c.hide)continue;if(Math.hypot(c.x-cx,c.y-cy)<1.7&&accLevel(c)>=d.l){open=true;break}}
    if(!open)for(const e of ST.S.enemies){if(e.f!==d.f||e.type==='camera'||e.ko)continue;if(Math.hypot(e.x-cx,e.y-cy)<1.7){open=true;break}}
    if(open)ST.S.dLing[k]=ST.S.t+1.6;else if((ST.S.dLing[k]||0)>ST.S.t)open=true;
    if(open)ST.S.dLatch[k]=1;ST.S.dOpen[k]=open||!!ST.S.dLatch[k]}
}
