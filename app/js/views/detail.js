// Detail pane: the selected trophy's guide, steps, PSN counter input, missable
// warning and sources. Shown beside the checklist.
import { isSpoilerHidden } from '../filters.js';

export function renderDetail(pane, trophy, ctx) {
  const { state } = ctx;
  const earned = new Set(state.earned);
  pane.innerHTML = '';
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Select a trophy from the list to read its guide, steps and sources.';
    pane.append(p);
    return;
  }
  const hidden = isSpoilerHidden(trophy, state.spoiler, earned);
  const h = document.createElement('h2');
  h.textContent = hidden ? '??? (hidden story trophy)' : trophy.name;
  pane.append(h);
  const meta = document.createElement('p');
  meta.className = 'muted';
  meta.textContent = trophy.grade.charAt(0).toUpperCase() + trophy.grade.slice(1) + '  ·  ' + trophy.kind.replace('-', ' ') + (trophy.hidden ? '  ·  Hidden on PSN until earned' : '');
  pane.append(meta);
  const desc = document.createElement('p');
  desc.textContent = hidden ? 'Spoiler-safe mode is on. Earn this story trophy in game to reveal its name and description here.' : trophy.description;
  pane.append(desc);
  if (trophy.missable) {
    const warn = document.createElement('div');
    warn.className = 'warning';
    warn.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = 'Possibly missable — read this first. ';
    const span = document.createElement('span');
    span.textContent = 'PowerPyx via GTABase report that the Chapter 1 balcony meditation with Lucia stops counting once the chapter ends, and that there is no mission replay or New Game Plus. That is reported, not verified on real hardware, so treat it as a warning, not a certainty: meditate at every spot you find, starting in Chapter 1.';
    warn.append(strong, span);
    pane.append(warn);
  }
  if (!hidden) {
    const g = document.createElement('p');
    g.className = 'guide';
    g.textContent = trophy.guide;
    pane.append(g);
    if (Array.isArray(trophy.steps) && trophy.steps.length) {
      const sh = document.createElement('h3');
      sh.textContent = 'Steps';
      pane.append(sh);
      const ol = document.createElement('ol');
      for (const s of trophy.steps) {
        const li = document.createElement('li');
        li.textContent = s;
        ol.append(li);
      }
      pane.append(ol);
    }
  }
  if (trophy.psnTarget != null) {
    const row = document.createElement('div');
    row.className = 'count-row';
    const label = document.createElement('label');
    label.textContent = 'Your PSN progress (0/' + trophy.psnTarget.toLocaleString('en-US') + '): ';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = String(trophy.psnTarget);
    input.value = String(state.counts[trophy.name] || 0);
    input.addEventListener('change', () => ctx.onSetCount(trophy.name, input.value));
    label.append(input);
    row.append(label);
    pane.append(row);
  }
  const earnedLine = document.createElement('p');
  earnedLine.innerHTML = '';
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn primary';
  b.textContent = earned.has(trophy.name) ? 'Mark as not earned' : 'Mark as earned';
  b.addEventListener('click', () => ctx.onToggleEarned(trophy.name));
  earnedLine.append(b);
  pane.append(earnedLine);
  const sh = document.createElement('h3');
  sh.textContent = 'Sources';
  pane.append(sh);
  const src = document.createElement('div');
  src.className = 'sources';
  const ul = document.createElement('ul');
  for (const s of trophy.sources || []) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.label;
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(a);
    ul.append(li);
  }
  src.append(ul);
  const note = document.createElement('p');
  note.className = 'muted';
  note.textContent = 'Official names, descriptions and grades are from the frozen 2026-11-18 list. Guide text is this guide\u2019s own wording; locations that are not verified are marked as such in the text.';
  src.append(note);
  pane.append(src);
}
