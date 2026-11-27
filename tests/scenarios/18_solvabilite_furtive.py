"""Preuve de solvabilité : une équipe jouée sans téléportation gagne en moins de 8 minutes de jeu (clé du coffre récupérée, sortie par l'ascenseur)."""
from lib import G
async def T(g): return await g.ev("__G.S.t")
async def wait_t(g,t):
    n=0
    while await T(g)<t and n<2000:
        n+=1
        await g.run(min(1,t-await T(g)))
        if await g.ev("__G.S.over==='fail'"): await fail(g,'partie perdue')
async def until(g,cond,maxs=60,label='',step=.5):
    for i in range(int(maxs/step)):
        if await g.ev(cond): return True
        await g.run(step)
        if await g.ev("!!__G.dlg"): await g.skip_dialog()
        if await g.ev("__G.S.over==='fail'"): await fail(g,'partie perdue')
    await fail(g,'délai dépassé : '+label)
async def fail(g,why=''):
    raise AssertionError(f"{why} t={await T(g)} etat={await stat(g)}")
async def go(g,cid,x,y,run=False,extra=''):
    if await g.ev(f"__G.getC('{cid}').out"):
        await fail(g,'perso éliminé : '+cid)
    await g.ev(f"__G.getC('{cid}').run={'true' if run else 'false'}")
    await g.ev(f"__G.gotoPos(__G.getC('{cid}'),{x},{y}{extra})")
async def pc(g,term,action,wait_effect=0):
    """Nadia pirate le PC term=(x,y,f) et choisit action ; attend la fin"""
    x,y=term
    await g.ev(f"__G.doAction(__G.getC('nadege'),'hack',{{kind:'term',x:{x},y:{y}}})")
    await until(g,"!!__G.pcm",30,'menu pc')
    await g.ev(f"__G.pcChoose('{action}')")
    await until(g,"!__G.getC('nadege').busy",40,'busy fin')
async def watch(g,secs,every=2):
    n=int(secs/every)
    for i in range(n):
        await g.run(every)
        if await g.ev("!!__G.dlg"): await g.skip_dialog()
        if await g.ev("__G.S.over==='fail'"): await fail(g,'partie perdue')
async def stat(g,label=''):
    return await g.ev("JSON.stringify({t:+__G.S.t.toFixed(0),ch:__G.S.chars.map(c=>c.id[0]+c.f+':'+Math.round(c.x)+','+Math.round(c.y)+(c.out?'X':'')),en:__G.S.enemies.filter(e=>e.f===1||e.f===0).map(e=>e.id.slice(0,3)+' '+e.state[0]+Math.round(e.x)+','+Math.round(e.y)+(e.ko?'K':'')+(e.hidden?'H':''))})")

async def phase_rdc(g):
    await g.skip_dialog()
    await go(g,'nadege',16.5,10.5); await go(g,'kevin',12.5,11.5); await watch(g,14,7)
    await g.ev("__G.doAction(__G.getC('nadege'),'clope',{eid:'dede'})"); await watch(g,18,9)
    await go(g,'nadege',16.5,8.5); await watch(g,3,3)
    await g.ev("__G.doAction(__G.getC('nadege'),'hack',{kind:'door',x:17,y:5})"); await watch(g,5,5)
    await wait_t(g,56)
    await g.ev("__G.doAction(__G.getC('kevin'),'throw',{x:8.5,y:4.5})"); await watch(g,1,1)
    for c in ('nadege','kevin'): await g.ev(f"__G.gotoPos(__G.getC('{c}'),19.5,1.5,{{k:'stairs',sx:19,sy:1}})")
    await until(g,"__G.getC('kevin').f===1&&__G.getC('nadege').f===1",30,'montée')
async def phase_f1_a(g):
    await wait_t(g,69)
    await go(g,'kevin',19.5,11.5)
    await g.ev("__G.doAction(__G.getC('nadege'),'hack',{kind:'term',x:15,y:8})")
    await until(g,"!!__G.pcm",20,'menu')
    await g.ev("__G.pcChoose('print')")
    await until(g,"__G.getE('manon').state==='coffee'",30,'print')
    await until(g,"__G.getC('marc').joined",20,'djibril')
    await until(g,"__G.getE('dylan').y<5.2",12,'dylan')
    await go(g,'kevin',3.5,11.5,True); await go(g,'nadege',3.5,5.5)
    await until(g,"__G.getC('jordan').joined",20,'max')
    await go(g,'kevin',4.5,2.5,True)
    await until(g,"__G.getC('nadege').x<4&&__G.getC('nadege').y<6",30,'nadia serveur')

async def phase_f1_b(g):
    """Max assomme Dylan puis Manon (cafe pour écarter Manon et Hugo), Nadia récupère le code."""
    await until(g,"__G.getC('kevin').y<4",30,'kevin serveur')
    await pc(g,(3,5),'code'); assert await g.ev("__G.S.team.code")
    await pc(g,(3,5),'cafe')
    await until(g,"__G.getE('dylan').state==='patrol'&&__G.getE('dylan').y>10.5",60,'dylan patrouille')
    await g.ev("__G.doAction(__G.getC('jordan'),'ko',{eid:'dylan'})")
    await until(g,"__G.getE('dylan').ko",20,'ko dylan')
    await g.ev("__G.doAction(__G.getC('jordan'),'hide')")
    await until(g,"__G.getE('dylan').hidden",20,'hide dylan')
    await until(g,"__G.getE('manon').state==='patrol'",80,'manon revient')
    await until(g,"(()=>{const m=__G.getE('manon');return m.state==='patrol'&&m.y>10&&m.x>11&&m.x<14.5})()",60,'manon couloir sud')
    await g.ev("__G.doAction(__G.getC('jordan'),'ko',{eid:'manon'})")
    await until(g,"__G.getE('manon').ko",20,'ko manon')
    await g.ev("__G.doAction(__G.getC('jordan'),'hide')")
    await until(g,"__G.getE('manon').hidden",20,'hide manon')

