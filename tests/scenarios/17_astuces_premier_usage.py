"""Chaque pouvoir affiche une astuce au premier usage seulement, mémorisée au rechargement ; « Revoir les astuces » les réinitialise."""
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog()
        await g.run(3)
        n = lambda: g.ev("document.querySelectorAll('#toast .t.h').length")
        assert await n() >= 1, "astuce de déplacement attendue"
        await g.ev("document.querySelectorAll('#toast .t').forEach(e=>e.remove())")
        await g.ev("__G.selectChar('kevin')")
        await g.pg.keyboard.press('e')
        assert await n() == 1, "astuce du lancer attendue au premier appui"
        await g.pg.keyboard.press('Escape')
        await g.ev("document.querySelectorAll('#toast .t').forEach(e=>e.remove())")
        await g.pg.keyboard.press('e'); await g.pg.keyboard.press('Escape')
        assert await n() == 0, "l'astuce ne doit pas se répéter"
        seen = await g.ev("JSON.parse(localStorage.getItem('plansocial.hints')||'[]')")
        assert 'throw' in seen and 'move' in seen, seen
        await g.pg.click('#bHelp'); await g.pg.click('#helpHints')
        assert await g.ev("localStorage.getItem('plansocial.hints')") is None, "les astuces doivent être réinitialisées"
        assert not g.errs, g.errs
