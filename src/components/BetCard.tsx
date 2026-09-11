import { betStandings, formatMoney } from '../bets/ledger';
import { betStatus, type Bet, type Progress } from '../bets/types';
import { Podium } from './Podium';
import { ProgressBar } from './ProgressBar';
import { Seesaw } from './Seesaw';

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
        <h3 className="text-base font-semibold">
          <span>{bet.title}</span>{' '}
          <span className="font-normal whitespace-nowrap text-muted">
            - ${bet.stake.toLocaleString('en-US')}
          </span>
        </h3>
        <span className={`badge shrink-0 ${STATUS_BADGE[status]}`}>{status}</span>
      </div>

      {bet.detail && <p className="mt-2 text-sm text-muted">{bet.detail}</p>}

      <p className="mt-3 text-sm">
        <Sides bet={bet} />
      </p>

      {bet.progress && (
        <div className="mt-4 rounded-lg border border-edge bg-ink p-3">
          <ProgressView progress={bet.progress} />
        </div>
      )}

      <Money bet={bet} />
    </li>
  );
}

function ProgressView({ progress }: { progress: Progress }) {
  switch (progress.kind) {
    case 'podium':
      return <Podium players={progress.players} unit={progress.unit} />;
    case 'bar':
      return <ProgressBar player={progress.player} target={progress.target} unit={progress.unit} />;
    case 'seesaw':
      return <Seesaw left={progress.left} right={progress.right} unit={progress.unit} />;
  }
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

/** Where every person on the bet currently stands, best off first. */
function Money({ bet }: { bet: Bet }) {
  const rows = betStandings(bet);
  const status = betStatus(bet);
  const decided = rows.some((row) => row.amount !== 0);

  return (
    <div className="mt-4">
      <p className="mb-1.5 text-[0.7rem] tracking-wide text-muted uppercase">
        {caption(status, decided)}
      </p>

      {/*
       * One row across, packing as many people as fit. Only a narrow phone with
       * five names on a bet drops to a second line.
       */}
      <ul
        className="grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-x-3 gap-y-2"
        aria-label="Where each person stands on this bet"
      >
        {rows.map((row) => (
          <li key={row.name} className="text-center">
            <span className="block truncate text-xs text-muted" title={row.name}>
              {row.name}
            </span>
            <span className={`block text-sm font-semibold tabular-nums ${moneyTone(row.amount)}`}>
              {formatMoney(row.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function caption(status: ReturnType<typeof betStatus>, decided: boolean): string {
  if (status === 'void') return 'Nobody pays';
  if (status === 'settled') return 'Final';
  return decided ? 'If it ended now' : 'Nothing to split yet';
}

function moneyTone(amount: number): string {
  if (amount > 0) return 'text-win';
  if (amount < 0) return 'text-loss';
  return 'text-muted';
}
