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

/**
 * A free-for-all settled as a ladder by placing: every player pays the stake to
 * everyone who finishes above them and collects it from everyone below. Four
 * players at $100 finish +300 / +100 / -100 / -300.
 */
export interface PoolBet {
  id: string;
  format: 'pool';
  title: string;
  detail?: string;
  stake: number;
  players: string[];
  /**
   * `'final'` locks in the placings from the podium numbers, `'void'` calls the
   * bet off, and `null` leaves it live. Placings always come from `progress`,
   * so there is no separate winner to keep in sync.
   */
  result: 'final' | 'void' | null;
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
 * The most one person can swing on a bet, win or lose. A head-to-head settles
 * pairwise against each opponent, so the person alone against four has four
 * times as much on it as any one of them does. A pool player is up against
 * everyone else: first collects a stake from each, last pays a stake to each.
 */
export function exposure(bet: Bet, name: string): number {
  if (bet.format === 'pool') {
    return bet.players.includes(name) ? bet.stake * (bet.players.length - 1) : 0;
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
  /**
   * One number climbing toward a threshold. `direction` says which way the bet
   * title reads: `over` means the `for` side needs the target reached, `under`
   * means they need it missed.
   */
  | { kind: 'bar'; unit: string; player: Tracked; target: number; direction: 'over' | 'under' }
  /**
   * Two sides weighed against each other; the heavier one sits on the ground.
   * `right` always holds the player the bet title is named after, so the `for`
   * side is winning exactly when the right end is heavier.
   */
  | { kind: 'seesaw'; unit: string; left: SeesawSide; right: SeesawSide }
  /**
   * A yes-or-no proposition with no number to track. `answer` is where the
   * question stands today: `true` means the bet title is currently true,
   * `false` means it is not, and `null` means it is too early to call.
   *
   * `phrase` overrides what the ball actually says. Leave it off and the ball
   * picks a fitting classic on its own; set it to word the verdict yourself.
   * Keep it to roughly four short words so it stays inside the die.
   */
  | { kind: 'eightBall'; question: string; answer: boolean | null; phrase?: string };

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
