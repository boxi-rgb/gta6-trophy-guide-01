// Data & settings view: export / import of progress, spoiler toggle, theme,
// and a reset. Import validates before it replaces anything.
import { exportState, parseImport, saveStore } from '../store.js';

export function renderSettings(view, ctx) {
  const { state } = ctx;
  view.innerHTML = '';
  const card = document.createElement('section');
  card.className = 'card';
  const h = document.createElement('h2');
  h.textContent = 'Your progress data';
  card.append(h);
  const p = document.createElement('p');
  p.textContent = 'Progress is saved in this browser (localStorage). Export it as a JSON file to back it up or move it to another browser, and import it back here. Nothing leaves your device unless you export it.';
  card.append(p);
  const summary = document.createElement('p');
  summary.innerHTML = '';
  const strong = document.createElement('strong');
  strong.textContent = state.earned.length + ' of 55 trophies earned';
  summary.append(strong, document.createTextNode('  ·  ' + Object.keys(state.counts).length + ' PSN counters saved.'));
  card.append(summary);
  const row = document.createElement('div');
  row.className = 'btn-row';
  const exp = document.createElement('button');
  exp.type = 'button';
  exp.className = 'btn primary';
  exp.textContent = 'Export progress (JSON)';
  exp.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([exportState(state)], { type: 'application/json' }));
    a.download = 'leonida-trophy-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  const impLabel = document.createElement('label');
  impLabel.className = 'btn';
  impLabel.textContent = 'Import progress…';
  const imp = document.createElement('input');
  imp.type = 'file';
  imp.accept = 'application/json';
  imp.style.display = 'none';
  imp.addEventListener('change', async () => {
    const file = imp.files[0];
    if (!file) return;
    try {
      const parsed = parseImport(await file.text());
      state.earned = parsed.earned;
      state.counts = parsed.counts;
      state.spoiler = parsed.spoiler;
      saveStore(state);
      ctx.onDataChanged();
    } catch (err) {
      ctx.onImportError(String(err && err.message ? err.message : err));
    }
  });
  impLabel.append(imp);
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'btn';
  reset.textContent = 'Reset all progress';
  reset.addEventListener('click', () => {
    if (window.confirm('Clear all earned ticks, counters and settings?')) {
      state.earned = [];
      state.counts = {};
      state.spoiler = false;
      saveStore(state);
      ctx.onDataChanged();
    }
  });
  row.append(exp, impLabel, reset);
  card.append(row);
  const msg = document.createElement('p');
  msg.id = 'import-message';
  msg.className = 'muted';
  card.append(msg);
  view.append(card);

  const card2 = document.createElement('section');
  card2.className = 'card';
  const h2 = document.createElement('h2');
  h2.textContent = 'Settings';
  card2.append(h2);
  const sp = document.createElement('label');
  const spBox = document.createElement('input');
  spBox.type = 'checkbox';
  spBox.checked = state.spoiler;
  spBox.addEventListener('change', () => {
    state.spoiler = spBox.checked;
    saveStore(state);
    ctx.onDataChanged();
  });
  sp.append(spBox, document.createTextNode(' Spoiler-safe: hide unearned story trophies (name and description become “???” until earned)'));
  card2.append(sp);
  const themeP = document.createElement('p');
  themeP.textContent = 'Theme: ' + (state.theme === 'night' ? 'Night' : 'Paper') + '. Use the “Night theme” / “Paper theme” button in the tab bar to switch.';
  card2.append(themeP);
  const about = document.createElement('p');
  about.className = 'muted';
  about.textContent = 'Offline app: the only file it loads is data/trophies.json from its own folder. No accounts, no network, no ads.';
  card2.append(about);
  view.append(card2);
}
