"""RDC : Kévin jette un gobelet (Roger nettoie), Nadia lance une clope à Dédé (fumoir), pirate le portillon, tous deux montent."""
from lib import G
async def main():
    async with G() as g:
        await g.ev("__G.S.chars.forEach(c=>{if(c.id==='kevin'||c.id==='nadege')c.joined=true})")
        P="__G.gotoPos(__G.getC('%s'),%s,%s)"
        await g.ev(P%('nadege',16.5,10.5)); await g.ev(P%('kevin',12.5,11.5)); await g.run(14)
        assert not (await g.state())['over'], 'repéré sur le bord sud'
        # Nadia attire Dédé (second garde) au fumoir : 60 s, vue réduite
        dede=await g.ev("__G.getE('dede').state")
        await g.ev("__G.doAction(__G.getC('nadege'),'clope',{eid:'dede'})"); await g.run(18)
        assert await g.ev("[__G.getE('dede').state,__G.getE('dede').range]")==['break',2.3], await g.ev("[__G.getE('dede').state,__G.getE('dede').x,__G.getE('dede').y]")
        await g.ev(P%('nadege',16.5,8.5)); await g.run(3)
        await g.ev("__G.doAction(__G.getC('nadege'),'hack',{kind:'door',x:17,y:5})"); await g.run(5)
        # Kévin jette un gobelet au nord-ouest : Roger va nettoyer 10 s
        await g.ev("__G.doAction(__G.getC('kevin'),'throw',{x:8.5,y:4.5})"); await g.run(5)
        assert await g.ev("__G.getE('roger').state")=='clean'
        for c in ('nadege','kevin'): await g.ev(f"__G.gotoPos(__G.getC('{c}'),19.5,1.5,{{k:'stairs',sx:19,sy:1}})")
        await g.only_enemies(1,[]); await g.run(12); s=await g.state()
        assert not s['over'] and all(c[1]==1 for c in s['chars'][:2]), s['chars'][:2]
        assert not g.errs, g.errs
