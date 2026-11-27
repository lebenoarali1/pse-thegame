"""Étage 1 : recrutement de Djibril (salle de réunion) et de Max (toilettes)."""
from lib import G
async def main():
    async with G() as g:
        await g.ev("__G.S.chars.forEach(c=>{if(c.id==='kevin'||c.id==='nadege')c.joined=true})")
        await g.only_enemies(0,[]); await g.only_enemies(1,[]); await g.skip_dialog()
        await g.tp('kevin',1,20.5,10.8); await g.ev("__G.selectChar('kevin')"); await g.run(.5)
        assert await g.ev("!!__G.dlg"), 'dialogue Djibril'
        await g.skip_dialog()
        await g.tp('nadege',1,3.5,11.5); await g.run(.5); await g.skip_dialog()
        j=await g.ev("JSON.stringify(__G.S.chars.map(c=>[c.id,!!c.joined]))")
        assert j=='[["kevin",true],["nadege",true],["marc",true],["jordan",true]]', j
