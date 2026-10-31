import { useReducedMotion } from 'framer-motion';

const NODES = [
  { x: 14, y: 50, r: 4.5, kind: 'in' },
  { x: 36, y: 22, r: 3.2 },
  { x: 36, y: 50, r: 3.2 },
  { x: 36, y: 78, r: 3.2 },
  { x: 60, y: 34, r: 3.2 },
  { x: 60, y: 66, r: 3.2 },
  { x: 84, y: 50, r: 4.5, kind: 'out' },
];

const EDGES = [
  [0, 1], [0, 2], [0, 3],
  [1, 4], [2, 4], [2, 5], [3, 5],
  [4, 6], [5, 6],
];

/**
 * Background texture for the hero. It is the shape of a LangGraph fan-out,
 * so it says something about the work rather than decorating the page.
 */
export default function NodeGraph({ className = '' }) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <g stroke="#2A323F" strokeWidth="0.3" fill="none">
        {EDGES.map(([a, b], i) => (
          <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
        ))}
      </g>
      {!reduce &&
        EDGES.map(([a, b], i) => (
          <line
            key={`p-${i}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#7DA2FF"
            strokeWidth="0.45"
            strokeDasharray="3 60"
            opacity="0.5"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="63"
              to="0"
              dur={`${3.2 + (i % 4) * 0.7}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      {NODES.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="#0A0C10"
          stroke={n.kind ? '#7DA2FF' : '#2A323F'}
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}
