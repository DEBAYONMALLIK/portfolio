import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  initSession, currentNode, submit, back, progress, buildBrief, isComplete, FLOW,
} from '../lib/qualifier.js';
import { PROFILE } from '../data/content.js';
import { Section, Button } from './primitives.jsx';

function Transcript({ session }) {
  return (
    <ol className="space-y-3" data-testid="transcript">
      {session.history.map((nodeId) => {
        const node = FLOW.nodes[nodeId];
        const answer = session.answers[nodeId];
        const label =
          node.kind === 'choice'
            ? node.options.find((o) => o.value === answer)?.label
            : [answer?.name, answer?.company].filter(Boolean).join(', ');
        return (
          <li key={nodeId} className="grid gap-1 border-l border-hair pl-4">
            <span className="font-mono text-[0.6875rem] text-type-faint">{node.prompt}</span>
            <span className="text-sm text-type-muted">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function ContactForm({ node, errors, onSubmit }) {
  const [values, setValues] = useState({ name: '', email: '', company: '' });
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  return (
    <form
      data-testid="contact-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="grid gap-4"
    >
      {node.fields.map((f, i) => (
        <div key={f.name} className="grid gap-1.5">
          <label htmlFor={`q-${f.name}`} className="font-mono text-xs text-type-muted">
            {f.label}
          </label>
          <input
            ref={i === 0 ? firstRef : undefined}
            id={`q-${f.name}`}
            name={f.name}
            type={f.type ?? 'text'}
            autoComplete={f.autoComplete}
            data-testid={`input-${f.name}`}
            aria-invalid={errors[f.name] ? 'true' : undefined}
            aria-describedby={errors[f.name] ? `err-${f.name}` : undefined}
            value={values[f.name]}
            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            className={`w-full rounded-md border bg-ink px-3.5 py-2.5 text-sm text-type outline-none transition-colors placeholder:text-type-faint ${
              errors[f.name] ? 'border-live' : 'border-hair focus:border-signal-dim'
            }`}
          />
          {errors[f.name] && (
            <p id={`err-${f.name}`} data-testid={`error-${f.name}`} className="text-xs text-live">
              {errors[f.name]}
            </p>
          )}
        </div>
      ))}
      <Button type="submit" data-testid="contact-submit" className="mt-1 justify-self-start">
        Build my brief
      </Button>
    </form>
  );
}

function Brief({ brief, onRestart }) {
  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    `Brief: ${brief.recommendation.title}`,
  )}&body=${encodeURIComponent(brief.payload.message)}`;

  return (
    <div data-testid="brief" className="grid gap-7">
      <div>
        <p className="font-mono text-[0.6875rem] text-live">recommended</p>
        <h3 className="mt-2 max-w-measure text-display-md font-semibold text-type">{brief.headline}</h3>
        <p className="mt-4 max-w-measure leading-relaxed text-type-muted">{brief.recommendation.outcome}</p>
      </div>

      <div>
        <p className="font-mono text-[0.6875rem] text-type-faint">how it would go</p>
        <ol className="mt-3 grid gap-2.5">
          {brief.steps.map((s, i) => (
            <li key={s} className="grid grid-cols-[1.75rem_1fr] items-baseline gap-2">
              <span className="font-mono text-xs tabular-nums text-signal-dim">{String(i + 1).padStart(2, '0')}</span>
              <span className="max-w-measure text-sm leading-relaxed text-type-muted">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="font-mono text-[0.6875rem] text-type-faint">where I have done this before</p>
        <div className="mt-3 grid gap-2">
          {brief.evidence.map((e) => (
            <a
              key={e.id}
              href={e.href}
              target="_blank"
              rel="noreferrer noopener"
              data-testid="brief-evidence"
              className="surface flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-md px-4 py-3 transition-colors hover:border-signal-dim"
            >
              <span className="text-sm text-type">{e.label}</span>
              <span className="font-mono text-[0.6875rem] text-type-faint">{e.note}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-hair pt-6">
        <Button as="a" href={mailto} data-testid="brief-send">
          Send this to Debayon
        </Button>
        <Button type="button" variant="quiet" onClick={onRestart} data-testid="brief-restart">
          Start over
        </Button>
      </div>
    </div>
  );
}

export default function Qualifier() {
  const [session, setSession] = useState(initSession);
  const [errors, setErrors] = useState({});
  const reduce = useReducedMotion();

  const node = currentNode(session);
  const done = isComplete(session);
  const brief = done ? buildBrief(session) : null;
  const pct = Math.round(progress(session) * 100);

  const answer = (value) => {
    const result = submit(session, value);
    setErrors(result.errors);
    if (result.ok) setSession(result.session);
  };

  return (
    <Section
      id="brief"
      index="03"
      label="tell me about your business"
      title="Two minutes, and you leave with a plan"
      lede="No chatbot guessing at you. These are the same questions I ask on a first call, and the answer at the end is built from work I have actually shipped."
    >
      <div className="surface overflow-hidden rounded-lg">
        <div className="flex items-center justify-between gap-4 border-b border-hair px-5 py-3">
          <span className="font-mono text-[0.6875rem] text-type-faint">
            {done ? 'brief ready' : `step ${session.history.length + 1}`}
          </span>
          <div className="h-px flex-1 bg-hair" aria-hidden="true">
            <motion.div
              className="h-px bg-signal"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span
            className="font-mono text-[0.6875rem] tabular-nums text-type-faint"
            data-testid="qualifier-progress"
          >
            {pct}%
          </span>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-12">
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={session.cursor}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                {!done && (
                  <>
                    <p
                      className="max-w-measure text-lg font-medium leading-snug text-type"
                      data-testid="qualifier-prompt"
                    >
                      {node.prompt}
                    </p>

                    <div className="mt-6">
                      {node.kind === 'choice' ? (
                        <div className="grid gap-2.5">
                          {node.options.map((o) => (
                            <button
                              key={o.value}
                              type="button"
                              data-testid={`option-${o.value}`}
                              onClick={() => answer(o.value)}
                              className="group rounded-md border border-hair bg-ink px-4 py-3.5 text-left text-sm text-type-muted transition-colors duration-200 hover:border-signal-dim hover:bg-signal-wash hover:text-type focus-visible:border-signal-dim"
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <ContactForm node={node} errors={errors} onSubmit={answer} />
                      )}
                    </div>
                  </>
                )}

                {done && brief && <Brief brief={brief} onRestart={() => { setSession(initSession()); setErrors({}); }} />}
              </motion.div>
            </AnimatePresence>

            {!done && session.history.length > 0 && (
              <button
                type="button"
                data-testid="qualifier-back"
                onClick={() => { setSession(back(session)); setErrors({}); }}
                className="mt-6 font-mono text-xs text-type-faint transition-colors hover:text-type"
              >
                Back
              </button>
            )}
          </div>

          <aside className="border-t border-hair pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-mono text-[0.6875rem] text-type-faint">what you have told me</p>
            <div className="mt-4">
              {session.history.length === 0 ? (
                <p className="text-sm text-type-faint">Nothing yet. Pick an answer and this fills in.</p>
              ) : (
                <Transcript session={session} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
