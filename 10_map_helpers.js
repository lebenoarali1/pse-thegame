function mk(){const g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill(' '));return g}
function rect(g,x0,y0,x1,y1,c){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]=c}
function room(g,x0,y0,x1,y1){rect(g,x0,y0,x1,y1,'#');rect(g,x0+1,y0+1,x1-1,y1-1,'.')}
function vline(g,x,y0,y1,c='#'){for(let y=y0;y<=y1;y++)g[y][x]=c}
function hline(g,y,x0,x1,c='#'){for(let x=x0;x<=x1;x++)g[y][x]=c}
function put(g,l,c){for(const [x,y] of l)g[y][x]=c}
