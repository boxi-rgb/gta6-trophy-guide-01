// Platinum roadmap: five stages built from the official descriptions, each with
// its trophies and live progress. Stage 1 carries the missable warning.
import { isSpoilerHidden } from '../filters.js';

const STAGES = [
  {
    n: 1,
    title: 'Play the story',
    text: 'Chapters 1 to 4, the named missions and the finale. 12 story trophies plus the gold finale.',
    kinds: ['story'],
    note: 'Do the Chapter 1 meditations for Positive Mental Attitude as you go — guides report the balcony spot may become unavailable after Chapter 1.',
  },
  {
    n: 2,
    title: 'Side-mission strands',
    text: 'Strangers and named side characters (Andy, Kenton, Billy, Randy, Tyrone, Bret) across Leonida.',
    kinds: ['side-missions'],
    note: '',
  },
  {
    n: 3,
    title: 'Activities and races',
    text: 'Shooting ranges, drone races, stunts, challenges, fishing, bowling, robberies and Combat Focus.',
    kinds: ['activities'],
    note: '',
  },
  {
    n: 4,
    title: 'Collectibles and exploration',
    text: 'Meditation spots, card sets, WAiNK spots, vehicles, garages and all 52 areas of Leonida.',
    kinds: ['collectibles'],
    note: '',
  },
  {
    n: 5,
    title: '100% completion and clean-up',
    text: 'A Long Road (100%) and the long counters — money, choices and the platinum itself.',
    kinds: ['completion', 'platinum'],
    note: '',
  },
];

export function renderRoadmap(view, ctx) {
  const { trophies, state } = ctx;
  const earned = new Set(state.earned);
  view.innerHTML = '';
  const intro = document.createElement('p');
  intro.textContent = 'Five stages from the first mission to the platinum. Each stage lists its trophies and your progress. Built from the official trophy descriptions; the only missable flagged by guide sites is in Stage 1.';
  view.append(intro);
  for (const stage of STAGES) {
    const members = trophies.filter((t) => stage.kinds.includes(t.kind));
    const done = members.filter((t) => earned.has(t.name)).length;
    const card = document.createElement('section');
    card.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = 'Stage ' + stage.n + ' — ' + stage.title + '  (' + done + ' / ' + members.length + ')';
    card.append(h);
    const p = document.createElement('p');
    p.textContent = stage.text;
    card.append(p);
    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('div');
    fill.style.width = (members.length ? Math.round((done / members.length) * 100) : 0) + '%';
    bar.append(fill);
    card.append(bar);
    if (stage.note) {
      const warn = document.createElement('div');
      warn.className = 'warning';
      const strong = document.createElement('strong');
      strong.textContent = 'Possibly missable: ';
      warn.append(strong, document.createTextNode(stage.note));
      card.append(warn);
    }
    const ul = document.createElement('ul');
    for (const t of members) {
      const li = document.createElement('li');
      const hidden = isSpoilerHidden(t, state.spoiler, earned);
      li.textContent = (earned.has(t.name) ? '✓ ' : '○ ') + (hidden ? '??? (hidden story trophy)' : t.name) + ' — ' + t.grade + (t.missable ? ' — MAY BE MISSABLE' : '');
      ul.append(li);
    }
    card.append(ul);
    view.append(card);
  }
}
