"""Outils de test : Chrome sans tête, jeu chargé depuis dist/index.html, temps simulé."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import functools, http.server, threading
DIST = os.path.join(ROOT, 'dist')

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIST)
    h.log_message = lambda *a, **k: None
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv
OUT = os.path.join(ROOT, 'tests', 'out')
os.makedirs(OUT, exist_ok=True)

class G:
    def __init__(self, w=900, h=620): self.w, self.h = w, h
    async def __aenter__(self):
        self.srv = serve(); URL = f'http://127.0.0.1:{self.srv.server_port}/#novid'
        self.p = await async_playwright().start()
        self.b = await self.p.chromium.launch(channel='chrome', args=['--no-sandbox'])
        self.pg = await self.b.new_page(viewport={'width': self.w, 'height': self.h})
        self.errs = []
        self.pg.on('console', lambda m: self.errs.append(m.text) if m.type == 'error' and 'ERR_TUNNEL' not in m.text else None)
        self.pg.on('pageerror', lambda e: self.errs.append('PAGEERR: ' + str(e)))
        await self.pg.goto(URL); await self.pg.wait_for_timeout(300)
        await self.pg.click('#bStart')
        await self.pg.evaluate("__G.paused=true")
        return self
    async def __aexit__(self, *a):
        await self.b.close(); await self.p.stop(); self.srv.shutdown()
    async def ev(self, js): return await self.pg.evaluate(js)
    async def run(self, secs):
        """Avance la simulation de `secs` secondes (pas de 0,05 s)."""
        await self.ev(f"(()=>{{let n={int(secs*20)};for(let i=0;i<n;i++){{__G.update(0.05);if(__G.S.over)break}}}})()")
    async def shot(self, name):
        await self.pg.wait_for_timeout(250)
        await self.pg.screenshot(path=os.path.join(OUT, name + '.png'))
    async def skip_dialog(self):
        for _ in range(6):
            if await self.ev("!!__G.dlg"): await self.ev("document.getElementById('dSkip').click()")
    # raccourcis de mise en scène
    async def join_all(self, floor=1): await self.ev(f"__G.S.chars.forEach(c=>{{c.joined=true;c.f={floor}}})")
    async def tp(self, cid, f, x, y): await self.ev(f"(()=>{{const c=__G.getC('{cid}');c.f={f};c.x={x};c.y={y};c.path=[];c.order=null}})()")
    async def only_enemies(self, floor, keep):
        await self.ev(f"__G.S.enemies.forEach(e=>{{if(e.f==={floor}&&!{json.dumps(keep)}.includes(e.id)){{e.ko=true;e.hidden=true}}}})")
    async def blind_guards(self): await self.ev("__G.S.enemies.forEach(e=>{e.fov=1;e.range=.3})")
    async def state(self):
        return json.loads(await self.ev("JSON.stringify({over:__G.S.over,t:+__G.S.t.toFixed(1),team:__G.S.team,chars:__G.S.chars.map(c=>[c.id,c.f,+c.x.toFixed(1),+c.y.toFixed(1),c.disguise,c.busy&&c.busy.k,c.hide,!!c.out]),en:__G.S.enemies.filter(e=>e.type!=='camera').map(e=>[e.id,e.f,+e.x.toFixed(1),+e.y.toFixed(1),e.state,e.ko,e.hidden,+e.det.toFixed(2)])})"))
