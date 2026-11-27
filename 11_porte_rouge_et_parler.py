"""Porte rouge : Nadia la pirate de près et monte à R+2. On peut parler à un employé calme, qui ne repère personne."""
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1)
        await g.only_enemies(1,["lucie","hugo","karim"])
        # un employé n'est pas dangereux : Nadia reste à côté sans être repérée
        await g.tp('nadege',1,10.5,5.5); await g.tp('kevin',1,9.5,5.5); await g.run(6)
        assert not (await g.state())['over'] and await g.ev("__G.getE('lucie').det")==0
        await g.ev("__G.S.sel='kevin';__G.gotoPos(__G.getC('kevin'),8.5,4.5,{k:'chat',eid:'lucie'})"); await g.run(4)
        assert await g.ev("!!__G.getE('lucie').say"), 'Lucie répond'
        # porte rouge
        await g.tp('nadege',1,20.5,8.5); await g.tp('kevin',1,20.5,8.5)
        await g.ev("__G.doAction(__G.getC('nadege'),'hack',{kind:'door',x:21,y:7})"); await g.run(10)
        await g.ev("__G.gotoPos(__G.getC('kevin'),22.5,7.5,{k:'stairs',sx:22,sy:7})"); await g.run(8)
        assert await g.ev("__G.getC('kevin').f")==2, await g.state()
        assert not g.errs, g.errs
