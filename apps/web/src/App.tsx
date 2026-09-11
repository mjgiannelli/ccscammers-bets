import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BET_STATUSES, type BetStatus } from '@ccscammers/shared';

import { betKeys, listBets } from './api/bets';
import { BetForm } from './components/BetForm';
import { BetList } from './components/BetList';

const PAGE_SIZE = 25;

const FILTERS = ['all', ...BET_STATUSES] as const;

export function App() {
  const [status, setStatus] = useState<BetStatus | 'all'>('all');
  const params = { status: status === 'all' ? undefined : status, take: PAGE_SIZE };

  const { data, isPending, isError, error } = useQuery({
    queryKey: betKeys.list(params),
    queryFn: ({ signal }) => listBets(params, signal),
  });

  return (
    <main className="mx-auto grid max-w-2xl gap-6 px-4 pt-8 pb-16">
      <header>
        <h1 className="text-2xl font-semibold">ccscammers bets</h1>
        <p className="mt-1 text-sm text-muted">Track who called it and who is buying dinner.</p>
      </header>

      <BetForm />

      <section>
        <div className="mb-3 flex flex-wrap gap-2">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              className={`btn ${status === value ? 'btn-active' : ''}`}
              onClick={() => setStatus(value)}
            >
              {value === 'all' ? 'All' : value}
            </button>
          ))}
        </div>

        {isPending && <p className="text-sm text-muted">Loading bets…</p>}
        {isError && <p className="text-sm text-loss">{error.message}</p>}
        {data && (
          <>
            <p className="mb-3 text-sm text-muted">
              Showing {data.items.length} of {data.total}
            </p>
            <BetList bets={data.items} />
          </>
        )}
      </section>
    </main>
  );
}
