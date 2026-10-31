import { useEffect, useState } from 'react';
import { PROFILE } from '../data/content.js';
import { Button } from './primitives.jsx';

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'automate', label: 'Automate' },
  { id: 'brief', label: 'Talk to me' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav
      data-testid="nav"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out ${
        lifted ? 'border-b border-hair bg-ink/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-wide items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Back to top">
          <span className="font-mono text-sm font-medium text-type">DM</span>
          <span className="hidden text-sm text-type-muted transition-colors group-hover:text-type sm:inline">
            {PROFILE.name}
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-testid={`nav-${l.id}`}
              aria-current={active === l.id ? 'true' : undefined}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active === l.id ? 'text-signal' : 'text-type-muted hover:text-type'
              }`}
            >
              {l.label}
            </a>
          ))}
          <Button as="a" href="#brief" className="ml-3 px-4 py-2" data-testid="nav-cta">
            Start a brief
          </Button>
        </div>

        <button
          type="button"
          className="-mr-2 rounded-md p-2 text-type-muted md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          data-testid="nav-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-menu" data-testid="mobile-menu" className="border-t border-hair bg-ink md:hidden">
          <div className="flex flex-col px-5 py-2 sm:px-8">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="border-b border-hair/60 py-3.5 text-sm text-type-muted last:border-0"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
