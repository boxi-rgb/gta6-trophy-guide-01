// Progress saved in localStorage under a guide-specific key. Earned names, PSN counter
// values the player types in, and the spoiler setting all live here.
export const STORE_KEY = 'leonida-trophy-guide-v1';

export function loadStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    return {
      earned: Array.isArray(raw.earned) ? raw.earned : [],
      counts: raw.counts && typeof raw.counts === 'object' ? raw.counts : {},
      spoiler: raw.spoiler === true,
      theme: raw.theme === 'night' ? 'night' : 'paper',
    };
  } catch {
    return { earned: [], counts: {}, spoiler: false, theme: 'paper' };
  }
}

export function saveStore(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function earnedSet(state) {
  return new Set(state.earned);
}

export function toggleEarned(state, name) {
  const set = earnedSet(state);
  if (set.has(name)) set.delete(name);
  else set.add(name);
  state.earned = [...set];
  saveStore(state);
}

export function setCount(state, name, value) {
  const n = Math.max(0, Math.floor(Number(value) || 0));
  state.counts[name] = n;
  saveStore(state);
}

export function exportState(state) {
  return JSON.stringify({ app: 'leonida-trophy-guide', version: 1, earned: state.earned, counts: state.counts, spoiler: state.spoiler }, null, 2);
}

export function parseImport(text) {
  const doc = JSON.parse(text);
  if (!doc || typeof doc !== 'object') throw new Error('Not a progress file.');
  const earned = Array.isArray(doc.earned) ? doc.earned.filter((n) => typeof n === 'string') : [];
  const counts = doc.counts && typeof doc.counts === 'object' ? doc.counts : {};
  return { earned, counts, spoiler: doc.spoiler === true };
}
