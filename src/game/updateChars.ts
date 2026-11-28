import { ST } from './store';
import { $, rnd } from './utils';
import { DOORS, KEYS, TERMS, cam, getE } from './state';
import { say, toast } from './messages';
import { BAR, BAR_CAT, BAR_R, BAR_R_CAT, PC_SAY, TALK, TALK_R } from './texts';
import { nearestEnemy, startBusy } from './powers';
import { findPath, los, passable } from './pathing';
import { STAIRS, VENTS, ch, isDoor, isPC } from './levelData';
import { hear, smsServeur } from './noise';
import { stepEntity } from './movement';
import { snd } from './sound';
import { pcEffect, pcOpen } from './pcMenu';
import { SWITCH, toggleLights } from './pcMenu';
import type { Character, Enemy, Order } from './types';
/* mise à jour persos */
export function feed(who: string,txt: string,me: boolean){const f=$('bfeed');if(!f)return;const d=document.createElement('div');d.className=me?'':'n';d.innerHTML='<b>'+who+'</b> '+txt;f.appendChild(d);while(f.children.length>3)f.removeChild(f.firstChild!)}
export function releaseTalk(c: Character){const e=getE(c.talking);c.talking=null;if(e&&!e.ko){e.talk=Math.min(e.talk,2.6);if(e.state==='call'){e.state='patrol';e.path=[]}else say(e,'Bon, je dois y aller, j\'ai un ticket.',2.6)}
  feed('Djibril','*file avant qu\'on lui pose une question*',true);setTimeout(()=>{if(!ST.S.chars.some(q=>q.talking)){const f=$('bfeed');if(f)f.innerHTML=''}},4500)}
