/**
 * The lifecycle of a bet. A bet starts `open` and moves to exactly one
 * terminal state when it is settled.
 */
export const BET_STATUSES = ['open', 'won', 'lost', 'void'] as const;

export type BetStatus = (typeof BET_STATUSES)[number];

export const SETTLED_BET_STATUSES = ['won', 'lost', 'void'] as const satisfies readonly BetStatus[];

export type SettledBetStatus = (typeof SETTLED_BET_STATUSES)[number];

export function isSettledStatus(status: BetStatus): status is SettledBetStatus {
  return status !== 'open';
}

/** A bet as it crosses the wire. Dates are ISO-8601 strings. */
export interface Bet {
  id: string;
  title: string;
  description: string | null;
  /** Amount risked, in whole currency units. */
  stake: number;
  /** Decimal odds, e.g. 2.5 means a winning 10 stake returns 25. */
  odds: number;
  status: BetStatus;
  /** Display name or handle of whoever placed the bet. */
  createdBy: string;
  createdAt: string;
  settledAt: string | null;
}

export interface CreateBetInput {
  title: string;
  description?: string | null;
  stake: number;
  odds: number;
  createdBy: string;
}

export interface UpdateBetInput {
  title?: string;
  description?: string | null;
  stake?: number;
  odds?: number;
}

export interface SettleBetInput {
  status: SettledBetStatus;
}

export interface ListBetsQuery {
  status?: BetStatus;
  /** Zero-based offset. */
  skip?: number;
  take?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
}

export type BetListResponse = Paged<Bet>;

/** Total amount returned if the bet wins, stake included. */
export function potentialReturn(bet: Pick<Bet, 'stake' | 'odds'>): number {
  return round2(bet.stake * bet.odds);
}

/**
 * Realised profit/loss for a bet. Open bets have no result yet, a void bet is
 * refunded, and a loss costs the stake.
 */
export function profitLoss(bet: Pick<Bet, 'stake' | 'odds' | 'status'>): number | null {
  switch (bet.status) {
    case 'open':
      return null;
    case 'won':
      return round2(bet.stake * bet.odds - bet.stake);
    case 'lost':
      return -round2(bet.stake);
    case 'void':
      return 0;
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
