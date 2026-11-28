"""Les bruits (course, gobelet) dessinent un cercle qui s'étend ; les employés lancent des répliques d'ambiance selon l'heure et la coupure de lumière."""
import sys; sys.path.insert(0,'tests')
from lib import G
async def main():
    async with G() as g:
        await g.skip_dialog(); await g.run(1)
        await g.ev("(()=>{const k=__G.getC('kevin');k.run=true;__G.S.sel='kevin';__G.gotoPos(k,k.x+4,k.y)})()")
        await g.run(2)
        assert await g.ev("__G.P.some(p=>p.ring&&p.sz>0)"), 'cercle de bruit attendu quand on court'
        # réplique d'ambiance : on force le bavardage d'un employé calme
        await g.ev("(()=>{const e=__G.getE('dede');e.state='patrol';e.talk=0;e.chat=0;e.sayT=0;__G.S.t=400})()")
        await g.run(1)
        assert await g.ev("!!__G.getE('dede').say"), 'réplique attendue'
        assert not g.errs, g.errs
