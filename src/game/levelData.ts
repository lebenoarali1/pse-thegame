import { buildFloor0 } from './floorRdc';
import { buildFloor1 } from './floor1';
import { buildFloor2 } from './floor2';
import { H, W } from './utils';
/* Données de niveau : zones, passages, fumoirs */
export function buildMaps(){return [buildFloor0(),buildFloor1(),buildFloor2()]}
export const MAP=buildMaps();
export const SOLID=new Set(['#',' ','c','r','d','p','m','b','T','S','x']);
export const TALL=new Set(['#','c','r']);
export const ch=(f: any,x: any,y: any)=>(x<0||y<0||x>=W||y>=H)?' ':MAP[f][y][x];
export const isPC=(f: any,x: any,y: any)=>{const c=ch(f,x,y);return c==='T'||(c==='d'&&x%3===0)};
export const isDoor=(c: any)=>c==='1'||c==='2'||c==='3';
export const ZN: [number,number,number,number,string][][]=[
 [[6,1,16,12,'marble'],[1,1,4,12,'lino'],[18,1,22,12,'concrete']],
 [[1,1,5,5,'server'],[1,11,4,12,'lino'],[19,1,22,5,'lino'],[19,7,22,8,'marble'],[19,10,22,12,'wood']],
 [[1,7,22,8,'corridor'],[15,1,22,5,'wood'],[1,10,8,12,'marble'],[10,10,13,12,'lino']]
];
export const STY: Record<string, string[]>={carpet:['#3d4d69','#394965'],marble:['#d5d0c4','#c9c3b5'],lino:['#a9bca8','#a0b39f'],server:['#27394b','#223340'],wood:['#966439','#8a5b35'],corridor:['#5a6a8c','#546489'],concrete:['#7e848d','#787e87']};
export function zoneOf(f: any,x: number,y: number){let z:any=f===0?'marble':'carpet';for(const r of ZN[f])if(x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3])z=r[4];return z}

export const VENTS=[{f:2,x:16,y:8,to:{f:2,x:16,y:2}},{f:2,x:16,y:2,to:{f:2,x:16,y:8}}];
export const STAIRS=[
 {f:0,x:19,y:1,to:{f:1,x:20.5,y:8.5}},{f:1,x:20,y:7,to:{f:0,x:19.5,y:2.5}},
 {f:1,x:22,y:7,to:{f:2,x:3.5,y:11.5}},{f:2,x:2,y:11,to:{f:1,x:21.5,y:8.5}}
];
export const SMK=[{x:8.5,y:2.5},null,null];
export const CAFE=[null,{x:20.5,y:2.5},null];
