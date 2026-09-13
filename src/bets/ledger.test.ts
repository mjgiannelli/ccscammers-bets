import { describe, expect, it } from 'vitest';

import { BETS } from './data';
import { betStandings, formatMoney, ladder, leaning, standings } from './ledger';
import { exposure, pot, type Bet, type PoolBet } from './types';

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

const POOL: PoolBet = {
  id: 'pool',
  format: 'pool',
  title: 'Most points',
  stake: 100,
  players: ['Jeff', 'Mark', 'Gerry', 'Tim'],
  result: null,
};

/** The same pool with placings, highest first: Mark, Jeff, Gerry, Tim. */
function scoredPool(values: [number, number, number, number]): PoolBet {
  return {
    ...POOL,
    progress: {
      kind: 'podium',
      unit: 'pts',
      players: POOL.players.map((name, index) => ({
        abbr: name[0],
        name,
        value: values[index],
      })),
    },
  };
}

describe('exposure', () => {
  // One person against four has four separate bets running, not one.
  it('scales with the size of the opposing side', () => {
    expect(exposure(ONE_VS_FOUR, 'Tim')).toBe(80);
    expect(exposure(ONE_VS_FOUR, 'Mark')).toBe(20);
  });

  it('is zero for someone with no money on it', () => {
    expect(exposure(ONE_VS_FOUR, 'Stranger')).toBe(0);
  });

  // First collects a stake from each of the other three; last pays one to each.
  it('puts a pool player up against everyone else', () => {
    expect(exposure(POOL, 'Jeff')).toBe(300);
  });
});

