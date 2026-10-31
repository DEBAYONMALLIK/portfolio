/**
 * Input validation for the business-brief qualifier.
 * Pure functions, no DOM, no network — so they are cheap to test exhaustively.
 */

const EMAIL = /^[^\s@<>]+@[^\s@<>.]+(\.[^\s@<>.]+)+$/;

const asString = (v) => (typeof v === 'string' ? v : '');

/** Strip markup characters, collapse whitespace, trim and cap length. */
export function sanitize(value, max = 500) {
  return asString(value)
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function isValidEmail(value) {
  const v = asString(value).trim();
  if (!v || v.length > 254) return false;
  return EMAIL.test(v);
}

export function isValidName(value) {
  const v = asString(value).trim();
  return v.length >= 2 && v.length <= 80;
}

export function isValidCompany(value) {
  const v = asString(value).trim();
  return v.length <= 120;
}

/**
 * Validates the whole contact object at once and reports every problem,
 * so the form can highlight all bad fields in a single pass.
 */
export function validateContact(input) {
  const raw = input && typeof input === 'object' ? input : {};
  const value = {
    name: sanitize(raw.name, 80),
    email: sanitize(raw.email, 254),
    company: sanitize(raw.company, 120),
  };

  const errors = {};
  if (!isValidName(raw.name)) errors.name = 'Please enter your name (at least 2 characters).';
  if (!isValidEmail(raw.email)) errors.email = 'Please enter a valid email address.';
  if (!isValidCompany(raw.company)) errors.company = 'Company name is too long.';

  return { ok: Object.keys(errors).length === 0, errors, value };
}
