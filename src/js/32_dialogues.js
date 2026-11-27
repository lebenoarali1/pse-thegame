/* dialogues */
let dlg=null;
function runDlg(steps,done,trig){dlg={q:steps.slice(),done,trig:trig||'kevin',cur:null,pos:0};$('dlg').classList.add('show');document.body.classList.add('indlg');ptr=null;nextDlg()}
function dHead(w){const id=w==='$'?dlg.trig:w,i=WHO[id];$('dWho').textContent=i[0];$('dAv').textContent=i[0][0];$('dAv').style.background=i[1];$('dlg').style.setProperty('--c',i[1])}
function endDlg(){const d=dlg.done;dlg=null;$('dlg').classList.remove('show');document.body.classList.remove('indlg');if(d)d()}
function nextDlg(){
  if(!dlg)return;
  if(!dlg.q.length){endDlg();return}
  const st=dlg.q.shift();if(st.fx)st.fx();
  if(!st.t&&!st.ch){nextDlg();return}
  dHead(st.w);
  if(st.ch){dlg.cur=null;$('dTxt').textContent=st.t||'';$('dHint').style.display='none';const box=$('dCh');box.innerHTML='';
    st.ch.forEach(o=>{const b=document.createElement('button');b.textContent=o.t;b.onclick=ev=>{ev.stopPropagation();if(o.fx)o.fx();box.innerHTML='';dlg.q.unshift(...(o.r||[]));nextDlg()};box.appendChild(b)})}
  else{dlg.cur=st.t;dlg.pos=0;$('dTxt').textContent='';$('dCh').innerHTML='';$('dHint').style.display=''}
}
function advDlg(){if(!dlg||!dlg.cur)return;if(dlg.pos<dlg.cur.length){dlg.pos=dlg.cur.length;$('dTxt').textContent=dlg.cur}else nextDlg()}
$('dlg').addEventListener('click',advDlg);
$('dSkip').addEventListener('click',ev=>{ev.stopPropagation();if(!dlg)return;while(dlg.q.length){const st=dlg.q.shift();if(st.fx)st.fx();if(st.ch&&st.ch[0].fx)st.ch[0].fx()}endDlg()});
function recruit(n,c){S.talked[n.id]=1;runDlg(RECRUIT[n.id](),()=>{n.joined=true;n.path=[];toast(n.name+" rejoint l'équipe",'g');snd(784,.12,'triangle',.05);setTimeout(()=>snd(1046,.2,'triangle',.05),120)},c.id)}
function beginRun(){runDlg(introSteps(),()=>{const n=getC('nadege');n.smoke=false;say(n,'*écrase sa clope*',2.8)})}
