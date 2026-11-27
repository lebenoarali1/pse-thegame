import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const JS_DIR = path.resolve(__dirname, 'src/js');
const ID = 'virtual:plan-social';

// Assemble les fichiers de src/js (ordre alphabétique) en un seul module, comme avant.
// Les fichiers migrés en .ts remplaceront peu à peu ce mécanisme.
function plansocial(): Plugin {
  const files = () => fs.readdirSync(JS_DIR).filter(f => f.endsWith('.js')).sort();
  return {
    name: 'plan-social-legacy',
    resolveId: id => (id === ID ? '\0' + ID : null),
    load(id) {
      if (id !== '\0' + ID) return null;
      files().forEach(f => this.addWatchFile(path.join(JS_DIR, f)));
      return "'use strict';\n" + files().map(f => `/* ---- ${f} ---- */\n` + fs.readFileSync(path.join(JS_DIR, f), 'utf8')).join('\n');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [plansocial()],
  build: { target: 'es2020', chunkSizeWarningLimit: 1500 },
});
