import { ST } from './store';
import { los } from './pathing';
import type { Enemy } from './types';
/* visibilité */
export function enemyVisible(e: Enemy){
  if(e.f!==ST.view)return false;return true;
  if(e.type==='camera')return true;if(ST.assist||ST.S.team.fluxUntil>ST.S.t)return true;
  if(e.state==='chase'||e.talk>0)return true;
  for(const c of ST.S.chars){if(c.f!==e.f||c.hide)continue;const d=Math.hypot(c.x-e.x,c.y-e.y);if(d<=13&&los(e.f,c.x,c.y,e.x,e.y))return true}
  return false}
