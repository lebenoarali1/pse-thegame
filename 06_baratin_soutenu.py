"""Djibril déguisé attire un manager et le baratine aussi longtemps qu'on veut, fil des bêtises visible."""
from lib import G
async def main():
    async with G() as g:
        await g.join_all(1); await g.only_enemies(1,['manon'])
        await g.ev("(()=>{const m=__G.getE('manon');m.x=15.5;m.y=2.5;m.route=[{x:15.5,y:2.5,wait:99}];m.path=[]})()")
        for c in ('kevin','nadege','jordan'): await g.tp(c,1,2,12)
        await g.tp('marc',1,10.5,4.5); await g.ev("__G.getC('marc').disguise='manager'")
        await g.ev("__G.doAction(__G.getC('marc'),'talk',{eid:'manon'})"); await g.run(6)
        assert await g.ev("__G.getE('manon').talk>1e8"), 'Manon doit être scotchée'
        await g.run(40)
        assert await g.ev("__G.getE('manon').talk>1e8") and await g.ev("document.getElementById('bfeed').children.length")>=2
        await g.ev("__G.doAction(__G.getC('marc'),'talk')"); await g.run(4)
        assert await g.ev("__G.getC('marc').talking")==None
