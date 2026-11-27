"""Flaque de Max, réveil d'un assommé, costume retiré, portes qui restent ouvertes, caméras coupées, employés assis."""
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1); await g.only_enemies(1,["dylan","lucie"]); await g.blind_guards()
        # flaque : Dylan glisse et s'endort, puis se réveille
        await g.tp('jordan',1,9.5,10.5); await g.ev("__G.getE('dylan').x=9.5;__G.getE('dylan').y=11.5;__G.getE('dylan').route=[]")
        await g.ev("__G.doAction(__G.getC('jordan'),'puddle',{x:9.5,y:11.5})"); await g.run(2)
        assert await g.ev("__G.getE('dylan').ko"), 'Dylan glisse'
        await g.run(38); assert not await g.ev("__G.getE('dylan').ko"), 'Dylan se réveille'
        # un déguisé ne peut pas être viré, même vu de près
        await g.ev("__G.getC('marc').disguise='vigile';__G.getC('marc').x=9.5;__G.getC('marc').y=11.5;__G.getC('marc').f=1;__G.getE('dylan').fov=80;__G.getE('dylan').range=8;__G.getE('dylan').x=10.5;__G.getE('dylan').y=11.5")
        await g.run(5); assert not await g.ev("__G.getC('marc').out"), 'Djibril déguisé intouchable'
        # costume retiré
        await g.ev("__G.getC('marc').disguise='vigile'"); await g.ev("__G.doAction(__G.getC('marc'),'uniform')")
        assert not await g.ev("__G.getC('marc').disguise")
        # menu du PC : caméras
        await g.tp('nadege',1,12.5,6.5)
        await g.ev("__G.doAction(__G.getC('nadege'),'hack',{kind:'term',x:12,y:5})"); await g.run(10)
        assert await g.ev("!!__G.pcm")
        await g.ev("__G.pcChoose('cam')"); await g.run(8)
        assert await g.ev("(__G.S.team.camsOff||{})[1]>__G.S.t")
        # porte ouverte reste ouverte
        await g.tp('kevin',1,20.5,8.5)
        await g.tp('nadege',1,20.5,8.5)
        await g.ev("__G.doAction(__G.getC('nadege'),'hack',{kind:'door',x:21,y:7})"); await g.run(14)
        await g.tp('nadege',1,3.5,3.5); await g.tp('kevin',1,3.5,3.5); await g.run(6)
        assert await g.ev("__G.S.dOpen['1,21,7']"), 'la porte reste ouverte'
        assert not g.errs, g.errs
