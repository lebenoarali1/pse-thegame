import { hline, mk, put, room, vline } from './mapHelpers';
/* Étage 2 : direction, bureau du DG, coffre */
export function buildFloor2(){
  /* --- Etage 2 --- */
  const c=mk();room(c,0,0,23,13);
  hline(c,6,1,22);vline(c,9,1,5);vline(c,14,1,5);
  c[6][4]='.';c[6][11]='.';c[6][18]='3';
  hline(c,9,1,22);for(const x of [5,6,16,17,18,19])c[9][x]='.';c[9][11]='.';
  vline(c,9,10,12);vline(c,14,10,12);
  put(c,[[3,3],[4,3],[5,3],[6,3]],'d');put(c,[[1,1],[8,5]],'p');
  put(c,[[11,1],[12,1]],'x');c[5][13]='c';
  c[1][22]='S';put(c,[[19,3],[20,3],[21,3]],'d');put(c,[[17,1],[18,1]],'c');put(c,[[15,5],[22,5]],'p');
  c[2][16]='V';c[8][16]='V';
  put(c,[[17,11],[18,11],[19,11]],'d');put(c,[[22,10],[15,12]],'p');
  c[11][2]='N';put(c,[[1,10],[8,12]],'p');
  c[11][11]='c';
  return c;
}
