/**
 * A bet between two sides: one lot of people saying it happens, another saying
 * it doesn't. Sides can be uneven — one person against four is common.
 */
export interface HeadToHeadBet {
  id: string;
  format: 'headToHead';
  title: string;
  /** Optional extra context shown under the title. */
  detail?: string;
  /** What each person has on it, in dollars. */
  stake: number;
  /** Whoever is betting the title happens. */
  for: string[];
  /** Whoever is betting against it. */
  against: string[];
  /** `null` while the bet is live. */
  result: 'for' | 'against' | 'void' | null;
}

/** A free-for-all: everyone is in for the stake, one person takes the lot. */
export interface PoolBet {
  id: string;
  format: 'pool';
  title: string;
  detail?: string;
  stake: number;
  players: string[];
  /** The winner's name, `'void'` if it is off, or `null` while it is live. */
  result: string | null;
}

export type Bet = HeadToHeadBet | PoolBet;

export type BetStatus = 'open' | 'settled' | 'void';

export function betStatus(bet: Bet): BetStatus {
  if (bet.result === null) return 'open';
  return bet.result === 'void' ? 'void' : 'settled';
}

/** Everyone with money on the bet, whichever side they are on. */
export function everyone(bet: Bet): string[] {
  return bet.format === 'pool' ? bet.players : [...bet.for, ...bet.against];
}

/** Everything on the table across all sides. */
export function pot(bet: Bet): number {
  return bet.stake * everyone(bet).length;
}

/**
 * What one person collects if their side wins.
 *
 * A head-to-head bet settles pairwise against each opponent, so the person
 * alone against four others collects four stakes while each of the four pays
 * one. A pool winner collects the stake from everyone else.
 */
export function upside(bet: Bet, name: string): number {
  if (bet.format === 'pool') {
    return bet.players.includes(name) ? bet.stake * (bet.players.length - 1) : 0;
  }
  return opposingCount(bet, name) * bet.stake;
}

/**
 * What one person pays if their side loses. This is *not* the mirror of
 * `upside` in a pool: everyone chips in one stake and a single winner takes
 * the lot, so a pool loser is only ever down the stake itself.
 */
export function downside(bet: Bet, name: string): number {
  if (bet.format === 'pool') {
    return bet.players.includes(name) ? bet.stake : 0;
  }
  return opposingCount(bet, name) * bet.stake;
}

/** How many people are on the other side of a head-to-head bet from `name`. */
function opposingCount(bet: HeadToHeadBet, name: string): number {
  if (bet.for.includes(name)) return bet.against.length;
  if (bet.against.includes(name)) return bet.for.length;
  return 0;
}
