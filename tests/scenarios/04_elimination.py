"""Un perso capturé est éliminé seul, la partie continue ; Kévin éliminé avant la clé = défaite."""
from lib import G
async def main():
    async with G() as g:
        await g.ev("__G.S.chars.forEach(c=>{if(c.id==='kevin'||c.id==='nadege')c.joined=true})")
        await g.ev("(()=>{const r=__G.getE('roger'),n=__G.getC('nadege');n.x=r.x+.5;n.y=r.y;r.state='chase';r.tgt='nadege'})()")
        await g.run(1.5)
        assert await g.ev("__G.getC('nadege').out"), 'Nadia doit être éliminée'
        assert not await g.ev("__G.S.over"), 'la partie continue'
        assert await g.ev("__G.S.sel")=='kevin'
    async with G() as g:
        await g.ev("__G.S.chars.forEach(c=>{if(c.id==='kevin'||c.id==='nadege')c.joined=true})")
        await g.ev("(()=>{const r=__G.getE('roger'),k=__G.getC('kevin');k.x=r.x+1.5;k.y=r.y;k.face=0;r.face=Math.atan2(0,-1)})()")
        await g.run(4)
        assert await g.ev("__G.S.over")=='fail', 'Kévin repéré avant la clé : échec'
