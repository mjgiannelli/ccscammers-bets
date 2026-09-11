import { describe, expect, it } from 'vitest';

import { BETS } from './data';
import { formatMoney, standings } from './ledger';
import { downside, pot, upside, type Bet } from './types';

function find(rows: ReturnType<typeof standings>, name: string) {
  const row = rows.find((entry) => entry.name === name);
  if (!row) throw new Error(`No standing for ${name}`);
  return row;
}

const ONE_VS_FOUR: Bet = {
  id: 'one-vs-four',
  format: 'headToHead',
  title: 'DJ Moore outscores either AJ Brown or JSN',
  stake: 20,
  for: ['Tim'],
  against: ['Jeff', 'Mark', 'Nubes', 'Gerry'],
  result: null,
};

const POOL: Bet = {
  id: 'pool',
  format: 'pool',
  title: 'Most points',
  stake: 100,
  players: ['Jeff', 'Mark', 'Gerry', 'Tim'],
  result: null,
};

describe('upside and downside', () => {
  // One person against four has four separate bets running, not one.
  it('scale with the size of the opposing side', () => {
    expect(upside(ONE_VS_FOUR, 'Tim')).toBe(80);
    expect(downside(ONE_VS_FOUR, 'Tim')).toBe(80);
    expect(upside(ONE_VS_FOUR, 'Mark')).toBe(20);
  });

  it('are zero for someone with no money on it', () => {
    expect(upside(ONE_VS_FOUR, 'Stranger')).toBe(0);
    expect(downside(ONE_VS_FOUR, 'Stranger')).toBe(0);
  });

  // The asymmetry that keeps a pool zero-sum: one winner collects three
  // stakes, but each of the three losers is only ever out one.
  it('are asymmetric in a pool', () => {
    expect(upside(POOL, 'Jeff')).toBe(300);
    expect(downside(POOL, 'Jeff')).toBe(100);
  });
});

describe('standings', () => {
  it('pays the lone winner from every opponent', () => {
    const rows = standings([{ ...ONE_VS_FOUR, result: 'for' }]);

    expect(find(rows, 'Tim').net).toBe(80);
    expect(find(rows, 'Mark').net).toBe(-20);
    expect(find(rows, 'Tim').won).toBe(1);
    expect(find(rows, 'Mark').lost).toBe(1);
  });

  it('bills the lone loser by every opponent', () => {
    const rows = standings([{ ...ONE_VS_FOUR, result: 'against' }]);

    expect(find(rows, 'Tim').net).toBe(-80);
    expect(find(rows, 'Gerry').net).toBe(20);
  });

  it('gives a pool winner the stake from everyone else', () => {
    const rows = standings([{ ...POOL, result: 'Mark' }]);

    expect(find(rows, 'Mark').net).toBe(300);
    expect(find(rows, 'Jeff').net).toBe(-100);
  });

  it('moves no money on a void bet but still lists the players', () => {
    const rows = standings([{ ...ONE_VS_FOUR, result: 'void' }]);

    expect(find(rows, 'Tim').net).toBe(0);
    expect(find(rows, 'Tim').won).toBe(0);
    expect(find(rows, 'Tim').lost).toBe(0);
  });

  it('counts live bets as exposure rather than profit', () => {
    const rows = standings([ONE_VS_FOUR]);

    expect(find(rows, 'Tim').net).toBe(0);
    expect(find(rows, 'Tim').open).toBe(1);
    expect(find(rows, 'Tim').atRisk).toBe(80);
  });

  it('ranks the biggest winner first', () => {
    const rows = standings([
      { ...ONE_VS_FOUR, result: 'for' },
      { ...POOL, result: 'Mark' },
    ]);

    expect(rows[0].name).toBe('Mark');
  });

  // Nobody wins money from outside the group, so the table has to balance.
  it('is a zero-sum table', () => {
    const rows = standings([
      { ...ONE_VS_FOUR, result: 'for' },
      { ...POOL, result: 'Mark' },
    ]);

    expect(rows.reduce((sum, row) => sum + row.net, 0)).toBe(0);
  });
});

describe('the real bet data', () => {
  it('has a unique id per bet', () => {
    expect(new Set(BETS.map((bet) => bet.id)).size).toBe(BETS.length);
  });

  // A pool result has to name a player, or that bet silently pays nobody.
  it('only ever settles a pool to a name on its roster', () => {
    for (const bet of BETS) {
      if (bet.format !== 'pool' || bet.result === null || bet.result === 'void') continue;
      expect(bet.players).toContain(bet.result);
    }
  });

  it('keeps every settled bet zero-sum', () => {
    const rows = standings(BETS);
    expect(rows.reduce((sum, row) => sum + row.net, 0)).toBe(0);
  });

  it('has the league-winner joke paying out nothing', () => {
    const joke = BETS.find((bet) => bet.id === 'league-winner');

    expect(joke?.result).toBe('void');
    expect(pot(joke!)).toBe(2000);
    expect(find(standings(BETS), 'Jeff Stafford').net).toBe(0);
  });
});

describe('formatMoney', () => {
  it.each([
    [75, '+$75'],
    [-25, '-$25'],
    [0, 'even'],
    [1000, '+$1,000'],
  ])('formats %i as %s', (amount, expected) => {
    expect(formatMoney(amount)).toBe(expected);
  });
});
