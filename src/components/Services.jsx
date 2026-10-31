import { SERVICES, PROJECTS } from '../data/content.js';
import { Section, Button } from './primitives.jsx';

export default function Services() {
  return (
    <Section
      id="automate"
      index="02"
      label="what I can automate for you"
      title="If a person does it every day on a screen, an agent can do it tonight"
      lede="Four shapes of work I have already built. Each one links to the system where I built it, so you can judge the claim rather than take it."
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-hair bg-hair md:grid-cols-2">
        {SERVICES.map((s) => (
          <article key={s.id} data-testid={`service-${s.id}`} className="flex flex-col bg-ink-raised p-6 sm:p-8">
            <h3 className="max-w-measure text-xl font-semibold leading-snug text-type">{s.title}</h3>
            <p className="mt-4 max-w-measure leading-relaxed text-type-muted">{s.outcome}</p>

            <ul className="mt-6 grid gap-2.5">
              {s.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-relaxed text-type-muted">
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-signal-dim" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-hair pt-6">
              <span className="font-mono text-[0.6875rem] text-type-faint">built in</span>
              {s.proof.map((pid) => {
                const p = PROJECTS.find((x) => x.id === pid);
                const href = p?.links?.[0]?.href;
                return href ? (
                  <a key={pid} href={href} target="_blank" rel="noreferrer noopener" className="link-underline text-xs">
                    {p.title}
                  </a>
                ) : (
                  <span key={pid} className="text-xs text-type-muted">
                    {p?.title}
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button as="a" href="#brief" data-testid="services-cta">
          Tell me about your business
        </Button>
        <p className="text-sm text-type-muted">Two minutes of questions, then a plan you can act on.</p>
      </div>
    </Section>
  );
}
