import { describe, expect, it } from 'vitest';

import { BETS } from '../bets/data';
import { ANSWERS, LINE_WIDTHS, pickAnswer, wrapAnswer } from './eight-ball-answers';

const EVERY_PHRASE = [...ANSWERS.yes, ...ANSWERS.no, ...ANSWERS.hazy];

describe('wrapAnswer', () => {
  // The die narrows toward its point, so a phrase that overflows any line
  // spills outside the triangle and looks broken.
  it.each(EVERY_PHRASE)('fits %s inside the die', (phrase) => {
    const lines = wrapAnswer(phrase);

    expect(lines.length).toBeLessThanOrEqual(LINE_WIDTHS.length);
    lines.forEach((line, index) => {
      expect(line.length).toBeLessThanOrEqual(LINE_WIDTHS[index]);
    });
  });

  it('keeps every word, in order', () => {
    for (const phrase of EVERY_PHRASE) {
      expect(wrapAnswer(phrase).join(' ')).toBe(phrase);
    }
  });

  it('packs the widest line first', () => {
    expect(wrapAnswer('ASK AGAIN LATER')).toEqual(['ASK AGAIN', 'LATER']);
  });
});

describe('pickAnswer', () => {
  it('answers from the bank that matches the verdict', () => {
    expect(ANSWERS.yes).toContain(pickAnswer('Still QB1?', true));
    expect(ANSWERS.no).toContain(pickAnswer('Still QB1?', false));
    expect(ANSWERS.hazy).toContain(pickAnswer('Still QB1?', null));
  });

  it('is stable for a given question', () => {
    expect(pickAnswer('Still QB1?', false)).toBe(pickAnswer('Still QB1?', false));
  });

  it('varies between different questions', () => {
    const phrases = new Set(
      ['a', 'bb', 'ccc', 'dddd', 'eeeee', 'ffffff'].map((q) => pickAnswer(q, true)),
    );
    expect(phrases.size).toBeGreaterThan(1);
  });
});

describe('the phrases written by hand in the data', () => {
  const written = BETS.flatMap((bet) =>
    bet.progress?.kind === 'eightBall' && bet.progress.phrase
      ? [{ id: bet.id, phrase: bet.progress.phrase }]
      : [],
  );

  // Nothing stops someone typing a phrase too long for the die, so the data
  // itself gets checked rather than just the built-in banks.
  it('fit inside the die', () => {
    for (const { id, phrase } of written) {
      const lines = wrapAnswer(phrase);

      expect(lines.length, `${id}: "${phrase}" needs ${lines.length} lines`).toBeLessThanOrEqual(
        LINE_WIDTHS.length,
      );
      lines.forEach((line, index) => {
        expect(
          line.length,
          `${id}: "${line}" is too wide for line ${index + 1}`,
        ).toBeLessThanOrEqual(LINE_WIDTHS[index]);
      });
    }
  });

  // Deliberately NOT checked against `answer`. The ball editorialises about
  // where a bet is heading, which is not always where it stands today — Watson
  // holds the job while the ball reckons he will not hold it to week 18. The
  // money and the yes/no label come from `answer`, never from the wording.
});
