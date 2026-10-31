/**
 * The "tell me about your business" conversation, modelled as an explicit
 * state machine rather than an LLM call. Deterministic, offline, and fully
 * testable — the same reason the gadget advisor keeps its arithmetic in Python.
 */
import { validateContact, sanitize } from './validators.js';
import { PROJECTS, SERVICES, PROFILE } from '../data/content.js';

export const FLOW = {
  start: 'intent',
  nodes: {
    intent: {
      kind: 'choice',
      prompt: "Let's work out what you actually need. What brings you here?",
      options: [
        { value: 'automate', label: 'I want to automate something in my business', next: 'workload' },
        { value: 'hire', label: "I'm hiring and I'm evaluating you", next: 'role' },
        { value: 'explore', label: "I'm curious what AI could do for us", next: 'workload' },
      ],
    },
    workload: {
      kind: 'choice',
      prompt: 'Where does the time go today? Pick the one that hurts most.',
      options: [
        { value: 'manual-ui', label: 'People clicking through the same screens every day', next: 'cadence' },
        { value: 'ops-data', label: 'Moving, cleaning and reconciling data between systems', next: 'cadence' },
        { value: 'research', label: 'Gathering and comparing information before decisions', next: 'cadence' },
        { value: 'support', label: 'Answering the same customer questions over and over', next: 'cadence' },
      ],
    },
    cadence: {
      kind: 'choice',
      prompt: 'How often does that happen?',
      options: [
        { value: 'daily', label: 'Every day — it is someone’s whole job', next: 'systems' },
        { value: 'weekly', label: 'Weekly, in batches', next: 'systems' },
        { value: 'monthly', label: 'Monthly or at project milestones', next: 'systems' },
      ],
    },
    systems: {
      kind: 'choice',
      prompt: 'What is it happening inside?',
      options: [
        { value: 'erp', label: 'An ERP — Oracle, NetSuite, SAP or similar', next: 'timeline' },
        { value: 'saas', label: 'SaaS tools with a web interface', next: 'timeline' },
        { value: 'sheets', label: 'Spreadsheets and email', next: 'timeline' },
        { value: 'internal', label: 'Our own internal application', next: 'timeline' },
      ],
    },
    timeline: {
      kind: 'choice',
      prompt: 'And when would you want something working?',
      options: [
        { value: 'asap', label: 'Yesterday', next: 'contact' },
        { value: 'weeks', label: 'In the next few weeks', next: 'contact' },
        { value: 'months', label: 'This quarter, planning ahead', next: 'contact' },
      ],
    },
    role: {
      kind: 'choice',
      prompt: 'What is the role centred on?',
      options: [
        { value: 'agentic', label: 'Agentic AI and LLM systems', next: 'contact' },
        { value: 'automation', label: 'Automation and QA engineering', next: 'contact' },
        { value: 'data', label: 'Data engineering and enterprise integration', next: 'contact' },
        { value: 'fullstack', label: 'Full-stack product engineering', next: 'contact' },
      ],
    },
    contact: {
      kind: 'form',
      prompt: 'Last thing — where should the brief go?',
      fields: [
        { name: 'name', label: 'Your name', required: true, autoComplete: 'name' },
        { name: 'email', label: 'Email', required: true, type: 'email', autoComplete: 'email' },
        { name: 'company', label: 'Company (optional)', required: false, autoComplete: 'organization' },
      ],
      next: 'summary',
    },
    summary: {
      kind: 'terminal',
      prompt: "Here's what I'd build for you.",
    },
  },
};

const WORKLOAD_TO_PLAY = {
  'manual-ui': 'browser-agent',
  'ops-data': 'data-pipeline',
  research: 'research-agent',
  support: 'support-agent',
};

const ROLE_TO_PLAY = {
  agentic: 'browser-agent',
  automation: 'browser-agent',
  data: 'data-pipeline',
  fullstack: 'support-agent',
};

const CADENCE_LABEL = { daily: 'every day', weekly: 'every week', monthly: 'every month' };
const TIMELINE_LABEL = { asap: 'as soon as possible', weeks: 'within a few weeks', months: 'this quarter' };
const SYSTEM_LABEL = { erp: 'your ERP', saas: 'your SaaS tools', sheets: 'spreadsheets and email', internal: 'your internal application' };

const clone = (s) => JSON.parse(JSON.stringify(s));

export function initSession() {
  return { cursor: FLOW.start, answers: {}, history: [], startedAt: null };
}

export function currentNode(session) {
  return FLOW.nodes[session?.cursor] ?? null;
}

export function isComplete(session) {
  return currentNode(session)?.kind === 'terminal';
}

