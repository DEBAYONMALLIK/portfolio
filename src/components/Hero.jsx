import { PROFILE, ACHIEVEMENTS } from '../data/content.js';
import { Button, Enter } from './primitives.jsx';
import RunTrace from './RunTrace.jsx';
import NodeGraph from './NodeGraph.jsx';

export default function Hero() {
  return (
    <header className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="graph-field pointer-events-none absolute inset-0 opacity-[0.45]" aria-hidden="true" />
      <NodeGraph className="pointer-events-none absolute -right-24 top-10 hidden h-[34rem] w-[34rem] opacity-50 lg:block" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-wide px-5 sm:px-8 lg:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <Enter>
              <div className="flex items-center gap-4">
                <img
                  src={PROFILE.portrait.src}
                  alt={PROFILE.portrait.alt}
                  width="320"
                  height="320"
                  loading="eager"
                  decoding="async"
                  data-testid="portrait"
                  className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-hair-strong sm:h-16 sm:w-16"
                />
                <p className="flex flex-col gap-y-0.5 font-mono text-xs text-type-faint">
                  <span className="text-type-muted">{PROFILE.name}</span>
                  <span>{PROFILE.role}</span>
                  <span>{PROFILE.location}</span>
                </p>
              </div>
            </Enter>

            <Enter delay={0.08}>
              <h1 className="mt-6 text-display-xl font-semibold text-type">
                I build agents that do the work.
              </h1>
            </Enter>

            <Enter delay={0.16}>
              <p className="mt-7 max-w-measure text-lg leading-relaxed text-type-muted sm:text-xl">
                {PROFILE.subhead}
              </p>
            </Enter>

            <Enter delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button as="a" href="#automate" data-testid="cta-automate">
                  See what I can automate
                </Button>
                <Button as="a" href="#work" variant="ghost" data-testid="cta-work">
                  Read the work
                </Button>
              </div>
            </Enter>

            <Enter delay={0.32}>
              <dl className="mt-12 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-hair bg-hair">
                {ACHIEVEMENTS.map((a) => (
                  <div key={a.label} className="bg-ink-raised px-4 py-5">
                    <dt className="font-mono text-2xl font-medium tabular-nums text-type sm:text-3xl">
                      {a.value}
                    </dt>
                    <dd className="mt-2 text-xs leading-snug text-type-muted">{a.label}</dd>
                  </div>
                ))}
              </dl>
            </Enter>
          </div>

          <Enter delay={0.2} className="lg:pt-10">
            <RunTrace />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-type-faint">
              A real run from one of my pipelines. The browser reads live prices, and the
              scoring stays in Python — so the numbers cannot be invented.
            </p>
          </Enter>
        </div>
      </div>
    </header>
  );
}
