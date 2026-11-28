// Génère le site de documentation (dist/docs) à partir des fichiers Markdown du dépôt.
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const out = path.join(root, 'dist', 'docs');
const pages = [
  { file: 'docs/MCO.md', slug: 'index', title: 'MCO et mode opératoire' },
  { file: 'docs/ARCHITECTURE.md', slug: 'architecture', title: 'Architecture du code' },
  { file: 'docs/GAME_DESIGN.md', slug: 'conception', title: 'Conception du jeu' },
  { file: 'docs/BACKLOG.md', slug: 'backlog', title: 'Backlog' },
  { file: 'docs/RECETTE.md', slug: 'recette', title: 'Recette' },
  { file: 'CHANGELOG.md', slug: 'changelog', title: 'Historique des versions' },
  { file: 'README.md', slug: 'readme', title: 'Présentation' },
];
const linkMap = { 'MCO.md': 'index.html', 'ARCHITECTURE.md': 'architecture.html', 'GAME_DESIGN.md': 'conception.html', 'BACKLOG.md': 'backlog.html', 'RECETTE.md': 'recette.html', 'CHANGELOG.md': 'changelog.html', 'README.md': 'readme.html' };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const css = `
:root{--bg:#0f1220;--panel:#171b2e;--line:#2a3050;--txt:#dfe4f5;--mut:#8a93b8;--acc:#ef7757;--code:#1d2238}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--txt);font:16px/1.6 system-ui,Segoe UI,Arial,sans-serif}
a{color:#7fb2ff}header{background:var(--panel);border-bottom:1px solid var(--line);padding:14px 20px;display:flex;flex-wrap:wrap;gap:10px 22px;align-items:center;position:sticky;top:0}
header b{font-family:'Bebas Neue',Impact,sans-serif;letter-spacing:.06em;font-size:22px;color:var(--acc);font-weight:400}
nav{display:flex;flex-wrap:wrap;gap:6px 16px}nav a{color:var(--mut);text-decoration:none;font-size:15px}nav a.on{color:var(--txt);border-bottom:2px solid var(--acc)}
main{max-width:920px;margin:0 auto;padding:24px 20px 80px}h1,h2,h3{line-height:1.25}h1{color:var(--acc);font-size:30px}h2{margin-top:2em;border-bottom:1px solid var(--line);padding-bottom:.25em}
table{border-collapse:collapse;width:100%;margin:14px 0;font-size:15px;display:block;overflow-x:auto}th,td{border:1px solid var(--line);padding:7px 10px;text-align:left;vertical-align:top}th{background:var(--panel)}
code{background:var(--code);padding:1px 5px;border-radius:4px;font-size:.92em}pre{background:var(--code);padding:12px;border-radius:8px;overflow-x:auto}pre code{padding:0}
li{margin:3px 0}input[type=checkbox]{margin-right:6px}.play{margin-left:auto;background:var(--acc);color:#1b1f33;text-decoration:none;font-weight:700;padding:6px 14px;border-radius:6px}
@media(max-width:600px){header{position:static}main{padding:16px 14px 60px}h1{font-size:25px}}`;

