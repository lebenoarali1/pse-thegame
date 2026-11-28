"""Nadia coupe la lumière de l'étage 60 s : on n'est vu que de très près, un employé rallume ; au RDC le menu ne propose pas les caméras."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog()
        await g.ev("__G.pcOpen(__G.getC('nadege'),{f:0,x:16,y:10},'x')")
        txt = await g.ev("document.getElementById('pcm').textContent")
        assert 'Éteindre la lumière' in txt, 'action lumière attendue'
        assert 'caméras' not in txt.lower(), 'pas de caméras au RDC'
        await g.ev("__G.pcClose&&0")
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1)
        await g.only_enemies(1,["manon"])
        await g.ev("__G.getE('manon').range=0")
        await g.tp('nadege',1,12.5,6.5)
        await g.ev("__G.pcOpen(__G.getC('nadege'),{f:1,x:12,y:5},'x');__G.pcChoose('lights')"); await g.run(6)
        assert await g.ev("!!__G.S.flags.pc_lights"), 'lumière coupée'
        await g.run(60)
        assert await g.ev("!(__G.S.team.lightsOff[1]>__G.S.t)"), 'un employé doit rallumer'
        await g.ev("__G.S.team.lightsOff[1]=__G.S.t+60")
        # dans le noir, un manager qui regarde Djibril à 5 cases ne le voit pas
        await g.ev("(()=>{const m=__G.getE('manon');m.state='patrol';m.x=12.5;m.y=9.5;m.face=-Math.PI/2;m.fov=120;m.range=8;m.det=0;m.cof=null;m.path=[];m.wait=99})()")
        await g.tp('marc',1,12.5,4.5); await g.run(3)
        assert await g.ev("__G.getE('manon').det")<0.05, 'ne doit rien voir dans le noir'
        assert not g.errs, g.errs
