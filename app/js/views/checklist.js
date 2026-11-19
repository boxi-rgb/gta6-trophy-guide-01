// Checklist view: the trophy rows on the left, the detail pane on the right.
// Clicking a row opens its guide; ticking the box marks it earned.
import { applyFilters, isSpoilerHidden } from '../filters.js';

export function renderChecklist(view, ctx) {
  const { trophies, state, filters, selectedName } = ctx;
  const earned = new Set(state.earned);
  const list = applyFilters(trophies, filters, earned);
  view.innerHTML = '';
  const layout = document.createElement('div');
  layout.className = 'checklist-layout';
  const listEl = document.createElement('div');
  listEl.className = 'trophy-list';
  const detailEl = document.createElement('aside');
  detailEl.className = 'detail';
  detailEl.id = 'detail-pane';

  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No trophies match these filters. Loosen the filters to see the list again.';
    listEl.append(empty);
  }
  for (const t of list) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'trophy-row' + (earned.has(t.name) ? ' earned' : '') + (t.name === selectedName ? ' selected' : '');
    row.dataset.name = t.name;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', 'Earned: ' + t.name);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      ctx.onToggleEarned(t.name);
    });
    const mid = document.createElement('span');
    const hidden = isSpoilerHidden(t, state.spoiler, earned);
    const nameEl = document.createElement('div');
    nameEl.className = 't-name';
    nameEl.textContent = hidden ? '??? (story trophy — hidden until earned)' : t.name;
    const descEl = document.createElement('div');
    descEl.className = 't-desc';
    descEl.textContent = hidden ? 'Spoiler-safe mode hides this story trophy. Tick it earned to reveal it.' : t.description;
    mid.append(nameEl, descEl);
    const meta = document.createElement('span');
    meta.className = 't-meta';
    const grade = document.createElement('span');
    grade.className = 'badge ' + t.grade;
    grade.textContent = t.grade;
    meta.append(grade);
    if (t.missable) {
      meta.append(document.createElement('br'));
      const flag = document.createElement('span');
      flag.className = 'flag';
      flag.textContent = 'MAY BE MISSABLE';
      meta.append(flag);
    }
    if (t.hidden && !hidden) {
      meta.append(document.createElement('br'));
      const flag = document.createElement('span');
      flag.className = 'flag hidden-flag';
      flag.textContent = 'HIDDEN';
      meta.append(flag);
    }
    row.append(box, mid, meta);
    row.addEventListener('click', () => ctx.onSelect(t.name));
    listEl.append(row);
  }
  layout.append(listEl, detailEl);
  view.append(layout);
  return detailEl;
}
