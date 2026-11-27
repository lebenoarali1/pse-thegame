/* utilitaires */
export const $=(id:string):any=>document.getElementById(id);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const rnd=(a,b)=>a+Math.random()*(b-a);
export const W=24,H=14,OFFX=H*32+70,OFFY=130;
export const iso=(x,y,z=0)=>[(x-y)*32,(x+y)*16-z];
export const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d};
