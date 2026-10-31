import { describe, it, expect } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Qualifier from '../../src/components/Qualifier.jsx';

const setup = () => ({ user: userEvent.setup(), ...render(<Qualifier />) });

/**
 * Questions cross-fade, so the next one mounts a beat after the click.
 * Every step waits for the control to exist rather than assuming it does.
 */
const choose = async (user, value) => {
  await user.click(await screen.findByTestId(`option-${value}`));
};

/** The prompt node persists across the cross-fade, so wait on its text, not its presence. */
const expectPrompt = async (pattern) => {
  await waitFor(() => expect(screen.getByTestId('qualifier-prompt').textContent).toMatch(pattern));
};

const fillContact = async (user, { name = 'Priya Raman', email = 'priya@acme.co', company = 'Acme Logistics' } = {}) => {
  await user.type(await screen.findByTestId('input-name'), name);
  await user.type(screen.getByTestId('input-email'), email);
  if (company) await user.type(screen.getByTestId('input-company'), company);
  await user.click(screen.getByTestId('contact-submit'));
};

describe('Qualifier — automation track', () => {
  it('walks a visitor from first question to a finished brief', async () => {
    const { user } = setup();

    expect(screen.getByTestId('qualifier-progress')).toHaveTextContent('0%');
    await choose(user, 'automate');
    await choose(user, 'manual-ui');
    await choose(user, 'daily');
    await choose(user, 'erp');
    await choose(user, 'weeks');

    expect(await screen.findByTestId('contact-form')).toBeInTheDocument();
    await fillContact(user);

    const brief = await screen.findByTestId('brief');
    expect(within(brief).getByRole('heading')).toHaveTextContent(/agent on the software you already pay for/i);
    expect(screen.getByTestId('qualifier-progress')).toHaveTextContent('100%');
  });

  it('routes data work to the pipeline recommendation, not the browser one', async () => {
    const { user } = setup();
    await choose(user, 'automate');
    await choose(user, 'ops-data');
    await choose(user, 'weekly');
    await choose(user, 'erp');
    await choose(user, 'months');
    await fillContact(user);

    const brief = await screen.findByTestId('brief');
    expect(within(brief).getByRole('heading')).toHaveTextContent(/move and clean data/i);
  });

  it('cites at least one piece of real evidence in the brief', async () => {
    const { user } = setup();
    await choose(user, 'automate');
    await choose(user, 'research');
    await choose(user, 'weekly');
    await choose(user, 'saas');
    await choose(user, 'weeks');
    await fillContact(user);

    const evidence = await screen.findAllByTestId('brief-evidence');
    expect(evidence.length).toBeGreaterThan(0);
    evidence.forEach((e) => expect(e.getAttribute('href')).toMatch(/^https:\/\//));
  });

  it('builds a mailto that carries the brief, with the visitor address inside', async () => {
    const { user } = setup();
    await choose(user, 'automate');
    await choose(user, 'support');
    await choose(user, 'daily');
    await choose(user, 'saas');
    await choose(user, 'asap');
    await fillContact(user, { email: 'ops@northwind.io' });

    const send = await screen.findByTestId('brief-send');
    const href = send.getAttribute('href');
    expect(href.startsWith('mailto:')).toBe(true);
    expect(decodeURIComponent(href)).toContain('ops@northwind.io');
  });
});

describe('Qualifier — hiring track', () => {
  it('asks a different second question and ends on the hiring brief', async () => {
    const { user } = setup();
    await choose(user, 'hire');
    await expectPrompt(/role centred on/i);

    await choose(user, 'agentic');
    await fillContact(user, { company: '' });

    const brief = await screen.findByTestId('brief');
    expect(within(brief).getByRole('heading')).toHaveTextContent(/closest thing I've shipped/i);
  });
});

describe('Qualifier — validation and navigation', () => {
  it('blocks submission and names every bad field', async () => {
    const { user } = setup();
    await choose(user, 'hire');
    await choose(user, 'data');

    await user.type(await screen.findByTestId('input-name'), 'x');
    await user.type(screen.getByTestId('input-email'), 'not-an-email');
    await user.click(screen.getByTestId('contact-submit'));

    expect(await screen.findByTestId('error-name')).toBeInTheDocument();
    expect(screen.getByTestId('error-email')).toBeInTheDocument();
    expect(screen.queryByTestId('brief')).not.toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('lets a visitor go back and change an answer', async () => {
    const { user } = setup();
    await choose(user, 'automate');
    await choose(user, 'manual-ui');
    await expectPrompt(/how often/i);

    await user.click(screen.getByTestId('qualifier-back'));
    await expectPrompt(/where does the time go/i);

    await choose(user, 'support');
    await expectPrompt(/how often/i);
  });

  it('has no back control on the first question', () => {
    setup();
    expect(screen.queryByTestId('qualifier-back')).not.toBeInTheDocument();
  });

  it('records each answer in the running transcript', async () => {
    const { user } = setup();
    expect(screen.getByText(/nothing yet/i)).toBeInTheDocument();

    await choose(user, 'automate');
    const transcript = await screen.findByTestId('transcript');
    expect(within(transcript).getByText(/automate something in my business/i)).toBeInTheDocument();
  });

  it('resets cleanly when the visitor starts over', async () => {
    const { user } = setup();
    await choose(user, 'hire');
    await choose(user, 'fullstack');
    await fillContact(user, { company: '' });

    await user.click(await screen.findByTestId('brief-restart'));
    expect(screen.getByTestId('qualifier-progress')).toHaveTextContent('0%');
    await expectPrompt(/what brings you here/i);
    expect(screen.queryByTestId('brief')).not.toBeInTheDocument();
  });
});
