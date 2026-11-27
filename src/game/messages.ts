import { ST } from './store';
import { $ } from './utils';
import { snd } from './sound';
import { TL } from './state';
/* messages */
export function toast(t,cls=''){const d=document.createElement('div');d.className='t '+cls;d.textContent=t;$('toast').appendChild(d);while($('toast').children.length>3)$('toast').firstChild.remove();setTimeout(()=>d.remove(),4200)}
export function say(e,t,d=2.4){e.say=t;e.sayT=d}
export function fail(title,text){if(ST.S.over)return;ST.S.over='fail';snd(160,.7,'sawtooth',.07,-90);$('eT').textContent=title;$('eP').textContent=text;$('bRetry').style.display=ST.lastSave?'':'none';$('end').classList.add('show')}
export function win(){if(ST.S.over)return;ST.S.over='win';snd(660,.15,'triangle',.07);setTimeout(()=>snd(880,.3,'triangle',.07),150);
  const left=Math.max(0,Math.round(TL-ST.S.t));$('eT').textContent='Dehors, tous les quatre !';
  $('eP').textContent="Ils sortent par l'ascenseur de service avec la clé du DG, "+Math.floor(left/(TL/15))+" min "+(left%(TL/15)?Math.round((left%(TL/15))/(TL/15)*60):0)+" s avant la réunion de 18h. Le plan social va devoir négocier, ce qui sera une première pour la direction. "+(ST.S.age===7?'Kévin, 7 ans (si on l\'en croit), a tenu la porte.':ST.S.age===77?'Kévin, 77 ans, a tenu la porte et pris sa retraite dans la foulée.':'Quant à l\'âge de Kévin, le mystère reste entier.');
  $('bRetry').style.display='none';$('end').classList.add('show')}
