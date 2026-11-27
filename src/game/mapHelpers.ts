import { H, W } from './utils';
export function mk(){const g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill(' '));return g}
export function rect(g: string[][],x0: number,y0: number,x1: number,y1: number,c: string){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]=c}
export function room(g: string[][],x0: number,y0: number,x1: number,y1: number){rect(g,x0,y0,x1,y1,'#');rect(g,x0+1,y0+1,x1-1,y1-1,'.')}
export function vline(g: string[][],x: number,y0: number,y1: number,c='#'){for(let y=y0;y<=y1;y++)g[y][x]=c}
export function hline(g: string[][],y: number,x0: number,x1: number,c='#'){for(let x=x0;x<=x1;x++)g[y][x]=c}
export function put(g: string[][],l: number[][],c: string){for(const [x,y] of l)g[y][x]=c}
