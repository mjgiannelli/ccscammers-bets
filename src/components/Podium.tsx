import type { Tracked } from '../bets/types';

/** Shortest step, so a podium with nothing scored yet still reads as a podium. */
const MIN_STEP = 12;
const MAX_STEP = 64;

export function Podium({ players, unit }: { players: Tracked[]; unit: string }) {
  const ranked = [...players].sort((a, b) => b.value - a.value);
  const best = Math.max(...ranked.map((player) => player.value), 0);

  return (
    <ol className="flex items-end justify-center gap-2" aria-label="Podium">
      {ranked.map((player, index) => {
        // Step height tracks the score itself, not the placing, so a runaway
        // leader actually looks like one.
        const share = best > 0 ? player.value / best : 0;
        const height = MIN_STEP + share * (MAX_STEP - MIN_STEP);

        return (
          <li key={player.name} className="flex w-full max-w-20 flex-col items-center gap-1">
            <span className="text-xs text-muted tabular-nums">
              {player.value.toLocaleString('en-US')}
            </span>

            <span
              className={`grid size-9 place-items-center rounded-full border text-sm font-semibold ${
                index === 0 && best > 0
                  ? 'border-(--color-accent) bg-[#232838] text-accent'
                  : 'border-edge bg-[#232838] text-body'
              }`}
              title={player.name}
            >
              {player.abbr}
            </span>

            <div
              className="w-full rounded-t-md border border-b-0 border-edge bg-[#232838]"
              style={{ height }}
            >
              <span className="sr-only">
                {player.name}: {player.value} {unit}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
