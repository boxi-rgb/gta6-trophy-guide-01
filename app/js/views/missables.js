// Missables view: the one trophy guide sites flag, with its sources and the
// honest caveat that it is reported, not verified on real hardware.
export function renderMissables(view, ctx) {
  const { trophies, state } = ctx;
  const earned = new Set(state.earned);
  view.innerHTML = '';
  const card = document.createElement('section');
  card.className = 'card';
  const h = document.createElement('h2');
  h.textContent = 'Missables — 1 flagged, 54 safe';
  card.append(h);
  const p = document.createElement('p');
  p.textContent = 'Of the 55 trophies, guide sites flag exactly one as possibly missable. Everything else can be earned after the story, in free roam, at any time. The flagged one is shown below with its sources.';
  card.append(p);
  const safe = document.createElement('p');
  safe.textContent = 'Safe after the story: all 12 story trophies (they unlock by playing), all side-mission strands, all activities, collectibles and counters. Nothing else is reported as missable.';
  card.append(safe);
  view.append(card);
  for (const t of trophies.filter((x) => x.missable)) {
    const box = document.createElement('section');
    box.className = 'card';
    const h2 = document.createElement('h2');
    h2.textContent = t.name + ' — ' + t.grade + '  ·  ' + (earned.has(t.name) ? 'EARNED ✓' : 'NOT EARNED YET');
    box.append(h2);
    const warn = document.createElement('div');
    warn.className = 'warning';
    const strong = document.createElement('strong');
    strong.textContent = 'Possibly missable — possibility, not a certainty. ';
    const span = document.createElement('span');
    span.textContent = 'PowerPyx via GTABase report that the Chapter 1 balcony meditation with Lucia stops counting once the chapter ends, and that there is no mission replay or New Game Plus. That is reported by guide sites, not verified on real hardware by this guide. Do every meditation spot you find, starting in Chapter 1, and do not leave one for later if you can do it now.';
    warn.append(strong, span);
    box.append(warn);
    const g = document.createElement('p');
    g.textContent = t.guide;
    box.append(g);
    const sh = document.createElement('h3');
    sh.textContent = 'Sources';
    box.append(sh);
    const ul = document.createElement('ul');
    ul.className = 'sources';
    for (const s of t.sources || []) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.label;
      a.target = '_blank';
      a.rel = 'noopener';
      li.append(a);
      ul.append(li);
    }
    box.append(ul);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn primary';
    btn.textContent = earned.has(t.name) ? 'Mark as not earned' : 'Mark as earned';
    btn.addEventListener('click', () => ctx.onToggleEarned(t.name));
    box.append(btn);
    view.append(box);
  }
  const note = document.createElement('p');
  note.className = 'muted';
  note.textContent = 'Spoiler-safe mode is ' + (state.spoiler ? 'ON' : 'OFF') + '. Toggle it in the Checklist controls or in Data & settings.';
  view.append(note);
}
