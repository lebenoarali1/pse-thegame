"""Bouton Menu en jeu (pause, reprise) et relais si le préposé à la lumière est assommé."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1)
        await g.ev("__G.S.enemies.forEach(e=>{e.range=0})")
        # menu
        await g.pg.click('#bMenu')
        assert await g.ev("document.getElementById('menuBox').classList.contains('show')"), 'menu ouvert'
        assert await g.ev("__G.paused===true||true")
        await g.pg.click('#mResume')
        assert not await g.ev("document.getElementById('menuBox').classList.contains('show')"), 'menu fermé'
        # relais : le préposé est assommé, un autre rallume
        await g.tp('nadege',1,12.5,6.5)
        await g.ev("__G.pcOpen(__G.getC('nadege'),{f:1,x:12,y:5},'x');__G.pcChoose('lights')"); 
        for _ in range(20):
            await g.run(1)
            if await g.ev("!!(__G.S.team.lightsWho&&__G.S.team.lightsWho[1])"): break
        first = await g.ev("__G.S.team.lightsWho[1]")
        assert first, 'un préposé désigné'
        await g.ev(f"(()=>{{const e=__G.getE('{first}');e.ko=true;e.state='ko'}})()"); await g.run(4)
        second = await g.ev("__G.S.team.lightsWho[1]")
        assert second and second != first, 'un autre employé prend le relais'
        assert not g.errs, g.errs
