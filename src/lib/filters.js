/** Project taxonomy helpers. All pure, none mutate their input. */

export function allTags(projects = []) {
  const unique = [...new Set(projects.flatMap((p) => p.tags ?? []))].sort();
  return ['All', ...unique];
}

export function filterProjects(projects = [], tag = 'All') {
  if (tag === 'All') return [...projects];
  return projects.filter((p) => (p.tags ?? []).includes(tag));
}

/** Featured work first, then most recent. */
export function sortProjects(projects = []) {
  return [...projects].sort((a, b) => {
    if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
    return (b.year ?? 0) - (a.year ?? 0);
  });
}

export function featured(projects = [], limit = 3) {
  return sortProjects(projects.filter((p) => p.featured)).slice(0, limit);
}
