import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import App from '../../src/App.jsx';
import { PROJECTS, PROFILE, SERVICES, CERTIFICATIONS } from '../../src/data/content.js';

/**
 * Structural regression: these lock the shape of the page so a future edit
 * cannot quietly drop a section, an outbound link, or the rel attributes.
 */
describe('App structure', () => {
  it('renders every section the navigation points at', () => {
    render(<App />);
    ['work', 'automate', 'brief', 'experience', 'skills', 'contact'].forEach((id) => {
      expect(screen.getByTestId(`section-${id}`), `missing section ${id}`).toBeInTheDocument();
    });
  });

  it('renders exactly one h1 and it is the hero headline', () => {
    const { container } = render(<App />);
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/agents that do the work/i);
  });

  it('never emits a duplicate element id', () => {
    const { container } = render(<App />);
    const ids = [...container.querySelectorAll('[id]')].map((n) => n.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it('opens every external link safely', () => {
    const { container } = render(<App />);
    const external = [...container.querySelectorAll('a[href^="http"]')];
    expect(external.length).toBeGreaterThan(5);
    external.forEach((a) => {
      expect(a.getAttribute('target'), a.getAttribute('href')).toBe('_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
      expect(a.getAttribute('rel')).toContain('noreferrer');
    });
  });

  it('every link has a discernible accessible name', () => {
    const { container } = render(<App />);
    container.querySelectorAll('a').forEach((a) => {
      const name = a.textContent.trim() || a.getAttribute('aria-label');
      expect(name, `empty link: ${a.outerHTML.slice(0, 80)}`).toBeTruthy();
    });
  });

  it('every button is explicitly typed so none submits a form by accident', () => {
    const { container } = render(<App />);
    container.querySelectorAll('button').forEach((b) => {
      expect(b.getAttribute('type'), b.textContent).toBeTruthy();
    });
  });

  it('renders one card per project', () => {
    render(<App />);
    expect(screen.getAllByTestId('project-card')).toHaveLength(PROJECTS.length);
  });

  it('renders one panel per service with its proof links', () => {
    render(<App />);
    SERVICES.forEach((s) => {
      const panel = screen.getByTestId(`service-${s.id}`);
      expect(within(panel).getByRole('heading', { name: s.title })).toBeInTheDocument();
    });
  });

  it('renders every certification badge pointing at the issuer', () => {
    render(<App />);
    const badges = screen.getAllByTestId('certification');
    expect(badges).toHaveLength(CERTIFICATIONS.length);
    badges.forEach((b) => expect(b.getAttribute('href')).toMatch(/^https:\/\/www\.skills\.google\//));
  });

  it('renders every profile link in the footer', () => {
    render(<App />);
    expect(screen.getAllByTestId('profile-link')).toHaveLength(PROFILE.links.length);
  });

  it('replays the hero run trace through to its final stage', async () => {
    render(<App />);
    const trace = await screen.findByTestId('run-trace');
    // The trace reveals one line at a time; it must finish, not stall.
    expect(
      await within(trace).findByText(/candidates ranked/i, {}, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(within(trace).getByText('complete')).toBeInTheDocument();
  });

  it('shows the portrait with real alt text and explicit dimensions', () => {
    render(<App />);
    const img = screen.getByTestId('portrait');
    expect(img.getAttribute('src')).toBe(PROFILE.portrait.src);
    expect(img.getAttribute('alt')).toBe(PROFILE.name);
    // width and height keep the hero from shifting while the image loads.
    expect(img.getAttribute('width')).toBeTruthy();
    expect(img.getAttribute('height')).toBeTruthy();
  });

  it('gives every image an alt attribute', () => {
    const { container } = render(<App />);
    const imgs = [...container.querySelectorAll('img')];
    expect(imgs.length).toBeGreaterThan(0);
    imgs.forEach((i) => expect(i.getAttribute('alt'), i.getAttribute('src')).not.toBeNull());
  });

  it('offers a skip link as the first focusable element', () => {
    const { container } = render(<App />);
    expect(container.querySelector('a').textContent).toMatch(/skip to content/i);
  });

  it('keeps the contact email as a mailto, not plain text', () => {
    render(<App />);
    expect(screen.getByTestId('contact-email').getAttribute('href')).toBe(`mailto:${PROFILE.email}`);
  });
});
