import { ST } from './store';
import { VH, VW, render, resize } from './renderLoop';
import { KEYS, cam, getC, getE, newState, selC } from './state';
import { buildFloor } from './renderFloors';
import { buildActs, mkUI, selectChar, updateUI } from './ui';
import { $, iso } from './utils';
import { fxTick } from './events';
import { update } from './logicLoop';
import { VID, playVid, startGame, vidFrame } from './video';
import { MAP } from './levelData';
import { pcChoose, pcOpen, pcm } from './pcMenu';
import { advDlg, beginRun, recruit } from './dialogues';
import { doAction, gotoPos } from './powers';
import { quickLoad, quickSave, tapAt } from './input';
import { startMusic, currentMode } from './music';
import { hear } from './noise';
import { findPath } from './pathing';
/* démarrage */
resize();for(let f=0;f<3;f++){ST.S=ST.S||newState();buildFloor(f)}
ST.S=newState();mkUI();buildActs();ST.zoom=VW<620?.8:1;{const c=selC(),p=iso(c.x,c.y);cam.x=p[0];cam.y=p[1]}
/* eslint-disable-next-line prefer-const */
export let last=performance.now(),acc=0;
export function frame(now: number){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  fxTick(dt);
  if(ST.dlg&&ST.dlg.cur&&ST.dlg.pos<ST.dlg.cur.length){ST.dlg.pos=Math.min(ST.dlg.cur.length,ST.dlg.pos+dt*75);$('dTxt').textContent=ST.dlg.cur.slice(0,Math.floor(ST.dlg.pos))}
  if(ST.started&&!ST.paused&&!ST.S.over&&!ST.dlg){const step=dt*ST.spd;const n=Math.ceil(step/.025);for(let i=0;i<n;i++)update(step/n)}
  render(dt);
  if(now-ST.lastUI>100){ST.lastUI=now;updateUI()}
  ST.fCount++;requestAnimationFrame(frame)
}
requestAnimationFrame(frame);
if(location.hash!=='#novid')playVid(()=>{});
startMusic();
if('serviceWorker' in navigator&&location.protocol==='https:')window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>undefined)});
window.__G={MAP,pcChoose,pcOpen,get pcm(){return pcm},vidFrame,VID,KEYS,iso,cam,get VW(){return VW},get P(){return ST.P},hear,get musicMode(){return currentMode()},get VH(){return VH},get dlg(){return ST.dlg},advDlg,beginRun,recruit,gotoPos,getC,getE,get S(){return ST.S},update,doAction,tapAt,findPath,selectChar,startGame,get view(){return ST.view},set view(v: number){ST.view=v},get paused(){return ST.paused},set paused(v: boolean){ST.paused=v},get showCones(){return ST.showCones},set started(v: boolean){ST.started=v},quickSave,quickLoad,get zoom(){return ST.zoom}};
