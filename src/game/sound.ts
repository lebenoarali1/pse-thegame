import { ST } from './store';
/* sons */
ST.AC=null;
export function snd(fr: number,d=.12,type='square',v=.04,sl=0){if(ST.muted)return;try{if(!ST.AC)ST.AC=new(window.AudioContext||(window as any).webkitAudioContext)();const o=ST.AC.createOscillator(),g=ST.AC.createGain(),t=ST.AC.currentTime;o.type=type as OscillatorType;o.frequency.setValueAtTime(fr,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(30,fr+sl),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(ST.AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
