"""Mise en page mobile : portrait et paysage, cibles tactiles d'au moins 44 px, aucun débordement horizontal ; boutons rares derrière « ⋯ »."""
import sys; sys.path.insert(0,'tests')
from lib import G
JS = """(()=>{const r=[];document.querySelectorAll('button,.btn,.pa,.ab').forEach(b=>{const s=getComputedStyle(b);if(s.display==='none'||s.visibility==='hidden')return;const q=b.getBoundingClientRect();if(!q.width)return;if(q.width<43.5||q.height<43.5)r.push((b.id||b.className||b.tagName)+':'+q.width.toFixed(1)+'x'+q.height.toFixed(1))});return [r,document.documentElement.scrollWidth>innerWidth]})()"""
async def main():
    for w, h in ((390, 844), (844, 390), (360, 640)):
        async with G(w, h) as g:
            await g.skip_dialog(); await g.run(1)
            small, overflow = await g.ev(JS)
            assert not small, (w, h, small)
            assert not overflow, (w, h, 'débordement horizontal')
            assert not await g.pg.is_visible('#bSave'), 'bouton rare masqué par défaut'
            await g.pg.click('#bMore')
            assert await g.pg.is_visible('#bSave'), 'bouton rare visible derrière ⋯'
            assert not g.errs, g.errs
