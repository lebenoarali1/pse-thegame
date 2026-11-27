import { H, OFFX, OFFY, W, iso } from './utils';
import { STY, ch, zoneOf } from './levelData';
/* rendu : floors pré-rendus */
export const FLOORC: HTMLCanvasElement[]=[];
export function diamond(g: CanvasRenderingContext2D,x: number,y: number,fill: string){const [sx,sy]=iso(x,y);g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+32,sy+16);g.lineTo(sx,sy+32);g.lineTo(sx-32,sy+16);g.closePath();g.fillStyle=fill;g.fill()}
export function buildFloor(f: number){
  const cv=document.createElement('canvas');cv.width=(W+H)*32+140;cv.height=(W+H)*16+OFFY+90;const g=cv.getContext('2d') as CanvasRenderingContext2D;g.translate(OFFX,OFFY);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const c=ch(f,x,y);if(c===' '||c==='#')continue;
    const z=zoneOf(f,x,y),col=STY[z][(x+y)&1];diamond(g,x,y,col);
    const h=((x*73+y*151)%11)/11;g.globalAlpha=.05+h*.05;diamond(g,x,y,h>.5?'#fff':'#000');g.globalAlpha=1;
    const [sx,sy]=iso(x,y);
    if(z==='wood'){g.strokeStyle='rgba(40,20,5,.22)';g.lineWidth=1;g.beginPath();for(let k=1;k<4;k++){const t=k/4;g.moveTo(sx-32+32*t,sy+16-16*t);g.lineTo(sx+32*t,sy+32-16*t)}g.stroke()}
    if(z==='server'){g.strokeStyle='rgba(78,227,240,.18)';g.lineWidth=1;g.beginPath();g.moveTo(sx-32,sy+16);g.lineTo(sx,sy);g.lineTo(sx+32,sy+16);g.stroke()}
    if(z==='marble'&&h>.7){g.strokeStyle='rgba(120,120,140,.25)';g.beginPath();g.moveTo(sx-10,sy+14);g.lineTo(sx+8,sy+20);g.stroke()}
    g.strokeStyle='rgba(255,255,255,.05)';g.lineWidth=1;g.beginPath();g.moveTo(sx-32,sy+16);g.lineTo(sx,sy);g.lineTo(sx+32,sy+16);g.stroke();
    if(c==='V'){diamond(g,x+.1,y+.1,'rgba(0,0,0,0)');g.fillStyle='#20252e';g.beginPath();g.moveTo(sx,sy+6);g.lineTo(sx+20,sy+16);g.lineTo(sx,sy+26);g.lineTo(sx-20,sy+16);g.closePath();g.fill();
      g.strokeStyle='#6f7a8c';g.lineWidth=1.5;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(sx+k*7-8,sy+16+k*3.5+4);g.lineTo(sx+k*7+8,sy+16+k*3.5-4);g.stroke()}}
    if(c==='X'){g.fillStyle='#2a2f3a';g.beginPath();g.moveTo(sx,sy+3);g.lineTo(sx+28,sy+16);g.lineTo(sx,sy+29);g.lineTo(sx-28,sy+16);g.closePath();g.fill();g.strokeStyle='#ffd166';g.lineWidth=2;g.setLineDash([5,4]);g.stroke();g.setLineDash([])}
  }
  FLOORC[f]=cv;
}
/* éclairage */
export const LIGHTS: any[][]=[[],[],[]];
for(let f=0;f<3;f++)for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(x%4!==2||y%4!==2)continue;const c=ch(f,x,y);if(c==='#'||c===' ')continue;const z=zoneOf(f,x,y);LIGHTS[f].push([x+.5,y+.5,z==='server'?'#4ee3f0':z==='wood'?'#ffb866':z==='lino'?'#ffe2b0':null as any])}
export const lightSpr=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d') as CanvasRenderingContext2D,r=g.createRadialGradient(128,128,0,128,128,128);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.45,'rgba(255,255,255,.7)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,256,256);return c})();
export const glowSpr=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d') as CanvasRenderingContext2D,r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128);return c})();
