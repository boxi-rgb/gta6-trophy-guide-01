// Filters for the checklist: kind, grade, earned status, free-text search, and the
// spoiler rule (unearned story trophies are hidden when spoiler-safe is on).
export function applyFilters(trophies, opts, earned) {
  const q = (opts.query || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (opts.kind !== 'all' && t.kind !== opts.kind) return false;
    if (opts.grade !== 'all' && t.grade !== opts.grade) return false;
    const has = earned.has(t.name);
    if (opts.status === 'earned' && !has) return false;
    if (opts.status === 'unearned' && has) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    return true;
  });
}

export function isSpoilerHidden(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.name);
}
