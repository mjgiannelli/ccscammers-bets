import { describe, expect, it } from 'vitest';

import { isSettledStatus, potentialReturn, profitLoss, type BetStatus } from './bet';

const base = { stake: 25, odds: 2 };

describe('potentialReturn', () => {
  it('includes the stake in the return', () => {
    expect(potentialReturn(base)).toBe(50);
  });

  it('rounds to whole cents', () => {
    expect(potentialReturn({ stake: 10, odds: 1.333 })).toBe(13.33);
  });
});

describe('profitLoss', () => {
  it('has no result while the bet is open', () => {
    expect(profitLoss({ ...base, status: 'open' })).toBeNull();
  });

  it('nets off the stake on a win', () => {
    expect(profitLoss({ ...base, status: 'won' })).toBe(25);
  });

  it('loses exactly the stake', () => {
    expect(profitLoss({ ...base, status: 'lost' })).toBe(-25);
  });

  it('breaks even on a void', () => {
    expect(profitLoss({ ...base, status: 'void' })).toBe(0);
  });
});

describe('isSettledStatus', () => {
  it.each<[BetStatus, boolean]>([
    ['open', false],
    ['won', true],
    ['lost', true],
    ['void', true],
  ])('%s -> %s', (status, expected) => {
    expect(isSettledStatus(status)).toBe(expected);
  });
});
