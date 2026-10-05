import { SEASON_GAMES, type Tracked } from '../bets/types';

export function ProgressBar({
  player,
  target,
  unit,
  gamesPlayed,
  seasonGames = SEASON_GAMES,
}: {
  player: Tracked;
  target: number;
  unit: string;
  gamesPlayed: number;
  seasonGames?: number;
}) {
  const done = clamp(player.value / target);
  const remaining = Math.max(target - player.value, 0);

  // Where this ends up if the rest of the season looks like the start of it.
  const gamesLeft = Math.max(seasonGames - gamesPlayed, 0);
  const projected = gamesPlayed > 0 ? Math.round((player.value / gamesPlayed) * seasonGames) : 0;
  const onPace = projected >= target;
  const perGameNeeded = gamesLeft > 0 ? Math.ceil(remaining / gamesLeft) : remaining;

  return (
    <div className="grid gap-3">
      <div className="grid gap-1.5">
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <span>{player.name}</span>
          <span className="text-muted tabular-nums">
            {player.value.toLocaleString('en-US')} / {target.toLocaleString('en-US')} {unit}
          </span>
        </div>

        <Track
          value={player.value}
          target={target}
          fill={done}
          tone={player.value >= target ? 'bg-win' : 'bg-accent'}
          label={`${player.name} toward ${target} ${unit}`}
        />

        <p className="text-xs text-muted tabular-nums">
          {Math.round(done * 100)}% there
          {remaining > 0 && ` — ${remaining.toLocaleString('en-US')} to go`}
        </p>
      </div>

      {gamesPlayed > 0 && (
        <div className="grid gap-1.5 border-t border-edge pt-3">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-muted">On pace for</span>
            <span className={`tabular-nums ${onPace ? 'text-win' : 'text-loss'}`}>
              {projected.toLocaleString('en-US')} {unit}
            </span>
          </div>

          <Track
            value={projected}
            target={target}
            fill={clamp(projected / target)}
            tone={onPace ? 'bg-win' : 'bg-loss'}
            label={`Projected ${projected} ${unit} against ${target}`}
          />

          <p className="text-xs text-muted tabular-nums">
            {gamesPlayed} {gamesPlayed === 1 ? 'game' : 'games'} in
            {remaining > 0
              ? gamesLeft > 0 &&
                ` — needs ${perGameNeeded.toLocaleString('en-US')} ${unit} a game from here`
              : ' — already there'}
          </p>
        </div>
      )}
    </div>
  );
}

function Track({
  value,
  target,
  fill,
  tone,
  label,
}: {
  value: number;
  target: number;
  fill: number;
  tone: string;
  label: string;
}) {
  return (
    <div
      className="h-2.5 overflow-hidden rounded-full border border-edge bg-ink"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={target}
      aria-label={label}
    >
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${fill * 100}%` }} />
    </div>
  );
}

function clamp(share: number): number {
  if (!Number.isFinite(share)) return 0;
  return Math.min(Math.max(share, 0), 1);
}
