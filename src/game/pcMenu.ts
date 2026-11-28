import { ST } from './store';
import { DOORS, getC, getE } from './state';
import { CAFE } from './levelData';
import { EVENTS } from './events';
import { $ } from './utils';
import { say, toast } from './messages';
import { startBusy } from './powers';
import { MEET_SAY, PRI, busyWith, goCoffee, smsServeur, spotNear } from './noise';
import { snd } from './sound';
import type { Enemy, Order, PcAction, PcMenu } from './types';
import type { Character } from './types';
/* menu de piratage d'un PC : Nadia choisit l'action */
export let pcm: PcMenu | null=null;
/** Instant d'ouverture du menu : un appui tactile qui l'a ouvert ne doit pas valider le premier bouton (clic fantôme). */
let pcOpenedAt=0;
export const MEET=[null,{x:20.5,y:10.5},null];
export const PRN=[{x:14.5,y:2.5},{x:14.5,y:2.5},{x:12.5,y:2.5}];
export const PRN_SAY=['Qui imprime 400 pages à cette heure-ci ?','Encore bloquée, comme tous les vendredis.','C\'est mon CV, ne regardez pas.','Une imprimante qui marche. Il y a forcément un piège.'];
export const PCACT=[
 {k:'door',i:'🚪',n:'Ouvrir la porte',s:'Déverrouille les portes proches (restent ouvertes)',t:5},
 {k:'notif',i:'📩',n:'Envoyer une notification',s:'Managers et techniciens filent en salle serveur (45 s)',t:5},
 {k:'cafe',i:'☕',n:'Rendez-vous pause café',s:'Manager et support à la cafétéria (45 s)',t:5},
 {k:'reu',i:'📅',n:'Réunion urgente',s:'Manager et support en salle de réunion (45 s)',t:5},
 {k:'cam',i:'📷',n:'Éteindre les caméras',s:'Caméras de l\'étage coupées 40 s',t:6},
 {k:'print',i:'🖨️',n:'Imprimer à distance',s:'Tout le personnel vient voir l\'imprimante (20 s)',t:4},
 {k:'eval',i:'🗂️',n:'Entretien d\'évaluation',s:'Mme Lambert est convoquée au fond de l\'étage (25 s)',t:5},
 {k:'copies',i:'📠',n:'Le DG veut 12 copies',s:'Brigitte quitte son poste pour l\'imprimante (25 s)',t:5},
 {k:'meeting',i:'📆',n:'Avancer la réunion du comité',s:'Le DG quitte son bureau tout de suite',t:6},
 {k:'lights',i:'💡',n:'Éteindre la lumière',s:'Étage dans le noir 60 s : on ne voit qu\'à 2,6 cases, quelqu\'un ira rallumer',t:5}];
export const SWITCH=[{x:16.5,y:10.5},{x:19.5,y:11.5},{x:8.5,y:7.5}];
export function pcExtras(name: string){const E: PcAction[]=[];
  if(name==='serveur'){if(!ST.S.team.code)E.push({k:'code',i:'🔐',n:'Pirater le code du coffre',s:ST.S.team.codeInfo?'Djibril a localisé le code : piratage rapide':'Indispensable pour ouvrir le coffre du DG',t:ST.S.team.codeInfo?6:10});E.push({k:'cams2',i:'📷',n:'Couper les caméras de l\'étage 2',s:'70 s, vue sur le bureau du DG',t:6})}
  if(name==='accueil')E.push({k:'portillon',i:'🚧',n:'Ouvrir le portillon bleu',s:'Le portillon de l\'accueil reste ouvert 45 s',t:4});
  return E}
