import { betStatus, downside, everyone, upside, type Bet } from './types';

export interface Standing {
  name: string;
  /** Net dollars across settled bets. Negative means they owe. */
  net: number;
  won: number;
  lost: number;
  /** Bets still live. */
  open: number;
  /** Dollars they would be down if every live bet went against them. */
  atRisk: number;
}

/**
 * Who is up and who is down.
 *
 * A bet settles pairwise: everyone on the winning side collects the stake from
 * every single person on the losing side. So one person alone against four
 * collects four stakes, while each of the four pays one. Pools work the same
 * way, with the winner collecting from everyone else. Money always balances to
 * zero across the group.
 */
export function standings(bets: Bet[]): Standing[] {
  const table = new Map<string, Standing>();

  const entry = (name: string): Standing => {
    const existing = table.get(name);
    if (existing) return existing;

    const fresh: Standing = { name, net: 0, won: 0, lost: 0, open: 0, atRisk: 0 };
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
      for (const name of everyone(bet)) {
        const row = entry(name);
        row.open += 1;
        row.atRisk += downside(bet, name);
      }
      continue;
    }

    for (const name of everyone(bet)) {
      const row = entry(name);

      if (isWinner(bet, name)) {
        row.net += upside(bet, name);
        row.won += 1;
      } else {
        row.net -= downside(bet, name);
        row.lost += 1;
      }
    }
  }

  return [...table.values()].sort(byNetThenName);
}

/** Only meaningful once a bet has settled to something other than `'void'`. */
function isWinner(bet: Bet, name: string): boolean {
  if (bet.format === 'pool') return bet.result === name;
  return bet.result === 'for' ? bet.for.includes(name) : bet.against.includes(name);
}

function byNetThenName(a: Standing, b: Standing): number {
  return b.net - a.net || a.name.localeCompare(b.name);
}

/** Formats dollars the way the group chat says them: `+$75`, `-$25`, `even`. */
export function formatMoney(amount: number): string {
  if (amount === 0) return 'even';

  const sign = amount > 0 ? '+' : '-';
  return `${sign}$${Math.abs(amount).toLocaleString('en-US')}`;
}
