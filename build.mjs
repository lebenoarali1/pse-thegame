// Assemble src/ en un seul fichier dist/index.html (aucune dépendance).
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const files = fs.readdirSync(path.join(root, 'src/js')).filter(f => f.endsWith('.js')).sort();
const js = "'use strict';\n" + files.map(f => `/* ---- ${f} ---- */\n` + read('src/js/' + f)).join('\n');
const version = new Date().toISOString().slice(0, 16).replace('T', ' ');
let html = read('src/template.html').replace('{{CSS}}', () => read('src/css/main.css')).replace('{{JS}}', () => js);
html = html.replace('</body>', `<!-- build ${version} -->\n</body>`);
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/index.html'), html);
// contrôle de syntaxe
fs.writeFileSync('/tmp/_plan_social_check.js', js);
import('node:child_process').then(({ execSync }) => {
  execSync('node --check /tmp/_plan_social_check.js', { stdio: 'inherit' });
  console.log(`OK dist/index.html (${(html.length / 1024).toFixed(0)} Ko, ${files.length} fichiers source)`);
});
