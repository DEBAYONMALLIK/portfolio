import { SKILL_GROUPS, CERTIFICATIONS } from '../data/content.js';
import { Section } from './primitives.jsx';

export default function Skills() {
  return (
    <Section id="skills" index="05" label="tools and credentials" title="What I reach for">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <dl className="grid gap-8 sm:grid-cols-2">
          {SKILL_GROUPS.map((g) => (
            <div key={g.name} data-testid={`skill-group-${g.name}`}>
              <dt className="font-mono text-[0.6875rem] text-type-faint">{g.name}</dt>
              <dd className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {g.items.map((i) => (
                  <span key={i} className="text-sm text-type-muted">
                    {i}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="font-mono text-[0.6875rem] text-type-faint">verified badges</p>
          <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-hair bg-hair">
            {CERTIFICATIONS.map((c) => (
              <a
                key={c.href}
                href={c.href}
                target="_blank"
                rel="noreferrer noopener"
                data-testid="certification"
                className="group bg-ink-raised px-4 py-4 transition-colors hover:bg-signal-wash"
              >
                <p className="text-sm font-medium text-type">{c.title}</p>
                <p className="mt-1 font-mono text-[0.6875rem] text-type-faint">
                  {c.issuer}, {c.date}
                </p>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-type-faint">
            Each badge links to the issuer, not a screenshot.
          </p>
        </div>
      </div>
    </Section>
  );
}
