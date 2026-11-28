"""Hiérarchie des ordres (serveur avant gobelet avant café), interrupteur visible, double appui qui fait courir."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1)
        await g.ev("__G.S.enemies.forEach(e=>{e.range=0})")
        # SMS serveur, puis gobelet, puis café : le manager reste en route vers le serveur
        mgr = await g.ev("__G.S.enemies.find(e=>e.f===1&&!e.ko&&(e.type==='manager'||e.tech)).id")
        await g.tp('nadege',1,12.5,6.5)
        await g.ev("__G.pcOpen(__G.getC('nadege'),{f:1,x:12,y:5},'x');__G.pcChoose('notif')"); await g.run(12)
        assert await g.ev(f"__G.getE('{mgr}').pri")==6, 'ordre serveur attendu'
        await g.ev(f"(()=>{{const e=__G.getE('{mgr}');__G.hear(1,e.x,e.y,9)}})()")
        await g.ev("__G.pcOpen(__G.getC('nadege'),{f:1,x:12,y:5},'x');__G.pcChoose('cafe')"); await g.run(12)
        assert await g.ev(f"__G.getE('{mgr}').pri")==6, 'le serveur reste prioritaire'
        assert await g.ev(f"__G.getE('{mgr}').state")=='coffee' and await g.ev(f"__G.getE('{mgr}').cof.lines.length")>0
        # double appui : le personnage court jusqu'à destination puis reprend la marche
        await g.ev("__G.S.sel='kevin';__G.gotoPos(__G.getC('kevin'),__G.getC('kevin').x+5,__G.getC('kevin').y)")
        await g.pg.mouse.click(600,400); await g.pg.mouse.click(600,400)
        assert await g.ev("__G.getC('kevin').run===true"), 'course attendue au double appui'
        await g.run(12)
        assert await g.ev("__G.getC('kevin').run===false"), 'retour à la marche attendu'
        assert not g.errs, g.errs
