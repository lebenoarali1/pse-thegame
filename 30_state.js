/* état */
const TL=480;/* durée de la partie en secondes de jeu (15 min d'horloge) */
let showCones=true,noLimit=false,dbg=false,S=null,view=0,pend=null,assist=false,paused=true,started=false,muted=false,spd=1;
let cam={x:0,y:0,free:false},zoom=1,P=[],PR=[],lastSave=null,fCount=0;

function newState(){
  const C=(id,name,x,y,sp,o)=>Object.assign({id,name,f:0,x,y,face:.78,path:[],order:null,busy:null,hide:false,disguise:null,run:false,cd:{q:0,e:0},sp,moving:false,say:'',sayT:0,stall:0,repath:0,runN:0},o||{});
  const E=(id,name,type,f,x,y,o)=>{const e=Object.assign({hx:x,hy:y,id,name,type,f,x,y,face:Math.PI/2,fov:80,range:8,sp:1.2,route:[],ri:0,loop:true,wait:0,idleFace:0,path:[],state:'patrol',det:0,tgt:null,look:null,ko:false,hidden:false,uniformTaken:false,talk:0,talkTo:null,scan:null,lose:0,repath:0,moving:false,say:'',sayT:0},o||{});e.home=JSON.parse(JSON.stringify(e.route));return e};
  const enemies=makeEnemies(E);
  return {t:0,over:null,sel:'kevin',age:0,talked:{},
    chars:makeChars(C),
    enemies,team:{code:false,key:false,camsUntil:0,fluxUntil:0,throws:5},doorHack:{},dOpen:{},dLatch:{},dLing:{},puddles:[],distCd:{},ev:{},flags:{},alertT:0};
}
const getC=id=>S.chars.find(c=>c.id===id),getE=id=>S.enemies.find(e=>e.id===id);
const selC=()=>getC(S.sel);

const DOORS=[];for(let f=0;f<3;f++)for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(isDoor(MAP[f][y][x]))DOORS.push({f,x,y,l:+MAP[f][y][x]});
const KEYS=new Set();
const TERMS={ '0,12,3':'accueil','1,3,5':'serveur' };
