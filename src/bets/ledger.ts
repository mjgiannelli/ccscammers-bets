import { betStatus, effective, everyone, exposure, type Bet, type PoolBet } from './types';

export interface Standing {
  name: string;
  /** Net dollars across settled bets. Negative means they owe. */
  net: number;
  won: number;
  lost: number;
  /** Bets still live. */
  open: number;
  /**
   * The most their live bets could still pay them. A bet pays a stake for each
   * opponent, so the person alone against four can collect four times what any
   * one of them can. A settled bet has nothing left to pay, so it counts for
   * nothing here — once everything is settled this is 0.
   */
  potential: number;
  /** Where they would stand if the season stopped today, settled money included. */
  live: number;
}

/**
 * Who is up and who is down across the bets that have actually finished.
 *
 * A head-to-head settles pairwise: everyone on the winning side collects the
 * stake from every single person on the losing side, so one person alone
 * against four collects four stakes while each of the four pays one. A pool
 * settles as a ladder — see `ladder`. Either way the table balances to zero.
 */
export function standings(bets: Bet[]): Standing[] {
  const table = new Map<string, Standing>();

  const entry = (name: string): Standing => {
    const existing = table.get(name);
    if (existing) return existing;

    const fresh: Standing = {
      name,
      net: 0,
      won: 0,
      lost: 0,
      open: 0,
      potential: 0,
      live: 0,
    };
    table.set(name, fresh);
    return fresh;
  };

  for (const bet of bets) {
    const status = betStatus(bet);

    // A void bet still gets its players a row, but moves no money.
    if (status === 'void') {
      for (const name of everyone(bet)) entry(name);
      continue;
    }

    if (status === 'open') {
      // `betStandings` already knows how to project a live bet, pool ladder
      // and all, so take the upside and the projection in one pass.
      for (const { name, amount } of betStandings(bet)) {
        const row = entry(name);

        row.open += 1;
        row.potential += exposure(bet, name);
        row.live += amount;
      }
      continue;
    }

    for (const { name, amount } of betStandings(bet)) {
      const row = entry(name);
      row.net += amount;

      // A pool can finish someone dead level in the middle of the ladder,
      // which is neither a win nor a loss.
      if (amount > 0) row.won += 1;
      else if (amount < 0) row.lost += 1;
    }
  }

  // `live` is a whole position — settled money plus where the open bets stand
  // — while `potential` is only what is still out there to be won.
  for (const row of table.values()) {
    row.live += row.net;
  }

  return [...table.values()].sort(byLiveThenName);
}

/**
 * Whether `name` comes out ahead of a head-to-head under a given outcome —
 * either a settled `result` or the way the live numbers are currently leaning.
 */
function isWinnerUnder(bet: Bet, name: string, outcome: string): boolean {
  return bet.format === 'pool'
    ? false
    : outcome === 'for'
      ? bet.for.includes(name)
      : bet.against.includes(name);
}

/** Best off today at the top, which is the column the table actually shows. */
function byLiveThenName(a: Standing, b: Standing): number {
  return b.live - a.live || a.name.localeCompare(b.name);
}

/**
 * Formats dollars the way the group chat says them: `+$75`, `-$25`, `$0`.
 *
 * Nothing owed is still money, so it reads as an amount rather than a word —
 * everybody just gets their stake back. The colour, not the wording, is what
 * says whether it is good news.
 */
export function formatMoney(amount: number): string {
  if (amount === 0) return '$0';

  const sign = amount > 0 ? '+' : '-';
  return `${sign}$${Math.abs(amount).toLocaleString('en-US')}`;
}

/* ------------------------------------------------------------------ *
 * Per-bet standing — where each person sits on one bet right now.
 * ------------------------------------------------------------------ */

/**
 * Which way a live head-to-head is currently leaning, read off its progress
 * numbers: `'for'`, `'against'`, or `null` when it is level, nobody has scored,
 * or the bet tracks nothing. Pools always return `null` — use `ladder`.
 */
export function leaning(bet: Bet): string | null {
  const progress = bet.progress;
  if (!progress) return null;

  // A pool has no single side to lean toward; every player sits on a rung.
  if (progress.kind === 'podium') return null;

  if (progress.kind === 'bar') {
    const reached = progress.player.value >= progress.target;
    const forSideAhead = progress.direction === 'under' ? !reached : reached;
    return forSideAhead ? 'for' : 'against';
  }

  const left = effective(progress.left).value;
  const right = effective(progress.right).value;
  if (left === right) return null;

  // `right` always carries the player the title is named after.
  return right > left ? 'for' : 'against';
}

export interface BetStanding {
  name: string;
  /** Positive if they collect, negative if they pay, zero if nothing is settled. */
  amount: number;
}

export interface Rung extends BetStanding {
  /** 1 for first, counting up. */
  place: number;
}

/**
 * A pool's placings and what they pay, best first.
 *
 * Everyone pays the stake to each player above them and collects it from each
 * player below, so with `n` players the person in place `p` nets
 * `stake * (n - 2p + 1)`: four at $100 finish +300, +100, -100, -300. That is
 * symmetric about the middle, so it always sums to zero.
 *
 * Placings come from the podium numbers. Returns nothing if the bet tracks no
 * numbers or nobody has scored yet.
 */
export function ladder(bet: PoolBet): Rung[] {
  const progress = bet.progress;
  if (progress?.kind !== 'podium') return [];

  const ranked = [...progress.players].sort((a, b) => b.value - a.value);
  if (ranked.every((player) => player.value === 0)) return [];

  const size = ranked.length;
  return ranked.map((player, index) => {
    const place = index + 1;
    return { name: player.name, place, amount: bet.stake * (size - 2 * place + 1) };
  });
}

/**
 * What each person on a bet is up or down, best off first. A settled bet
 * reports what actually happened; a live one reports where the current numbers
 * would leave everybody if the season stopped today.
 */
export function betStandings(bet: Bet): BetStanding[] {
  const status = betStatus(bet);
  const level = () => everyone(bet).map((name) => ({ name, amount: 0 }));

  if (status === 'void') return level();

  if (bet.format === 'pool') {
    const rungs = ladder(bet);
    return rungs.length === 0 ? level() : rungs.map(({ name, amount }) => ({ name, amount }));
  }

  const outcome = status === 'settled' ? (bet.result as string) : leaning(bet);
  if (outcome === null) return level();

  return everyone(bet)
    .map((name) => ({
      name,
      amount: isWinnerUnder(bet, name, outcome) ? exposure(bet, name) : -exposure(bet, name),
    }))
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name));
}
