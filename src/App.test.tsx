import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './App';
import { BETS } from './bets/data';

describe('App', () => {
  it('renders every bet from the data file', () => {
    render(<App />);

    for (const bet of BETS) {
      expect(screen.getByText(bet.title)).toBeInTheDocument();
    }
  });

  it('lists the whole roster in the standings', () => {
    render(<App />);

    const table = screen.getByRole('table');
    for (const name of ['Tim Huie', 'Jeff Stafford', 'Uncle Gerry', 'Mark', 'Nubes']) {
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
