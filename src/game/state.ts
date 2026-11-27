import { ST } from './store';
import type { GameState } from './types';
import { makeChars, makeEnemies } from './castData';
import { H, W } from './utils';
import { MAP, isDoor } from './levelData';
/* état */
export const TL=480;/* durée de la partie en secondes de jeu (15 min d'horloge) */
ST.showCones=true;ST.noLimit=false;ST.dbg=false;ST.S=null;ST.view=0;ST.pend=null;ST.assist=false;ST.paused=true;ST.started=false;ST.muted=false;ST.spd=1;
export let cam={x:0,y:0,free:false};ST.zoom=1;ST.P=[];ST.PR=[];ST.lastSave=null;ST.fCount=0;

export function newState(): GameState {
  const C=(id,name,x,y,sp,o)=>Object.assign({id,name,f:0,x,y,face:.78,path:[],order:null,busy:null,hide:false,disguise:null,run:false,cd:{q:0,e:0},sp,moving:false,say:'',sayT:0,stall:0,repath:0,runN:0},o||{});
  const E=(id,name,type,f,x,y,o)=>{const e=Object.assign({hx:x,hy:y,id,name,type,f,x,y,face:Math.PI/2,fov:80,range:8,sp:1.2,route:[],ri:0,loop:true,wait:0,idleFace:0,path:[],state:'patrol',det:0,tgt:null,look:null,ko:false,hidden:false,uniformTaken:false,talk:0,talkTo:null,scan:null,lose:0,repath:0,moving:false,say:'',sayT:0},o||{});e.home=JSON.parse(JSON.stringify(e.route));return e};
  const enemies=makeEnemies(E);
  return {t:0,over:null,sel:'kevin',age:0,talked:{},
    chars:makeChars(C),
    enemies,team:{code:false,key:false,camsUntil:0,fluxUntil:0,throws:5},doorHack:{},dOpen:{},dLatch:{},dLing:{},puddles:[],distCd:{},ev:{},flags:{},alertT:0};
}
export const getC=id=>ST.S.chars.find(c=>c.id===id),getE=id=>ST.S.enemies.find(e=>e.id===id);
export const selC=()=>getC(ST.S.sel);

export const DOORS=[];for(let f=0;f<3;f++)for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(isDoor(MAP[f][y][x]))DOORS.push({f,x,y,l:+MAP[f][y][x]});
export const KEYS=new Set();
export const TERMS={ '0,12,3':'accueil','1,3,5':'serveur' };
