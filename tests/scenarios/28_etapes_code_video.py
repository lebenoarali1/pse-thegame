"""Étapes indispensables, dialogue avec retour arrière : liste lisible, deux voies pour le code (Djibril puis Nadia, ou Max sur le DG) ; la vidéo marque un temps à chaque changement de scène."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1)
        await g.pg.click('#obj')
        txt = await g.ev("document.getElementById('goalList').textContent")
        assert 'Le code du coffre' in txt and 'Max assomme le DG' in txt and 'Djibril' in txt, txt
        await g.pg.click('#goalClose')
        # voie A : Djibril fait parler la manageuse en chef
        await g.ev("__G.S.enemies.forEach(e=>{e.range=0})")
        await g.tp('marc',1,12.5,5.5)
        await g.ev("(()=>{const m=__G.getE('manon'),d=__G.getC('marc');m.x=13.5;m.y=5.5;m.talk=1e9;d.talking='manon';d.chatN=0;d.chatT=.4})()")
        await g.run(14)
        assert await g.ev("!!__G.S.team.codeInfo"), 'information sur le code attendue'
        # voie B : Max assomme le DG
        await g.tp('jordan',2,20.5,4.5)
        await g.ev("(()=>{const d=__G.getE('dg');d.x=21;d.y=4.5;d.state='patrol';d.path=[];__G.doAction(__G.getC('jordan'),'ko',{eid:'dg',x:d.x,y:d.y})})()")
        await g.run(6)
        assert await g.ev("__G.S.team.code===true && __G.S.team.codeBy==='max'"), 'code volé au DG'
        assert not g.errs, g.errs
    # dialogue : retour à la réplique précédente
    async with G() as g:
        await g.ev("__G.paused=false")
        await g.pg.wait_for_timeout(300)
        assert await g.pg.is_visible('#dlg'), 'dialogue ouvert au départ'
        t1 = await g.ev("document.getElementById('dTxt').textContent")
        for _ in range(2):
            await g.pg.click('#dlg'); await g.pg.wait_for_timeout(60); await g.pg.click('#dlg'); await g.pg.wait_for_timeout(60)
        t2 = await g.ev("document.getElementById('dTxt').textContent")
        assert t2 != t1
        await g.pg.click('#dBack'); await g.pg.wait_for_timeout(100)
        t3 = await g.ev("document.getElementById('dTxt').textContent")
        assert t3 != t2, 'le bouton retour doit changer la réplique'
        await g.pg.click('#dlg', button='right'); await g.pg.wait_for_timeout(100)
        assert await g.pg.is_visible('#dlg')
    # vidéo : un temps d'arrêt doit survenir
    async with G() as g:
        await g.pg.goto(g.pg.url.split('#')[0]); await g.pg.wait_for_timeout(400)
        ok = False
        for _ in range(40):
            await g.pg.wait_for_timeout(400)
            if await g.ev("__G.VID.hold>0"): ok = True; break
        assert ok, 'temps d\'arrêt attendu dans la vidéo'
