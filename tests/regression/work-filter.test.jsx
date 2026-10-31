import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Work from '../../src/components/Work.jsx';
import { PROJECTS } from '../../src/data/content.js';
import { filterProjects } from '../../src/lib/filters.js';

describe('Work filtering', () => {
  it('shows every project before any filter is applied', () => {
    render(<Work />);
    expect(screen.getAllByTestId('project-card')).toHaveLength(PROJECTS.length);
    expect(screen.getByTestId('filter-All')).toHaveAttribute('aria-pressed', 'true');
  });

  it('narrows the grid to the chosen area and marks the chip pressed', async () => {
    const user = userEvent.setup();
    render(<Work />);
    await user.click(screen.getByTestId('filter-MCP'));

    const expected = filterProjects(PROJECTS, 'MCP');
    await waitFor(() => expect(screen.getAllByTestId('project-card')).toHaveLength(expected.length));
    expect(screen.getByTestId('filter-MCP')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('filter-All')).toHaveAttribute('aria-pressed', 'false');
  });

  it('restores the full grid when All is chosen again', async () => {
    const user = userEvent.setup();
    render(<Work />);
    await user.click(screen.getByTestId('filter-Full-Stack'));
    await user.click(screen.getByTestId('filter-All'));
    await waitFor(() => expect(screen.getAllByTestId('project-card')).toHaveLength(PROJECTS.length));
  });

  it('puts the live client work first', () => {
    render(<Work />);
    const first = screen.getAllByTestId('project-card')[0];
    expect(first.getAttribute('data-project-id')).toBe('oracle-browser-agent');
  });

  it('keeps the how-it-works detail collapsed until asked for', async () => {
    const user = userEvent.setup();
    render(<Work />);
    const toggle = screen.getByTestId('project-detail-toggle-festive-sale-gadget-advisor');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('project-detail-festive-sale-gadget-advisor')).not.toBeInTheDocument();

    await user.click(toggle);
    expect(await screen.findByTestId('project-detail-festive-sale-gadget-advisor')).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
