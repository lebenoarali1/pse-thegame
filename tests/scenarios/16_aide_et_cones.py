"""Écran des commandes (bouton et touche H) met en pause et restaure l'état ; le bouton cônes bascule l'affichage."""
from lib import G
async def main():
    async with G() as g:
        await g.ev("__G.paused=false")
        await g.pg.click('#bHelp')
        assert await g.pg.is_visible('#helpBox'), "aide attendue"
        assert await g.ev("__G.paused"), "l'aide doit mettre en pause"
        await g.pg.keyboard.press('h')
        assert not await g.pg.is_visible('#helpBox')
        assert not await g.ev("__G.paused"), "la pause doit être restaurée"
        before = await g.ev("__G.showCones")
        await g.pg.click('#bCones')
        assert await g.ev("__G.showCones") != before, "le bouton doit basculer les cônes"
        await g.pg.click('#bCones')
        assert await g.ev("__G.showCones") == before
        assert not g.errs, g.errs
