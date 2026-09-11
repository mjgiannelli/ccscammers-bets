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
  /** Live numbers drawn on the card. Omit for a bet with nothing to track. */
  progress?: Progress;
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
  progress?: Progress;
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

/* ------------------------------------------------------------------ *
 * Progress — the live picture on each bet card.
 * ------------------------------------------------------------------ */

/** One competitor's current number. */
export interface Tracked {
  /** Short label for the avatar, 1-4 characters. */
  abbr: string;
  name: string;
  value: number;
}

/**
 * One end of a see-saw. Usually a single player, but a bet like "DJ Moore beats
 * either AJ Brown or JSN" puts two players on one end where only the lower of
 * them actually matters.
 */
export interface SeesawSide {
  players: Tracked[];
  /**
   * Which player counts when there is more than one. `min` is the one to reach
   * when the bet only has to clear the *easier* of two targets.
   */
  reduce?: 'min' | 'max';
  /** Shown under the avatar, e.g. "lower of the two". */
  note?: string;
}

export type Progress =
  /** Ranked standing: the bigger the number, the higher the step. */
  | { kind: 'podium'; unit: string; players: Tracked[] }
  /** One number climbing toward a threshold. */
  | { kind: 'bar'; unit: string; player: Tracked; target: number }
  /** Two sides weighed against each other. The heavier one sits on the ground. */
  | { kind: 'seesaw'; unit: string; left: SeesawSide; right: SeesawSide };

/** The player on a see-saw side whose number is actually in play right now. */
export function effective(side: SeesawSide): Tracked {
  const [first, ...rest] = side.players;
  if (rest.length === 0) return first;

  return side.players.reduce((chosen, player) =>
    side.reduce === 'min'
      ? player.value < chosen.value
        ? player
        : chosen
      : player.value > chosen.value
        ? player
        : chosen,
  );
}
