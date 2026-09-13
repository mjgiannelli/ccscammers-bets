/** Classic answers, grouped by what the ball is actually saying. */
export const ANSWERS = {
  yes: [
    'IT IS CERTAIN',
    'WITHOUT A DOUBT',
    'SIGNS POINT TO YES',
    'OUTLOOK GOOD',
    'YOU MAY RELY ON IT',
  ],
  no: [
    "DON'T COUNT ON IT",
    'MY SOURCES SAY NO',
    'OUTLOOK NOT SO GOOD',
    'VERY DOUBTFUL',
    'MY REPLY IS NO',
  ],
  hazy: [
    'REPLY HAZY TRY AGAIN',
    'ASK AGAIN LATER',
    'CANNOT PREDICT NOW',
    'BETTER NOT TELL YOU NOW',
  ],
} as const;

/**
 * Characters allowed on each line. It is a triangle standing on its point, so
 * the third line has less room than the first — and each budget stops short of
 * what would actually fit, leaving the text clear of the sloped edges rather
 * than running into them.
 */
export const LINE_WIDTHS = [10, 8, 6];

/**
 * Same question, same answer, same phrase every render — a ball that reshuffled
 * on every re-render would be unreadable.
 */
export function pickAnswer(question: string, answer: boolean | null): string {
  const bank = answer === null ? ANSWERS.hazy : answer ? ANSWERS.yes : ANSWERS.no;

  let hash = 0;
  for (const character of question) {
    hash = (hash * 31 + character.charCodeAt(0)) % 100_000;
  }
  return bank[hash % bank.length];
}

/**
 * Greedily fills each line up to the width the die allows at that height, so
 * the text sits inside the triangle instead of spilling over its edges.
 */
export function wrapAnswer(phrase: string): string[] {
  const lines: string[] = [];

  for (const word of phrase.split(' ')) {
    const index = Math.min(lines.length - 1, LINE_WIDTHS.length - 1);
    const last = lines[index];

    if (last !== undefined && `${last} ${word}`.length <= LINE_WIDTHS[index]) {
      lines[index] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}
