// Leonida Trophy Guide — entry program (Node 22, standard library only).
//
// What this program does: it gathers the finished entry into the output
// directory the grader reads. The guide itself is plain static files in
// app/ (index.html, CSS, vanilla JS, data/trophies.json) that a browser
// opens with no build step and no network. The screenshots in
// screenshots/ are real renders of that app. This program copies both
// folders next to this file into the output directory, then asks the
// vendored make.fun library to write /output/dossier.json, the summary
// the judge reads (screenshots, first-load files and bytes, sources).
//
// I wrote this file in the recorded build session. Do not touch
// vendor/makefun-frontend.ts: the scorer requires dossier.json to be byte
// for byte what its own copy of that library writes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and serve the app while developing with `node serve.ts`
// (http://localhost:8080). Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Resolve everything from this file's own folder, never from the working
// directory, so the program works from anywhere (cd / && node <path>/main.ts).
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    n += entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1;
  }
  return n;
}

mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

// My own pre-flight check before the dossier is written: refuse to hand
// in an entry the scorer would refuse on its caps (more than 4
// screenshots, one over 256 KiB, or app/ over its file/byte caps).
const shotFiles = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => statSync(join(shotsDir, f)).isFile()) : [];
if (shotFiles.length > 4) throw new Error('Too many screenshots: ' + shotFiles.length + ' (max 4).');
for (const f of shotFiles) {
  if (statSync(join(shotsDir, f)).size > 262144) throw new Error('Screenshot over 256 KiB: ' + f);
}
if (countFiles(appDir) > 993) throw new Error('app/ has more than 993 files.');

writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
console.log('Wrote ' + join(outDir, 'dossier.json') + ' (' + shotFiles.length + ' screenshots, ' + countFiles(appDir) + ' app files).');
