import { describe, it, expect } from 'vitest';
import {
  FLOW, initSession, currentNode, submit, back, progress, buildBrief, isComplete,
} from '../../src/lib/qualifier.js';

const answerPath = (session, values) => values.reduce((s, v) => {
  const r = submit(s, v);
  expect(r.ok, `expected "${JSON.stringify(v)}" to be accepted at node ${s.cursor}`).toBe(true);
  return r.session;
}, session);

describe('FLOW graph integrity', () => {
  it('starts at a node that exists', () => {
    expect(FLOW.nodes[FLOW.start]).toBeDefined();
  });

  it('every option points at a node that exists', () => {
    for (const [id, node] of Object.entries(FLOW.nodes)) {
      for (const opt of node.options ?? []) {
        expect(FLOW.nodes[opt.next], `${id} -> ${opt.next}`).toBeDefined();
      }
      if (node.next) expect(FLOW.nodes[node.next], `${id} -> ${node.next}`).toBeDefined();
    }
  });

  it('has exactly one terminal node and it is reachable', () => {
    const terminals = Object.entries(FLOW.nodes).filter(([, n]) => n.kind === 'terminal');
    expect(terminals).toHaveLength(1);
    const seen = new Set();
    const walk = (id) => {
      if (seen.has(id)) return;
      seen.add(id);
      const n = FLOW.nodes[id];
      (n.options ?? []).forEach((o) => walk(o.next));
      if (n.next) walk(n.next);
    };
    walk(FLOW.start);
    expect(seen.has(terminals[0][0])).toBe(true);
  });

  it('every node has a prompt and every choice option a distinct value', () => {
    for (const [id, node] of Object.entries(FLOW.nodes)) {
      expect(node.prompt, `${id} has no prompt`).toBeTruthy();
      if (node.kind === 'choice') {
        const values = node.options.map((o) => o.value);
        expect(new Set(values).size, `${id} has duplicate option values`).toBe(values.length);
        expect(values.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('has no node that can only be reached from itself', () => {
    for (const [, node] of Object.entries(FLOW.nodes)) {
      for (const opt of node.options ?? []) {
        expect(opt.label, 'every option needs a human-readable label').toBeTruthy();
      }
    }
  });
});

describe('initSession', () => {
  it('starts at the flow start with no answers', () => {
    const s = initSession();
    expect(s.cursor).toBe(FLOW.start);
    expect(s.answers).toEqual({});
    expect(s.history).toEqual([]);
    expect(isComplete(s)).toBe(false);
  });
  it('returns a fresh object each call', () => {
    const a = initSession(); const b = initSession();
    expect(a).not.toBe(b);
    a.answers.poisoned = true;
    expect(b.answers).toEqual({});
  });
});

describe('submit', () => {
  it('rejects a value that is not an option at a choice node', () => {
    const r = submit(initSession(), 'not-a-real-option');
    expect(r.ok).toBe(false);
    expect(r.errors.value).toBeTruthy();
  });

  it('does not mutate the session it is given', () => {
    const s = initSession();
    const frozen = JSON.stringify(s);
    submit(s, FLOW.nodes[FLOW.start].options[0].value);
    expect(JSON.stringify(s)).toBe(frozen);
  });

  it('records the answer and moves the cursor', () => {
    const s = initSession();
    const first = FLOW.nodes[FLOW.start].options[0];
    const r = submit(s, first.value);
    expect(r.ok).toBe(true);
    expect(r.session.answers[FLOW.start]).toBe(first.value);
    expect(r.session.cursor).toBe(first.next);
    expect(r.session.history).toEqual([FLOW.start]);
  });

  it('refuses to accept anything once the session is complete', () => {
    let s = initSession();
    s = answerPath(s, ['automate', 'ops-data', 'daily', 'erp', 'weeks']);
    s = submit(s, { name: 'Debayon Mallik', email: 'd@example.com', company: 'Acme' }).session;
    expect(isComplete(s)).toBe(true);
    const r = submit(s, 'automate');
    expect(r.ok).toBe(false);
  });

  it('validates the contact form and keeps the user on the node when invalid', () => {
    let s = initSession();
    s = answerPath(s, ['automate', 'ops-data', 'daily', 'erp', 'weeks']);
    const cursorBefore = s.cursor;
    const r = submit(s, { name: 'x', email: 'bad', company: '' });
    expect(r.ok).toBe(false);
    expect(r.session.cursor).toBe(cursorBefore);
    expect(r.errors.email).toBeTruthy();
    expect(r.errors.name).toBeTruthy();
  });

  it('routes the hiring track differently from the automation track', () => {
    const hire = submit(initSession(), 'hire');
    const automate = submit(initSession(), 'automate');
    expect(hire.session.cursor).not.toBe(automate.session.cursor);
  });
});

describe('back', () => {
  it('returns to the previous node and clears that answer', () => {
    let s = initSession();
    s = answerPath(s, ['automate', 'ops-data']);
    const prev = back(s);
    expect(prev.cursor).toBe('workload');
    expect(prev.answers.workload).toBeUndefined();
    expect(prev.answers.intent).toBe('automate');
  });
  it('is a no-op at the first node', () => {
    const s = initSession();
    expect(back(s)).toEqual(s);
  });
  it('does not mutate its input', () => {
    let s = answerPath(initSession(), ['automate', 'ops-data']);
    const frozen = JSON.stringify(s);
    back(s);
    expect(JSON.stringify(s)).toBe(frozen);
  });
});

describe('progress', () => {
  it('is 0 at the start and 1 when complete', () => {
    let s = initSession();
    expect(progress(s)).toBe(0);
    s = answerPath(s, ['automate', 'ops-data', 'daily', 'erp', 'weeks']);
    s = submit(s, { name: 'Debayon Mallik', email: 'd@example.com' }).session;
    expect(progress(s)).toBe(1);
  });
  it('increases monotonically along a path', () => {
    let s = initSession();
    let last = progress(s);
    for (const v of ['automate', 'ops-data', 'daily', 'erp', 'weeks']) {
      s = submit(s, v).session;
      const p = progress(s);
      expect(p).toBeGreaterThan(last);
      last = p;
    }
  });
  it('never exceeds 1 on the longest path', () => {
    let s = answerPath(initSession(), ['automate', 'ops-data', 'daily', 'erp', 'weeks']);
    s = submit(s, { name: 'Debayon Mallik', email: 'd@example.com' }).session;
    expect(progress(s)).toBeLessThanOrEqual(1);
  });
});

describe('buildBrief', () => {
  const finish = (path, contact = { name: 'Debayon Mallik', email: 'd@example.com', company: 'Acme Ltd' }) => {
    let s = answerPath(initSession(), path);
    const r = submit(s, contact);
    expect(r.ok).toBe(true);
    return buildBrief(r.session);
  };

  it('returns null for an unfinished session', () => {
    expect(buildBrief(initSession())).toBeNull();
  });

  it('produces a brief with a track, a headline, steps and a payload', () => {
    const b = finish(['automate', 'ops-data', 'daily', 'erp', 'weeks']);
    expect(b.track).toBe('automation');
    expect(typeof b.headline).toBe('string');
    expect(b.headline.length).toBeGreaterThan(10);
    expect(Array.isArray(b.steps)).toBe(true);
    expect(b.steps.length).toBeGreaterThanOrEqual(3);
    expect(b.payload.email).toBe('d@example.com');
  });

  it('recommends a browser-automation play for repetitive UI work', () => {
    const b = finish(['automate', 'manual-ui', 'daily', 'erp', 'weeks']);
    expect(b.recommendation.id).toBe('browser-agent');
  });

  it('recommends a data-pipeline play for migration and reconciliation work', () => {
    const b = finish(['automate', 'ops-data', 'weekly', 'erp', 'months']);
    expect(b.recommendation.id).toBe('data-pipeline');
  });

  it('recommends a research-agent play for information gathering', () => {
    const b = finish(['automate', 'research', 'weekly', 'saas', 'weeks']);
    expect(b.recommendation.id).toBe('research-agent');
  });

  it('recommends a support-agent play for customer conversations', () => {
    const b = finish(['automate', 'support', 'daily', 'saas', 'asap']);
    expect(b.recommendation.id).toBe('support-agent');
  });

  it('switches to the hiring track and cites relevant evidence', () => {
    const b = finish(['hire', 'agentic']);
    expect(b.track).toBe('hiring');
    expect(b.evidence.length).toBeGreaterThan(0);
    b.evidence.forEach((e) => {
      expect(e.label).toBeTruthy();
      expect(e.href).toMatch(/^https:\/\//);
    });
  });

  it('every recommendation cites at least one real project as proof', () => {
    const paths = [
      ['automate', 'manual-ui', 'daily', 'erp', 'weeks'],
      ['automate', 'ops-data', 'weekly', 'erp', 'months'],
      ['automate', 'research', 'weekly', 'saas', 'weeks'],
      ['automate', 'support', 'daily', 'saas', 'asap'],
    ];
    for (const p of paths) {
      const b = finish(p);
      expect(b.evidence.length, `no evidence for ${p.join('/')}`).toBeGreaterThan(0);
    }
  });

  it('sanitizes contact input into the payload', () => {
    const b = finish(['automate', 'ops-data', 'daily', 'erp', 'weeks'], {
      name: '  <b>Debayon</b>   Mallik ', email: ' d@example.com ', company: '  Acme  ',
    });
    expect(b.payload.name).toBe('bDebayon/b Mallik');
    expect(b.payload.company).toBe('Acme');
  });

  it('never produces a doubled article in the generated steps', () => {
    const systems = ['erp', 'saas', 'sheets', 'internal'];
    const cadences = ['daily', 'weekly', 'monthly'];
    for (const sys of systems) {
      for (const cad of cadences) {
        const b = finish(['automate', 'ops-data', cad, sys, 'weeks']);
        const text = b.steps.join(' ');
        expect(text, `${sys}/${cad}`).not.toMatch(/\bthe your\b|\ba your\b|\bthe the\b|\bin your your\b/i);
        expect(text).not.toContain('undefined');
      }
    }
  });

  it('never leaves an unresolved label anywhere in the brief', () => {
    const b = finish(['automate', 'manual-ui', 'daily', 'internal', 'asap']);
    const blob = JSON.stringify(b);
    expect(blob).not.toContain('undefined');
    expect(blob).not.toContain('[object Object]');
  });

  it('includes a plain-text summary suitable for an email body', () => {
    const b = finish(['automate', 'ops-data', 'daily', 'erp', 'weeks']);
    expect(b.payload.message).toContain('d@example.com');
    expect(b.payload.message).not.toContain('<');
  });
});