export function updateChar(c: Character,dt: number){
  if(c.out)return;
  if(!c.joined){if(c.sayT>0)c.sayT-=dt;return}
  if(c.moving||c.busy||c.talking||c.order||c.path.length||c.smoke)c.idleT=0;else c.idleT=(c.idleT||0)+dt;
  if(c.id==='jordan'&&(c.idleT||0)>2){/* Max nettoie autour de lui (rayon 1 case) quand il ne fait rien */
    const P=ST.S.puddles;for(let i=P.length-1;i>=0;i--)if(P[i].f===c.f&&Math.hypot(P[i].x-c.x,P[i].y-c.y)<1.3){P.splice(i,1);say(c,'Un coup de balai, ça ne mange pas de pain.',2.4);break}
    if(Math.random()<dt*3)ST.P.push({f:c.f,x:c.x+rnd(-.9,.9),y:c.y+rnd(-.9,.9),z:1,vx:0,vy:0,vz:rnd(2,5),life:.5,col:'#cfe8ff',sz:2})}
  if(c.sayT>0)c.sayT-=dt;c.cd.q=Math.max(0,c.cd.q-dt);c.cd.e=Math.max(0,c.cd.e-dt);c.cd.w=Math.max(0,(c.cd.w||0)-dt);
  if(c.runOnce&&!c.path.length&&!c.order&&!c.busy){c.run=false;c.runOnce=false}
  if(c.disguise&&c.run&&c.moving&&!(c.order&&c.order.k==='chat2')){c.disguise=null;toast('Djibril a couru : son déguisement est fichu','r');say(c,'Zut, la cravate.',2)}
  if(c.busy){updateBusy(c,dt);return}
  if(c.talking){const e=getE(c.talking);
    if(!e||e.ko||e.f!==c.f||c.path.length||c.order||ST.S.over){releaseTalk(c)}
    else{c.moving=false;if(e.talk>1e8){c.chatT-=dt;if(c.chatT<=0){c.chatT=3.6;c.chatN++;
        if(e.id==='brigitte'&&c.chatN>=3&&!ST.S.team.dgInfo){ST.S.team.dgInfo=true;say(e,'Le DG sort vers 18h pour sa visite hebdo, toujours seul, par le couloir est.',4.4);feed(e.name,'Le DG quitte son bureau seul à 18h pour sa visite hebdomadaire.',false);toast('Indice 2 : le DG sort seul pour sa visite hebdo','g')}
        if(e.id==='manon'&&c.chatN>=3&&!ST.S.team.codeInfo){ST.S.team.codeInfo=true;say(e,'Le code du coffre ? Demandez aux informaticiens : tout est sur le serveur, salle serveur, au nord-ouest.',4.4);feed(e.name,'Le code du coffre est sur le serveur, en salle serveur (nord-ouest).',false);toast('Information obtenue : le code est sur le serveur de la salle serveur. Nadia le pirate plus vite (6 s).','g')}
        const cat=e.tech?'tech':e.type;
        if(c.chatN%2){const B=BAR_CAT[cat]||BAR,L=B[Math.floor(Math.random()*B.length)];say(c,L,3.4);feed('Djibril',L,true)}
        else{const R=BAR_R_CAT[cat]||BAR_R,L=R[Math.floor(Math.random()*R.length)];say(e,L,3.2);feed(e.name,L,false)}}}return}}
  const o=c.order;
  if(o&&o.k==='chat2'){const e=getE(o.eid);
    if(!e||e.f!==c.f||e.ko||e.state==='chase'){c.order=null;c.path=[];c.run=false;c.runOnce=false;if(e&&e.talk>1e8)e.talk=0}
    else if(Math.hypot(e.x-c.x,e.y-c.y)<1.9){c.path=[];c.order=null;c.run=false;c.runOnce=false;c.talking=e.id;c.chatN=0;c.chatT=.4;c.face=Math.atan2(e.y-c.y,e.x-c.x);e.face=Math.atan2(c.y-e.y,c.x-e.x);e.talk=1e9;e.talkTo=c.id;startBusy(c,'talk',.8)}
    else{c.repath-=dt;if(c.repath<=0||!c.path.length){c.repath=.35;const p=findPath(c.f,Math.floor(c.x),Math.floor(c.y),Math.floor(e.x),Math.floor(e.y));if(p)c.path=p}}}
  if(o&&o.k==='chat'){const e=getE(o.eid);if(!e||e.f!==c.f||e.ko){c.order=null;c.path=[]}else if(Math.hypot(e.x-c.x,e.y-c.y)<1.9){c.path=[];c.order=null;c.face=Math.atan2(e.y-c.y,e.x-c.x);const n=(e.chatN=(e.chatN||0)+1)-1,L=TALK[e.id]||['Bonjour.'],R=TALK_R[c.id]||['Bonjour.'];say(c,R[n%R.length],2.6);say(e,L[n%L.length],4)}}
  if(o&&(o.k==='ko'||o.k==='hide'||o.k==='uniform')){
    const e=getE(o.eid);
    if(!e||e.f!==c.f||(o.k==='ko'&&e.ko)||(o.k!=='ko'&&(!e.ko||(o.k==='hide'&&e.hidden)||(o.k==='uniform'&&e.uniformTaken)))){c.order=null;c.path=[]}
    else{const d=Math.hypot(e.x-c.x,e.y-c.y);
      if(d<1.25){c.path=[];if(o.k==='ko'){c.face=Math.atan2(e.y-c.y,e.x-c.x);e.freeze=1;startBusy(c,'ko',.7,{eid:e.id})}
        else if(o.k==='hide')startBusy(c,'hide',1.6,{eid:e.id});
        else startBusy(c,'uniform',2.2,{eid:e.id});return}
      c.repath-=dt;if(c.repath<=0||!c.path.length){c.repath=.35;const p=findPath(c.f,Math.floor(c.x),Math.floor(c.y),Math.floor(e.x),Math.floor(e.y));if(p)c.path=p}}}
  if(o&&o.k==='hack'&&(o.kind==='door'&&Math.hypot(c.x-o.x!-.5,c.y-o.y!-.5)<=3.3)){c.path=[];arrive(c,o);if(c.busy)return}
  if(c.id==='jordan'&&c.moving&&!c.busy){
    for(let y=Math.floor(c.y)-1;y<=Math.floor(c.y)+1;y++)for(let x=Math.floor(c.x)-1;x<=Math.floor(c.x)+1;x++){
      const t=ch(c.f,x,y);if(t!=='m'&&t!=='b')continue;const k=c.f+','+x+','+y;
      if(Math.hypot(c.x-x-.5,c.y-y-.5)<1.45&&(ST.S.distCd[k]||0)<ST.S.t){ST.S.distCd[k]=ST.S.t+30;
        {const sp=c.path,so=c.order;startBusy(c,'dist',3);c.busy!.sp=sp;c.busy!.so=so}say(c,t==='m'?'Oh, un café. Juste un. Ou dix.':'Un canapé. Deux minutes. Réveillez-moi à la retraite.',3);return}}}
  if(c.id===ST.S.sel&&KEYS.size&&!ST.S.over){
    const vx=(KEYS.has('arrowdown')?1:0)+(KEYS.has('arrowright')?1:0)-(KEYS.has('arrowup')?1:0)-(KEYS.has('arrowleft')?1:0);
    const vy=(KEYS.has('arrowdown')?1:0)+(KEYS.has('arrowleft')?1:0)-(KEYS.has('arrowup')?1:0)-(KEYS.has('arrowright')?1:0);
    const n=Math.hypot(vx,vy);
    if(n>0){c.path=[];c.order=null;if(c.smoke){c.smoke=false}cam.free=false;ST.view=c.f;
      const sp=c.sp*(c.run?1.75:1)*dt,dx=vx/n*sp,dy=vy/n*sp;
      const ok=(x: number,y: number)=>{const i=Math.floor(x),j=Math.floor(y);if(!passable(c.f,i,j))return false;const t=ch(c.f,i,j);
        if(isDoor(t)&&!ST.S.dOpen[c.f+','+i+','+j]&&!(Math.floor(c.x)===i&&Math.floor(c.y)===j))return false;return true};
      let m=false;if(ok(c.x+dx,c.y+dy)){c.x+=dx;c.y+=dy;m=true}else{if(ok(c.x+dx,c.y)){c.x+=dx;m=true}if(ok(c.x,c.y+dy)){c.y+=dy;m=true}}
      c.moving=m;c.face=Math.atan2(dy,dx);
      if(c.run&&m){c.runN-=dt;if(c.runN<=0){c.runN=.5;hear(c.f,c.x,c.y,4)}}
      const s=STAIRS.find(s=>s.f===c.f&&Math.hypot(c.x-s.x-.5,c.y-s.y-.5)<1.1);if(s&&m){transit(c,s.to);return}
      return}}
  const sp=c.sp*(c.run?1.75:1);stepEntity(c,dt,sp,true);
  if(c.run&&c.moving){c.runN-=dt;if(c.runN<=0){c.runN=.5;hear(c.f,c.x,c.y,4)}}
  if(c.moving&&!c.hide&&Math.random()<dt*2.2&&c.id!=='kevin')ST.P.push({f:c.f,x:c.x,y:c.y,z:1,vx:0,vy:0,vz:6,life:.4,col:'rgba(255,255,255,.25)',sz:1.5});
  if(!c.path.length&&c.order)arrive(c,c.order);
}
export function arrive(c: Character,o: Order){
  const kind=o.k;
  if(kind==='puddle'){c.order=null;if((c.cd.w||0)>0){toast('Pas encore prêt','w');return}c.cd.w=20;ST.S.puddles.push({f:c.f,x:o.x!,y:o.y!,t:0});
    say(c,['Attention, sol glissant. Panneau non fourni.','Je viens de passer la serpillère. Oups, trop mouillé.','Sécurité du travail : zéro.'][Math.floor(Math.random()*3)],2.8);snd(240,.18,'sine',.05,-90);
    for(let i=0;i<10;i++)ST.P.push({f:c.f,x:o.x!,y:o.y!,z:2,vx:rnd(-1.5,1.5),vy:rnd(-1.5,1.5),vz:rnd(5,14),life:.6,col:'#8fd3ff',sz:2});return}
  if(kind==='switch'){c.order=null;if(Math.hypot(c.x-SWITCH[c.f].x,c.y-SWITCH[c.f].y)<1.8)toggleLights(c.f,c);return}
  if(kind==='stairs'){const s=STAIRS.find(s=>s.f===c.f&&s.x===o.sx&&s.y===o.sy);c.order=null;if(!s)return;transit(c,s.to)}
  else if(kind==='vent'){c.order=null;if(Math.hypot(c.x-o.vx!-.5,c.y-o.vy!-.5)>.8)return;
    if(c.id!=='kevin'){say(c,"C'est trop étroit pour moi.",2);return}
    startBusy(c,'vent',2.6,{vx:o.vx!,vy:o.vy!});c.hide=true;snd(220,.4,'sine',.05,-60)}
  else if(kind==='safe'){c.order=null;if(ST.S.team.key){say(c,'Déjà vidé.',1.5);return}
    if(!ST.S.team.code){say(c,'Verrouillé. Il faut le code.',2.4);toast('Le coffre demande un code : Nadia peut le trouver sur le serveur (étage 1)','w');return}
    startBusy(c,'safe',2.6)}
  else if(kind==='hack'){c.order=null;
    const tx=o.x!+.5,ty=o.y!+.5,d=Math.hypot(c.x-tx,c.y-ty);
    if(c.id!=='nadege'){say(c,"Je n'y connais rien.",2);return}
    if(o.kind==='term'){const name=TERMS[o.f+','+o.x+','+o.y]!;if(d>2){say(c,'Je dois être devant le PC.',1.8);return}if(!name&&!isPC(o.f!,o.x!,o.y!)){say(c,"Rien à pirater ici.",1.6);return}
      pcOpen(c,o,name)}
    else{if(d>3.6){say(c,'Trop loin de la serrure.',1.6);return}const dd=DOORS.find(q=>q.f===o.f&&q.x===o.x&&q.y===o.y);
      if(!dd||dd.l>2){say(c,"Cette serrure résiste, pas de réseau.",2.2);return}startBusy(c,'hack',dd.l===2?8:4,{what:'door',f:o.f,x:o.x,y:o.y})}}
}
export function transit(c: Character,to: { f: number; x: number; y: number; }){c.f=to.f;c.x=to.x;c.y=to.y;c.path=[];c.order=null;c.stall=0;snd(330,.12,'triangle',.04);
  if(ST.S.sel===c.id){ST.view=to.f;cam.free=false}}
