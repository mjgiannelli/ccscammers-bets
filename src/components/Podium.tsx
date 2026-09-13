import type { Tracked } from '../bets/types';

/** Tall enough to hold the place number even when nobody has scored. */
const MIN_STEP = 28;
const MAX_STEP = 76;

interface Placed extends Tracked {
  place: number;
}

export function Podium({ players, unit }: { players: Tracked[]; unit: string }) {
  // Competition ranking: level scores take the same place, matching the pool
  // ladder, which splits the money between them rather than ordering them.
  const sorted = [...players].sort((a, b) => b.value - a.value);
  const ranked: Placed[] = sorted.map((player) => ({
    ...player,
    place: sorted.findIndex((other) => other.value === player.value) + 1,
  }));

  const best = Math.max(...ranked.map((player) => player.value), 0);

  return (
    <ol className="flex items-end justify-center gap-2" aria-label="Podium">
      {arrange(ranked).map((player) => {
        // Step height tracks the score itself, not the placing, so a runaway
        // leader actually looks like one.
        const share = best > 0 ? player.value / best : 0;
        const height = MIN_STEP + share * (MAX_STEP - MIN_STEP);
        const leading = player.place === 1 && best > 0;

        return (
          <li key={player.name} className="flex w-full max-w-20 flex-col items-center gap-1">
            <span className="text-xs text-muted tabular-nums">
              {player.value.toLocaleString('en-US')}
            </span>

            <span
              className={`grid size-9 place-items-center rounded-full border text-sm font-semibold ${
                leading
                  ? 'border-(--color-accent) bg-[#232838] text-accent'
                  : 'border-edge bg-[#232838] text-body'
              }`}
              title={player.name}
            >
              {player.abbr}
            </span>

            <div
              className={`grid w-full place-items-center rounded-t-md border border-b-0 bg-[#232838] ${
                leading ? 'border-(--color-accent)' : 'border-edge'
              }`}
              style={{ height }}
            >
              <span
                className={`text-sm font-semibold tabular-nums ${
                  leading ? 'text-accent' : 'text-muted'
                }`}
              >
                {player.place}
              </span>
              <span className="sr-only">
                {player.name}, {ordinal(player.place)} with {player.value} {unit}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Lays a ranked list out as a podium rather than a ladder: the winner stands in
 * the middle and the rest fan outwards, so four people read 4th, 2nd, 1st, 3rd
 * from left to right.
 */
function arrange<T>(ranked: T[]): T[] {
  const slots = new Array<T>(ranked.length);
  const centre = Math.ceil((ranked.length - 1) / 2);

  let left = centre - 1;
  let right = centre + 1;
  slots[centre] = ranked[0];

  ranked.slice(1).forEach((player, index) => {
    // Alternate outwards, starting on the left, and fall back to whichever
    // side still has room once the other runs out.
    const goLeft = index % 2 === 0;
    if ((goLeft && left >= 0) || right >= ranked.length) {
      slots[left--] = player;
    } else {
      slots[right++] = player;
    }
  });

  return slots;
}

function ordinal(place: number): string {
  const suffix = place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th';
  return `${place}${suffix}`;
}