async def phase_f2(g):
    """Porte rouge ouverte tôt, caméras coupées juste avant la montée de Kévin, aller-retour dans la gaine."""
    await go(g,'marc',3.5,11.5); await go(g,'jordan',2.5,11.5)
    await wait_t(g,268)
    await go(g,'nadege',16.5,8.5)
    await until(g,"Math.hypot(__G.getC('nadege').x-16,__G.getC('nadege').y-8.5)<1.5",30,'nadia au PC est')
    await pc(g,(15,8),'door')
    await go(g,'nadege',3.5,5.5)
    await until(g,"__G.getC('nadege').x<4.5&&__G.getC('nadege').y<6",40,'nadia serveur 2')
    await go(g,'kevin',4.5,9.5)
    await wait_t(g,340)
    await pc(g,(3,5),'cams2')
    # le DG arrive à l'étage 1 (est), file en salle de réunion
    await until(g,"(()=>{const d=__G.getE('dg');return d.f===1&&d.x>19.5&&d.y>10})()",60,'dg en réunion')
    await go(g,'kevin',21.5,8.5,True)
    await until(g,"Math.hypot(__G.getC('kevin').x-21.5,__G.getC('kevin').y-8.5)<1",40,'kevin porte')
    await g.ev("__G.gotoPos(__G.getC('kevin'),22.5,7.5,{k:'stairs',sx:22,sy:7})")
    await until(g,"__G.getC('kevin').f===2",20,'kevin étage 2')
    for c in ('nadege','marc','jordan'): await go(g,c,8.5,7.5)
    await until(g,"(()=>{const d=__G.getE('drh');return d.x>12.5&&Math.abs(d.face)<.6})()",60,'drh passe x=12')
    await go(g,'kevin',9.5,8.5)
    await until(g,"(()=>{const d=__G.getE('drh');return d.x>18.2&&Math.abs(d.face)<.6})()",60,'drh à l est')
    await g.ev("__G.doAction(__G.getC('kevin'),'vent')")
    await until(g,"__G.getC('kevin').f===2&&__G.getC('kevin').y<5",30,'gaine')
    await g.ev("__G.gotoPos(__G.getC('kevin'),22.5,1.5,{k:'safe'})")
    await until(g,"__G.S.team.key",30,'coffre')
    # on rejoint l'escalier seulement quand le DG est revenu en salle (il va vérifier le bruit de l'escalier)
    await until(g,"(()=>{const d=__G.getE('dg');return d.f===1&&d.x>19.5&&d.y>10&&d.state==='patrol'})()",60,'dg revenu en salle')
    await until(g,"(()=>{const d=__G.getE('drh');return d.x>16.5&&Math.abs(d.face)<.6})()",90,'drh est retour')
    await g.ev("__G.doAction(__G.getC('kevin'),'vent')")
    await until(g,"__G.getC('kevin').y>6",30,'retour gaine',.05)
    await g.ev("__G.getC('kevin').run=true")
    assert await g.ev("__G.gotoPos(__G.getC('kevin'),2.5,11.5,{k:'stairs',sx:2,sy:11})"), 'ordre de descente refusé'
    for _ in range(40):
        await g.run(.25)
        k=await g.ev("JSON.stringify([+__G.S.t.toFixed(2),__G.getC('kevin').f,+__G.getC('kevin').x.toFixed(1),+__G.getC('kevin').y.toFixed(1),__G.getC('kevin').path.length,__G.getC('kevin').out,+__G.getE('drh').x.toFixed(1),+__G.getE('drh').det.toFixed(2),__G.getE('drh').state])")
        if await g.ev("__G.getC('kevin').f===1||__G.getC('kevin').out"):
            break

async def phase_exit(g):
    """Descente groupée au RDC, diversions (gobelet sur Dédé, clope sur Roger), sortie par l'ascenseur de service."""
    for c in ('nadege','marc','jordan','kevin'):
        await g.ev(f"__G.getC('{c}').run=false")
        await g.ev(f"__G.gotoPos(__G.getC('{c}'),20.5,8.6)")
    await until(g,"['nadege','marc','jordan','kevin'].every(c=>Math.hypot(__G.getC(c).x-20.5,__G.getC(c).y-8.6)<1.2||__G.getC(c).f!==1)",60,'groupe à l escalier')
    for c in ('nadege','marc','jordan','kevin'):
        await g.ev(f"__G.gotoPos(__G.getC('{c}'),20.5,7.5,{{k:'stairs',sx:20,sy:7}})")
    await until(g,"__G.S.chars.every(c=>c.f===0)",40,'tous au RDC')
    await g.ev("__G.doAction(__G.getC('kevin'),'throw',{x:13.5,y:10.5})")
    await g.ev("__G.doAction(__G.getC('nadege'),'clope',{eid:'roger'})")
    await watch(g,3,1); await stat(g,'diversions')
    for c in ('kevin','nadege','marc','jordan'):
        await g.ev(f"__G.gotoPos(__G.getC('{c}'),21.5,12.5)")
    await until(g,"__G.S.over==='win'",40,'victoire')

async def main():
    async with G() as g:
        await phase_rdc(g); await phase_f1_a(g); await phase_f1_b(g)
        await phase_f2(g); await phase_exit(g)
        assert await g.ev("__G.S.over") == 'win', 'victoire attendue'
        assert await T(g) < 480, 'victoire hors délai'
        assert await g.ev("__G.S.team.key"), 'clé du coffre attendue'
        assert not g.errs, g.errs
