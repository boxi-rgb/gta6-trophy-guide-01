// Leonida Trophy Guide — startup, tabs and progress header.
// Loads the 55 trophies once, then renders one of four views (checklist,
// roadmap, missables, data) into #view. The checklist keeps its detail pane.
import { loadTrophies } from './data.js';
import { loadStore, saveStore, toggleEarned, setCount } from './store.js';
import { renderChecklist } from './views/checklist.js';
import { renderDetail } from './views/detail.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderSettings } from './views/settings.js';

const VIEWS = ['checklist', 'roadmap', 'missables', 'data'];
const state = loadStore();
const trophies = await loadTrophies();
let currentView = 'checklist';
let selectedName = 'Positive Mental Attitude';
const filters = { query: '', kind: 'all', grade: 'all', status: 'all' };

const viewEl = document.getElementById('view');
const controlsEl = document.getElementById('controls');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const statusEl = document.getElementById('status');
const spoilerEl = document.getElementById('spoiler');
spoilerEl.checked = state.spoiler;

function gradeCounts() {
  const out = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  const earned = new Set(state.earned);
  for (const t of trophies) {
    out[t.grade][1] += 1;
    if (earned.has(t.name)) out[t.grade][0] += 1;
  }
  return out;
}

function renderHeader() {
  const earned = new Set(state.earned);
  const total = trophies.length;
  const pct = Math.round((earned.size / total) * 100);
  document.getElementById('progress-text').textContent = earned.size + ' / ' + total + ' earned';
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-fill').style.width = pct + '%';
  const counts = gradeCounts();
  document.getElementById('grade-line').textContent =
    'Platinum ' + counts.platinum[0] + '/' + counts.platinum[1] +
    '  ·  Gold ' + counts.gold[0] + '/' + counts.gold[1] +
    '  ·  Silver ' + counts.silver[0] + '/' + counts.silver[1] +
    '  ·  Bronze ' + counts.bronze[0] + '/' + counts.bronze[1];
  document.getElementById('platinum-line').textContent =
    (total - earned.size) + ' trophies left to the platinum — ' +
    (earned.has('Vice Got a Price!') ? 'platinum earned!' : 'finish the other 54 to unlock Vice Got a Price!');
  document.getElementById('foot-note').textContent =
    'Showing ' + trophies.length + ' trophies · ' + earned.size + ' earned · spoiler-safe ' + (state.spoiler ? 'ON' : 'OFF');
}

function applyTheme() {
  document.body.dataset.theme = state.theme;
  document.getElementById('theme-toggle').textContent = state.theme === 'night' ? 'Paper theme' : 'Night theme';
}

function render() {
  renderHeader();
  applyTheme();
  controlsEl.style.display = currentView === 'checklist' ? '' : 'none';
  for (const btn of document.querySelectorAll('#tabs button[data-view]')) {
    btn.classList.toggle('active', btn.dataset.view === currentView);
  }
  const ctx = {
    trophies,
    state,
    filters,
    selectedName,
    onToggleEarned: (name) => { toggleEarned(state, name); render(); },
    onSelect: (name) => { selectedName = name; render(); },
    onSetCount: (name, value) => { setCount(state, name, value); render(); },
    onDataChanged: () => { spoilerEl.checked = state.spoiler; render(); },
    onImportError: (msg) => {
      const el = document.getElementById('import-message');
      if (el) el.textContent = 'Import failed: ' + msg;
    },
  };
  if (currentView === 'checklist') {
    const detailEl = renderChecklist(viewEl, ctx);
    const selected = trophies.find((t) => t.name === selectedName) || trophies[0];
    renderDetail(detailEl, selected, ctx);
  } else if (currentView === 'roadmap') {
    renderRoadmap(viewEl, ctx);
  } else if (currentView === 'missables') {
    renderMissables(viewEl, ctx);
  } else {
    renderSettings(viewEl, ctx);
  }
}

function go(view) {
  if (!VIEWS.includes(view)) view = 'checklist';
  currentView = view;
  if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
  render();
}

for (const btn of document.querySelectorAll('#tabs button[data-view]')) {
  btn.addEventListener('click', () => go(btn.dataset.view));
}
document.getElementById('theme-toggle').addEventListener('click', () => {
  state.theme = state.theme === 'night' ? 'paper' : 'night';
  saveStore(state);
  render();
});
searchEl.addEventListener('input', () => { filters.query = searchEl.value; render(); });
kindEl.addEventListener('change', () => { filters.kind = kindEl.value; render(); });
gradeEl.addEventListener('change', () => { filters.grade = gradeEl.value; render(); });
statusEl.addEventListener('change', () => { filters.status = statusEl.value; render(); });
spoilerEl.addEventListener('change', () => {
  state.spoiler = spoilerEl.checked;
  saveStore(state);
  render();
});
window.addEventListener('hashchange', () => go(location.hash.slice(1)));

go(location.hash.slice(1) || 'checklist');
