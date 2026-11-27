import { ST } from './store';
import { findPath, los } from './pathing';
import { angDiff } from './utils';
import { snd } from './sound';
import { fail, say, toast } from './messages';
import { cam, getC, getE } from './state';
import { buildActs } from './ui';
import { BRK_SAY, CHAT, CLEAN_SAY, COF_SAY } from './texts';
import { stepEntity } from './movement';
import { goCoffee } from './noise';
/* ennemis */
export function canSee(e,c,fovExtra?){
  const dx=c.x-e.x,dy=c.y-e.y,d=Math.hypot(dx,dy);
  if(d>e.range)return 0;
  if(!los(e.f,e.x,e.y,c.x,c.y))return 0;
  const inCone=Math.abs(angDiff(Math.atan2(dy,dx),e.face))<=e.fov*Math.PI/360;
  if(inCone)return 1;
  if(e.type!=='camera'&&d<2.1)return 2;
  return 0;
}
export function eliminate(c,e,why){if(c.out||c.disguise)return;c.out=true;c.f=-1;c.path=[];c.order=null;c.busy=null;c.run=false;c.hide=false;snd(160,.5,'sawtooth',.06,-90);ST.S.alertT=2;
  const L=[' est cueilli : licenciement pour faute grave, présence dans les locaux.',' est embarqué. Le DRH n\'a même pas eu à se déplacer.',' est escorté vers la sortie, sans pot de départ.'];
  toast(c.name+L[Math.floor(Math.random()*L.length)],'r');
  for(const o of ST.S.enemies){if(o.tgt===c.id&&o.state==='chase'){o.state='patrol';o.path=[];o.det=0;o.tgt=null}if(o.det>0)o.det=0}
  const act=ST.S.chars.filter(q=>q.joined&&!q.out);
  if(c.id==='kevin'&&!ST.S.team.key){fail('Sans Kévin, pas de coffre',why+' Lui seul passe par la gaine jusqu\'au coffre du DG. Rechargez la sauvegarde rapide ou recommencez.');return}
  if(!act.length){fail('Équipe décimée','Plus personne pour mener le plan. La réunion de 18h se passera sans résistance. Rechargez la sauvegarde rapide ou recommencez.');return}
  if(ST.S.sel===c.id){ST.S.sel=act[0].id;ST.pend=null;const n=getC(ST.S.sel);ST.view=n.f;cam.free=false;buildActs()}}
