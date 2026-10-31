import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom lacks these; framer-motion and scroll-reveal hooks need them.
globalThis.IntersectionObserver = class {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};
globalThis.ResizeObserver = class {
  observe() {} unobserve() {} disconnect() {}
};
globalThis.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  });
}

afterEach(() => cleanup());
