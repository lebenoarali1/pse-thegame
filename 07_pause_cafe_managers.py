"""Nadia, devant le PC de l'open space, envoie un SMS : le manager et les techniciens filent en salle serveur 45 s. À distance, impossible."""
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1); await g.blind_guards(); await g.ev("__G.S.enemies.forEach(e=>e.range=0)")
        await g.only_enemies(1,["manon","lucie","hugo","karim","dylan"])
        await g.tp('nadege',1,12.5,11.5)
        await g.ev("__G.doAction(__G.getC('nadege'),'hack',{kind:'term',x:12,y:5})"); await g.run(14)
        assert await g.ev("!!__G.pcm"), 'menu du PC'
        await g.ev("__G.pcChoose('notif')"); await g.run(30)
        st=await g.ev("['manon','hugo','karim','lucie'].map(i=>__G.getE(i).state)")
        assert st==['coffee','coffee','patrol','patrol'], st
        await g.run(12)
        assert await g.ev("__G.getE('hugo').cof&&__G.getE('hugo').cof.arrived"), 'Hugo en salle serveur'
        await g.run(40)
        assert await g.ev("__G.getE('hugo').state")=='patrol'
        assert not g.errs, g.errs
