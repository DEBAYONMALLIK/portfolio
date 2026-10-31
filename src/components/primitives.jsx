import { motion, useReducedMotion } from 'framer-motion';

/** Section wrapper. The id is the scroll target; the rail marker names it. */
export function Section({ id, index, label, title, lede, children, className = '' }) {
  return (
    <section id={id} data-testid={`section-${id}`} className={`relative scroll-mt-20 ${className}`}>
      <div className="mx-auto w-full max-w-wide px-5 sm:px-8 lg:px-12">
        <div className="border-t border-hair pt-8 sm:pt-12">
          <div className="flex items-baseline gap-4">
            <span className="mono-label tabular-nums text-signal-dim">{index}</span>
            <span className="mono-label">{label}</span>
          </div>
          {title && (
            <h2 className="mt-5 max-w-measure text-display-lg font-semibold text-type">{title}</h2>
          )}
          {lede && (
            <p className="mt-4 max-w-measure text-base leading-relaxed text-type-muted sm:text-lg">{lede}</p>
          )}
          <div className="mt-10 sm:mt-12">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function Pill({ children, tone = 'quiet' }) {
  const tones = {
    quiet: 'border-hair text-type-muted',
    signal: 'border-signal-dim/50 text-signal bg-signal-wash',
    live: 'border-live/40 text-live bg-live-wash',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Button({ as = 'button', variant = 'primary', className = '', children, ...rest }) {
  const Tag = as;
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors duration-200 ease-out disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-signal text-ink hover:bg-[#9BB6FF] focus-visible:bg-[#9BB6FF]',
    ghost: 'border border-hair-strong text-type hover:border-signal-dim hover:text-signal',
    quiet: 'text-type-muted hover:text-type',
  };
  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** A status dot whose colour carries meaning: live work vs shipped work. */
export function StatusDot({ state = 'done' }) {
  if (state === 'live') {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-live animate-pulse-ring"
      />
    );
  }
  return <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-type-faint" />;
}

/**
 * Entrance used exactly once, for the hero. Everything else animates in
 * response to something the visitor did.
 */
export function Enter({ delay = 0, children, className = '' }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