fs.mkdirSync(out, { recursive: true });
for (const p of pages) {
  let md = fs.readFileSync(path.join(root, p.file), 'utf8');
  let html = marked.parse(md, { gfm: true }) ;
  html = html.replace(/href="(?:\.\/|\.\.\/docs\/|docs\/)?([A-Z_]+\.md)"/g, (m, f) => (linkMap[f] ? `href="${linkMap[f]}"` : m));
  if (p.slug === 'recette') {
    /* tableaux interactifs : Résultat (— / Oui / Non) et commentaire, mémorisés, avec export texte */
    html = html.replace(/<th>À vérifier<\/th>/g, '<th>À vérifier</th><th>Résultat</th><th>Commentaire</th>');
    html = html.replace(/<tr>\s*<td>(\d+\.\d+)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g, (m, id, t) => `<tr><td>${id}</td><td>${t}</td><td><button class="rb" data-i="${id}">—</button></td><td><input class="rn" data-i="${id}" placeholder="…"></td></tr>`);
    html += '<p><button id="rcopy" class="rcp">Copier tous les résultats</button> <button id="rcopyn" class="rcp">Copier seulement les Non et commentaires</button> <button id="rreset" class="rcp">Tout remettre à zéro</button></p><pre id="rout" style="white-space:pre-wrap"></pre>';
    html += `<style>table{width:100%}td:first-child{white-space:nowrap}.rb{min-width:56px;padding:8px 10px;border-radius:8px;border:1px solid #4a5470;background:#1b2038;color:#e8ecff;font-size:15px;font-weight:700;cursor:pointer}.rb.o{background:#1f7a46;border-color:#2fbf6f}.rb.n{background:#a02828;border-color:#ff5d5d}.rn{width:100%;min-width:140px;padding:8px;border-radius:8px;border:1px solid #4a5470;background:#10131f;color:#e8ecff;font-size:15px}@media(max-width:700px){table,tbody,tr,td{display:block;width:100%}thead{display:none}tr{border:1px solid #2a3350;border-radius:10px;margin:10px 0;padding:8px}td{border:0!important;padding:4px 0!important}td:first-child{font-weight:800;color:#ff8a3d}.rn{min-width:0}}.rcp{padding:10px 14px;border-radius:8px;border:1px solid #ff8a3d;background:#2a2030;color:#ffd2a8;font-size:15px;cursor:pointer;margin:4px 4px 4px 0}</style>`;
    html += '<script>(function(){var K="plansocial.recette2",s={};try{s=JSON.parse(localStorage.getItem(K)||"{}")}catch(e){}var L=["—","Oui","Non"],C=["","o","n"];function sv(){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}function ro(){var r=[];document.querySelectorAll("tr").forEach(function(tr){var b=tr.querySelector(".rb");if(!b)return;var id=b.dataset.i,v=s[id]||{r:0,c:""};r.push({id:id,t:tr.children[1].textContent.trim(),r:L[v.r||0],c:v.c||""})});return r}function cnt(){var a=ro(),o=a.filter(function(x){return x.r=="Oui"}).length,n=a.filter(function(x){return x.r=="Non"}).length;var e=document.getElementById("rcount");if(e)e.textContent="Oui : "+o+" · Non : "+n+" · À tester : "+(a.length-o-n)+" / "+a.length}document.querySelectorAll(".rb").forEach(function(b){var v=s[b.dataset.i]||{r:0,c:""};function d(){var q=s[b.dataset.i]||{r:0,c:""};b.textContent=L[q.r||0];b.className="rb "+C[q.r||0]}d();b.onclick=function(){var q=s[b.dataset.i]||(s[b.dataset.i]={r:0,c:""});q.r=((q.r||0)+1)%3;sv();d();cnt()}});document.querySelectorAll(".rn").forEach(function(i){var v=s[i.dataset.i];if(v)i.value=v.c||"";i.oninput=function(){var q=s[i.dataset.i]||(s[i.dataset.i]={r:0,c:""});q.c=i.value;sv()}});function out(onlyN){var a=ro().filter(function(x){return onlyN?(x.r=="Non"||x.c):true});var t="RECETTE PLAN SOCIAL\\n"+a.map(function(x){return x.id+" | "+x.r+" | "+x.t+(x.c?" | Commentaire : "+x.c:"")}).join("\\n");document.getElementById("rout").textContent=t;try{navigator.clipboard.writeText(t)}catch(e){}}document.getElementById("rcopy").onclick=function(){out(false)};document.getElementById("rcopyn").onclick=function(){out(true)};document.getElementById("rreset").onclick=function(){if(confirm("Tout remettre à zéro ?")){s={};sv();location.reload()}};cnt()})()</script>';
  }
  const nav = pages.map(q => `<a href="${q.slug === 'index' ? 'index' : q.slug}.html" class="${q === p ? 'on' : ''}">${esc(q.title)}</a>`).join('');
  const page = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)} | PLAN SOCIAL</title><link rel="icon" href="../favicon.svg"><style>${css}</style></head><body><header><b>PLAN SOCIAL</b><nav>${nav}</nav><a class="play" href="../">Jouer</a></header><main>${html}</main></body></html>`;
  fs.writeFileSync(path.join(out, p.slug + '.html'), page);
}
console.log(`docs: ${pages.length} pages dans dist/docs`);
