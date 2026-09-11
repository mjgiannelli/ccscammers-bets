import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Standings } from './Standings';
import { standings } from '../bets/ledger';
import type { Bet } from '../bets/types';

const SETTLED: Bet = {
  id: 'x',
  format: 'headToHead',
  title: 'DJ Moore outscores Chris Olave',
  stake: 25,
  for: ['Tim'],
  against: ['Mark', 'Gerry'],
  result: 'for',
};

/** The three money figures on one person's row. */
function payout(name: string) {
  const row = screen.getByText(name).closest('tr');
  if (!row) throw new Error(`No standings row for ${name}`);

  const cells = [...row.querySelectorAll('td')].map((cell) => cell.textContent);
  return { potential: cells[2], live: cells[3] };
}

describe('Standings', () => {
  it('puts the winner on top', () => {
    render(<Standings rows={standings([SETTLED])} />);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Tim');
    expect(rows[0]).toHaveTextContent('+$50');
    expect(screen.getAllByText('-$25')).toHaveLength(2);
  });

  it('explains itself while nothing has settled', () => {
    render(<Standings rows={standings([{ ...SETTLED, result: null }])} />);

    expect(screen.getByText(/Nothing has settled yet/)).toBeInTheDocument();
  });

  // A live bet has no settled money, but it does have a swing and a projection.
  it('shows the swing and the live projection on an open bet', () => {
    const live: Bet = {
      ...SETTLED,
      result: null,
      progress: {
        kind: 'seesaw',
        unit: 'pts',
        left: { players: [{ abbr: 'OLV', name: 'Chris Olave', value: 10 }] },
        right: { players: [{ abbr: 'DJM', name: 'DJ Moore', value: 90 }] },
      },
    };

    render(<Standings rows={standings([live])} />);

    // Tim is one against two, so his $25 bet can pay him $50.
    expect(payout('Tim')).toEqual({ potential: '+$50', live: '+$50' });
    expect(payout('Mark')).toEqual({ potential: '+$25', live: '-$25' });
  });

  // Nothing left to play for, so the upside empties out and the settled money
  // stays visible in the live column.
  it('blanks the potential payout once a bet is settled', () => {
    render(<Standings rows={standings([SETTLED])} />);

    expect(payout('Tim')).toEqual({ potential: '—', live: '+$50' });
    expect(payout('Mark')).toEqual({ potential: '—', live: '-$25' });
  });
});
