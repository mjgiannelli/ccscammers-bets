import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BetCard } from './BetCard';
import type { Bet } from '../bets/types';

const HEAD_TO_HEAD: Bet = {
  id: 'x',
  format: 'headToHead',
  title: 'DJ Moore outscores Chris Olave',
  stake: 25,
  for: ['Tim'],
  against: ['Mark', 'Gerry'],
  result: null,
  progress: {
    kind: 'seesaw',
    unit: 'pts',
    left: { players: [{ abbr: 'OLV', name: 'Chris Olave', value: 40 }] },
    right: { players: [{ abbr: 'DJM', name: 'DJ Moore', value: 120 }] },
  },
};

/** The money column for one person, scoped to the per-bet standing list. */
function money(name: string) {
  const list = screen.getByRole('list', { name: 'Where each person stands on this bet' });
  const row = within(list).getByText(name).closest('li');
  if (!row) throw new Error(`No money row for ${name}`);

  return [...row.querySelectorAll('span')][1].textContent;
}

describe('BetCard', () => {
  it('puts the per-person stake next to the title', () => {
    render(
      <ul>
        <BetCard bet={HEAD_TO_HEAD} />
      </ul>,
    );

    expect(screen.getByRole('heading')).toHaveTextContent('DJ Moore outscores Chris Olave - $25');
  });

  it('shows both sides of the bet', () => {
    render(
      <ul>
        <BetCard bet={HEAD_TO_HEAD} />
      </ul>,
    );

    expect(screen.getByText('Mark, Gerry')).toBeInTheDocument();
    // Once in the sides line, once in the money list.
    expect(screen.getAllByText('Tim')).toHaveLength(2);
  });

  // DJ Moore is ahead, so Tim's side would collect $25 from each of the two.
  it('projects what each person is up or down while it is live', () => {
    render(
      <ul>
        <BetCard bet={HEAD_TO_HEAD} />
      </ul>,
    );

    expect(screen.getByText('If it ended now')).toBeInTheDocument();
    expect(money('Tim')).toBe('+$50');
    expect(money('Mark')).toBe('-$25');
    expect(money('Gerry')).toBe('-$25');
  });

  it('flips the projection when the numbers flip', () => {
    const behind: Bet = {
      ...HEAD_TO_HEAD,
      progress: {
        kind: 'seesaw',
        unit: 'pts',
        left: { players: [{ abbr: 'OLV', name: 'Chris Olave', value: 120 }] },
        right: { players: [{ abbr: 'DJM', name: 'DJ Moore', value: 40 }] },
      },
    };

    render(
      <ul>
        <BetCard bet={behind} />
      </ul>,
    );

    expect(money('Tim')).toBe('-$50');
    expect(money('Mark')).toBe('+$25');
  });

  it('calls a settled bet final', () => {
    render(
      <ul>
        <BetCard bet={{ ...HEAD_TO_HEAD, result: 'against' }} />
      </ul>,
    );

    expect(screen.getByText('Final')).toBeInTheDocument();
    expect(screen.getByText('settled')).toBeInTheDocument();
    expect(money('Tim')).toBe('-$50');
  });

  it('pays nobody on a void bet', () => {
    render(
      <ul>
        <BetCard bet={{ ...HEAD_TO_HEAD, result: 'void' }} />
      </ul>,
    );

    expect(screen.getByText('Nobody pays')).toBeInTheDocument();
    expect(money('Tim')).toBe('$0');
    expect(money('Mark')).toBe('$0');
  });

  it('holds off while a live bet is level', () => {
    const level: Bet = {
      ...HEAD_TO_HEAD,
      progress: {
        kind: 'seesaw',
        unit: 'pts',
        left: { players: [{ abbr: 'OLV', name: 'Chris Olave', value: 0 }] },
        right: { players: [{ abbr: 'DJM', name: 'DJ Moore', value: 0 }] },
      },
    };

    render(
      <ul>
        <BetCard bet={level} />
      </ul>,
    );

    expect(screen.getByText('Nothing to split yet')).toBeInTheDocument();
    expect(money('Tim')).toBe('$0');
  });

  // Three at $100: first collects from both below, last pays both above.
  it('settles a pool up and down the ladder', () => {
    render(
      <ul>
        <BetCard
          bet={{
            id: 'p',
            format: 'pool',
            title: 'Mark vs Tim vs Gerry',
            stake: 100,
            players: ['Mark', 'Tim', 'Gerry'],
            result: 'final',
            progress: {
              kind: 'podium',
              unit: 'pts',
              players: [
                { abbr: 'M', name: 'Mark', value: 30 },
                { abbr: 'T', name: 'Tim', value: 20 },
                { abbr: 'G', name: 'Gerry', value: 10 },
              ],
            },
          }}
        />
      </ul>,
    );

    expect(screen.getByText('Everyone in:')).toBeInTheDocument();
    expect(money('Mark')).toBe('+$200');
    expect(money('Tim')).toBe('$0');
    expect(money('Gerry')).toBe('-$200');
  });
});