export function spotted(e,c){
  if(c.id==='kevin'){eliminate(c,e,(e.type==='camera'?'Une caméra':e.name)+' a repéré le stagiaire. Le pire, c\'est qu\'on l\'a reconnu tout de suite.');return}
  if(false){fail('Kévin est repéré !',(e.type==='camera'?'Une caméra':e.name)+' a vu un stagiaire là où il ne devait pas être. Le pire, c\'est qu\'on l\'a reconnu tout de suite : il n\'a jamais été aussi visible. Alerte immédiate. Rechargez la sauvegarde rapide ou recommencez.');return}
  e.state='chase';e.tgt=c.id;e.lose=0;say(e,['Hé ! Vous là !','Vous n\'avez pas de badge, c\'est ça ?','Stop ! Il y a un process pour être suspect !'][Math.floor(Math.random()*3)],2.4);snd(520,.25,'sawtooth',.05,-200);ST.S.alertT=3;
  for(const o of ST.S.enemies){if(o===e||o.f!==e.f||o.ko||o.type==='camera'||o.state==='chase'||o.talk>0)continue;
    if(Math.hypot(o.x-e.x,o.y-e.y)<7){o.state='chase';o.tgt=c.id;o.lose=0;say(o,'Alerte !',2)}}
}
export function updateEnemy(e,dt){
  if(e.sayT>0)e.sayT-=dt;
  if(e.fovS&&e.state!=='break'){e.fov=e.fovS;e.range=e.rangeS;e.fovS=null}
  if(e.chat===undefined)e.chat=6+Math.random()*25;
  if(!e.ko&&e.state==='patrol'&&e.talk<=0){e.chat-=dt;if(e.chat<=0){e.chat=22+Math.random()*30;const L=CHAT[e.type];if(L&&e.sayT<=0&&!(ST.S.over))say(e,L[Math.floor(Math.random()*L.length)],3.2)}}
  if(e.ko){if(!e.hidden){e.koT=(e.koT||0)+dt;if(e.koT>=(e.koDur||50)&&!ST.S.chars.some(c=>c.busy&&c.busy.eid===e.id))wakeUp(e)}return}
  if(e.freeze>0){e.freeze-=dt;e.moving=false;return}
  if(e.type==='camera'){
    const off=(ST.S.team.camsUntil>ST.S.t&&e.f===2)||((ST.S.team.camsOff||{})[e.f]||0)>ST.S.t;e.off=off;
    e.face=e.scan.base+e.scan.amp*Math.sin(ST.S.t*6.283/e.scan.period);return}
  if(e.talk>0&&!e.talkRed){e.talkRed=[e.fov,e.range];e.fov=Math.min(e.fov,56);e.range=Math.min(e.range,2.4)}
  else if(!(e.talk>0)&&e.talkRed){e.fov=e.talkRed[0];e.range=e.talkRed[1];e.talkRed=null}
  if(e.talk>0){e.talk-=dt;const c=getC(e.talkTo);if(c&&c.f===e.f){e.face=Math.atan2(c.y-e.y,c.x-e.x);if(Math.hypot(c.x-e.x,c.y-e.y)>8)e.talk=0}
    e.moving=false;return}
  if(e.state==='call'){const c=getC(e.callTo);if(!c||c.f!==e.f||c.talking!==e.id){e.state='patrol';e.path=[];return}
    if(Math.hypot(c.x-e.x,c.y-e.y)<=1.9){e.state='patrol';e.talk=1e9;e.talkTo=c.id;e.path=[];say(e,'Je vous écoute, mais vite.',2.6);return}
    e.repath-=dt;if(e.repath<=0||!e.path.length){e.repath=.5;const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(c.x),Math.floor(c.y));e.path=p||[]}
    stepEntity(e,dt,1.5,false);return}
  if(e.state==='snitch'){const b=e.snt,m=b&&getE(b.mid);if(!m||m.ko||m.f!==e.f){e.state='patrol';e.snt=null;return}b.t+=dt;
    if(Math.hypot(m.x-e.x,m.y-e.y)<1.7){const c=getC(b.cid);say(e,'Chef, il y a un intrus !',2.4);if(c&&!c.out&&!c.disguise&&c.f===m.f){m.state='chase';m.tgt=c.id;m.lose=0;m.path=[];m.det=0;say(m,'Où ça ?! Montrez-moi !',2.4)}else say(m,'Encore vos histoires, vous.',2.4);e.state='patrol';e.snt=null;e.path=[];return}
    if(!e.path.length||b.t%.5<dt){const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(m.x),Math.floor(m.y));e.path=p||[]}
    stepEntity(e,dt,2,false);return}
  if(e.state==='clean'){const l=e.cln;if(!l){e.state='patrol';return}
    if(!l.arrived){if(!e.path.length){const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(l.x),Math.floor(l.y));e.path=p||[];if(!p||!p.length)l.arrived=true}
      stepEntity(e,dt,1.7,false);if(!e.path.length)l.arrived=true;if(l.arrived){l.f0=Math.atan2(l.y-e.y,l.x-e.x);say(e,CLEAN_SAY[Math.floor(Math.random()*CLEAN_SAY.length)],3.4)}}
    else{l.t+=dt;e.moving=false;e.face=l.f0+Math.sin(l.t*3.2)*.6;
      if(l.t>=l.dur){e.cln=null;e.path=[];e.wait=0;if(!((e.type==='vigile'||e.type==='beaugosse'||e.type==='manager')&&goCoffee(e,20))){e.state='patrol';say(e,'Voilà, propre. Jusqu\'au prochain stagiaire.',2.6)}}}
    return}
  if(e.state==='coffee'){const b=e.cof;if(!b){e.state='patrol';return}
    if(!b.arrived){if(!e.path.length){const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(b.x),Math.floor(b.y));e.path=p||[];if(!p||!p.length)b.arrived=true}
      stepEntity(e,dt,1.7,false);if(!e.path.length)b.arrived=true}
    else{b.t+=dt;e.moving=false;if(b.t>b.dur){e.state='patrol';e.cof=null;e.path=[];e.wait=0;say(e,b.lines?'Fausse alerte. Comme toujours.':'Allez, au boulot. Le café était tiède.',2.6)}
      else if(Math.floor(b.t/7)!==Math.floor((b.t-dt)/7)&&b.t>1){const L=b.lines||COF_SAY;say(e,L[(b.sy+Math.floor(b.t/7))%L.length],3)}}
    return}
  if(e.state==='chase'){
    const c=getC(e.tgt);if(!c||c.f!==e.f||c.hide){e.state='patrol';e.path=[];return}
    const vis=canSee(e,c);if(vis)e.lose=0;else e.lose+=dt;
    if(vis){e.lastSeen={x:c.x,y:c.y}}
    e.repath-=dt;if(e.repath<=0){e.repath=.3;const tx=e.lose>0&&e.lastSeen?e.lastSeen.x:c.x,ty=e.lose>0&&e.lastSeen?e.lastSeen.y:c.y;
      const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(tx),Math.floor(ty));if(p)e.path=p}
    stepEntity(e,dt,2.9,false);
    if(Math.hypot(c.x-e.x,c.y-e.y)<.95&&!ST.S.over){eliminate(c,e,c.name+' est cueilli par '+e.name+'.');e.state='patrol';e.path=[];e.det=0;return}
    if(e.lose>5){e.state='look';e.look={x:(e.lastSeen||c).x,y:(e.lastSeen||c).y,t:0,arrived:false};e.path=[];say(e,'Où est-il passé ?',2.6)}
    return}
  if(e.state==='break'){const b=e.brk;if(!b){e.state='patrol';return}
    if(!b.arrived){if(!e.path.length){const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(b.x),Math.floor(b.y));e.path=p||[];if(!p||!p.length)b.arrived=true}
      stepEntity(e,dt,1.7,false);if(!e.path.length)b.arrived=true}
    else{if(!b.red){b.red=1;e.fovS=e.fov;e.rangeS=e.range;e.fov=64;e.range=2.3;e.det=0}b.t+=dt;e.moving=false;e.face=b.face;if(b.t>b.dur){e.state='patrol';e.brk=null;e.path=[];e.wait=0;say(e,'Bon, retour au travail.',2.4)}
      else if(Math.floor(b.t/9)!==Math.floor((b.t-dt)/9)&&b.t>1)say(e,BRK_SAY[(b.sy+Math.floor(b.t/9))%BRK_SAY.length],3)}
    return}
  if(e.state==='look'){
    const l=e.look;if(!l){e.state='patrol';return}
    if(!l.arrived){if(!e.path.length){const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(l.x),Math.floor(l.y));e.path=p||[];if(!p||!p.length)l.arrived=true}
      stepEntity(e,dt,1.7,false);if(!e.path.length&&e.moving===false&&Math.hypot(e.x-l.x,e.y-l.y)<1.6)l.arrived=true;if(!e.path.length)l.arrived=true}
    else{l.t+=dt;if(l.f0===undefined)l.f0=e.face;e.face=l.f0+Math.sin(l.t*2.2)*1.0;if(l.t>(e.lookDur||4.5)){e.state='patrol';e.look=null;e.path=[];e.wait=0}}
    return}
  /* patrouille */
  if(!e.route.length){
    if(Math.hypot(e.x-e.hx,e.y-e.hy)>.3){if(!e.path.length){const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(e.hx),Math.floor(e.hy));e.path=p||[];if(!p){e.hx=e.x;e.hy=e.y}}stepEntity(e,dt,e.sp,false);return}
    if(e.scan)e.face=e.scan.base+e.scan.amp*Math.sin(ST.S.t*6.283/e.scan.period);e.moving=false;return}
  if(e.wait>0){e.wait-=dt;e.face=e.idleFace+.45*Math.sin(ST.S.t*1.8);e.moving=false;return}
  const wp=e.route[e.ri];
  if(!e.path.length){
    if(Math.hypot(wp.x-e.x,wp.y-e.y)<.3){
      if(wp.warp){e.f=wp.warp.f;e.x=wp.warp.x;e.y=wp.warp.y}
      e.wait=wp.wait||0;e.idleFace=wp.face!==undefined?wp.face:e.face;e.ri++;
      if(e.ri>=e.route.length){if(e.loop)e.ri=0;else{e.route=[];e.hx=e.x;e.hy=e.y;e.scan={base:e.face,amp:.3,period:7}}}
      return}
    const p=findPath(e.f,Math.floor(e.x),Math.floor(e.y),Math.floor(wp.x),Math.floor(wp.y));
    if(!p){e.ri=(e.ri+1)%e.route.length;return}
    e.path=p}
  stepEntity(e,dt,e.sp,false);
}
export function detect(dt){
  for(const e of ST.S.enemies){
    if(e.ko||(e.calm&&!e.tech)||e.state==='snitch'||e.type==='camera'&&e.off||e.state==='chase')continue;
    let seen=false;
    for(const c of ST.S.chars){
      if(!c.joined||c.f!==e.f||c.hide||c.disguise||(c.busy&&c.busy.k==='vent'))continue;
      if(e.talk>0&&e.talkTo===c.id)continue;
      const v=canSee(e,c);if(!v)continue;
      const d=Math.hypot(c.x-e.x,c.y-e.y);
      if(c.id==='jordan'&&c.f<=1)continue;
      if(c.disguise&&e.type!=='drh'&&e.type!=='dg'&&e.type!=='camera'&&d>2.0)continue;
      if(c.disguise&&e.type==='camera'&&d>2.0)continue;
      let rate=(.55+.9*(1-d/e.range))*(v===2?1.2:1);
      if(c.run)rate*=1.7;if(c.id==='kevin')rate*=2.2;
      e.det=Math.min(1.05,e.det+rate*dt);seen=true;
      if(e.det>=1){if(e.calm){snitch(e,c);break}spotted(e,c);return}
    }
    if(!seen)e.det=Math.max(0,e.det-.45*dt);
    /* corps découverts */
    if(e.type!=='camera'&&e.talk<=0)for(const b of ST.S.enemies){
      if(!b.ko||b.hidden||b.f!==e.f||b===e)continue;
      const d=Math.hypot(b.x-e.x,b.y-e.y);if(d>e.range)continue;
      const inCone=Math.abs(angDiff(Math.atan2(b.y-e.y,b.x-e.x),e.face))<=e.fov*Math.PI/360;
      if((inCone||d<2.1)&&los(e.f,e.x,e.y,b.x,b.y)){say(e,'Un corps !',2.5);fail('Corps découvert !',e.name+" est tombé sur "+b.name+" assommé. Un collègue inanimé, c'est la première fois qu'on le voit aussi calme au bureau. Alerte générale. Un corps visible = fin de partie : planquez-les (Max) avant qu'on les voie.");return}}
  }
}

export function snitch(e,c){const m=ST.S.enemies.filter(q=>q.type==='manager'&&q.f===e.f&&!q.ko).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];e.det=0;
  if(!m){say(e,'J\'ai vu quelqu\'un, mais il n\'y a plus de chef pour s\'en occuper.',3);return}
  e.state='snitch';e.snt={mid:m.id,cid:c.id,t:0};e.path=[];e.look=null;e.talk=0;e.wait=0;say(e,'Il y a quelqu\'un qui ne devrait pas être là ! Je préviens le chef.',3.2);toast(e.name+' (support) file prévenir '+m.name,'w')}
export function wakeUp(e){e.ko=false;e.hidden=false;e.koT=0;e.state='patrol';e.path=[];e.det=0;e.talk=0;e.look=null;e.wait=0;
  say(e,e.uniformTaken?'Mon uniforme ?! Qui m\'a pris mon uniforme ?!':'Aïe. Ma tête. Je ne dormais pas, je méditais.',3.2);toast(e.name+' se réveille','w');snd(260,.15,'triangle',.05)}
