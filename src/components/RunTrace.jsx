import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * The hero's centrepiece: a real agent run, replayed.
 * These are the actual stages of the Festive Sale Gadget Advisor pipeline.
 */
export const TRACE = [
  { op: 'init', detail: 'agent graph, 8 nodes', t: 'ready' },
  { op: 'fan-out', detail: '4 MCP servers, parallel', t: '0.4s' },
  { op: 'read', detail: 'Reddit owner threads', t: '1.2s' },
  { op: 'read', detail: 'YouTube review transcripts', t: '0.9s' },
  { op: 'drive', detail: 'real Chrome, live prices', t: '2.1s' },
  { op: 'score', detail: 'deterministic Python', t: '8ms' },
  { op: 'cite', detail: 'every claim sourced', t: 'ok' },
  { op: 'done', detail: '6 candidates ranked', t: '3.4s' },
];

export default function RunTrace() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? TRACE.length : 0);
  const timers = useRef([]);

  useEffect(() => {
    if (reduce) {
      setShown(TRACE.length);
      return undefined;
    }
    TRACE.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), 420 + i * 230));
    });
    return () => timers.current.forEach(clearTimeout);
  }, [reduce]);

  const running = shown < TRACE.length;

  return (
    <div
      data-testid="run-trace"
      className="surface relative overflow-hidden rounded-lg"
      aria-label="Replay of an agent run from the Festive Sale Gadget Advisor"
    >
      <div className="flex items-center justify-between border-b border-hair px-4 py-2.5">
        <span className="font-mono text-[0.6875rem] text-type-faint">festive-sale-gadget-advisor</span>
        <span className="flex items-center gap-2 font-mono text-[0.6875rem]">
          <span
            aria-hidden="true"
            className={`inline-block h-1.5 w-1.5 rounded-full ${running ? 'bg-live animate-pulse-ring' : 'bg-signal'}`}
          />
          <span className={running ? 'text-live' : 'text-signal'}>{running ? 'running' : 'complete'}</span>
        </span>
      </div>

      <ol className="px-4 py-3 font-mono text-trace">
        {TRACE.slice(0, shown).map((line, i) => (
          <li
            key={`${line.op}-${i}`}
            className="grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-3 py-[3px]"
          >
            <span className={line.op === 'done' ? 'text-signal' : 'text-type-faint'}>{line.op}</span>
            <span className="truncate text-type-muted">{line.detail}</span>
            <span className="tabular-nums text-type-faint">{line.t}</span>
          </li>
        ))}
        {running && (
          <li className="grid grid-cols-[4.5rem_1fr_auto] gap-3 py-[3px]" aria-hidden="true">
            <span className="text-live">
              <span className="animate-caret">_</span>
            </span>
          </li>
        )}
      </ol>
    </div>
  );
}
