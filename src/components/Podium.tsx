import type { Tracked } from '../bets/types';

/** Tall enough to hold the place number even for someone yet to score. */
const MIN_STEP = 26;
const MAX_STEP = 88;

/**
 * Steps are measured against the leader, who always stands at full height, and
 * that ratio is raised to this power before it becomes a height.
 *
 * Straight proportion is too flat to read as a podium: a field inside 30% of
 * each other, which is a normal season, produces steps a few pixels apart.
 * Cubing stretches those gaps into something with a shape while keeping what
 * the height means — level scores stay level, a bigger lead is always a taller
 * step, and a photo finish still looks like one. Turn it up for more drama,
 * down toward 1 for straight proportion.
 */
const STEEPNESS = 3;

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
        // Everyone is measured against the leader, so first place tops the
        // podium and the rest fall away from it. Before anyone scores they are
        // all tied for the lead, and all stand level.
        const fill = best > 0 ? (player.value / best) ** STEEPNESS : 1;
        const height = MIN_STEP + fill * (MAX_STEP - MIN_STEP);
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
