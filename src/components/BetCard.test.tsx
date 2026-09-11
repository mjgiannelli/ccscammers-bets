import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BetCard } from './BetCard';
import type { Bet } from '../bets/types';

const HEAD_TO_HEAD: Bet = {
  id: 'x',
  format: 'headToHead',
  title: 'DJ Moore outscores Chris Olave',
  stake: 25,
  for: ['Tim Huie'],
  against: ['Mark', 'Uncle Gerry'],
  result: null,
};

describe('BetCard', () => {
  it('shows both sides and the whole pot', () => {
    render(
      <ul>
        <BetCard bet={HEAD_TO_HEAD} />
      </ul>,
    );

    expect(screen.getByText('Tim Huie')).toBeInTheDocument();
    expect(screen.getByText('Mark, Uncle Gerry')).toBeInTheDocument();
    // Three people in at $25.
    expect(screen.getByText('$75')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('reads a settled bet as hit or missed', () => {
    render(
      <ul>
        <BetCard bet={{ ...HEAD_TO_HEAD, result: 'against' }} />
      </ul>,
    );

    expect(screen.getByText('Missed')).toBeInTheDocument();
    expect(screen.getByText('settled')).toBeInTheDocument();
  });

  it('names the winner of a pool', () => {
    render(
      <ul>
        <BetCard
          bet={{
            id: 'p',
            format: 'pool',
            title: 'Most points',
            stake: 100,
            players: ['Mark', 'Tim Huie'],
            result: 'Mark',
          }}
        />
      </ul>,
    );

    expect(screen.getByText('Mark')).toBeInTheDocument();
    expect(screen.getByText('Everyone in:')).toBeInTheDocument();
  });
});
