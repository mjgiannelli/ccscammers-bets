import { describe, expect, it } from 'vitest';

import { BETS } from './data';
import type { Tracked } from './types';

/** Every tracked player on the board, with the bets each of them appears on. */
function appearances(): Map<string, { values: Set<number>; bets: string[] }> {
  const seen = new Map<string, { values: Set<number>; bets: string[] }>();

  const note = (player: Tracked, betId: string) => {
    const entry = seen.get(player.name) ?? { values: new Set<number>(), bets: [] };
    entry.values.add(player.value);
    entry.bets.push(betId);
    seen.set(player.name, entry);
  };

  for (const bet of BETS) {
    const progress = bet.progress;
    if (!progress) continue;

    if (progress.kind === 'podium') for (const p of progress.players) note(p, bet.id);
    else if (progress.kind === 'bar') note(progress.player, bet.id);
    else if (progress.kind === 'seesaw')
      for (const side of [progress.left, progress.right])
        for (const p of side.players) note(p, bet.id);
  }
  return seen;
}

describe('the roster across bets', () => {
  // DJ Moore is on four bets and Brooks on two, so a weekly update has to touch
  // the same name in several places. Updating one and missing the rest leaves
  // the board quietly disagreeing with itself — which is exactly what happened
  // in week 9, where one card had him on 71 and three still had 64.
  it('gives a player the same score on every bet they appear on', () => {
    for (const [name, { values, bets }] of appearances()) {
      expect(
        [...values],
        `${name} appears on ${bets.join(', ')} with conflicting scores`,
      ).toHaveLength(1);
    }
  });

  it('is actually checking the players who span several bets', () => {
    const shared = [...appearances()].filter(([, entry]) => entry.bets.length > 1);

    expect(shared.length).toBeGreaterThan(0);
    expect(shared.map(([name]) => name)).toContain('DJ Moore');
  });
});
