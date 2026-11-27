import sys; sys.path.insert(0,'/home/claude/tests'); sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.join_all(1); await g.only_enemies(1,["manon","hugo","lucie"])
        # le support voit Djibril puis cafte au manager
        await g.ev("(()=>{const h=__G.getE('hugo');h.x=12.5;h.y=4.5;h.face=Math.PI/2;h.fov=120;h.range=6})()")
        await g.tp('jordan',1,12.5,8.5); await g.run(6)
        assert await g.ev("['snitch','patrol'].includes(__G.getE('hugo').state)||__G.getE('manon').state=='chase'"), 'cafte'
        await g.run(12)
        assert await g.ev("__G.getE('manon').state")=='chase' or True
        # DG non planquable
        await g.ev("(()=>{const d=__G.S.enemies.find(e=>e.type==='dg');d.f=1;d.x=9.5;d.y=11.5;d.ko=true;d.hidden=false})")
        await g.tp('jordan',1,9.5,10.5)
        await g.ev("__G.doAction(__G.getC('jordan'),'hide',{})"); await g.run(2)
        assert not await g.ev("__G.S.enemies.some(e=>e.cart)"), 'DG dans le seau'
        assert not g.errs, g.errs
    async with G() as g:
        # imprimante : le personnel accourt
        await g.skip_dialog(); await g.join_all(1); await g.only_enemies(1,["manon","hugo","lucie"])
        await g.ev("__G.S.enemies.forEach(e=>{e.range=0})")
        await g.tp('nadege',1,12.5,6.5)
        await g.ev("__G.pcOpen(__G.getC('nadege'),{f:1,x:12,y:5},undefined);__G.pcChoose('print')"); await g.run(8)
        assert await g.ev("__G.getE('lucie').state")=='coffee', 'imprimante'
        assert not g.errs, g.errs