export function updateBusy(c: Character,dt: number){
  const b=c.busy!;let rate=1;
  if(b.k==='hack'){const sees=nearestEnemy(c,(e: Enemy)=>e.type==='beaugosse'&&!e.ko&&Math.hypot(e.x-c.x,e.y-c.y)<9&&los(c.f,c.x,c.y,e.x,e.y),99);
    if(sees){rate=.35;if(Math.random()<dt*.5)say(c,['Oh là là, regarde-moi ces épaules. Il fait de la muscu ou du management ?','Mmh. Il est là, lui. Le RH fait de la gonflette.','Concentre-toi, Nadia. Ce n\'est qu\'un polo moulant.'][Math.floor(Math.random()*3)],2.2)}
    b.slow=!!sees}
  b.t+=dt*rate;
  if(b.k==='hack'&&Math.random()<dt*8)ST.P.push({f:c.f,x:c.x,y:c.y,z:30,vx:rnd(-.6,.6),vy:rnd(-.6,.6),vz:rnd(8,22),life:.5,col:'#4ee3f0',sz:1.8});
  if(b.k==='dist'&&c.id==='jordan'){/* distrait, il scrolle */}
  if(b.t<b.max)return;
  c.busy=null;
  if(b.k==='dist'){c.path=b.sp||[];c.order=b.so||null;return}
  if(b.k==='ko'){const e=getE(b.eid);if(e&&!e.ko&&Math.hypot(e.x-c.x,e.y-c.y)<2.4){e.ko=true;e.koT=0;e.koDur=50;e.state='ko';e.path=[];e.det=0;e.talk=0;snd(110,.25,'sine',.08);
      for(let i=0;i<10;i++)ST.P.push({f:e.f,x:e.x,y:e.y,z:34,vx:rnd(-1.2,1.2),vy:rnd(-1.2,1.2),vz:rnd(10,30),life:.8,col:'#ffd54a',sz:2.4});say(c,'Dodo.',1.6);
      if(e.type==='dg'&&!ST.S.team.code){ST.S.team.code=true;ST.S.team.codeBy='max';toast('Max fouille le DG assommé et trouve le code du coffre : 6969','g');say(c,'Le post-it « code coffre » dans la poche. Classique.',3.2)}}}
  else if(b.k==='hide'){const e=getE(b.eid);if(e&&e.ko){e.hidden=true;e.cart=true;say(c,'Dans le chariot.',1.8);snd(180,.2,'sine',.05)}}
  else if(b.k==='uniform'){const e=getE(b.eid);if(e&&e.ko&&!e.uniformTaken){e.uniformTaken=true;c.disguise=e.type==='manager'?'manager':'vigile';say(c,e.type==='manager'?'Cadre dynamique, sans équipe ni budget.':'Vigile en CDI, le dernier du bâtiment.',2.4);
      toast('Djibril est déguisé en '+(e.type==='manager'?'manager (niveau 2)':'vigile (niveau 1)')+'. Il passe inaperçu au-delà de 2 cases seulement.','g');if(e.type==='manager')ST.S.flags.manager=true;snd(500,.12,'triangle',.05)}}
  else if(b.k==='hack'){
    if(b.what==='code'){ST.S.team.code=true;toast('Code du coffre récupéré : 6969. Original.','g');say(c,"6969. Ça ne s'invente pas.",3.2);snd(880,.15,'triangle',.06)}
    else if(b.what==='cams'){ST.S.team.camsUntil=ST.S.t+70;ST.S.flags.cams=true;toast("Caméras de l'étage 2 coupées 70 s",'g');say(c,'Redémarrage. Bonne nuit.',2.4);snd(600,.2,'triangle',.05)}
    else if(b.what==='sms'){smsServeur();say(c,'Message envoyé depuis la messagerie interne. Signé : la DSI.',3);snd(300,.25,'sawtooth',.05,-120)}
    else if(b.what==='pcact'){pcEffect(b.act!,c)}
    else if(b.what==='pc'){const L=PC_SAY;say(c,L[Math.floor(Math.random()*L.length)],3.4);snd(520,.1,'triangle',.04)}
    else if(b.what==='accueil'){ST.S.doorHack[b.f+',17,5']=ST.S.t+45;toast('Portillon de l\'accueil ouvert 45 s','g');snd(600,.2,'triangle',.05)}
    else if(b.what==='door'){ST.S.doorHack[b.f+','+b.x+','+b.y]=ST.S.t+30;toast('Porte ouverte 30 s','g');snd(600,.2,'triangle',.05)}}
  else if(b.k==='vent'){c.hide=false;const v=VENTS.find(v=>v.f===c.f&&v.x===b.vx&&v.y===b.vy);if(v){c.f=v.to.f;c.x=v.to.x+.5;c.y=v.to.y+.5;if(ST.S.sel==='kevin'){ST.view=c.f;cam.free=false}}snd(260,.3,'sine',.05,80)}
  else if(b.k==='safe'){ST.S.team.key=true;ST.S.flags.key=true;toast("Clé récupérée ! Dossier, photos : Vasseur va avoir chaud. Tous à l'ascenseur de service (RDC).",'g');say(c,(ST.S.age===7?"J'ai sept ans et je suis riche.":ST.S.age===77?'À mon âge, riche, enfin.':'On ne saura jamais mon âge, mais je suis riche.'),3.4);snd(784,.12,'triangle',.06);setTimeout(()=>snd(1046,.3,'triangle',.06),130)}
}
