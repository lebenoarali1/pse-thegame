"""Étage 2 : Nadia convoque la DRH, éloigne Brigitte (copies) et avance la réunion du DG ; un appui tactile ne valide pas le premier bouton du menu."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(2)
        await g.ev("__G.S.enemies.forEach(e=>{e.range=0})")
        await g.tp('nadege',2,6.5,4.5)
        await g.ev("__G.pcOpen(__G.getC('nadege'),{f:2,x:6,y:3},'x')")
        txt = await g.ev("document.getElementById('pcm').textContent")
        for k in ("Entretien d'évaluation", "12 copies", "Avancer la réunion"): assert k in txt, k
        # clic fantôme : refusé juste après l'ouverture, accepté ensuite
        await g.ev("document.querySelector('#pcm .pa').click()")
        assert not await g.ev("!!__G.getC('nadege').busy"), 'clic fantôme accepté'
        await g.pg.wait_for_timeout(600)
        await g.ev("document.querySelector('#pcm .pa').click()")
        assert await g.ev("!!__G.getC('nadege').busy"), 'clic réel refusé'
        await g.run(8)
        for k in ('eval','copies','meeting'):
            await g.ev(f"__G.pcOpen(__G.getC('nadege'),{{f:2,x:6,y:3}},'x');__G.pcChoose('{k}')"); await g.run(8)
        assert await g.ev("__G.getE('drh').state")=='coffee', 'DRH convoquée'
        assert await g.ev("__G.getE('brigitte').state")=='coffee', 'Brigitte aux copies'
        assert await g.ev("__G.S.ev[320]===1 && __G.getE('dg').route.length>3"), 'DG parti en réunion'
        await g.ev("__G.pcOpen(__G.getC('nadege'),{f:2,x:6,y:3},'x')")
        assert 'Avancer la réunion' not in await g.ev("document.getElementById('pcm').textContent")
        assert not g.errs, g.errs