/** Shortest number of answers still required to reach the terminal node. */
function remainingDepth(cursor) {
  const queue = [[cursor, 0]];
  const seen = new Set();
  while (queue.length) {
    const [id, depth] = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    const node = FLOW.nodes[id];
    if (!node || node.kind === 'terminal') return depth;
    const nexts = node.options ? node.options.map((o) => o.next) : [node.next];
    nexts.filter(Boolean).forEach((n) => queue.push([n, depth + 1]));
  }
  return 0;
}

export function progress(session) {
  const done = session?.history?.length ?? 0;
  const left = remainingDepth(session?.cursor);
  if (done + left === 0) return 1;
  return done / (done + left);
}

/**
 * Accepts an answer for the current node. Pure: returns a new session,
 * never mutates the one it is handed.
 */
export function submit(session, value) {
  const node = currentNode(session);
  if (!node || node.kind === 'terminal') {
    return { ok: false, errors: { value: 'This conversation is already finished.' }, session };
  }

  if (node.kind === 'choice') {
    const option = node.options.find((o) => o.value === value);
    if (!option) {
      return { ok: false, errors: { value: 'Please pick one of the options.' }, session };
    }
    const next = clone(session);
    next.answers[session.cursor] = option.value;
    next.history = [...session.history, session.cursor];
    next.cursor = option.next;
    next.startedAt = session.startedAt ?? Date.now();
    return { ok: true, errors: {}, session: next };
  }

  // form node
  const result = validateContact(value);
  if (!result.ok) {
    return { ok: false, errors: result.errors, session };
  }
  const next = clone(session);
  next.answers[session.cursor] = result.value;
  next.history = [...session.history, session.cursor];
  next.cursor = node.next;
  return { ok: true, errors: {}, session: next };
}

/** Step back one node, discarding that node's answer. */
export function back(session) {
  if (!session?.history?.length) return session;
  const next = clone(session);
  const previous = next.history.pop();
  delete next.answers[previous];
  next.cursor = previous;
  return next;
}

function resolveEvidence(projectIds) {
  const fallback = PROFILE.links.find((l) => l.label === 'GitHub').href;
  return projectIds
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => ({
      id: p.id,
      label: p.title,
      href: p.links?.[0]?.href ?? fallback,
      note: p.links?.length ? 'See it running' : 'Client work — walkthrough on request',
    }));
}

/**
 * Turns a finished session into the brief the visitor sees and the
 * message that gets sent on. Returns null while the session is unfinished.
 */
export function buildBrief(session) {
  if (!isComplete(session)) return null;

  const a = session.answers;
  const track = a.intent === 'hire' ? 'hiring' : 'automation';
  const playId = track === 'hiring' ? ROLE_TO_PLAY[a.role] : WORKLOAD_TO_PLAY[a.workload];
  const service = SERVICES.find((s) => s.id === playId) ?? SERVICES[0];
  const contact = a.contact ?? {};

  const headline =
    track === 'hiring'
      ? `The closest thing I've shipped to what you're hiring for`
      : service.title;

  const steps =
    track === 'hiring'
      ? [
          'Walk through the architecture of the system closest to your problem.',
          'Show the code and the decisions behind it, including what I got wrong first.',
          'Talk through how I would approach the first thing on your roadmap.',
        ]
      : [
          `Map the workflow in ${SYSTEM_LABEL[a.systems] ?? 'your systems'} that runs ${CADENCE_LABEL[a.cadence] ?? 'regularly'}, step by step.`,
          'Build a narrow agent against the real interface and validate every run.',
          'Prove it on a slice of live work before it touches anything important.',
          `Harden, log and hand it over — targeting ${TIMELINE_LABEL[a.timeline] ?? 'an agreed date'}.`,
        ];

  const summaryLine =
    track === 'hiring'
      ? `${contact.name} is hiring for ${a.role} work.`
      : `${contact.name}${contact.company ? ` at ${contact.company}` : ''} spends time ${CADENCE_LABEL[a.cadence] ?? ''} on ${(FLOW.nodes.workload.options.find((o) => o.value === a.workload)?.label ?? '').toLowerCase()}, inside ${SYSTEM_LABEL[a.systems] ?? 'their systems'}, wanting something ${TIMELINE_LABEL[a.timeline] ?? 'soon'}.`;

  const message = sanitize(
    `New brief from the portfolio. ${summaryLine} Recommended play: ${service.title}. Reach them at ${contact.email}.`,
    800,
  );

  return {
    track,
    headline,
    summaryLine,
    steps,
    recommendation: { id: service.id, title: service.title, outcome: service.outcome, bullets: service.bullets },
    evidence: resolveEvidence(service.proof),
    payload: {
      name: contact.name,
      email: contact.email,
      company: contact.company,
      track,
      play: service.id,
      answers: { ...a, contact: undefined },
      message,
    },
  };
}
