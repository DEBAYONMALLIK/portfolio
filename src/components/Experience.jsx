import { EXPERIENCE, PROFILE } from '../data/content.js';
import { Section, StatusDot } from './primitives.jsx';

export default function Experience() {
  return (
    <Section id="experience" index="04" label="experience and education" title="Where this came from">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          {EXPERIENCE.map((job) => (
            <div key={job.company} data-testid="experience-entry">
              <div className="flex flex-wrap items-center gap-3">
                <StatusDot state="live" />
                <h3 className="text-xl font-semibold text-type">{job.company}</h3>
              </div>
              <p className="mt-1.5 pl-5 font-mono text-xs text-type-faint">
                {job.location}, {job.period}
              </p>

              <div className="mt-7 grid gap-9 border-l border-hair pl-5">
                {job.roles.map((r) => (
                  <div key={r.title}>
                    <h4 className="max-w-measure font-medium leading-snug text-type">{r.title}</h4>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-type-faint">
                      {r.stack.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </p>
                    <ul className="mt-4 grid gap-3">
                      {r.bullets.map((b) => (
                        <li key={b} className="max-w-measure text-sm leading-relaxed text-type-muted">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="font-mono text-[0.6875rem] text-type-faint">education</p>
          <dl className="mt-5 grid gap-6">
            {PROFILE.education.map((e) => (
              <div key={e.school} className="border-l border-hair pl-5">
                <dt className="font-medium text-type">{e.school}</dt>
                <dd className="mt-1 text-sm text-type-muted">{e.detail}</dd>
                <dd className="mt-1 font-mono text-[0.6875rem] tabular-nums text-type-faint">{e.period}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
