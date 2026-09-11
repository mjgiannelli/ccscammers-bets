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
  for: ['Tim Huie'],
  against: ['Mark', 'Uncle Gerry'],
  result: 'for',
};

describe('Standings', () => {
  it('puts the winner on top with their net', () => {
    render(<Standings rows={standings([SETTLED])} />);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Tim Huie');
    expect(rows[0]).toHaveTextContent('+$50');
    expect(screen.getAllByText('-$25')).toHaveLength(2);
  });

  it('explains itself while nothing has settled', () => {
    render(<Standings rows={standings([{ ...SETTLED, result: null }])} />);

    expect(screen.getByText(/Nothing has settled yet/)).toBeInTheDocument();
    expect(screen.getAllByText('even')).toHaveLength(3);
  });
});
