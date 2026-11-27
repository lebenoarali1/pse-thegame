"""Djibril prend la tenue d'un vigile assommé, même planqué, et d'un agent de sécurité (Dylan)."""
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1); await g.only_enemies(1,["dylan"]); await g.blind_guards()
        await g.tp('jordan',1,9.5,11.5); await g.tp('marc',1,10.5,11.5)
        await g.ev("__G.getE('dylan').x=9.5;__G.getE('dylan').y=11.5")
        await g.ev("__G.doAction(__G.getC('jordan'),'ko',{eid:'dylan'})"); await g.run(4)
        assert await g.ev("__G.getE('dylan').ko")
        await g.ev("__G.doAction(__G.getC('jordan'),'hide',{})"); await g.run(5)
        assert await g.ev("__G.getE('dylan').hidden"), 'planqué'
        await g.ev("__G.doAction(__G.getC('marc'),'uniform',{})"); await g.run(8)
        assert await g.ev("__G.getC('marc').disguise")=='vigile', await g.ev("[__G.getC('marc').disguise,__G.getC('marc').busy,__G.getC('marc').order]")
        assert not g.errs, g.errs
