import { ST } from './store';
import { $ } from './utils';
import { WHO } from './castData';
import { RECRUIT, introSteps } from './texts';
import { say, toast } from './messages';
import { snd } from './sound';
import { getC } from './state';
import type { Character } from './types';
/* dialogues */
ST.dlg=null;
export function runDlg(steps: any,done: () => void,trig?: any){ST.dlg={q:steps.slice(),done,trig:trig||'kevin',cur:null,pos:0};$('dlg').classList.add('show');document.body.classList.add('indlg');ST.ptr=null;nextDlg()}
export function dHead(w: any){const id=w==='$'?ST.dlg.trig:w,i=WHO[id];$('dWho').textContent=i[0];$('dAv').textContent=i[0][0];$('dAv').style.background=i[1];$('dlg').style.setProperty('--c',i[1])}
export function endDlg(){const d=ST.dlg.done;ST.dlg=null;$('dlg').classList.remove('show');document.body.classList.remove('indlg');if(d)d()}
export function nextDlg(){
  if(!ST.dlg)return;
  if(!ST.dlg.q.length){endDlg();return}
  const st=ST.dlg.q.shift();if(st.fx)st.fx();
  if(!st.t&&!st.ch){nextDlg();return}
  dHead(st.w);
  if(st.ch){ST.dlg.cur=null;$('dTxt').textContent=st.t||'';$('dHint').style.display='none';const box=$('dCh');box.innerHTML='';
    st.ch.forEach((o: any)=>{const b=document.createElement('button');b.textContent=o.t;b.onclick=(ev: Event)=>{ev.stopPropagation();if(o.fx)o.fx();box.innerHTML='';ST.dlg.q.unshift(...(o.r||[]));nextDlg()};box.appendChild(b)})}
  else{ST.dlg.cur=st.t;ST.dlg.pos=0;$('dTxt').textContent='';$('dCh').innerHTML='';$('dHint').style.display=''}
}
export function advDlg(){if(!ST.dlg||!ST.dlg.cur)return;if(ST.dlg.pos<ST.dlg.cur.length){ST.dlg.pos=ST.dlg.cur.length;$('dTxt').textContent=ST.dlg.cur}else nextDlg()}
$('dlg').addEventListener('click',advDlg);
$('dSkip').addEventListener('click',(ev: Event)=>{ev.stopPropagation();if(!ST.dlg)return;while(ST.dlg.q.length){const st=ST.dlg.q.shift();if(st.fx)st.fx();if(st.ch&&st.ch[0].fx)st.ch[0].fx()}endDlg()});
export function recruit(n: Character,c: Character){ST.S.talked[n.id]=1;runDlg(RECRUIT[n.id](),()=>{n.joined=true;n.path=[];toast(n.name+" rejoint l'équipe",'g');snd(784,.12,'triangle',.05);setTimeout(()=>snd(1046,.2,'triangle',.05),120)},c.id)}
export function beginRun(){runDlg(introSteps(),()=>{const n=getC('nadege');n.smoke=false;say(n,'*écrase sa clope*',2.8)})}
