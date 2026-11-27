import { ST } from './store';
import { VH, VW, cv } from './renderLoop';
import { DOORS, KEYS, TERMS, cam, selC } from './state';
import { $, clamp, iso } from './utils';
import { buildActs, pressAct, selectChar, toggleRun } from './ui';
import { doAction, gotoPos } from './powers';
import { say, toast } from './messages';
import { ACT } from './castData';
import { enemyVisible } from './visibility';
import { ch, isPC } from './levelData';
import { passable } from './pathing';
import { advDlg } from './dialogues';
import { snd } from './sound';
import { startGame } from './video';
import { readSave, writeSave } from './persist';
/* saisie */
export function toWorld(px: number,py: number){const sx=(px-VW/2)/ST.zoom+cam.x,sy=(py-VH/2)/ST.zoom+cam.y;return {sx,sy,x:(sy/16+sx/32)/2,y:(sy/16-sx/32)/2}}
export function tapAt(px: number,py: number){
  if(!ST.started||ST.S.over||ST.dlg)return;
  const w=toWorld(px,py),sc=selC();
  /* personnage */
  let hit=null,hd=34;
  const test=(x: number,y: number)=>{const[fx,fy]=iso(x,y);const d=Math.hypot(w.sx-fx,w.sy-(fy-20));return d};
  if(!ST.pend)for(const c of ST.S.chars){if(c.f!==ST.view||c.hide)continue;const d=test(c.x,c.y);if(d<hd*Math.max(.7,1/ST.zoom*.7)){hd=d;hit=c}}
  if(hit&&hit.joined){selectChar(hit.id);return}
  if(hit&&!hit.joined&&!ST.pend){if(sc.f===ST.view&&gotoPos(sc,hit.x,hit.y))toast('Approchez-vous pour lui parler','w');return}
  const tx=Math.floor(w.x),ty=Math.floor(w.y);
  if(ST.pend){const a=ACT[sc.id].find(q=>q.k===ST.pend!.k)!;
    if(a.mode==='enemy'){let be=null,bd=1e9;for(const e of ST.S.enemies){if(e.f!==ST.view||e.ko||e.type==='camera'||!enemyVisible(e))continue;const[fx,fy]=iso(e.x,e.y),d=Math.hypot(w.sx-fx,w.sy-(fy-20));if(d<bd){bd=d;be=e}}
      if(!be||bd>=60){let wd=1.7;for(const e of ST.S.enemies){if(e.f!==ST.view||e.ko||e.type==='camera'||!enemyVisible(e))continue;const d=Math.hypot(w.x-e.x,w.y-e.y);if(d<wd){wd=d;be=e;bd=0}}}
      if(be&&bd<60){const k=ST.pend.k;ST.pend=null;$('ban').style.display='none';doAction(sc,k,{x:be.x,y:be.y,eid:be.id})}else toast('Touchez un garde visible','w')}
    else if(a.mode==='hack'){let best=null,bd=3;for(const k in TERMS){const[f,x,y]=k.split(',').map(Number);if(f!==ST.view)continue;const d=Math.hypot(w.x-x-.5,w.y-y-.5);if(d<bd){bd=d;best={kind:'term',x,y}}}
      for(let yy=Math.floor(w.y)-2;yy<=Math.floor(w.y)+2;yy++)for(let xx=Math.floor(w.x)-2;xx<=Math.floor(w.x)+2;xx++){if(!isPC(ST.view,xx,yy))continue;const d=Math.hypot(w.x-xx-.5,w.y-yy-.5);if(d<bd){bd=d;best={kind:'term',x:xx,y:yy}}}
      for(const d of DOORS)if(d.f===ST.view){const dd=Math.hypot(w.x-d.x-.5,w.y-d.y-.5);if(dd<bd){bd=dd;best={kind:'door',x:d.x,y:d.y}}}
      if(best){ST.pend=null;$('ban').style.display='none';doAction(sc,'hack',best)}else toast('Touchez un PC ou une porte bleue ou rouge','w')}
    else if(a.mode==='tile'){const k=ST.pend.k;if(k!=='puddle'&&Math.hypot(w.x-sc.x,w.y-sc.y)>9.5){toast('Trop loin (9 cases max)','w');return}ST.pend=null;$('ban').style.display='none';doAction(sc,k,{x:w.x,y:w.y})}
    return}
  if(sc.f!==ST.view){toast('Ce perso est à un autre étage : touchez son portrait','w');return}
  {let be=null,bd=34;for(const e of ST.S.enemies){if(!e.calm||e.ko||e.f!==ST.view)continue;const[fx,fy]=iso(e.x,e.y),d=Math.hypot(w.sx-fx,w.sy-(fy-20));if(d<bd){bd=d;be=e}}
    if(be){if(gotoPos(sc,be.x,be.y,{k:'chat',eid:be.id}))toast('Vous allez parler à '+be.name,'g');return}}
  const c=ch(ST.view,tx,ty);
  if(c==='U'||c==='N'){if(gotoPos(sc,tx+.5,ty+.5,{k:'stairs',sx:tx,sy:ty}))marker(tx,ty)}
  else if(c==='S'){if(gotoPos(sc,tx+.5,ty+.5,{k:'safe'}))marker(tx,ty)}
  else if(c==='V'){if(sc.id==='kevin'){if(gotoPos(sc,tx+.5,ty+.5,{k:'vent',vx:tx,vy:ty}))marker(tx,ty)}else{gotoPos(sc,tx+.5,ty+.5);say(sc,"Trop étroit pour moi.",1.6)}}
  else if(c==='T'&&sc.id!=='nadege'){say(sc,"Je n'y connais rien en informatique.",2)}
  else if(!passable(ST.view,tx,ty)&&c!=='T'&&c!=='S'){ /* mur : se rapprocher */ gotoPos(sc,w.x,w.y)}
  else{if(gotoPos(sc,tx+.5,ty+.5))marker(tx,ty)}
}
export function marker(x: number,y: number){ST.P.push({f:ST.view,x:x+.5,y:y+.5,z:0,vx:0,vy:0,vz:0,life:.6,col:'#fff',sz:0,ring:true,age:0})}
/* pointeur : tap ou glisser */
ST.ptr=null;
export function toggleCones(){ST.showCones=!ST.showCones;$('bCones').classList.toggle('on',ST.showCones);toast(ST.showCones?'Cônes de vision affichés':'Cônes de vision masqués','g')}
let lpTimer=0,lpFired=false;
const lpClear=()=>{clearTimeout(lpTimer);lpTimer=0};
let wasPaused=false;
export function toggleHelp(){const b=$('helpBox'),open=!b.classList.contains('show');if(open){wasPaused=ST.paused;ST.paused=true}else ST.paused=wasPaused;b.classList.toggle('show',open)}
$('bHelp').onclick=toggleHelp;$('helpClose').onclick=toggleHelp;$('bCones').onclick=toggleCones;$('bCones').classList.add('on');
cv.addEventListener('contextmenu',e=>{e.preventDefault();toggleCones()});
cv.addEventListener('pointerdown',e=>{if(e.button===2)return;lpFired=false;lpClear();if(e.pointerType==='touch')lpTimer=window.setTimeout(()=>{if(ST.ptr&&!ST.ptr.drag){lpFired=true;toggleCones()}},550);ST.ptr={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y,drag:false,id:e.pointerId};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener('pointermove',e=>{if(!ST.ptr)return;const dx=e.clientX-ST.ptr.x,dy=e.clientY-ST.ptr.y;if(!ST.ptr.drag&&Math.hypot(dx,dy)>9){ST.ptr.drag=true;lpClear()}if(ST.ptr.drag){cam.free=true;cam.x=ST.ptr.cx-dx/ST.zoom;cam.y=ST.ptr.cy-dy/ST.zoom}});
cv.addEventListener('pointerup',e=>{lpClear();if(ST.ptr&&!ST.ptr.drag&&!lpFired)tapAt(e.clientX,e.clientY);ST.ptr=null});
cv.addEventListener('pointercancel',()=>{lpClear();ST.ptr=null});
cv.addEventListener('wheel',e=>{e.preventDefault();setZoom(ST.zoom*(e.deltaY<0?1.1:.9))},{passive:false});
export function setZoom(z: number){ST.zoom=clamp(z,.45,1.7)}
window.addEventListener('keydown',e=>{
  if(!ST.started)return;const k=e.key.toLowerCase();
  if(k==='h'||(k==='escape'&&$('helpBox').classList.contains('show'))){toggleHelp();return}
  if($('helpBox').classList.contains('show'))return;
  if(ST.dlg){if(k===' '||k==='enter'){e.preventDefault();advDlg()}return}
  if('1234'.includes(k)&&k.length===1){const c=ST.S.chars[+k-1];if(c&&c.joined&&!c.out)selectChar(c.id)}
  else if(k==='q')pressAct(0);else if(k==='e')pressAct(1);else if(k==='w'&&ACT[selC().id].length>2)pressAct(2);else if(k==='x'&&ACT[selC().id].length>3)pressAct(3);else if(k==='r')toggleRun();
  else if(k===' '){e.preventDefault();ST.paused=!ST.paused}
  else if(k==='f5'){e.preventDefault();quickSave()}else if(k==='f9'){e.preventDefault();quickLoad()}
  else if(k==='d')$('bDbg').click();else if(k==='v')ST.assist=!ST.assist;else if(k==='tab'){e.preventDefault();const j=ST.S.chars.filter(c=>c.joined&&!c.out),i=j.findIndex(c=>c.id===ST.S.sel);selectChar(j[(i+1)%j.length].id)}
  else if(k==='escape'){ST.pend=null;$('ban').style.display='none'}
  else if(k==='+'||k==='=')setZoom(ST.zoom*1.15);else if(k==='-')setZoom(ST.zoom/1.15);
  else if(k.startsWith('arrow')){e.preventDefault();KEYS.add(k)}
});
window.addEventListener('keyup',e=>{KEYS.delete(e.key.toLowerCase())});
window.addEventListener('blur',()=>KEYS.clear());
$('bPause').onclick=()=>{ST.paused=!ST.paused};$('bSpeed').onclick=()=>{ST.spd=ST.spd===1?2:1};$('bAssist').onclick=()=>{ST.assist=!ST.assist;toast(ST.assist?'Vue tactique : tous les gardes sont visibles':'Vue réaliste : seuls les gardes dans votre champ de vision','g')};
$('bLim').onclick=()=>{ST.noLimit=!ST.noLimit;$('bLim').classList.toggle('on',ST.noLimit);toast(ST.noLimit?'Debug : plus de limite de 18h':'Limite de 18h rétablie','w')};
$('bState').onclick=()=>{$('stTxt').value=ST.S?JSON.stringify(ST.S):'';$('stBox').classList.add('show')};
$('stClose').onclick=()=>$('stBox').classList.remove('show');
$('stCopy').onclick=()=>{const t=$('stTxt');t.select();try{navigator.clipboard.writeText(t.value)}catch(e){document.execCommand('copy')}toast('État copié','g')};
$('stLoad').onclick=()=>{try{const o=JSON.parse($('stTxt').value);if(!o||!o.chars||!o.enemies)throw 0;ST.lastSave=$('stTxt').value;$('stBox').classList.remove('show');ST.started=true;$('intro').classList.remove('show');ST.paused=false;quickLoad()}catch(e){toast("État illisible",'r')}};
$('bSnd').onclick=()=>{ST.muted=!ST.muted};$('bDbg').onclick=()=>{ST.dbg=!ST.dbg;document.body.classList.toggle('dbgon',ST.dbg);$('bDbg').classList.toggle('on',ST.dbg);$('dbg').style.display=ST.dbg?'block':'none'};$('bZi').onclick=()=>setZoom(ST.zoom*1.2);$('bZo').onclick=()=>setZoom(ST.zoom/1.2);
$('bSave').onclick=quickSave;$('bLoad').onclick=quickLoad;
export function quickSave(){if(ST.S.over)return;ST.lastSave=JSON.stringify(ST.S);writeSave(ST.lastSave);toast('Sauvegarde rapide effectuée','g');snd(900,.08,'triangle',.04)}
export function quickLoad(){if(!ST.lastSave)ST.lastSave=readSave()?.json??null;if(!ST.lastSave){toast('Aucune sauvegarde','w');return}ST.S=JSON.parse(ST.lastSave);ST.dlg=null;$('dlg').classList.remove('show');document.body.classList.remove('indlg');ST.pend=null;ST.P=[];ST.PR=[];$('end').classList.remove('show');$('ban').style.display='none';const c=selC();ST.view=c.f;cam.free=false;buildActs();toast('Sauvegarde chargée','g')}
$('bRetry').onclick=()=>{quickLoad()};
$('bRestart').onclick=()=>{startGame()};
