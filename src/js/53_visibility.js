/* visibilité */
function enemyVisible(e){
  if(e.f!==view)return false;return true;
  if(e.type==='camera')return true;if(assist||S.team.fluxUntil>S.t)return true;
  if(e.state==='chase'||e.talk>0)return true;
  for(const c of S.chars){if(c.f!==e.f||c.hide)continue;const d=Math.hypot(c.x-e.x,c.y-e.y);if(d<=13&&los(e.f,c.x,c.y,e.x,e.y))return true}
  return false}
