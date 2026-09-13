import { pickAnswer, wrapAnswer } from './eight-ball-answers';

/* The die is an equilateral triangle inscribed in the window, point down. */
const WINDOW = { cx: 80, cy: 84, r: 45 };
const DIE_R = 39;
const DIE_TOP = WINDOW.cy - DIE_R / 2;
const DIE_HALF = DIE_R * 0.866;

const LINE_HEIGHT = 11;

export function EightBall({
  question,
  answer,
  phrase: override,
}: {
  question: string;
  answer: boolean | null;
  phrase?: string;
}) {
  const phrase = override ?? pickAnswer(question, answer);
  const lines = wrapAnswer(phrase);
  const tone = answer === null ? 'text-muted' : answer ? 'text-win' : 'text-loss';

  return (
    <div className="grid justify-items-center gap-3">
      <p className="text-center text-sm text-muted">{question}</p>

      <svg viewBox="0 0 160 160" className="w-40" role="img" aria-label={`Magic 8-ball: ${phrase}`}>
        <defs>
          <radialGradient id="eb-ball" cx="34%" cy="27%" r="80%">
            <stop offset="0%" stopColor="#8b93a3" />
            <stop offset="18%" stopColor="#3c414d" />
            <stop offset="45%" stopColor="#15171c" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <linearGradient id="eb-die" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b2ef0" />
            <stop offset="100%" stopColor="#2409a6" />
          </linearGradient>
          <filter id="eb-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="eb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <circle cx="80" cy="80" r="78" fill="url(#eb-ball)" />

        {/* Specular highlight up top, and the light that wraps the far edge. */}
        <ellipse
          cx="52"
          cy="34"
          rx="26"
          ry="15"
          fill="#ffffff"
          opacity="0.45"
          filter="url(#eb-soft)"
          transform="rotate(-24 52 34)"
        />
        <ellipse
          cx="116"
          cy="126"
          rx="34"
          ry="17"
          fill="#ffffff"
          opacity="0.12"
          filter="url(#eb-soft)"
          transform="rotate(-38 116 126)"
        />

        {/* The window: black well behind a thin bright bezel. */}
        <circle cx={WINDOW.cx} cy={WINDOW.cy} r={WINDOW.r + 3} fill="#000000" opacity="0.85" />
        <circle
          cx={WINDOW.cx}
          cy={WINDOW.cy}
          r={WINDOW.r}
          fill="#04050a"
          stroke="#c3cad8"
          strokeWidth="1.6"
        />

        <polygon points={diePoints()} fill="#4a1fe0" opacity="0.55" filter="url(#eb-glow)" />
        <polygon points={diePoints()} fill="url(#eb-die)" />

        {lines.map((line, index) => (
          <text
            key={line}
            x={WINDOW.cx}
            y={WINDOW.cy - 4 + (index - (lines.length - 1) / 2) * LINE_HEIGHT}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="0.3"
            fill="#f2f4f8"
          >
            {line}
          </text>
        ))}
      </svg>

      <p className={`text-sm font-semibold ${tone}`}>
        {answer === null ? 'Too early to call' : answer ? 'Currently yes' : 'Currently no'}
      </p>
    </div>
  );
}

function diePoints(): string {
  const apex = WINDOW.cy + DIE_R;
  return `${WINDOW.cx - DIE_HALF},${DIE_TOP} ${WINDOW.cx + DIE_HALF},${DIE_TOP} ${WINDOW.cx},${apex}`;
}
