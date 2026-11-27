import { ST } from './store';
import { say, toast } from './messages';
import { findPath, los, passable } from './pathing';
import { ACT } from './castData';
import { getE } from './state';
import { snd } from './sound';
import { spotNear } from './noise';
import { releaseTalk } from './updateChars';
import { angDiff } from './utils';
import { SMK, VENTS } from './levelData';
import type { ActionArg, Busy, Character, Enemy, Order } from './types';
/* ordres */
export function gotoPos(c: Character,x: number,y: number,order?: Order){
  if(c.smoke){c.smoke=false;say(c,'*écrase sa clope*',2)}
  if(c.busy&&c.busy.lock){toast(c.name+' est occupé','w');return false}
  const p=findPath(c.f,Math.floor(c.x),Math.floor(c.y),Math.floor(x),Math.floor(y));
  if(!p){say(c,"Impossible d'y aller",1.8);return false}
  c.busy=null;c.path=p;c.order=order||null;c.stall=0;return true}
export function startBusy(c: Character,k: string,max: number,extra?: Partial<Busy>){c.busy=Object.assign({k,t:0,max,lock:true},extra||{});c.path=[];c.order=null}
export function nearestEnemy(c: Character,pred: (e: Enemy)=>boolean,maxd=99){let b=null,bd=maxd;for(const e of ST.S.enemies){if(e.f!==c.f||!pred(e))continue;const d=Math.hypot(e.x-c.x,e.y-c.y);if(d<bd){bd=d;b=e}}return b}

