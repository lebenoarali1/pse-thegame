"""Les flèches déplacent le personnage sélectionné (haut = vers le haut de l'écran), l'escalier se prend en marchant dessus."""
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog()
        await g.ev("__G.S.chars.forEach(c=>{if(c.id==='kevin'||c.id==='nadege')c.joined=true});__G.S.sel='kevin';__G.S.enemies.forEach(e=>{e.fov=1;e.range=.3})")
        await g.tp('kevin',0,12.5,11.5)
        p0=await g.ev("[__G.getC('kevin').x,__G.getC('kevin').y]")
        await g.ev("__G.KEYS.add('arrowup')"); await g.run(1)
        p1=await g.ev("[__G.getC('kevin').x,__G.getC('kevin').y]")
        assert p1[0]<p0[0] and p1[1]<p0[1], (p0,p1)
        await g.ev("__G.KEYS.clear()"); await g.run(.5)
        assert not await g.ev("__G.getC('kevin').moving")
        # vers l'escalier (19,1) : droite puis haut
        await g.tp('kevin',0,18.5,2.5)
        await g.ev("__G.KEYS.add('arrowright');__G.KEYS.add('arrowup')"); await g.run(3); await g.ev("__G.KEYS.clear()")
        assert await g.ev("__G.getC('kevin').f")==1, await g.ev("[__G.getC('kevin').f,__G.getC('kevin').x,__G.getC('kevin').y]")
        assert not g.errs, g.errs
