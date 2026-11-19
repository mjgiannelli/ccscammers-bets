import { lineupTotal, type LineupSide } from '../bets/types';

/**
 * One grid for the whole matchup: name, score, slot, score, name. The team
 * totals sit in the same two score columns as the players beneath them, so the
 * header lines up with the rows rather than floating above them.
 */
const COLUMNS = 'grid grid-cols-[1fr_3rem_2.75rem_3rem_1fr] items-baseline gap-x-2';

export function Lineup({
  left,
  right,
  week,
}: {
  left: LineupSide;
  right: LineupSide;
  week: number;
}) {
  const leftTotal = lineupTotal(left);
  const rightTotal = lineupTotal(right);
  const rows = Math.max(left.players.length, right.players.length);

  return (
    <div className="grid gap-2">
      <div className={`${COLUMNS} border-b border-edge pb-2`}>
        <span className={`truncate text-sm font-semibold ${lead(leftTotal, rightTotal)}`}>
          {left.team}
        </span>
        <span
          className={`text-right text-sm font-semibold tabular-nums ${lead(leftTotal, rightTotal)}`}
        >
          {leftTotal.toFixed(1)}
        </span>
        <span className="text-center text-[0.65rem] tracking-wide text-muted uppercase">
          Wk {week}
        </span>
        <span className={`text-sm font-semibold tabular-nums ${lead(rightTotal, leftTotal)}`}>
          {rightTotal.toFixed(1)}
        </span>
        <span
          className={`truncate text-right text-sm font-semibold ${lead(rightTotal, leftTotal)}`}
        >
          {right.team}
        </span>
      </div>

      <ul className="grid gap-1" aria-label={`Week ${week} lineups`}>
        {Array.from({ length: rows }, (_, index) => {
          const home = left.players[index];
          const away = right.players[index];

          return (
            <li key={index} className={`${COLUMNS} text-sm`}>
              <span className="truncate text-muted" title={home?.name}>
                {home?.name ?? ''}
              </span>
              <span className="text-right tabular-nums">{home ? home.points.toFixed(1) : ''}</span>
              <span className="justify-self-center rounded border border-edge px-1.5 py-0.5 text-[0.6rem] tracking-wide text-muted">
                {home?.slot ?? away?.slot ?? ''}
              </span>
              <span className="tabular-nums">{away ? away.points.toFixed(1) : ''}</span>
              <span className="truncate text-right text-muted" title={away?.name}>
                {away?.name ?? ''}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Whoever is ahead goes green; level leaves both neutral. */
function lead(mine: number, theirs: number): string {
  return mine > theirs ? 'text-win' : '';
}