export function pcAvail(a: { k: string; i: string; n: string; s: string; t: number; },f: number,px: number,py: number){if(a.k==='door')return f>=1&&DOORS.some(d=>d.f===f&&d.l<=2&&Math.hypot(d.x-px,d.y-py)<12);if(a.k==='notif')return f===1;if(a.k==='eval'||a.k==='copies')return f===2;if(a.k==='meeting')return f===2&&!ST.S.ev[320];if(a.k==='cam')return ST.S.enemies.some(e=>e.type==='camera'&&e.f===f);if(a.k==='cafe')return !!CAFE[f];if(a.k==='reu')return !!MEET[f];if(a.k==='print')return !!PRN[f];return true}
export function pcOpen(c: Character,o: Order,name: string){pcm={f:o.f!,x:o.x!,y:o.y!,extra:pcExtras(name)};pcOpenedAt=performance.now();pcRender();ST.paused=true}
export function pcClose(){pcm=null;$('pcm').classList.remove('show');ST.paused=false}
export function pcRender(){const b=$('pcm');b.innerHTML='<h4>Poste piraté : que faire ? <small style="font-weight:400;color:#8a93b8">(temps en pause)</small><span id="pcx">✕</span></h4>';
  pcm!.extra.concat(PCACT.filter((a: PcAction)=>pcAvail(a,pcm!.f,pcm!.x,pcm!.y))).forEach((a: PcAction)=>{const bt=document.createElement('button');bt.className='pa';bt.innerHTML='<i>'+a.i+'</i><div>'+a.n+' <small>'+a.s+' · '+a.t+' s</small></div>';bt.onclick=()=>{if(performance.now()-pcOpenedAt<500)return;pcChoose(a.k)};b.appendChild(bt)});
  $('pcx').onclick=pcClose;b.classList.add('show')}
export function pcChoose(k: string){const c=getC('nadege');if(!pcm||c.out)return;const a=pcm!.extra.concat(PCACT).find((q: PcAction)=>q.k===k);if(!a)return;
  if((Number(ST.S.flags['pc_'+k])||0)>ST.S.t){toast('Déjà fait il y a peu, attendez un peu','w');return}
  pcClose();if(k==='code'){startBusy(c,'hack',a.t,{what:'code',f:c.f});return}if(k==='cams2'){startBusy(c,'hack',a.t,{what:'cams',f:c.f});return}if(k==='portillon'){startBusy(c,'hack',a.t,{what:'accueil',f:c.f});return}startBusy(c,'hack',a.t,{what:'pcact',act:k,f:c.f})}
export function lightsTick(){const L=ST.S.team.lightsOff;if(!L)return;for(const k of Object.keys(L)){const f=Number(k);if(!L[f])continue;const id=(ST.S.team.lightsWho||{})[f]||'';const e=id?ST.S.enemies.find(q=>q.id===id):undefined;
  const done=L[f]<=ST.S.t||(e&&e.state==='coffee'&&e.cof&&e.cof.arrived);if(done&&L[f]>ST.S.t){L[f]=0;toast('La lumière revient','g');if(e)say(e,'Voilà, un disjoncteur de remis.',2.4)}else if(done)L[f]=0}}
