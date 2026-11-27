/* bruit, clope, gobelet, café */
const OFF=[[0,0],[.9,.4],[-.8,.6],[.3,-.9],[-.5,-.5]];
function spotNear(f,x,y,n){const o=OFF[n%OFF.length];let tx=x+o[0],ty=y+o[1];if(!passable(f,Math.floor(tx),Math.floor(ty))){tx=x;ty=y}return [tx,ty]}
/* Clope : UN garde va fumer au fumoir 60 s, vue réduite (enfumée) */
function smokeBreak(e){const k=SMK[e.f];if(!e||e.ko||!k)return;if(e.state==='chase'){return}
  const p=spotNear(e.f,k.x,k.y,S.enemies.filter(q=>q.state==='break').length);
  e.state='break';e.brk={x:p[0],y:p[1],t:0,arrived:false,dur:60,face:Math.random()*6.283,sy:Math.floor(Math.random()*BRK_SAY.length)};e.path=[];e.look=null;e.cln=null;e.wait=0;e.talk=0;say(e,BRK_SAY[e.brk.sy],3);
  toast(e.name+' file au fumoir pour 1 min, vue enfumée','g')}
/* Café : un PNJ va à la cafétéria de l'étage */
function goCoffee(e,dur){const k=CAFE[e.f];if(!k||e.ko||e.state==='chase')return false;
  const p=spotNear(e.f,k.x,k.y,S.enemies.filter(q=>q.state==='coffee').length);
  e.state='coffee';e.cof={x:p[0],y:p[1],t:0,arrived:false,dur,sy:Math.floor(Math.random()*COF_SAY.length)};e.path=[];e.look=null;e.cln=null;e.wait=0;e.talk=0;say(e,'Un petit café, ça ne se refuse pas.',3);return true}
/* SMS de Nadia : managers et techniciens filent en salle serveur */
const MEET_SAY=['Réunion sur la réunion de demain, sans ordre du jour.','Qui a convoqué ? Moi non, et pourtant je suis là.','Point d\'étape sur l\'étape du point.','On attend le DG. Le DG n\'attend personne.'];
const SRV={x:4.5,y:4.5};
function smsServeur(){let n=0;
  for(const e of S.enemies){if(e.f!==1||e.ko||e.state==='chase'||!(e.type==='manager'||e.tech))continue;
    const p=spotNear(1,SRV.x,SRV.y,n);e.state='coffee';e.cof={x:p[0],y:p[1],t:0,arrived:false,dur:45,sy:0,lines:SMS_SAY};e.path=[];e.look=null;e.cln=null;e.wait=0;e.talk=0;say(e,'Un SMS : « Salle serveur, urgent ». Ça sent la panne.',3.4);n++}
  toast(n?'SMS envoyé : '+n+' manager'+(n>1?'s':'')+' et technicien'+(n>1?'s':'')+' filent en salle serveur (45 s)':'Personne à prévenir','g')}
/* Gobelet : les PNJ proches vont nettoyer 10 s, puis (si l'étage a une cafétéria) prennent un café */
function hear(f,x,y,r){for(const e of S.enemies){if(e.f!==f||e.ko||e.calm||e.type==='camera'||e.state==='chase'||e.state==='break'||e.state==='call'||e.talk>0)continue;
  if(Math.hypot(e.x-x,e.y-y)<=r){e.state='clean';e.cln={x,y,t:0,arrived:false,dur:10};e.look=null;e.cof=null;e.path=[];e.wait=0;say(e,'?',2.2)}}}
