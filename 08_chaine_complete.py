"""Chaîne complète de mécaniques jusqu'à la victoire (gardes aveugles : teste les règles, pas la furtivité)."""
from lib import G
async def main():
    async with G() as g:
        await g.join_all(1); await g.only_enemies(1,['manon']); await g.blind_guards()
        await g.ev("(()=>{const m=__G.getE('manon');m.x=15.5;m.y=2.5;m.route=[{x:15.5,y:2.5,wait:999}];m.path=[]})()")
        # 1. Max assomme un manager, Djibril prend le costume
        await g.tp('jordan',1,14.5,2.5); await g.tp('marc',1,14.5,3.5)
        await g.ev("__G.doAction(__G.getC('jordan'),'ko',{eid:'manon'})"); await g.run(3)
        assert await g.ev("__G.getE('manon').ko"), 'Manon assommée'
        await g.ev("__G.doAction(__G.getC('marc'),'uniform')"); await g.run(5)
        assert await g.ev("__G.getC('marc').disguise")=='manager', 'Djibril déguisé'
        await g.ev("__G.doAction(__G.getC('jordan'),'hide')"); await g.run(5)
        # 2. Nadia : code du coffre (serveur étage 1), puis caméras
        await g.tp('nadege',1,3.5,6.5)
        await g.ev("__G.doAction(__G.getC('nadege'),'hack',{kind:'term',x:3,y:5})"); await g.run(45)
        await g.ev("__G.pcChoose('code')"); await g.run(14)
        assert await g.ev("__G.S.team.code"), 'code récupéré'
        await g.ev("__G.getC('nadege').cd.e=0;__G.doAction(__G.getC('nadege'),'hack',{kind:'term',x:3,y:5})"); await g.run(5)
        await g.ev("__G.pcChoose('cams2')"); await g.run(10)
        assert await g.ev("__G.S.team.camsUntil")>await g.ev("__G.S.t"), 'caméras coupées'
        # 3. le DG quitte son bureau (événement de 17h55)
        await g.ev("__G.S.t=325"); await g.run(2)
        # 4. Djibril ouvre la porte 2, Kévin monte
        await g.tp('marc',1,21.5,8.5); await g.tp('kevin',1,21.5,8.5)
        await g.ev("__G.gotoPos(__G.getC('kevin'),22.5,7.5,{k:'stairs',sx:22,sy:7})"); await g.run(8)
        assert await g.ev("__G.getC('kevin').f")==2, 'Kévin à l\'étage 2 : '+str(await g.state())
        # 5. gaine, coffre
        await g.ev("__G.doAction(__G.getC('kevin'),'vent')"); await g.run(25)
        assert await g.ev("__G.getC('kevin').y")<5, 'Kévin dans le bureau du DG'
        await g.ev("__G.gotoPos(__G.getC('kevin'),22.5,1.5,{k:'safe'})"); await g.run(15)
        assert await g.ev("__G.S.team.key"), 'clé récupérée'
        await g.ev("__G.S.t=345")  # la simulation accélérée consomme du temps de jeu : on le remet à une valeur réaliste
        # 6. retour : gaine, escaliers, RDC
        await g.ev("__G.doAction(__G.getC('kevin'),'vent')"); await g.run(25)
        await g.ev("__G.gotoPos(__G.getC('kevin'),2.5,11.5,{k:'stairs',sx:2,sy:11})"); await g.run(30)
        assert await g.ev("__G.getC('kevin').f")==1, 'Kévin redescendu : '+str(await g.state())
        await g.ev("__G.gotoPos(__G.getC('kevin'),20.5,7.5,{k:'stairs',sx:20,sy:7})"); await g.run(8)
        assert await g.ev("__G.getC('kevin').f")==0, 'Kévin au RDC'
        await g.ev("__G.S.t=400")
        for c in ('nadege','marc','jordan'):
            await g.tp(c,0,19.5,2.5)
        for c in ('kevin','nadege','marc','jordan'):
            await g.ev(f"__G.gotoPos(__G.getC('{c}'),21.5,12.5)")
        await g.run(25)
        assert await g.ev("__G.S.over")=='win', 'victoire : '+str(await g.state())
        assert not g.errs, g.errs
