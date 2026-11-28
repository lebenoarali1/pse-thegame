"""Première minute guidée au RDC : les bulles « cône », « jauge » et « cacher » apparaissent au bon moment, une seule fois."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog()
        await g.run(8)
        seen = lambda: g.ev("JSON.parse(localStorage.getItem('plansocial.hints')||'[]')")
        await g.ev("(()=>{const d=__G.getE('dede');const k=__G.getC('kevin');k.x=d.x+2.2;k.y=d.y;d.face=Math.atan2(k.y-d.y,k.x-d.x);d.fov=120;d.range=8;d.state='patrol';d.path=[];d.wait=99;d.det=.4;__G.S.sel='kevin'})()")
        await g.run(1)
        s = await seen()
        assert 'cone' in s and 'jauge' in s and 'cacher' in s, s
        n = await g.ev("document.querySelectorAll('#toast .t.h').length")
        await g.run(3)
        assert await g.ev("document.querySelectorAll('#toast .t.h').length") <= n, 'les bulles ne doivent pas se répéter'
        assert not g.errs, g.errs
