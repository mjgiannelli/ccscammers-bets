import type { Tracked } from '../bets/types';

export function ProgressBar({
  player,
  target,
  unit,
}: {
  player: Tracked;
  target: number;
  unit: string;
}) {
  const share = target > 0 ? Math.min(player.value / target, 1) : 0;
  const percent = Math.round(share * 100);

  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span>{player.name}</span>
        <span className="text-muted tabular-nums">
          {player.value.toLocaleString('en-US')} / {target.toLocaleString('en-US')} {unit}
        </span>
      </div>

      <div
        className="h-2.5 overflow-hidden rounded-full border border-edge bg-ink"
        role="progressbar"
        aria-valuenow={player.value}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-label={`${player.name} toward ${target} ${unit}`}
      >
        <div
          className={`h-full rounded-full ${share >= 1 ? 'bg-win' : 'bg-accent'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs text-muted tabular-nums">
        {percent}% there
        {player.value < target && ` — ${(target - player.value).toLocaleString('en-US')} to go`}
      </p>
    </div>
  );
}
