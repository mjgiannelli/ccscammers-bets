import { useMutation, useQueryClient } from '@tanstack/react-query';
import { potentialReturn, profitLoss, type Bet, type SettledBetStatus } from '@ccscammers/shared';

import { betKeys, deleteBet, settleBet } from '../api/bets';

const SETTLE_ACTIONS: { status: SettledBetStatus; label: string }[] = [
  { status: 'won', label: 'Won' },
  { status: 'lost', label: 'Lost' },
  { status: 'void', label: 'Void' },
];

const STATUS_BADGE: Record<Bet['status'], string> = {
  open: 'text-accent border-(--color-accent)',
  won: 'text-win border-(--color-win)',
  lost: 'text-loss border-(--color-loss)',
  void: 'text-muted',
};

export function BetList({ bets }: { bets: Bet[] }) {
  if (bets.length === 0) {
    return <p className="text-sm text-muted">No bets yet. Place one above.</p>;
  }

  return (
    <ul className="grid gap-3">
      {bets.map((bet) => (
        <BetRow key={bet.id} bet={bet} />
      ))}
    </ul>
  );
}

function BetRow({ bet }: { bet: Bet }) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: betKeys.all });

  const settle = useMutation({
    mutationFn: (status: SettledBetStatus) => settleBet(bet.id, status),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: () => deleteBet(bet.id),
    onSuccess: invalidate,
  });

  const result = profitLoss(bet);
  const busy = settle.isPending || remove.isPending;

  return (
    <li className="card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">{bet.title}</h3>
        <span className={`badge ${STATUS_BADGE[bet.status]}`}>{bet.status}</span>
      </div>

      {bet.description && <p className="mt-2 text-sm text-muted">{bet.description}</p>}

      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Stake" value={bet.stake.toFixed(2)} />
        <Stat label="Odds" value={String(bet.odds)} />
        <Stat
          label={result === null ? 'To return' : 'P/L'}
          value={result === null ? potentialReturn(bet).toFixed(2) : result.toFixed(2)}
          tone={result === null ? undefined : result >= 0 ? 'win' : 'loss'}
        />
        <Stat label="By" value={bet.createdBy} />
      </dl>

      <div className="mt-3 flex flex-wrap gap-2">
        {bet.status === 'open' &&
          SETTLE_ACTIONS.map(({ status, label }) => (
            <button
              key={status}
              type="button"
              className="btn"
              disabled={busy}
              onClick={() => settle.mutate(status)}
            >
              {label}
            </button>
          ))}
        <button
          type="button"
          className="btn btn-danger"
          disabled={busy}
          onClick={() => remove.mutate()}
        >
          Delete
        </button>
      </div>

      {settle.isError && <p className="mt-2 text-sm text-loss">{settle.error.message}</p>}
      {remove.isError && <p className="mt-2 text-sm text-loss">{remove.error.message}</p>}
    </li>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'win' | 'loss' }) {
  const toneClass = tone === 'win' ? 'text-win' : tone === 'loss' ? 'text-loss' : '';

  return (
    <div>
      <dt className="text-[0.7rem] tracking-wide text-muted uppercase">{label}</dt>
      <dd className={`mt-0.5 tabular-nums ${toneClass}`}>{value}</dd>
    </div>
  );
}