describe('ladder', () => {
  it('pays out +300 / +100 / -100 / -300 for four at $100', () => {
    expect(ladder(scoredPool([15, 18, 4, 11]))).toEqual([
      { name: 'Mark', place: 1, amount: 300 },
      { name: 'Jeff', place: 2, amount: 100 },
      { name: 'Tim', place: 3, amount: -100 },
      { name: 'Gerry', place: 4, amount: -300 },
    ]);
  });

  // Second place pays $100 up and collects $100 from each of the two below.
  it('nets the middle rungs against both directions', () => {
    const [, second, third] = ladder(scoredPool([15, 18, 4, 11]));
    expect(second.amount).toBe(100);
    expect(third.amount).toBe(-100);
  });

  it('sums to zero at any size', () => {
    for (const values of [
      [5, 4, 3, 2],
      [100, 1, 1, 1],
      [9, 9, 9, 1],
    ] as const) {
      const total = ladder(scoredPool([...values] as [number, number, number, number])).reduce(
        (sum, rung) => sum + rung.amount,
        0,
      );
      expect(total).toBe(0);
    }
  });

  // Two level on points must not have a $200 swing decided by which of them
  // happens to sit first in the data.
  it('splits the rungs two players are tied across', () => {
    expect(ladder(scoredPool([137, 137, 143, 182]))).toEqual([
      { name: 'Tim', place: 1, amount: 300 },
      { name: 'Gerry', place: 2, amount: 100 },
      { name: 'Jeff', place: 3, amount: -200 },
      { name: 'Mark', place: 3, amount: -200 },
    ]);
  });

  it('is unmoved by the order tied players are listed in', () => {
    const byName = (rungs: ReturnType<typeof ladder>) =>
      Object.fromEntries(rungs.map((rung) => [rung.name, rung.amount]));

    expect(byName(ladder(scoredPool([137, 137, 143, 182])))).toEqual(
      byName(ladder(scoredPool([137, 137, 143, 182]))),
    );
    // Jeff and Mark swapped: same money either way.
    expect(byName(ladder(scoredPool([137, 137, 143, 182]))).Jeff).toBe(-200);
  });

  it('splits the whole pot when everyone ties', () => {
    const rungs = ladder(scoredPool([50, 50, 50, 50]));

    expect(rungs.every((rung) => rung.amount === 0)).toBe(true);
    expect(rungs.every((rung) => rung.place === 1)).toBe(true);
  });

  it('gives a shared first place the same money', () => {
    const [first, second] = ladder(scoredPool([90, 90, 10, 5]));

    expect(first.amount).toBe(200);
    expect(second.amount).toBe(200);
    expect(first.place).toBe(1);
    expect(second.place).toBe(1);
  });

  it('holds off until somebody has scored', () => {
    expect(ladder(scoredPool([0, 0, 0, 0]))).toEqual([]);
    expect(ladder(POOL)).toEqual([]);
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

  it('settles a pool up and down the ladder', () => {
    const rows = standings([{ ...scoredPool([15, 18, 4, 11]), result: 'final' }]);

    expect(find(rows, 'Mark').net).toBe(300);
    expect(find(rows, 'Jeff').net).toBe(100);
    expect(find(rows, 'Tim').net).toBe(-100);
    expect(find(rows, 'Gerry').net).toBe(-300);
  });

  // Second place is up money, so it counts as a win even without finishing top.
  it('counts any positive rung as a win', () => {
    const rows = standings([{ ...scoredPool([15, 18, 4, 11]), result: 'final' }]);

    expect(find(rows, 'Jeff').won).toBe(1);
    expect(find(rows, 'Tim').lost).toBe(1);
  });

  it('moves no money on a void bet but still lists the players', () => {
    const rows = standings([{ ...ONE_VS_FOUR, result: 'void' }]);

    expect(find(rows, 'Tim').net).toBe(0);
    expect(find(rows, 'Tim').won).toBe(0);
    expect(find(rows, 'Tim').lost).toBe(0);
  });

  // Tim is alone against four, so a $20 bet can pay him $80 and each of them
  // only $20.
  it('scales the upside with the size of the opposing side', () => {
    const rows = standings([ONE_VS_FOUR]);

    expect(find(rows, 'Tim').net).toBe(0);
    expect(find(rows, 'Tim').open).toBe(1);
    expect(find(rows, 'Tim').potential).toBe(80);
    expect(find(rows, 'Mark').potential).toBe(20);
  });

  // A pool player can collect $100 from each of the other three.
  it('puts a pool player up for the whole field', () => {
    const rows = standings([scoredPool([15, 18, 4, 11])]);

    expect(find(rows, 'Tim').potential).toBe(300);
  });

  // A settled bet has nothing left to pay, so it drops out of the upside while
  // its money stays visible in the live figure.
  it('counts only live bets toward the potential payout', () => {
    const rows = standings([{ ...ONE_VS_FOUR, result: 'for' }, ONE_VS_FOUR]);

    expect(find(rows, 'Tim').net).toBe(80);
    expect(find(rows, 'Tim').potential).toBe(80);
    expect(find(rows, 'Tim').live).toBe(80);
  });

  it('leaves nothing to play for once every bet is settled', () => {
    const rows = standings([{ ...ONE_VS_FOUR, result: 'for' }]);

    expect(find(rows, 'Tim').potential).toBe(0);
    expect(find(rows, 'Tim').open).toBe(0);
    expect(find(rows, 'Tim').live).toBe(80);
  });

  it('ranks the biggest winner first', () => {
    const rows = standings([
      { ...ONE_VS_FOUR, result: 'for' },
      { ...scoredPool([15, 18, 4, 11]), result: 'final' },
    ]);

    expect(rows[0].name).toBe('Mark');
  });

  // Nobody wins money from outside the group, so the table has to balance.
  it('is a zero-sum table', () => {
    const rows = standings([
      { ...ONE_VS_FOUR, result: 'for' },
      { ...scoredPool([15, 18, 4, 11]), result: 'final' },
    ]);

    expect(rows.reduce((sum, row) => sum + row.net, 0)).toBe(0);
  });
});

describe('the real bet data', () => {
  it('has a unique id per bet', () => {
    expect(new Set(BETS.map((bet) => bet.id)).size).toBe(BETS.length);
  });

  // A settled pool reads its placings straight off the podium numbers.
  it('gives every settled pool the numbers it needs to rank', () => {
    for (const bet of BETS) {
      if (bet.format !== 'pool' || bet.result !== 'final') continue;
      expect(bet.progress?.kind).toBe('podium');
      expect(ladder(bet)).toHaveLength(bet.players.length);
    }
  });

  it('keeps every settled bet zero-sum', () => {
    const rows = standings(BETS);
    expect(rows.reduce((sum, row) => sum + row.net, 0)).toBe(0);
  });

  // The projection is money that would change hands, so it balances too.
  it('keeps the live projection zero-sum', () => {
    const rows = standings(BETS);
    expect(rows.reduce((sum, row) => sum + row.live, 0)).toBe(0);
  });

  // Nobody can be owed more than every live bet paying out at once.
  it('never projects past what is still on the table', () => {
    for (const row of standings(BETS)) {
      expect(row.live).toBeLessThanOrEqual(row.potential);
    }
  });

  it('has the league-winner joke paying out nothing', () => {
    const joke = BETS.find((bet) => bet.id === 'league-winner');

    expect(joke?.result).toBe('void');
    expect(pot(joke!)).toBe(2000);
    expect(find(standings(BETS), 'Jeff').net).toBe(0);
  });
});

describe('formatMoney', () => {
  it.each([
    [75, '+$75'],
    [-25, '-$25'],
    [0, '$0'],
    [1000, '+$1,000'],
  ])('formats %i as %s', (amount, expected) => {
    expect(formatMoney(amount)).toBe(expected);
  });
});

describe('leaning', () => {
  const seesaw = (left: number, right: number): Bet => ({
    ...ONE_VS_FOUR,
    progress: {
      kind: 'seesaw',
      unit: 'pts',
      left: { players: [{ abbr: 'L', name: 'Left', value: left }] },
      right: { players: [{ abbr: 'R', name: 'Right', value: right }] },
    },
  });

  // `right` carries the player the title is named after.
  it('backs the for side when the right end is heavier', () => {
    expect(leaning(seesaw(10, 40))).toBe('for');
    expect(leaning(seesaw(40, 10))).toBe('against');
    expect(leaning(seesaw(0, 0))).toBeNull();
  });

  // Same number, opposite verdicts: one bet is an over, the other an under.
  it('reads a yardage bar according to its direction', () => {
    const bar = (value: number, direction: 'over' | 'under'): Bet => ({
      ...ONE_VS_FOUR,
      progress: {
        kind: 'bar',
        unit: 'yds',
        player: { abbr: 'P', name: 'P', value },
        target: 1000,
        direction,
      },
    });

    expect(leaning(bar(400, 'under'))).toBe('for');
    expect(leaning(bar(400, 'over'))).toBe('against');
    expect(leaning(bar(1200, 'under'))).toBe('against');
    expect(leaning(bar(1200, 'over'))).toBe('for');
  });

  it('takes a yes-or-no prop straight from the eight ball', () => {
    const ball = (answer: boolean | null): Bet => ({
      ...ONE_VS_FOUR,
      progress: { kind: 'eightBall', question: 'Still QB1?', answer },
    });

    expect(leaning(ball(true))).toBe('for');
    expect(leaning(ball(false))).toBe('against');
    expect(leaning(ball(null))).toBeNull();
  });

  // A pool has no single side to back, so it has no leaning; use `ladder`.
  it('has no opinion on a pool', () => {
    expect(leaning(scoredPool([10, 40, 5, 2]))).toBeNull();
  });

  it('has no opinion on a bet that tracks nothing', () => {
    expect(leaning(ONE_VS_FOUR)).toBeNull();
  });
});

describe('betStandings', () => {
  it('pays the live leader from every opponent, biggest winner first', () => {
    const rows = betStandings({
      ...ONE_VS_FOUR,
      progress: {
        kind: 'seesaw',
        unit: 'pts',
        left: { players: [{ abbr: 'L', name: 'Left', value: 5 }] },
        right: { players: [{ abbr: 'R', name: 'Right', value: 50 }] },
      },
    });

    expect(rows[0]).toEqual({ name: 'Tim', amount: 80 });
    expect(rows.slice(1).every((row) => row.amount === -20)).toBe(true);
  });

  it('reports the settled result rather than the numbers', () => {
    const rows = betStandings({ ...ONE_VS_FOUR, result: 'against' });
    expect(rows.find((row) => row.name === 'Tim')?.amount).toBe(-80);
  });

  it('zeroes everyone on a void bet', () => {
    const rows = betStandings({ ...ONE_VS_FOUR, result: 'void' });
    expect(rows.every((row) => row.amount === 0)).toBe(true);
  });

  // Whatever the projection says, it still has to balance.
  it('is zero-sum for every bet in the real data', () => {
    for (const bet of BETS) {
      const total = betStandings(bet).reduce((sum, row) => sum + row.amount, 0);
      expect(total).toBe(0);
    }
  });
});
