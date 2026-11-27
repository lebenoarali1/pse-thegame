import { hline, mk, put, room, vline } from './mapHelpers';
/* RDC : accueil, hall, portillon bleu, ascenseur de service */
export function buildFloor0(){
  /* --- RDC --- */
  const a=mk();room(a,0,0,23,13);
  vline(a,5,1,12);a[5][5]='.';a[6][5]='.';
  vline(a,17,1,12);a[5][17]='1';
  put(a,[[1,1],[1,2],[1,11],[1,12],[3,12],[4,12]],'c');a[10][5]='.';a[11][5]='.';
  put(a,[[6,1],[6,12],[16,12],[22,1],[18,12]],'p');
  hline(a,3,8,12,'d');a[3][12]='T';
  put(a,[[10,7],[11,7]],'c');
  put(a,[[7,9],[8,9],[14,9],[15,9],[12,6]],'b');
  put(a,[[19,7],[20,7],[21,7],[22,7]],'c');
  a[1][19]='U';a[12][21]='X';put(a,[[14,1]],'x');
  return a;
}
