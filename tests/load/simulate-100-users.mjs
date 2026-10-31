/**
 * Simulates 100 concurrent visitors against the production build.
 *
 * Each virtual user does what a real one does: fetches the document, then the
 * CSS and both JS chunks. Run `npm run build && npm run preview` first, or let
 * this script be driven by `npm run test:load`.
 *
 * Pass/fail thresholds are asserted at the end, so this can run in CI.
 */
import autocannon from 'autocannon';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const URL = process.env.LOAD_URL || 'http://127.0.0.1:4173';
const CONNECTIONS = Number(process.env.LOAD_USERS || 100);
const DURATION = Number(process.env.LOAD_DURATION || 30);

const THRESHOLDS = {
  errors: 0,
  non2xx: 0,
  p99LatencyMs: 750,
  minRequestsPerSecond: 150,
};

function assetPaths() {
  const dir = join(process.cwd(), 'dist', 'assets');
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
      .map((f) => `/assets/${f}`);
  } catch {
    return [];
  }
}

const assets = assetPaths();
if (assets.length === 0) {
  console.error('No build found in dist/assets. Run `npm run build` first.');
  process.exit(1);
}

const requests = [
  { method: 'GET', path: '/' },
  ...assets.map((path) => ({ method: 'GET', path })),
];

console.log(`Simulating ${CONNECTIONS} concurrent users for ${DURATION}s against ${URL}`);
console.log(`Each user requests the document plus ${assets.length} assets.\n`);

const result = await autocannon({
  url: URL,
  connections: CONNECTIONS,
  duration: DURATION,
  pipelining: 1,
  requests,
});

const summary = {
  target: URL,
  concurrentUsers: CONNECTIONS,
  durationSeconds: result.duration,
  totalRequests: result.requests.total,
  requestsPerSecond: { mean: result.requests.mean, stddev: result.requests.stddev },
  latencyMs: {
    mean: result.latency.mean,
    p50: result.latency.p50,
    p90: result.latency.p90,
    p99: result.latency.p99,
    max: result.latency.max,
  },
  throughputBytesPerSecond: result.throughput.mean,
  errors: result.errors,
  timeouts: result.timeouts,
  non2xx: result.non2xx,
  capturedAt: new Date().toISOString(),
};

mkdirSync('test-results', { recursive: true });
writeFileSync('test-results/load-100-users.json', JSON.stringify(summary, null, 2));

const row = (k, v) => console.log(`  ${k.padEnd(26)} ${v}`);
console.log('Results');
row('Concurrent users', summary.concurrentUsers);
row('Duration', `${summary.durationSeconds}s`);
row('Total requests', summary.totalRequests.toLocaleString());
row('Requests/sec (mean)', Math.round(summary.requestsPerSecond.mean).toLocaleString());
row('Throughput', `${(summary.throughputBytesPerSecond / 1e6).toFixed(1)} MB/s`);
row('Latency mean', `${summary.latencyMs.mean} ms`);
row('Latency p50', `${summary.latencyMs.p50} ms`);
row('Latency p90', `${summary.latencyMs.p90} ms`);
row('Latency p99', `${summary.latencyMs.p99} ms`);
row('Latency max', `${summary.latencyMs.max} ms`);
row('Errors', summary.errors);
row('Timeouts', summary.timeouts);
row('Non-2xx responses', summary.non2xx);

const failures = [];
if (summary.errors > THRESHOLDS.errors) failures.push(`errors ${summary.errors} > ${THRESHOLDS.errors}`);
if (summary.non2xx > THRESHOLDS.non2xx) failures.push(`non-2xx ${summary.non2xx} > ${THRESHOLDS.non2xx}`);
if (summary.latencyMs.p99 > THRESHOLDS.p99LatencyMs) {
  failures.push(`p99 ${summary.latencyMs.p99}ms > ${THRESHOLDS.p99LatencyMs}ms`);
}
if (summary.requestsPerSecond.mean < THRESHOLDS.minRequestsPerSecond) {
  failures.push(`throughput ${Math.round(summary.requestsPerSecond.mean)} rps < ${THRESHOLDS.minRequestsPerSecond}`);
}

console.log('');
if (failures.length) {
  console.error(`FAILED thresholds:\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}
console.log('All thresholds met. Saved to test-results/load-100-users.json');
