/* sons */
let AC=null;
function snd(fr,d=.12,type='square',v=.04,sl=0){if(muted)return;try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=type;o.frequency.setValueAtTime(fr,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(30,fr+sl),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
