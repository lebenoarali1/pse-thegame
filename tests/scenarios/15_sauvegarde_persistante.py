"""La sauvegarde rapide survit au rechargement de la page et se reprend depuis l'écran d'accueil ; la version s'affiche."""
from lib import G
async def main():
    async with G() as g:
        await g.run(1)
        for _ in range(20):
            if await g.ev("!!__G.dlg"): await g.ev("__G.advDlg()")
        await g.run(5)
        t0 = await g.ev("__G.S.t")
        await g.pg.click('#bSave')
        assert await g.ev("!!localStorage.getItem('plansocial.save')"), "sauvegarde absente du stockage"
        await g.pg.reload(); await g.pg.wait_for_timeout(400)
        assert await g.pg.is_visible('#bResume'), "bouton Reprendre attendu"
        ver = await g.pg.inner_text('#ver')
        assert ver.startswith('Version 1.'), ver
        await g.pg.click('#bResume')
        await g.pg.wait_for_timeout(300)
        await g.ev("__G.paused=true")
        t1 = await g.ev("__G.S.t")
        assert abs(t1 - t0) < 1.5, (t0, t1)
        assert not g.errs, g.errs
