import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EightBall } from './EightBall';

const QUESTION = 'Watson still QB1 in week 18?';

function answerText(container: HTMLElement) {
  return [...container.querySelectorAll('svg text')].map((node) => node.textContent).join(' ');
}

describe('EightBall', () => {
  it('answers in the affirmative when the proposition holds', () => {
    const { container } = render(<EightBall question={QUESTION} answer={true} />);

    expect(answerText(container)).toMatch(/CERTAIN|DOUBT|YES|GOOD|RELY/);
    expect(screen.getByText('Currently yes')).toBeInTheDocument();
  });

  it('answers in the negative when it does not', () => {
    const { container } = render(<EightBall question={QUESTION} answer={false} />);

    expect(answerText(container)).toMatch(/DON'T|NO|DOUBTFUL|NOT SO GOOD/);
    expect(screen.getByText('Currently no')).toBeInTheDocument();
  });

  it('hedges while it is too early to call', () => {
    const { container } = render(<EightBall question={QUESTION} answer={null} />);

    expect(answerText(container)).toMatch(/HAZY|AGAIN|CANNOT PREDICT/);
    expect(screen.getByText('Too early to call')).toBeInTheDocument();
  });

  // A ball that reshuffled every render would be unreadable.
  it('gives the same question the same phrase every time', () => {
    const first = render(<EightBall question={QUESTION} answer={false} />);
    const phrase = answerText(first.container);
    first.unmount();

    const second = render(<EightBall question={QUESTION} answer={false} />);
    expect(answerText(second.container)).toBe(phrase);
  });

  it('reads the answer out for screen readers', () => {
    render(<EightBall question={QUESTION} answer={true} />);

    expect(screen.getByRole('img')).toHaveAccessibleName(/Magic 8-ball: /);
  });
});
