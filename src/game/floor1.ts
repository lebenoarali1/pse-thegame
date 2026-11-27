import { hline, mk, put, room, vline } from './mapHelpers';
/* Étage 1 : open space, serveur, salle de réunion (Djibril), toilettes (Max) */
export function buildFloor1(){
  /* --- Etage 1 --- */
  const b=mk();room(b,0,0,23,13);
  vline(b,6,1,5);hline(b,6,0,6);b[3][6]='.';
  vline(b,18,1,12);for(const y of [3,4,7,8,11])b[y][18]='.';
  hline(b,6,18,23);hline(b,9,18,23);
  b[7][20]='N';b[7][21]='2';b[7][22]='U';b[8][22]='#';
  hline(b,1,1,5,'r');put(b,[[2,3],[3,3]],'r');b[5][3]='T';
  for(const y of [2,3])for(const x of [8,9,12,13,16,17])b[y][x]='d';
  for(const y of [8,9])for(const x of [2,3,6,7,10,11,14,15])b[y][x]='d';
  put(b,[[6,10],[7,10]],'c');put(b,[[16,11],[7,1],[17,12]],'p');hline(b,10,1,5);vline(b,5,10,12);b[11][5]='.';b[12][1]='c';b[12][4]='b';b[11][10]='p';b[5][12]='T';
  b[1][22]='m';b[1][21]='m';put(b,[[20,3],[21,3],[20,4],[21,4]],'d');put(b,[[19,5],[22,5]],'b');
  put(b,[[20,11],[21,11]],'d');put(b,[[14,1]],'x');
  return b;
}
