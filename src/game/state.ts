import { ST } from './store';
import type { Character, Enemy, GameState } from './types';
import { makeChars, makeEnemies } from './castData';
import { H, W } from './utils';
import { MAP, isDoor } from './levelData';
/* état */
export const TL=480;/* durée de la partie en secondes de jeu (15 min d'horloge) */
ST.showCones=true;ST.noLimit=false;ST.dbg=false;ST.S=null as unknown as GameState;ST.view=0;ST.pend=null;ST.assist=false;ST.paused=true;ST.started=false;ST.muted=false;ST.spd=1;
export let cam={x:0,y:0,free:false};ST.zoom=1;ST.P=[];ST.PR=[];ST.lastSave=null;ST.fCount=0;

export function newState(): GameState {
  const C=(id: string,name: string,x: number,y: number,sp: number,o?: Partial<Character>)=>Object.assign({id,name,f:0,x,y,face:.78,path:[],order:null,busy:null,hide:false,disguise:null,run:false,cd:{q:0,e:0},sp,moving:false,say:'',sayT:0,stall:0,repath:0,runN:0,talking:null,chatT:0,chatN:0},o||{});
  const E=(id: string,name: string,type: string,f: number,x: number,y: number,o?: Partial<Enemy>)=>{const e: Enemy=Object.assign({hx:x,hy:y,id,name,type,f,x,y,face:Math.PI/2,fov:80,range:8,sp:1.2,route:[],ri:0,loop:true,wait:0,idleFace:0,path:[],state:'patrol',det:0,tgt:null,look:null,ko:false,hidden:false,uniformTaken:false,koT:0,koDur:50,freeze:0,stall:0,talk:0,talkTo:null,scan:null,lose:0,repath:0,moving:false,say:'',sayT:0},o||{}) as Enemy;e.home=JSON.parse(JSON.stringify(e.route));return e};
  const enemies=makeEnemies(E);
  return {t:0,over:null,sel:'kevin',age:0,talked:{},
    chars:makeChars(C),
    enemies,team:{code:false,key:false,camsUntil:0,fluxUntil:0,throws:5},doorHack:{},dOpen:{},dLatch:{},dLing:{},puddles:[],distCd:{},ev:{},flags:{},alertT:0};
}
/** Renvoient undefined si l'id est inconnu ; le type reste non nul pour alléger les appels (les gardes `if(!c)` restent valables). */
export const getC=(id?: string | null): Character=>ST.S.chars.find(c=>c.id===id) as Character,getE=(id?: string | null): Enemy=>ST.S.enemies.find(e=>e.id===id) as Enemy;
export const selC=()=>getC(ST.S.sel);

export const DOORS: {f:number;x:number;y:number;l:number}[]=[];for(let f=0;f<3;f++)for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(isDoor(MAP[f][y][x]))DOORS.push({f,x,y,l:+MAP[f][y][x]});
export const KEYS=new Set();
export const TERMS: Record<string, string>={ '0,12,3':'accueil','1,3,5':'serveur' };
