import { useMemo, useState } from 'react';

import { BETS } from './bets/data';
import { standings } from './bets/ledger';
import { betStatus } from './bets/types';
import { BetCard } from './components/BetCard';
import { Standings } from './components/Standings';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Live' },
  { value: 'settled', label: 'Settled' },
  { value: 'void', label: 'Void' },
] as const;

type Filter = (typeof FILTERS)[number]['value'];

export function App() {
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => standings(BETS), []);
  const visible = useMemo(
    () => (filter === 'all' ? BETS : BETS.filter((bet) => betStatus(bet) === filter)),
    [filter],
  );

  const live = BETS.filter((bet) => betStatus(bet) === 'open').length;

  return (
    <main className="mx-auto grid max-w-2xl gap-8 px-4 pt-8 pb-16">
      <header>
        <h1 className="text-2xl font-semibold">CC Scammers 2026</h1>
        <p className="mt-1 text-sm text-muted">Every side bet on the board. {live} still live.</p>
      </header>

      <section className="grid gap-3">
        <h2 className="text-base font-semibold">Standings</h2>
        <Standings rows={rows} />
      </section>

      <section className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Bets</h2>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`btn ${filter === value ? 'btn-active' : ''}`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-muted">Nothing here.</p>
        ) : (
          <ul className="grid gap-3">
            {visible.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
