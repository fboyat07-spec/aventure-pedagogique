const fs = require('fs');
const path = 'C:/Users/Florian/Documents/KidAI/backend/.env';
const out = 'C:/Users/Florian/Documents/KidAI/backend/env.cloudrun.yaml';
const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);
const vars = { PORT: '8080' };
for (const line of lines) {
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx < 0) continue;
  const k = line.slice(0, idx).trim();
  const v = line.slice(idx + 1);
  if (!k) continue;
  vars[k] = v;
}
let yaml = '';
for (const [k, v] of Object.entries(vars)) {
  if (v === undefined) continue;
  const safe = String(v).replace(/"/g, '\\"');
  yaml += `${k}: "${safe}"\n`;
}
fs.writeFileSync(out, yaml);
