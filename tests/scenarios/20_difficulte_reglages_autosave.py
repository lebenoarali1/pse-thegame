"""Difficulté (durée et vigilance) choisie à l'accueil et mémorisée avec les réglages ; sauvegarde automatique au passage d'un étage."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.pg.reload(); await g.pg.wait_for_timeout(400)
        txt = lambda: g.ev("document.getElementById('bDiff').textContent")
        assert 'Cadre' in await txt(), await txt()
        await g.pg.click('#bDiff'); assert 'Directeur' in await txt()
        assert await g.ev("JSON.parse(localStorage.getItem('plansocial.settings')).diff") == 'directeur'
        await g.ev("document.getElementById('bCones').click()")
        await g.pg.reload(); await g.pg.wait_for_timeout(400)
        assert 'Directeur' in await txt(), 'difficulté mémorisée'
        assert await g.ev("JSON.parse(localStorage.getItem('plansocial.settings')).cones") is False, 'cônes mémorisés'
        await g.pg.click('#bStart'); await g.pg.wait_for_timeout(200)
    async with G() as g:
        await g.ev("localStorage.removeItem('plansocial.save')")
        await g.skip_dialog(); await g.join_all(1)
        await g.tp('kevin',1,12.5,8.5); await g.run(1)
        assert await g.ev("!!localStorage.getItem('plansocial.save')"), 'sauvegarde automatique attendue au premier étage'
        assert not g.errs, g.errs
