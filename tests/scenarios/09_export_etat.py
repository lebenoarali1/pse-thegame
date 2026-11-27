"""Export puis import de l'état : la partie reprend exactement où elle était."""
from lib import G
async def main():
    async with G() as g:
        await g.join_all(1); await g.run(5)
        await g.ev("document.getElementById('bState').click()")
        txt=await g.ev("document.getElementById('stTxt').value")
        assert len(txt)>500
        t=await g.ev("__G.S.t"); await g.run(10)
        await g.ev("document.getElementById('stLoad').click()")
        assert abs(await g.ev("__G.S.t")-t)<1.5, "l'état doit revenir au moment de l'export"
        assert not g.errs, g.errs
