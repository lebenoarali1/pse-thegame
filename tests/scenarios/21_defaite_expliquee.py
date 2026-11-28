"""Une défaite dit qui a vu et où (étage et zone) ; la sauvegarde automatique permet de reprendre."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1); await g.only_enemies(1,["manon","hugo"])
        await g.ev("(()=>{const h=__G.getE('hugo');h.ko=true;h.x=12.5;h.y=8.5;h.hidden=false;const m=__G.getE('manon');m.x=12.5;m.y=6.5;m.face=Math.PI/2;m.fov=120;m.range=8;m.state='patrol';m.path=[];m.wait=99})()")
        await g.tp('nadege',1,3.5,3.5)
        await g.run(3)
        assert await g.ev("__G.S.over")=='fail', 'corps attendu'
        t = await g.ev("document.getElementById('eP').textContent")
        assert "étage 1" in t and ("côté" in t or "au centre" in t), t
        assert await g.pg.is_visible('#bRetry'), 'reprise attendue'
        assert not g.errs, g.errs
