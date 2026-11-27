"""Étage 1 : un gobelet de Kévin près de la plante, Dylan nettoie 10 s puis file à la cafétéria ; Nadia atteint Max sans être vue."""
from lib import G
async def main():
    async with G() as g:
        await g.join_all(1); await g.only_enemies(1,['dylan'])
        await g.tp('kevin',1,11.5,3.5); await g.tp('nadege',1,8.5,7.5); await g.run(1)
        await g.ev("__G.doAction(__G.getC('kevin'),'throw',{x:11.5,y:11.5})"); await g.run(5)
        assert await g.ev("__G.getE('dylan').state")=='clean'
        await g.tp('kevin',1,2.5,2.5)
        await g.ev("__G.gotoPos(__G.getC('nadege'),3.5,11.5)"); await g.run(11)
        assert not await g.ev("__G.getC('nadege').out") and await g.ev("__G.getC('nadege').x")<4.5
        assert await g.ev("__G.getE('dylan').state")=='coffee', 'Dylan doit aller prendre un café'
        await g.run(60)
        assert await g.ev("__G.getE('dylan').state")=='patrol', 'puis reprendre sa ronde'
