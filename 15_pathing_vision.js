/* passages / vue : A*, ligne de vue, cônes */
function passable(f,x,y){if(x<0||y<0||x>=W||y>=H)return false;return !SOLID.has(MAP[f][y][x])}
const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function findPath(f,sx,sy,tx,ty){
  if(!passable(f,tx,ty)){let best=null,bd=1e9;
    for(let r=1;r<=2&&!best;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const x=tx+dx,y=ty+dy;if(passable(f,x,y)){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=[x,y]}}}
    if(!best)return null;tx=best[0];ty=best[1]}
  if(sx===tx&&sy===ty)return [[tx+.5,ty+.5]];
  const key=(x,y)=>y*W+x,g=new Map(),from=new Map(),closed=new Set(),open=[[0,sx,sy]];g.set(key(sx,sy),0);
  while(open.length){
    let bi=0;for(let i=1;i<open.length;i++)if(open[i][0]<open[bi][0])bi=i;
    const [,cx,cy]=open.splice(bi,1)[0],ck=key(cx,cy);
    if(closed.has(ck))continue;closed.add(ck);
    if(cx===tx&&cy===ty){const p=[];let k=ck;while(k!==key(sx,sy)){p.push([(k%W)+.5,Math.floor(k/W)+.5]);k=from.get(k)}return p.reverse()}
    for(const [dx,dy] of DIRS){const nx=cx+dx,ny=cy+dy;if(!passable(f,nx,ny))continue;
      if(dx&&dy&&(!passable(f,cx+dx,cy)||!passable(f,cx,cy+dy)))continue;
      const nk=key(nx,ny);if(closed.has(nk))continue;const ng=g.get(ck)+(dx&&dy?1.414:1);
      if(g.has(nk)&&g.get(nk)<=ng)continue;g.set(nk,ng);from.set(nk,ck);open.push([ng+Math.hypot(tx-nx,ty-ny),nx,ny])}
  }
  return null;
}
function blocksSight(f,x,y){const i=Math.floor(x),j=Math.floor(y),c=ch(f,i,j);
  if(c==='#'||c===' '||c==='c'||c==='r')return true;
  if(isDoor(c))return !S.dOpen[f+','+i+','+j];return false}
function los(f,x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/.2);
  for(let i=1;i<n;i++){const t=i/n;if(blocksSight(f,x0+(x1-x0)*t,y0+(y1-y0)*t))return false}return true}
function conePoly(e){const pts=[[e.x,e.y]],fov=e.fov*Math.PI/180,st=Math.max(10,Math.round(e.fov/4));
  for(let i=0;i<=st;i++){const a=e.face-fov/2+fov*i/st,ca=Math.cos(a),sa=Math.sin(a);let d=0;
    while(d<e.range){d+=.2;if(blocksSight(e.f,e.x+ca*d,e.y+sa*d)){d-=.1;break}}
    pts.push([e.x+ca*d,e.y+sa*d])}return pts}
