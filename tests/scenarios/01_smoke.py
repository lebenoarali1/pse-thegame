"""Le jeu démarre, dialogue d'intro et choix d'âge, aucune erreur JS."""
from lib import G
async def main():
    async with G() as g:
        await g.ev("__G.paused=false")
        assert await g.ev("!!__G.dlg"), "dialogue d'intro attendu"
        for _ in range(20):
            if await g.ev("!!__G.dlg"): await g.ev("__G.advDlg()")
        await g.run(2)
        assert not g.errs, g.errs
