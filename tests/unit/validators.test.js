import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidName, isValidCompany, sanitize, validateContact } from '../../src/lib/validators.js';

describe('isValidEmail', () => {
  it.each([
    'debayonmallik9932@gmail.com',
    'a.b-c+tag@sub.domain.co.in',
    'x@y.io',
  ])('accepts %s', (v) => expect(isValidEmail(v)).toBe(true));

  it.each([
    '', '   ', 'plainstring', 'no@tld', '@nolocal.com', 'two@@at.com',
    'spaces in@mail.com', 'trailing@dot.', null, undefined, 42,
  ])('rejects %s', (v) => expect(isValidEmail(v)).toBe(false));

  it('trims surrounding whitespace before judging', () => {
    expect(isValidEmail('  hi@example.com  ')).toBe(true);
  });
});

describe('isValidName', () => {
  it('accepts a normal human name', () => expect(isValidName('Debayon Mallik')).toBe(true));
  it('accepts a single-word name', () => expect(isValidName('Ada')).toBe(true));
  it('rejects a single character', () => expect(isValidName('A')).toBe(false));
  it('rejects empty and whitespace', () => {
    expect(isValidName('')).toBe(false);
    expect(isValidName('    ')).toBe(false);
  });
  it('rejects names longer than 80 characters', () => {
    expect(isValidName('z'.repeat(81))).toBe(false);
  });
});

describe('isValidCompany', () => {
  it('treats company as optional', () => {
    expect(isValidCompany('')).toBe(true);
    expect(isValidCompany(undefined)).toBe(true);
  });
  it('accepts a real company', () => expect(isValidCompany('Trinamix Systems')).toBe(true));
  it('rejects absurdly long input', () => expect(isValidCompany('z'.repeat(121))).toBe(false));
});

describe('sanitize', () => {
  it('strips angle brackets so nothing can be injected into the brief', () => {
    expect(sanitize('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });
  it('collapses runs of whitespace and trims', () => {
    expect(sanitize('  too    many   spaces ')).toBe('too many spaces');
  });
  it('returns empty string for non-strings', () => {
    expect(sanitize(null)).toBe('');
    expect(sanitize(undefined)).toBe('');
    expect(sanitize(7)).toBe('');
  });
  it('caps length at 500 characters', () => {
    expect(sanitize('a'.repeat(900))).toHaveLength(500);
  });
});

describe('validateContact', () => {
  it('passes a complete valid contact', () => {
    const r = validateContact({ name: 'Debayon Mallik', email: 'd@example.com', company: 'Acme' });
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual({});
  });
  it('reports every bad field at once, not just the first', () => {
    const r = validateContact({ name: '', email: 'nope', company: 'z'.repeat(200) });
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors).sort()).toEqual(['company', 'email', 'name']);
  });
  it('returns sanitized values alongside the verdict', () => {
    const r = validateContact({ name: '  Debayon   Mallik ', email: ' d@example.com ', company: '' });
    expect(r.value.name).toBe('Debayon Mallik');
    expect(r.value.email).toBe('d@example.com');
  });
  it('handles a missing object without throwing', () => {
    expect(() => validateContact(undefined)).not.toThrow();
    expect(validateContact(undefined).ok).toBe(false);
  });
});
