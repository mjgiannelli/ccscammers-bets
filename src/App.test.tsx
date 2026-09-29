import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './App';
import { BETS } from './bets/data';
import { WEEK } from './bets/week';

describe('App', () => {
  it('renders every bet from the data file', () => {
    render(<App />);

    for (const bet of BETS) {
      expect(screen.getByText(bet.title)).toBeInTheDocument();
    }
  });

  // The write-up sets up the table, so it has to come before it.
  it('puts the week summary above the standings', () => {
    render(<App />);

    const summary = screen.getByRole('heading', { name: `Week ${WEEK.number} Summary` });
    const standings = screen.getByRole('heading', { name: 'Standings' });

    expect(summary.compareDocumentPosition(standings)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('lists the whole roster in the standings', () => {
    render(<App />);

    const table = screen.getByRole('table');
    for (const name of ['Tim', 'Jeff', 'Gerry', 'Mark', 'Nubes']) {
      expect(within(table).getByText(name)).toBeInTheDocument();
    }
  });

  it('filters down to the void bets', async () => {
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: 'Void' }));

    expect(screen.getByText('League winner pays the other $1,000')).toBeInTheDocument();
    expect(screen.queryByText('DJ Moore outscores Chris Olave')).not.toBeInTheDocument();
  });
});
