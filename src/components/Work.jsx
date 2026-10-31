import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PROJECTS } from '../data/content.js';
import { allTags, filterProjects, sortProjects } from '../lib/filters.js';
import { Section, Pill, StatusDot } from './primitives.jsx';

function ProjectCard({ project }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <article
      data-testid="project-card"
      data-project-id={project.id}
      className="surface group flex h-full flex-col rounded-lg p-5 transition-colors duration-300 ease-out hover:border-hair-strong sm:p-7"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <StatusDot state={project.year >= 2026 ? 'live' : 'done'} />
        <span className="font-mono text-[0.6875rem] text-type-faint">{project.org}</span>
        <span className="font-mono text-[0.6875rem] tabular-nums text-type-faint">{project.year}</span>
        {project.visibility === 'client' && <Pill>client work</Pill>}
      </div>

      <h3 className="mt-4 text-display-md font-semibold text-type">{project.title}</h3>
      <p className="mt-3 max-w-measure leading-relaxed text-type-muted">{project.summary}</p>

      {project.metrics?.length > 0 && (
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dt className="font-mono text-lg font-medium text-signal">{m.value}</dt>
              <dd className="mt-0.5 text-xs text-type-faint">{m.label}</dd>
            </div>
          ))}
        </dl>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-testid={`project-detail-toggle-${project.id}`}
        className="mt-6 flex items-center gap-2 font-mono text-xs text-type-muted transition-colors hover:text-signal"
      >
        <span
          aria-hidden="true"
          className={`inline-block transition-transform duration-300 ease-out ${open ? 'rotate-90' : ''}`}
        >
          +
        </span>
        {open ? 'Hide how it works' : 'How it works'}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            data-testid={`project-detail-${project.id}`}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-5 space-y-3 border-l border-hair pl-5">
              {project.highlights.map((h) => (
                <li key={h} className="max-w-measure text-sm leading-relaxed text-type-muted">
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hair pt-5">
          {project.stack.map((s) => (
            <span key={s} className="font-mono text-[0.6875rem] text-type-faint">
              {s}
            </span>
          ))}
        </div>
      </div>

      {project.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-5">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline text-sm"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Work() {
  const [tag, setTag] = useState('All');
  const tags = useMemo(() => allTags(PROJECTS), []);
  const visible = useMemo(() => sortProjects(filterProjects(PROJECTS, tag)), [tag]);
  const reduce = useReducedMotion();

  return (
    <Section
      id="work"
      index="01"
      label="selected work"
      title="Systems that run without me watching"
      lede="Two are client systems in production at Trinamix; the rest you can open and try right now."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by area">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            aria-pressed={tag === t}
            data-testid={`filter-${t}`}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors duration-200 ${
              tag === t
                ? 'border-signal-dim bg-signal-wash text-signal'
                : 'border-hair text-type-muted hover:border-hair-strong hover:text-type'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div layout={!reduce} className="mt-8 grid gap-5 lg:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p) => (
            <motion.div
              key={p.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="mt-8 text-type-muted" data-testid="work-empty">
          Nothing tagged {tag} yet. Pick another area.
        </p>
      )}
    </Section>
  );
}
