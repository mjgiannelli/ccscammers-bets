import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Podium } from './Podium';
import { ProgressBar } from './ProgressBar';

const PLAYERS = [
  { abbr: 'J', name: 'Jeff Stafford', value: 80 },
  { abbr: 'M', name: 'Mark', value: 140 },
  { abbr: 'G', name: 'Uncle Gerry', value: 20 },
];

describe('Podium', () => {
  it('ranks by value, highest first', () => {
    render(<Podium players={PLAYERS} unit="pts" />);

    const steps = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(steps[0]).toHaveTextContent('M');
    expect(steps[0]).toHaveTextContent('140');
    expect(steps[2]).toHaveTextContent('G');
  });

  // A taller step for a bigger number is the whole point of the shape.
  it('scales step height with the score', () => {
    const { container } = render(<Podium players={PLAYERS} unit="pts" />);

    const heights = [...container.querySelectorAll('li > div')].map((step) =>
      Number((step as HTMLElement).style.height.replace('px', '')),
    );

    expect(heights[0]).toBeGreaterThan(heights[1]);
    expect(heights[1]).toBeGreaterThan(heights[2]);
  });

  it('still renders steps before anyone has scored', () => {
    const { container } = render(
      <Podium players={PLAYERS.map((p) => ({ ...p, value: 0 }))} unit="pts" />,
    );

    const heights = [...container.querySelectorAll('li > div')].map((step) =>
      Number((step as HTMLElement).style.height.replace('px', '')),
    );

    expect(heights.every((height) => height > 0)).toBe(true);
  });
});

describe('ProgressBar', () => {
  it('fills to the share of the target and counts what is left', () => {
    render(
      <ProgressBar
        player={{ abbr: 'JJ', name: 'Jerry Jeudy', value: 250 }}
        target={1000}
        unit="yds"
      />,
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '250');
    expect(screen.getByText(/25% there/)).toBeInTheDocument();
    expect(screen.getByText(/750 to go/)).toBeInTheDocument();
  });

  it('caps the fill once the target is passed', () => {
    const { container } = render(
      <ProgressBar player={{ abbr: 'TU', name: 'Tuten', value: 1400 }} target={1000} unit="yds" />,
    );

    const fill = container.querySelector('[role="progressbar"] > div') as HTMLElement;
    expect(fill.style.width).toBe('100%');
    expect(screen.queryByText(/to go/)).not.toBeInTheDocument();
  });
});
