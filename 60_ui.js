/* interface */
function mkUI(){
  const cards=$('cards');cards.innerHTML='';
  S.chars.forEach((c,i)=>{const d=document.createElement('div');d.className='cd4';d.id='card_'+c.id;d.style.setProperty('--c',CCOL[c.id]);
    d.innerHTML='<div class="nm"><div><span class="dot"></span><span class="nn"></span></div><span>'+(i+1)+'</span></div><div class="st"></div><div class="pb"></div>';
    d.onclick=()=>selectChar(c.id);cards.appendChild(d)});
  const fl=$('fl');fl.innerHTML='';['RDC','R+1','R+2'].forEach((n,i)=>{const b=document.createElement('button');b.className='ib';b.textContent=n;b.id='fl'+i;b.onclick=()=>{view=i;cam.free=false;const c=selC();if(c&&c.f!==i){/* garde la caméra sur l'étage regardé */cam.free=true;const [x,y]=iso(12,7);cam.x=x;cam.y=y}};fl.appendChild(b)})
}
function selectChar(id){const q=getC(id);if(q.out){toast(q.name+' est licencié : il ne joue plus','w');return}if(!q.joined){toast(q.name+' n\'a pas encore rejoint l\'équipe : allez le voir ('+['RDC','étage 1','étage 2'][q.f]+')','w');view=q.f;cam.free=true;{const p=iso(q.x,q.y);cam.x=p[0];cam.y=p[1]}return}if(S.sel===id&&cam.free===false&&view===getC(id).f)return;S.sel=id;pend=null;const c=getC(id);view=c.f;cam.free=false;$('ban').style.display='none';snd(660,.05,'triangle',.03);buildActs()}
function buildActs(){
  const c=selC(),box=$('acts');box.innerHTML='';
  ACT[c.id].forEach((a,i)=>{const b=document.createElement('button');b.className='ab';b.id='ab'+i;b.innerHTML='<span class="ic">'+a.i+'</span><div><b>'+a.n+' <small class="kh">'+['Q','E','W','X'][i]+'</small>'+'</b><small>'+a.s+'</small></div>';
    b.onclick=()=>pressAct(i);box.appendChild(b)});
  const r=document.createElement('button');r.className='ab run';r.id='abRun';r.innerHTML='<span class="ic">🏃</span><div><b>Courir <small class="kh">R</small></b><small>Rapide mais bruyant</small></div>';r.onclick=toggleRun;box.appendChild(r)
}
function toggleRun(){const c=selC();c.run=!c.run;snd(c.run?500:380,.05,'triangle',.03)}
function pressAct(i){
  if(S.over||!started)return;const c=selC(),a=ACT[c.id][i];
  if(a.k==='talk'&&c.talking){releaseTalk(c);return}
  if(pend&&pend.k===a.k){pend=null;$('ban').style.display='none';return}
  if(a.mode==='auto'||a.mode==='none'){pend=null;$('ban').style.display='none';doAction(c,a.k)}
  else{pend={k:a.k};$('ban').textContent=a.mode==='enemy'?'Touchez un garde (ou la cible)':a.mode==='hack'?'Touchez un terminal ou une porte bleue':'Touchez le point à viser';$('ban').style.display='block'}
}
let lastUI=0;
function updateUI(){
  const t=S.t,mins=15-t/(TL/15),cl=Math.min(15,t/(TL/15)),h=17,m=45+Math.floor(cl),s=Math.floor((cl%1)*60);
  $('ck').firstChild.nodeValue=(m>=60?'18:'+String(m-60).padStart(2,'0'):'17:'+String(m).padStart(2,'0'));
  $('ck2').textContent=String(s).padStart(2,'0')+'s';$('barf').style.width=Math.min(100,t/TL*100)+'%';
  $('obj').innerHTML=objective();
  if(dbg){const f=n=>Math.max(0,n).toFixed(1),L=[];L.push('T '+S.t.toFixed(1)+' s  reste '+f(TL-S.t)+' s');L.push('caméras coupées : '+(S.team.camsUntil>S.t?f(S.team.camsUntil-S.t)+' s':'non'));
    const dd=Object.entries(S.doorHack).filter(q=>q[1]>S.t).map(q=>q[0]+' '+f(q[1]-S.t)+'s');if(dd.length)L.push('portes ouvertes : '+dd.join(' | '));
    const sc=getC(S.sel);L.push(sc.name+' : q '+f(sc.cd.q)+' s, e '+f(sc.cd.e)+' s');
    for(const e of S.enemies){if(e.f!==view||e.type==='camera'||e.ko)continue;let t=e.state;if(e.state==='break'&&e.brk)t+=e.brk.arrived?' '+f(e.brk.dur-e.brk.t)+' s (vue '+e.range.toFixed(1)+')':' en route';else if(e.state==='clean'&&e.cln)t+=e.cln.arrived?' nettoie '+f(e.cln.dur-e.cln.t)+' s':' en route';else if(e.state==='coffee'&&e.cof)t+=e.cof.arrived?' café '+f(e.cof.dur-e.cof.t)+' s':' en route';else if(e.state==='look'&&e.look)t+=' '+f((e.lookDur||4.5)-e.look.t)+' s';else if(e.talk>0)t='baratin '+f(e.talk)+' s';L.push(e.name+' : '+t+'  alerte '+Math.round(e.det*100)+'%')}
    $('dbg').textContent=L.join('\n')}
  S.chars.forEach(c=>{const d=$('card_'+c.id);d.classList.toggle('sel',c.id===S.sel);d.style.opacity=c.out?.3:c.joined?1:.4;d.querySelector('.nn').textContent=c.joined?c.name:'???';
    if(c.out){d.querySelector('.st').textContent='Licencié';d.querySelector('.pb').style.width='0';return}
    if(!c.joined){d.querySelector('.st').textContent='à retrouver';d.querySelector('.pb').style.width='0';return}
    const st=c.talking?'baratine':c.hide?'dans la gaine':c.busy?({ko:'assomme',hide:'planque',uniform:'se change',talk:'baratine',hack:c.busy.slow?'distrait':'pirate',vent:'dans la gaine',safe:'ouvre le coffre',dist:'distrait'}[c.busy.k]||'occupé'):c.moving?(c.run?'court':'marche'):(c.disguise?'déguisé':'attend');
    d.querySelector('.st').textContent=['RDC','Ét.1','Ét.2'][c.f]+' · '+st;d.querySelector('.pb').style.width=c.busy&&c.busy.max?(c.busy.t/c.busy.max*100)+'%':'0'});
  const c=selC();ACT[c.id].forEach((a,i)=>{const b=$('ab'+i);if(!b)return;const cd=[c.cd.q,c.cd.e,c.cd.w||0,0][i];b.classList.toggle('act',!!(pend&&pend.k===a.k));b.classList.toggle('cd',cd>0);
    if(a.k==='throw')b.querySelector('small:last-child').textContent='Il en reste '+S.team.throws});
  $('abRun')&&$('abRun').classList.toggle('on',c.run);
  for(let i=0;i<3;i++){$('fl'+i).classList.toggle('sel',view===i);$('fl'+i).classList.toggle('has',S.chars.some(q=>q.joined&&q.f===i))}
  $('alertfx').classList.toggle('on',S.alertT>0||S.enemies.some(e=>e.state==='chase'&&!e.ko));
  $('bPause').textContent=paused?'▶':'⏸';$('bPause').classList.toggle('on',paused);$('bSpeed').classList.toggle('on',spd===2);$('bAssist').classList.toggle('on',assist);$('bSnd').textContent=muted?'🔇':'🔊'
}
function objective(){
  const T=S.team,F=S.flags,tm=S.chars.filter(c=>c.joined),dj=getC('marc'),mx=getC('jordan');
  const steps=[
   [tm.some(c=>c.f>=1),"Rez-de-chaussée : <b>Kévin</b> jette un gobelet (Roger nettoie 10 s), <b>Nadia</b> lance une clope à Dédé (fumoir, 1 min), puis pirate le portillon bleu"],
   [dj.joined&&mx.joined,"Étage 1 : <b>Djibril</b> pleure en salle de réunion (est), <b>Max</b> est aux toilettes (ouest) : <b>Kévin</b> jette un gobelet près de la plante, Dylan nettoie puis file à la cafétéria"],
   [F.manager||tm.some(c=>c.f===2),"Porte rouge de l'escalier : <b>Nadia</b> la pirate de près (8 s), ou <b>Max</b> assomme le manager et <b>Djibril</b> prend son costume. <b>Nadia</b>, devant n'importe quel PC, choisit : porte, notification, pause café, réunion, caméras ou imprimante"],
   [T.code,"<b>Nadia</b> pirate le serveur (étage 1, nord-ouest) pour le code du coffre"],
   [F.cams&&tm.some(c=>c.f===2),"Couper les caméras et monter à l'étage 2 (Djibril ouvre, les autres collent derrière)"],
   [T.key,"<b>Kévin</b> : gaine du couloir, puis coffre du DG, une fois son bureau libre"],
   [false,"Tous au <b>RDC</b>, devant l'ascenseur de service, avant 18h"]];
  let i=steps.findIndex(q=>!q[0]);if(i<0)i=6;if(T.key)i=6;
  return '<b>'+(i+1)+'/7</b> '+steps[i][1]
}
