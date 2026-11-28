"""Interrupteur ouvert à tous, icône d indices, Max nettoie au repos."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1)
        await g.ev("__G.S.enemies.forEach(e=>{e.range=0})")
        # n'importe qui éteint la lumière avec l'interrupteur
        await g.tp('kevin',1,19.0,11.5)
        await g.ev("__G.S.sel='kevin';__G.gotoPos(__G.getC('kevin'),19.5,11.5,{k:'switch'})"); await g.run(6)
        assert await g.ev("(__G.S.team.lightsOff||{})[1]>__G.S.t"), 'lumière coupée par Kévin'
        # indices
        await g.run(1); await g.pg.wait_for_timeout(800)
        assert 'code ?' in await g.ev("document.getElementById('clues').textContent"), 'icone indices'
        await g.ev("__G.S.team.dgInfo=true;__G.S.team.codeInfo=true"); await g.run(2); await g.pg.wait_for_timeout(800)
        assert '2/2' in await g.ev("document.getElementById('clues').textContent"), 'indices 2/2'
        # Max au repos nettoie la flaque voisine
        await g.tp('jordan',1,10.5,10.5)
        await g.ev("__G.S.puddles.push({f:1,x:10.5,y:11,t:0})"); await g.run(4)
        assert await g.ev("__G.S.puddles.length")==0, 'flaque nettoyée par Max'
        assert not g.errs, g.errs
