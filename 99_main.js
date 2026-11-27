/* démarrage */
resize();for(let f=0;f<3;f++){S=S||newState();buildFloor(f)}
S=newState();mkUI();buildActs();zoom=VW<620?.8:1;{const c=selC(),p=iso(c.x,c.y);cam.x=p[0];cam.y=p[1]}
let last=performance.now(),acc=0;
function frame(now){
  let dt=Math.min(.05,(now-last)/1000);last=now;
  fxTick(dt);
  if(dlg&&dlg.cur&&dlg.pos<dlg.cur.length){dlg.pos=Math.min(dlg.cur.length,dlg.pos+dt*75);$('dTxt').textContent=dlg.cur.slice(0,Math.floor(dlg.pos))}
  if(started&&!paused&&!S.over&&!dlg){const step=dt*spd;let n=Math.ceil(step/.025);for(let i=0;i<n;i++)update(step/n)}
  render(dt);
  if(now-lastUI>100){lastUI=now;updateUI()}
  fCount++;requestAnimationFrame(frame)
}
requestAnimationFrame(frame);
if(location.hash!=='#novid')playVid(()=>{});
window.__G={MAP,pcChoose,pcOpen,get pcm(){return pcm},vidFrame,VID,KEYS,iso,cam,get VW(){return VW},get VH(){return VH},get dlg(){return dlg},advDlg,beginRun,recruit,gotoPos,getC,getE,get S(){return S},update,doAction,tapAt,findPath,selectChar,startGame,get view(){return view},set view(v){view=v},set paused(v){paused=v},set started(v){started=v},quickSave,quickLoad,get zoom(){return zoom}};