export function pcTick(){lightsTick();if(!pcm)return;const c=getC('nadege');if(c.out)pcClose()}
export function sendTo(e: Enemy,pt: { x: number; y: number },dur: number,lines: string[],hello: string,n: number,pri: number=PRI.reu){if(busyWith(e,pri))return false;e.pri=pri;const p=spotNear(e.f,pt.x,pt.y,n);e.state='coffee';e.cof={x:p[0],y:p[1],t:0,arrived:false,dur,sy:0,lines};e.path=[];e.look=null;e.cln=null;e.wait=0;e.talk=0;say(e,hello,3.4);return true}
export function pcEffect(k: string,c: Character){const f=c.f;ST.S.flags['pc_'+k]=ST.S.t+45;let n=0;
  const staff=ST.S.enemies.filter(e=>e.f===f&&!e.ko&&e.state!=='chase'&&(e.type==='manager'||e.tech));
  if(k==='door'){for(const d of DOORS){if(d.f===f&&d.l<=2&&Math.hypot(d.x-c.x,d.y-c.y)<12){ST.S.doorHack[f+','+d.x+','+d.y]=ST.S.t+30;n++}}
    toast(n?n+' porte'+(n>1?'s':'')+' déverrouillée'+(n>1?'s':'')+', elle'+(n>1?'s restent':' reste')+' ouverte'+(n>1?'s':''):'Aucune porte à portée','g');say(c,'Porte ouverte. Ticket clôturé.',2.2)}
  else if(k==='notif'){if(f!==1){toast('Pas de salle serveur à cet étage','w');return}smsServeur();say(c,'Notification envoyée. Signé : la DSI.',2.6)}
  else if(k==='cafe'){if(!CAFE[f]){toast('Pas de cafétéria à cet étage','w');return}staff.forEach(e=>{if(goCoffee(e,45))n++});toast(n?n+' personne'+(n>1?'s':'')+' invitée'+(n>1?'s':'')+' à la pause café':'Personne à inviter','g');say(c,'Invitation : « Café offert, présence obligatoire ».',2.6)}
  else if(k==='reu'){if(!MEET[f]){toast('Pas de salle de réunion à cet étage','w');return}staff.forEach((e,i)=>{if(sendTo(e,MEET[f]!,45,MEET_SAY,'Réunion urgente ? À cette heure-ci ?',i,PRI.reu))n++});toast(n?n+' personne'+(n>1?'s':'')+' filent en réunion (45 s)':'Personne à convoquer','g');say(c,'Réunion : ordre du jour, « point sur le point ».',2.6)}
  else if(k==='eval'){const e=getE('drh');if(e.ko||e.state==='chase'){toast('Mme Lambert est indisponible','w');return}sendTo(e,{x:12.5,y:11.5},25,['Tiens, un entretien ? Je ne l\'avais pas prévu.','Évaluation à 360 degrés, sans angle mort.'],'Un entretien ? À cette heure-ci ?',0);toast('Mme Lambert file en entretien d\'évaluation (25 s)','g');say(c,'Invitation : « Entretien annuel, durée indéterminée ».',2.6)}
  else if(k==='copies'){const e=getE('brigitte');if(e.ko||e.state==='chase'){toast('Brigitte est indisponible','w');return}sendTo(e,PRN[2],25,PRN_SAY,'Le DG veut douze copies. Pour hier.',0);toast('Brigitte part à l\'imprimante (25 s)','g');say(c,'Demande du DG : « 12 copies, recto verso, couleur ».',2.6)}
  else if(k==='meeting'){if(ST.S.ev[320]){toast('Le DG est déjà parti','w');return}const e=getE('dg');if(e.ko){toast('Le DG est hors service','w');return}ST.S.ev[320]=1;EVENTS[0].fn();say(c,'Agenda modifié : « Comité stratégique, tout de suite ».',2.8)}
  else if(k==='lights'){ST.S.team.lightsOff=ST.S.team.lightsOff||{};ST.S.team.lightsOff[f]=ST.S.t+60;ST.S.flags['pc_lights']=ST.S.t+80;
    let best: Enemy|undefined,bd=1e9;for(const e of ST.S.enemies){if(e.f!==f||e.ko||e.type==='camera'||e.state==='chase'||e.state==='break'||e.type==='dg'||e.type==='drh')continue;const d=Math.hypot(e.x-c.x,e.y-c.y);if(d<bd){bd=d;best=e}}
    if(best){ST.S.team.lightsWho=ST.S.team.lightsWho||{};ST.S.team.lightsWho[f]=best.id;sendTo(best,SWITCH[f],4,['Disjoncteur...','Encore une coupure.'],'Qui a coupé la lumière ?!',0,PRI.lumiere)}
    toast('Lumière coupée 60 s : un employé va la rallumer','g');say(c,'Disjoncteur. Pas de panique, c\'est volontaire.',2.4)}
  else if(k==='cam'){ST.S.team.camsOff=ST.S.team.camsOff||{};ST.S.team.camsOff[f]=ST.S.t+40;toast('Caméras de l\'étage coupées 40 s','g');say(c,'Écran noir. Les caméras font la sieste.',2.4)}
  else if(k==='print'){const p=PRN[f];ST.S.enemies.forEach((e,i)=>{if(e.f!==f||e.ko||e.type==='camera'||e.state==='chase'||e.state==='break')return;if(sendTo(e,p,20,PRN_SAY,'L\'imprimante sonne !',n,PRI.print))n++});toast(n?'L\'imprimante hurle : '+n+' personne'+(n>1?'s':'')+' accourent (20 s)':'Personne à l\'étage','g');say(c,'Impression de 400 pages en recto simple.',2.6);snd(180,.6,'sawtooth',.06,40)}
  snd(600,.2,'triangle',.05)}
