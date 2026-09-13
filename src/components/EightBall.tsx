/** Classic answers, grouped by what the ball is actually saying. */
const AFFIRMATIVE = [
  'IT IS CERTAIN',
  'WITHOUT A DOUBT',
  'SIGNS POINT TO YES',
  'YES DEFINITELY',
  'OUTLOOK GOOD',
  'YOU MAY RELY ON IT',
];

const NEGATIVE = [
  "DON'T COUNT ON IT",
  'MY SOURCES SAY NO',
  'OUTLOOK NOT SO GOOD',
  'VERY DOUBTFUL',
  'MY REPLY IS NO',
];

const HAZY = [
  'REPLY HAZY TRY AGAIN',
  'ASK AGAIN LATER',
  'CANNOT PREDICT NOW',
  'CONCENTRATE AND ASK AGAIN',
];

export function EightBall({ question, answer }: { question: string; answer: boolean | null }) {
  const phrase = pick(question, answer);
  const lines = wrap(phrase);
  const tone = answer === null ? 'text-muted' : answer ? 'text-win' : 'text-loss';

  return (
    <div className="grid justify-items-center gap-2">
      <p className="text-center text-sm text-muted">{question}</p>

      <svg viewBox="0 0 140 140" className="w-32" role="img" aria-label={`Magic 8-ball: ${phrase}`}>
        <circle cx="70" cy="70" r="62" fill="#07090d" stroke="var(--color-edge)" strokeWidth="2" />
        {/* A touch of gloss, so it reads as a ball rather than a flat disc. */}
        <ellipse cx="49" cy="38" rx="17" ry="10" fill="#ffffff" opacity="0.09" />

        <circle cx="26" cy="26" r="12" fill="#f2f4f8" />
        <text
          x="26"
          y="26"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fontWeight="700"
          fill="#07090d"
        >
          8
        </text>

        <circle cx="70" cy="74" r="37" fill="#05070a" />
        {/* The die floating in the window, point down. */}
        <polygon points="35,50 105,50 70,110" fill="#2b3a72" />

        {lines.map((line, index) => (
          <text
            key={line}
            x="70"
            y={66 + index * 11 - (lines.length - 1) * 5.5}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fontWeight="700"
            letterSpacing="0.4"
            fill="#e7eaf0"
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

/**
 * Same question, same answer, same phrase every render — a ball that reshuffled
 * on every re-render would be unreadable.
 */
function pick(question: string, answer: boolean | null): string {
  const bank = answer === null ? HAZY : answer ? AFFIRMATIVE : NEGATIVE;

  let hash = 0;
  for (const character of question) {
    hash = (hash * 31 + character.charCodeAt(0)) % 100_000;
  }
  return bank[hash % bank.length];
}

/** Breaks a phrase into at most three short lines to fit the window. */
function wrap(phrase: string): string[] {
  const words = phrase.split(' ');
  const lines: string[] = [];

  for (const word of words) {
    const last = lines[lines.length - 1];
    if (last && `${last} ${word}`.length <= 11) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}
