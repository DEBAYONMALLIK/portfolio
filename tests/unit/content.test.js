import { describe, it, expect } from 'vitest';
import { PROJECTS, EXPERIENCE, CERTIFICATIONS, PROFILE, SERVICES, SKILL_GROUPS } from '../../src/data/content.js';
import { allTags, filterProjects, sortProjects, featured } from '../../src/lib/filters.js';

const HTTPS = /^https:\/\/[^\s]+$/;

describe('PROFILE', () => {
  it('carries the essentials with no placeholder text', () => {
    expect(PROFILE.name).toBe('Debayon Mallik');
    expect(PROFILE.email).toBe('debayonmallik9932@gmail.com');
    expect(PROFILE.location).toBeTruthy();
    expect(PROFILE.headline.length).toBeGreaterThan(20);
    const blob = JSON.stringify(PROFILE).toLowerCase();
    ['lorem', 'ipsum', 'todo', 'placeholder', 'xxx'].forEach((bad) => expect(blob).not.toContain(bad));
  });
  it('every social link is https and labelled', () => {
    expect(PROFILE.links.length).toBeGreaterThanOrEqual(5);
    PROFILE.links.forEach((l) => {
      expect(l.href, `${l.label} href`).toMatch(HTTPS);
      expect(l.label).toBeTruthy();
    });
  });
  it('has no duplicate link labels', () => {
    const labels = PROFILE.links.map((l) => l.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe('PROJECTS', () => {
  it('has at least four projects', () => expect(PROJECTS.length).toBeGreaterThanOrEqual(4));

  it('every project is fully formed', () => {
    PROJECTS.forEach((p) => {
      expect(p.id, 'id').toMatch(/^[a-z0-9-]+$/);
      expect(p.title, `${p.id} title`).toBeTruthy();
      expect(p.summary.length, `${p.id} summary too short`).toBeGreaterThan(40);
      expect(Array.isArray(p.highlights)).toBe(true);
      expect(p.highlights.length, `${p.id} highlights`).toBeGreaterThanOrEqual(2);
      expect(Array.isArray(p.stack)).toBe(true);
      expect(p.stack.length).toBeGreaterThanOrEqual(2);
      expect(Array.isArray(p.tags)).toBe(true);
      expect(p.tags.length).toBeGreaterThanOrEqual(1);
      expect(typeof p.year).toBe('number');
      expect(p.year).toBeGreaterThanOrEqual(2023);
    });
  });

  it('every project id is unique', () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every project link is https and has a label', () => {
    PROJECTS.forEach((p) => {
      (p.links ?? []).forEach((l) => {
        expect(l.href, `${p.id} ${l.label}`).toMatch(HTTPS);
        expect(l.label).toBeTruthy();
      });
    });
  });

  it('at least two projects are marked featured', () => {
    expect(PROJECTS.filter((p) => p.featured).length).toBeGreaterThanOrEqual(2);
  });

  it('no project claims a metric without a unit or number', () => {
    PROJECTS.forEach((p) => {
      (p.metrics ?? []).forEach((m) => {
        expect(m.value, `${p.id} metric ${m.label}`).toBeTruthy();
        expect(m.label).toBeTruthy();
      });
    });
  });
});

describe('EXPERIENCE', () => {
  it('lists the Trinamix role with bullet points', () => {
    const t = EXPERIENCE.find((e) => /trinamix/i.test(e.company));
    expect(t).toBeDefined();
    expect(t.roles.length).toBeGreaterThanOrEqual(1);
    t.roles.forEach((r) => {
      expect(r.title).toBeTruthy();
      expect(r.bullets.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('CERTIFICATIONS', () => {
  it('has three Google Cloud badges with verifiable https links', () => {
    expect(CERTIFICATIONS.length).toBeGreaterThanOrEqual(3);
    CERTIFICATIONS.forEach((c) => {
      expect(c.href).toMatch(HTTPS);
      expect(c.title).toBeTruthy();
      expect(c.issuer).toBeTruthy();
    });
  });
  it('badge links are unique', () => {
    const hrefs = CERTIFICATIONS.map((c) => c.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe('SERVICES', () => {
  it('describes at least three automation offers, each with an outcome', () => {
    expect(SERVICES.length).toBeGreaterThanOrEqual(3);
    SERVICES.forEach((s) => {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.outcome.length).toBeGreaterThan(20);
      expect(s.proof.length).toBeGreaterThanOrEqual(1);
    });
  });
  it('every service proof points at a real project id', () => {
    const ids = new Set(PROJECTS.map((p) => p.id));
    SERVICES.forEach((s) => s.proof.forEach((pid) => expect(ids.has(pid), `${s.id} -> ${pid}`).toBe(true)));
  });
});

describe('SKILL_GROUPS', () => {
  it('groups skills under named categories', () => {
    expect(SKILL_GROUPS.length).toBeGreaterThanOrEqual(4);
    SKILL_GROUPS.forEach((g) => {
      expect(g.name).toBeTruthy();
      expect(g.items.length).toBeGreaterThanOrEqual(3);
    });
  });
  it('does not repeat the same skill in two groups', () => {
    const all = SKILL_GROUPS.flatMap((g) => g.items.map((i) => i.toLowerCase()));
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('filters', () => {
  it('allTags returns a sorted, de-duplicated list including "All" first', () => {
    const tags = allTags(PROJECTS);
    expect(tags[0]).toBe('All');
    const rest = tags.slice(1);
    expect([...rest].sort()).toEqual(rest);
    expect(new Set(rest).size).toBe(rest.length);
  });

  it('filterProjects with "All" returns everything', () => {
    expect(filterProjects(PROJECTS, 'All')).toHaveLength(PROJECTS.length);
  });

  it('filterProjects narrows to matching tag only', () => {
    const tag = allTags(PROJECTS)[1];
    const out = filterProjects(PROJECTS, tag);
    expect(out.length).toBeGreaterThan(0);
    out.forEach((p) => expect(p.tags).toContain(tag));
  });

  it('filterProjects returns an empty array for an unknown tag', () => {
    expect(filterProjects(PROJECTS, 'Blockchain')).toEqual([]);
  });

  it('filterProjects never mutates the source array', () => {
    const before = PROJECTS.map((p) => p.id);
    filterProjects(PROJECTS, 'All');
    expect(PROJECTS.map((p) => p.id)).toEqual(before);
  });

  it('sortProjects puts featured first, then newest', () => {
    const out = sortProjects(PROJECTS);
    const firstNonFeatured = out.findIndex((p) => !p.featured);
    if (firstNonFeatured > -1) {
      out.slice(firstNonFeatured).forEach((p) => expect(p.featured).toBeFalsy());
    }
    const feat = out.filter((p) => p.featured).map((p) => p.year);
    expect([...feat].sort((a, b) => b - a)).toEqual(feat);
  });

  it('featured returns only featured projects, capped', () => {
    const f = featured(PROJECTS, 2);
    expect(f).toHaveLength(2);
    f.forEach((p) => expect(p.featured).toBe(true));
  });
});
