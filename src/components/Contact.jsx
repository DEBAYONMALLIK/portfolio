import { PROFILE } from '../data/content.js';
import { Button } from './primitives.jsx';

export default function Contact() {
  return (
    <footer id="contact" data-testid="section-contact" className="relative mt-24 scroll-mt-20 overflow-hidden pb-16 pt-20">
      <div className="graph-field pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-wide px-5 sm:px-8 lg:px-12">
        <div className="border-t border-hair pt-12">
          <p className="mono-label">{PROFILE.availability}</p>
          <h2 className="mt-5 max-w-[20ch] text-display-lg font-semibold text-type">
            Tell me what takes too long, and I will tell you if an agent can take it.
          </h2>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button as="a" href={`mailto:${PROFILE.email}`} data-testid="contact-email">
              {PROFILE.email}
            </Button>
            <Button as="a" href="#brief" variant="ghost">
              Start a brief instead
            </Button>
          </div>

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-hair pt-8">
            {PROFILE.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-testid="profile-link"
                  className="group inline-flex items-baseline gap-2 text-sm"
                >
                  <span className="text-type-muted transition-colors group-hover:text-signal">{l.label}</span>
                  <span className="font-mono text-[0.6875rem] text-type-faint">{l.handle}</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-10 font-mono text-[0.6875rem] text-type-faint">
            {PROFILE.name}, {PROFILE.location}. Built with React and Tailwind, tested end to end.
          </p>
        </div>
      </div>
    </footer>
  );
}
