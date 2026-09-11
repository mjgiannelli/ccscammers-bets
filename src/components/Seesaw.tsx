import { effective, type SeesawSide } from '../bets/types';

const CX = 140;
const PIVOT_Y = 62;
const GROUND_Y = 86;
const ARM = 96;
const RADIUS = 17;
/** How far the plank tips when one side has run away with it. */
const MAX_TILT = 14;

export function Seesaw({
  left,
  right,
  unit,
}: {
  left: SeesawSide;
  right: SeesawSide;
  unit: string;
}) {
  const leftPlayer = effective(left);
  const rightPlayer = effective(right);

  // The heavier side drops. Scaling by the larger of the two means an early
  // 3-to-1 lead tips hard and then settles as the numbers grow.
  const scale = Math.max(leftPlayer.value, rightPlayer.value, 1);
  const lean = clamp((leftPlayer.value - rightPlayer.value) / scale, -1, 1);
  const radians = (lean * MAX_TILT * Math.PI) / 180;

  const dx = Math.cos(radians);
  const dy = -Math.sin(radians);
  const leftEnd = { x: CX - ARM * dx, y: PIVOT_Y - ARM * dy };
  const rightEnd = { x: CX + ARM * dx, y: PIVOT_Y + ARM * dy };
  // Sit each avatar on top of the plank rather than centred on it.
  const lift = { x: -Math.sin(radians) * (RADIUS + 3), y: -Math.cos(radians) * (RADIUS + 3) };

  return (
    <div className="grid gap-2">
      <svg
        viewBox="0 0 280 100"
        className="w-full"
        role="img"
        aria-label={`${leftPlayer.name} ${leftPlayer.value} ${unit} against ${rightPlayer.name} ${rightPlayer.value} ${unit}`}
      >
        <line
          x1="18"
          y1={GROUND_Y}
          x2="262"
          y2={GROUND_Y}
          stroke="var(--color-edge)"
          strokeWidth="2"
        />
        <polygon
          points={`${CX - 13},${GROUND_Y} ${CX + 13},${GROUND_Y} ${CX},${PIVOT_Y + 5}`}
          fill="var(--color-edge)"
        />
        <line
          x1={leftEnd.x}
          y1={leftEnd.y}
          x2={rightEnd.x}
          y2={rightEnd.y}
          stroke="var(--color-muted)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <Avatar at={leftEnd} lift={lift} abbr={leftPlayer.abbr} heavier={lean > 0} />
        <Avatar at={rightEnd} lift={lift} abbr={rightPlayer.abbr} heavier={lean < 0} />
      </svg>

      <div className="flex items-start justify-between gap-3 text-sm">
        <Readout player={leftPlayer} note={left.note} unit={unit} align="left" />
        <Readout player={rightPlayer} note={right.note} unit={unit} align="right" />
      </div>
    </div>
  );
}

function Avatar({
  at,
  lift,
  abbr,
  heavier,
}: {
  at: { x: number; y: number };
  lift: { x: number; y: number };
  abbr: string;
  heavier: boolean;
}) {
  const cx = at.x + lift.x;
  const cy = at.y + lift.y;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={RADIUS}
        fill="#232838"
        stroke={heavier ? 'var(--color-accent)' : 'var(--color-edge)'}
        strokeWidth="2"
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="600"
        fill={heavier ? 'var(--color-accent)' : 'var(--color-body)'}
      >
        {abbr}
      </text>
    </g>
  );
}

function Readout({
  player,
  note,
  unit,
  align,
}: {
  player: { name: string; value: number };
  note?: string;
  unit: string;
  align: 'left' | 'right';
}) {
  return (
    <div className={align === 'right' ? 'text-right' : undefined}>
      <p>{player.name}</p>
      <p className="text-muted tabular-nums">
        {player.value.toLocaleString('en-US')} {unit}
      </p>
      {note && <p className="text-xs text-muted">{note}</p>}
    </div>
  );
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(Math.max(value, low), high);
}
