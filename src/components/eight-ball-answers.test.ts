import { describe, expect, it } from 'vitest';

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