export function doAction(c: Character,k: string,arg: ActionArg={x:0,y:0}){
  if(ST.S.over||ST.paused&&!ST.S.over&&false)return;
  const slot=['q','e','w','x'][Math.max(0,ACT[c.id].findIndex(a=>a.k===k))];
  if((c.cd as Record<string,number|undefined>)[slot]!>0&&k!=='flux'){toast('Pas encore prêt','w');return}
  if(k==='ko'){const e=arg&&getE(arg.eid);if(!e||e.ko||e.type==='camera'||e.f!==c.f){toast('Touchez un garde à assommer','w');return}
    if(gotoPos(c,e.x,e.y,{k:'ko',eid:e.id}))snd(300,.05,'square',.03)}
  else if(k==='empty'){const B=ST.S.enemies.filter(q=>q.cart);if(!B.length){toast('Le chariot est vide','w');return}
    B.forEach((q,i)=>{const p=spotNear(c.f,c.x+(i?.9:-.9),c.y+(i?.5:-.5),0);q.f=c.f;q.x=p[0];q.y=p[1];q.hidden=false;q.cart=false;q.koT=0;q.koDur=50;q.state='ko'});say(c,'Je vide le chariot. Ne me remerciez pas.',2.4);toast(B.length+' corps déposé'+(B.length>1?'s':'')+' : ils se réveilleront','w');snd(200,.2,'sine',.05)}
  else if(k==='puddle'){if(!passable(c.f,Math.floor(arg.x),Math.floor(arg.y))){toast('Il faut un sol libre','w');return}
    if(gotoPos(c,Math.floor(arg.x)+.5,Math.floor(arg.y)+.5,{k:'puddle',x:Math.floor(arg.x)+.5,y:Math.floor(arg.y)+.5}))toast('Max va poser une flaque','g')}
  else if(k==='hide'){if(ST.S.enemies.filter(e=>e.cart).length>=2){toast('Chariot plein : 2 corps maximum','w');return}const e=nearestEnemy(c,(e: Enemy)=>e.ko&&!e.hidden&&e.type!=='dg');if(!e){toast(ST.S.enemies.some(q=>q.ko&&!q.hidden&&q.type==='dg'&&q.f===c.f)?'Le DG ne tient pas dans le seau':'Aucun corps à planquer ici','w');return}
    gotoPos(c,e.x,e.y,{k:'hide',eid:e.id})}
  else if(k==='uniform'&&c.disguise){c.disguise=null;say(c,'Je range le costume. La cravate reste.',2.2);toast('Djibril retire son déguisement','g')}
  else if(k==='uniform'){const e=nearestEnemy(c,(e: Enemy)=>e.ko&&!e.uniformTaken&&(e.type==='vigile'||e.type==='beaugosse'||e.type==='manager'));
    if(!e){const o=ST.S.enemies.find(q=>q.ko&&!q.uniformTaken&&(q.type==='vigile'||q.type==='beaugosse'||q.type==='manager'));toast(o?'Le corps est à l\'étage '+['RDC','1','2'][o.f]+' : rejoignez-le':"Il faut un vigile, un agent de sécurité ou un manager assommé (dont la tenue n'a pas déjà été prise)",'w');return}
    gotoPos(c,e.x,e.y,{k:'uniform',eid:e.id})}
  else if(k==='talk'){if(c.talking){releaseTalk(c);return}
    const e=arg&&getE(arg.eid);if(!e||e.ko||e.f!==c.f||e.type==='camera'){toast('Touchez un PNJ à baratiner','w');return}
    if(e.type==='drh'||e.type==='dg'){say(c,"Lui, je n'y arrive pas.",2);toast(e.name+' ne se laisse pas baratiner','w');return}
    if(e.state==='chase'){toast(e.name+' est déjà lancé à votre poursuite','w');return}
    const d=Math.hypot(e.x-c.x,e.y-c.y),vis=los(c.f,c.x,c.y,e.x,e.y);
    if(c.disguise){if(d>11||!vis){toast("Il faut que le PNJ soit en vue (11 cases max)","w");return}}
    else{if(d>5.5||!vis){toast("Sans déguisement, approchez-vous : 5 cases, en vue","w");return}
      if(Math.abs(angDiff(Math.atan2(c.y-e.y,c.x-e.x),e.face))>1.45){toast("Sans déguisement, il faut être face à lui","w");return}}
    c.path=[];c.order=null;c.talking=e.id;c.chatN=0;c.chatT=.4;e.path=[];e.look=null;e.det=0;
    if(c.disguise&&d>2.2){e.state='call';e.callTo=c.id;e.talk=0;say(e,'Oui ? On m\'appelle ?',2.4);say(c,'Hep ! Venez voir, j\'ai une opportunité pour vous.',2.6)}
    else{e.talk=1e9;e.talkTo=c.id;e.state='patrol';say(e,'Ah ? Oui, je vous écoute.',3)}
    c.cd.e=1;startBusy(c,'talk',.8);snd(520,.1,'triangle',.05)}
  else if(k==='hack'){if(!arg){toast('Touchez un terminal ou une porte bleue','w');return}
    const kind=arg.kind;let tx=arg.x+.5,ty=arg.y+.5;gotoPos(c,tx,ty,{k:'hack',f:c.f,x:arg.x,y:arg.y,kind})}
  else if(k==='clope'){const e=arg&&getE(arg.eid);
    if(!e||e.ko||e.f!==c.f||(e.type!=='vigile'&&e.type!=='beaugosse')){toast('Touchez un vigile ou un agent de sécurité','w');return}
    if(!SMK[c.f]){toast('Pas de fumoir à cet étage','w');return}
    if(e.state==='chase'){toast(e.name+' est déjà à vos trousses','w');return}
    const d=Math.hypot(e.x-c.x,e.y-c.y);if(d>9.5){toast('Trop loin (9 cases max)','w');return}
    c.cd.e=40;c.path=[];c.order=null;c.smoke=false;
    ST.PR.push({f:c.f,x0:c.x,y0:c.y,x1:e.x,y1:e.y,t:0,dur:Math.min(1.2,.5+d*.04),kind:'clope',eid:e.id});say(c,['Une clope, '+e.name+' ? Offerte par la maison.','Hep, '+e.name+', pause réglementaire !','Vous fumez ? Moi non, je distribue.'][Math.floor(Math.random()*3)],2.6);snd(520,.1,'triangle',.04)}
  else if(k==='flux'){if(c.cd.e>0){toast('Flux en recharge','w');return}ST.S.team.fluxUntil=ST.S.t+12;c.cd.e=26;say(c,'Je vois tout. Et ils ne font rien.',2.2);toast('Flux caméras : tous les gardes visibles 12 s','g');snd(900,.2,'sine',.05)}
  else if(k==='vent'){const v=VENTS.filter(v=>v.f===c.f).sort((a,b)=>Math.hypot(a.x-c.x,a.y-c.y)-Math.hypot(b.x-c.x,b.y-c.y))[0];
    if(!v){toast('Aucune gaine à cet étage','w');return}gotoPos(c,v.x+.5,v.y+.5,{k:'vent',vx:v.x,vy:v.y})}
  else if(k==='throw'){if(!arg){toast('Touchez le point à viser','w');return}
    if(ST.S.team.throws<=0){toast("Plus rien à lancer",'w');return}
    const d=Math.hypot(arg.x-c.x,arg.y-c.y);if(d>9.5){toast('Trop loin (9 cases max)','w');return}
    if(!passable(c.f,Math.floor(arg.x),Math.floor(arg.y))){toast('Visez le sol','w');return}
    ST.S.team.throws--;c.cd.q=2;c.path=[];c.order=null;ST.PR.push({f:c.f,x0:c.x,y0:c.y,x1:arg.x,y1:arg.y,t:0,dur:.55+d*.03});say(c,['Oups. Sans conséquence, comme mes stages.','Tiens, un gobelet. Recyclé, lui.','Ça glisse, comme les promesses de la direction.'][Math.floor(Math.random()*3)],1.5);snd(700,.08,'triangle',.04)}
}
