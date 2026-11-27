import { ST } from './store';
import { H, W, iso } from './utils';
import { ch, isDoor } from './levelData';
import type { Character } from './types';
/* rendu : formes */
export function poly(g: CanvasRenderingContext2D,pts: number[][],fill: string,stroke?: string){g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke()}}
export function cube(g: CanvasRenderingContext2D,x0: number,y0: number,x1: number,y1: number,z0: number,z1: never | number,top: string,left: string,right: string){
  poly(g,[iso(x0,y1,z1),iso(x1,y1,z1),iso(x1,y1,z0),iso(x0,y1,z0)],left);
  poly(g,[iso(x1,y0,z1),iso(x1,y1,z1),iso(x1,y1,z0),iso(x1,y0,z0)],right);
  poly(g,[iso(x0,y0,z1),iso(x1,y0,z1),iso(x1,y1,z1),iso(x0,y1,z1)],top)}
export function rr(g: CanvasRenderingContext2D,x: number,y: number,w: number,h: number,r: number){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
export const WH: Float32Array[]=[];for(let f=0;f<3;f++)WH.push(new Float32Array(W*H));
export function tallH(c: any,i: any,j: number){if(c==='#'){return(j===H-1||i===W-1)?9:40}if(c==='c')return 34;if(c==='r')return 42;return 0}

export function drawTile(g: any,f: any,i: any,j: number,c: any,t?: any){
  if(c==='#'){
    const h=WH[f][j*W+i],out=(j===H-1||i===W-1);
    const top=out?'#8d98aa':'#a9b4c4',L=out?'#69758a':'#7d8aa0',R=out?'#505c72':'#5f6c83';
    cube(g,i,j,i+1,j+1,0,h,top,L,R);
    if(!out&&h>30){ /* fenêtres */
      if(j===0&&i>0&&i<W-1){const a=iso(i+.18,1,h-8),b=iso(i+.82,1,h-8),c2=iso(i+.82,1,h-24),d=iso(i+.18,1,h-24);poly(g,[a,b,c2,d],'#f2a65a');poly(g,[a,b,[b[0],(b[1]+c2[1])/2],[a[0],(a[1]+d[1])/2]],'#ffd29a')}
      if(i===0&&j>0&&j<H-1){const a=iso(1,j+.18,h-8),b=iso(1,j+.82,h-8),c2=iso(1,j+.82,h-24),d=iso(1,j+.18,h-24);poly(g,[a,b,c2,d],'#6e7fd4');poly(g,[a,b,[b[0],(b[1]+c2[1])/2],[a[0],(a[1]+d[1])/2]],'#9fb0ff')}}
  }
  else if(c==='d'||c==='T'){
    cube(g,i+.06,j+.1,i+.94,j+.9,0,13,'#c9a46a','#9c7a48','#7a5c36');
    if(c==='T'||((i*5+j*3)%3===0)){cube(g,i+.3,j+.3,i+.7,j+.45,13,24,'#2a303c','#1b2029','#14181f');poly(g,[iso(i+.32,j+.45,23),iso(i+.68,j+.45,23),iso(i+.68,j+.45,15),iso(i+.32,j+.45,15)],c==='T'?'#4ee3f0':'#7fb4ff')}
  }
  else if(c==='p'){g.fillStyle='rgba(0,0,0,.25)';const[a,b]=iso(i+.5,j+.5);g.beginPath();g.ellipse(a,b,13,6,0,0,7);g.fill();cube(g,i+.3,j+.3,i+.7,j+.7,0,9,'#b5654a','#8e4a35','#733b2a');
    const[cx,cy]=iso(i+.5,j+.5,14);g.fillStyle='#2f9e57';for(let k=0;k<6;k++){const an=k*1.05;g.beginPath();g.ellipse(cx+Math.cos(an)*7,cy-6+Math.sin(an)*5,6,9,an,0,7);g.fill()}g.fillStyle='#46c06f';g.beginPath();g.ellipse(cx,cy-9,6,8,0,0,7);g.fill()}
  else if(c==='c'){const h=WH[f][j*W+i];cube(g,i+.04,j+.04,i+.96,j+.96,0,h,'#7a8a99','#5d6c7a','#485560');
    if(h>20){const a=iso(i+.1,j+.96,h-6),b=iso(i+.9,j+.96,h-6),c2=iso(i+.9,j+.96,h-14),d=iso(i+.1,j+.96,h-14);poly(g,[a,b,c2,d],'rgba(0,0,0,.25)')}}
  else if(c==='r'){const h=WH[f][j*W+i];cube(g,i+.05,j+.05,i+.95,j+.95,0,h,'#27323f','#1b232d','#141a22');
    if(h>20)for(let k=0;k<4;k++){const p=iso(i+.2+k*.18,j+.95,h-8-k*0+((k*7)%3)*5);g.fillStyle=((k+Math.floor(ST.S.t*2))%3===0)?'#4ee3f0':'#58d68d';g.fillRect(p[0]-1.5,p[1],3,2)}}
  else if(c==='m'){cube(g,i+.15,j+.15,i+.85,j+.85,0,24,'#d9dde4','#aab1bd','#858d99');poly(g,[iso(i+.2,j+.85,19),iso(i+.8,j+.85,19),iso(i+.8,j+.85,9),iso(i+.2,j+.85,9)],'#3a2a22');cube(g,i+.4,j+.3,i+.6,j+.5,24,28,'#ff6b4a','#c94d33','#a33d28')}
  else if(c==='x'){cube(g,i+.12,j+.2,i+.88,j+.8,0,18,'#e8eaee','#b9bec8','#8f96a3');cube(g,i+.2,j+.25,i+.8,j+.45,18,21,'#2e3541','#232832','#1b1f27')}
  else if(c==='b'){cube(g,i+.1,j+.12,i+.9,j+.88,0,9,'#c0504d','#933b39','#742f2d');cube(g,i+.1,j+.12,i+.9,j+.3,9,20,'#cf605c','#a24340','#7d3331')}
  else if(c==='S'){cube(g,i+.1,j+.1,i+.9,j+.9,0,26,'#8e98a6','#6c7686','#545d6b');const p=iso(i+.5,j+.9,16);g.fillStyle='#d9a441';g.beginPath();g.arc(p[0],p[1],4,0,7);g.fill();g.fillStyle='#3a3320';g.fillRect(p[0]-.7,p[1]-3,1.4,3)
    if(ST.S.team.key){poly(g,[iso(i+.2,j+.9,22),iso(i+.8,j+.9,22),iso(i+.8,j+.9,4),iso(i+.2,j+.9,4)],'#12151b')}}
  else if(c==='U'||c==='N'){
    for(let k=0;k<4;k++){const z=c==='U'?k*5:(3-k)*5;cube(g,i+.05,j+.05+k*.22,i+.95,j+.27+k*.22,0,z+4,'#cdd2db','#9aa3b2','#7d8695')}
    const p=iso(i+.5,j+.5,34);g.fillStyle='#ffd166';g.font='bold 16px sans-serif';g.textAlign='center';g.fillText(c==='U'?'▲':'▼',p[0],p[1])}
  else if(isDoor(c)){
    const vert=(ch(f,i,j-1)==='#'||isDoor(ch(f,i,j-1)))&&(ch(f,i,j+1)==='#'||isDoor(ch(f,i,j+1))); /* mur le long de y */
    const open=ST.S.dOpen[f+','+i+','+j],col=c==='1'?['#3b82f6','#2a64c4','#1d4a94']:c==='2'?['#ef4444','#b53232','#8a2525']:['#9aa3b0','#747d8a','#5a626e'];
    const hd=34;
    if(vert){ if(!open)cube(g,i+.38,j,i+.62,j+1,0,hd,col[0],col[1],col[2]);else{cube(g,i+.38,j,i+.62,j+.12,0,hd,col[0],col[1],col[2]);cube(g,i+.38,j+.88,i+.62,j+1,0,hd,col[0],col[1],col[2])}}
    else{ if(!open)cube(g,i,j+.38,i+1,j+.62,0,hd,col[0],col[1],col[2]);else{cube(g,i,j+.38,i+.12,j+.62,0,hd,col[0],col[1],col[2]);cube(g,i+.88,j+.38,i+1,j+.62,0,hd,col[0],col[1],col[2])}}
    const p=iso(i+.5,j+.5,hd+5);g.fillStyle=open?'#58d68d':'#ff5d5d';g.beginPath();g.arc(p[0],p[1],3,0,7);g.fill();g.fillStyle='rgba(255,255,255,.75)';g.font='bold 9px sans-serif';g.textAlign='center';g.fillText(c==='3'?'DG':c,p[0],p[1]-6)}
}
