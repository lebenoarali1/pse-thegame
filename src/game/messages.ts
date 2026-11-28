import { ST } from './store';
import { $ } from './utils';
import { snd } from './sound';
import { TL } from './state';
import { HINTS } from './texts';
import { hintSeen, markHint } from './persist';
import type { Character, Enemy } from './types';
/* messages */
export function toast(t: string,cls=''){const d=document.createElement('div');d.className='t '+cls;d.textContent=t;$('toast').appendChild(d);while($('toast').children.length>(cls==='h'?4:3))$('toast').firstChild?.remove();setTimeout(()=>d.remove(),cls==='h'?8000:4200)}
export function say(e: Character | Enemy,t: string,d=2.4){e.say=t;e.sayT=d}
/** Lieu lisible d'un incident, pour expliquer une défaite (E2-4). */
export function where(f: number,x: number,y: number){return (['au rez-de-chaussée','à l\'étage 1','à l\'étage 2'][f]||'dans l\'immeuble')+', '+(x<8?'côté ouest':x>16?'côté est':'au centre')+(y<5?', au nord':y>9?', au sud':'')}
/** Courte séquence et réplique de clôture selon l'issue (E7-4). */
const SCENES: Record<string,{s: string[];q: string}>={
  win:{s:['🛗','🏃','🚪','🎉'],q:'« Pour une fois, c\'est la direction qui va devoir se justifier. »'},
  corps:{s:['😴','👀','😱','🚨'],q:'« Il dort au bureau depuis des années, mais là, c\'est visible. »'},
  temps:{s:['⏰','🔔','🔒','📦'],q:'« Les cartons étaient déjà prêts. Ça aide. »'},
  equipe:{s:['💼','👋','🚪','📄'],q:'« Merci pour votre engagement. Voici votre solde de tout compte. »'},
  kevin:{s:['🧒','👀','❗','🚨'],q:'« Un stagiaire ? Ici ? À cette heure ? »'},
  defaut:{s:['👮','📣','🚨','📄'],q:'« Il y a un process pour être suspect, et vous ne l\'avez pas suivi. »'}};
function scene(k: string){const sc=SCENES[k]||SCENES.defaut;$('eS').innerHTML=sc.s.map((e,i)=>'<span style="animation-delay:'+(i*.35)+'s">'+e+'</span>').join('');$('eQ').textContent=sc.q}
export function fail(title: string,text: string){if(ST.S.over)return;ST.S.over='fail';scene(/Corps/.test(title)?'corps':/18h00/.test(title)?'temps':/Équipe/.test(title)?'equipe':/Kévin/.test(title)?'kevin':'defaut');snd(160,.7,'sawtooth',.07,-90);$('eT').textContent=title;$('eP').textContent=text;$('bRetry').style.display=ST.lastSave?'':'none';$('end').classList.add('show')}
export function win(){if(ST.S.over)return;ST.S.over='win';scene('win');snd(660,.15,'triangle',.07);setTimeout(()=>snd(880,.3,'triangle',.07),150);
  const left=Math.max(0,Math.round(TL-ST.S.t));$('eT').textContent='Dehors, tous les quatre !';
  $('eP').textContent="Ils sortent par l'ascenseur de service avec la clé du DG, "+Math.floor(left/(TL/15))+" min "+(left%(TL/15)?Math.round((left%(TL/15))/(TL/15)*60):0)+" s avant la réunion de 18h. Le plan social va devoir négocier, ce qui sera une première pour la direction. "+(ST.S.age===7?'Kévin, 7 ans (si on l\'en croit), a tenu la porte.':ST.S.age===77?'Kévin, 77 ans, a tenu la porte et pris sa retraite dans la foulée.':'Quant à l\'âge de Kévin, le mystère reste entier.');
  $('bRetry').style.display='none';$('end').classList.add('show')}

/** Affiche une astuce une seule fois (mémorisée dans le navigateur). */
export function hintOnce(id: string){
  const t=HINTS[id];if(!t||hintSeen(id))return;
  markHint(id);toast(t,'h');
}
