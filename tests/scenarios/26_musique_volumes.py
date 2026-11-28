"""Musique adaptative : calme au départ, tension puis poursuite selon les gardes ; volumes musique et effets réglables et mémorisés."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.run(3)
        await g.pg.wait_for_timeout(300)
        assert await g.ev("__G.musicMode")=='calm', await g.ev("__G.musicMode")
        await g.ev("__G.getE('dede').det=.5")
        await g.pg.wait_for_timeout(300)
        assert await g.ev("__G.musicMode")=='tension'
        await g.ev("__G.getE('dede').state='chase'")
        await g.pg.wait_for_timeout(300)
        assert await g.ev("__G.musicMode")=='chase'
        await g.ev("(()=>{const s=document.getElementById('volMusic');s.value='20';s.dispatchEvent(new Event('input'))})()")
        assert await g.ev("JSON.parse(localStorage.getItem('plansocial.settings')).music")==0.2
        assert not g.errs, g.errs
