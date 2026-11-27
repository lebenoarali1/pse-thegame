/* utilitaires */
export const $=(id:string):any=>document.getElementById(id);
export const clamp=(v: number,a: number,b: number)=>Math.max(a,Math.min(b,v));
export const lerp=(a: any,b: any,t: number)=>a+(b-a)*t;
export const rnd=(a: number,b: number)=>a+Math.random()*(b-a);
export const W=24,H=14,OFFX=H*32+70,OFFY=130;
export const iso=(x: number,y: number,z=0)=>[(x-y)*32,(x+y)*16-z];
export const angDiff=(a: number,b: any)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d};
