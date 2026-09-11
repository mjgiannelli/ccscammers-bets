import { betStatus, pot, type Bet } from '../bets/types';

const STATUS_BADGE: Record<ReturnType<typeof betStatus>, string> = {
  open: 'text-accent border-(--color-accent)',
  settled: 'text-win border-(--color-win)',
  void: 'text-muted',
};

export function BetCard({ bet }: { bet: Bet }) {
  const status = betStatus(bet);

  return (
    <li className="card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold">{bet.title}</h3>
        <span className={`badge shrink-0 ${STATUS_BADGE[status]}`}>{status}</span>
      </div>

      {bet.detail && <p className="mt-2 text-sm text-muted">{bet.detail}</p>}

      <p className="mt-3 text-sm">
        <Sides bet={bet} />
      </p>

      <dl className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="Each" value={`$${bet.stake.toLocaleString('en-US')}`} />
        <Stat label="Pot" value={`$${pot(bet).toLocaleString('en-US')}`} />
        <Stat label="Result" value={resultLabel(bet)} />
      </dl>
    </li>
  );
}

/**
 * A pool reads as one list of names. A head-to-head bet reads as two sides,
 * with the side backing the title first.
 */
function Sides({ bet }: { bet: Bet }) {
  if (bet.format === 'pool') {
    return (
      <>
        <span className="text-muted">Everyone in: </span>
        {bet.players.join(', ')}
      </>
    );
  }

  return (
    <>
      <span className={bet.result === 'for' ? 'text-win' : undefined}>{bet.for.join(', ')}</span>
      <span className="text-muted"> vs </span>
      <span className={bet.result === 'against' ? 'text-win' : undefined}>
        {bet.against.join(', ')}
      </span>
    </>
  );
}

function resultLabel(bet: Bet): string {
  if (bet.result === null) return 'Live';
  if (bet.result === 'void') return 'Void';
  if (bet.format === 'pool') return bet.result;
  return bet.result === 'for' ? 'Hit' : 'Missed';
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.7rem] tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 tabular-nums">{value}</dd>
    </div>
  );
}
