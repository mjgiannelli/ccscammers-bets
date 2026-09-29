import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Podium } from './Podium';
import { ProgressBar } from './ProgressBar';

const PLAYERS = [
  { abbr: 'J', name: 'Jeff', value: 80 },
  { abbr: 'M', name: 'Mark', value: 140 },
  { abbr: 'G', name: 'Gerry', value: 20 },
];

function steps(container: HTMLElement) {
  return [...container.querySelectorAll('li')].map((step) => {
    const pedestal = step.querySelector('div') as HTMLElement;
    return {
      text: step.textContent ?? '',
      place: pedestal.querySelector('span')?.textContent ?? '',
      height: Number(pedestal.style.height.replace('px', '')),
    };
  });
}

describe('Podium', () => {
  // The winner stands in the middle, not at the left-hand end.
  it('fans four people out as 4th, 2nd, 1st, 3rd', () => {
    const four = [...PLAYERS, { abbr: 'T', name: 'Tim', value: 200 }];
    const { container } = render(<Podium players={four} unit="pts" />);

    expect(steps(container).map((step) => step.place)).toEqual(['4', '2', '1', '3']);
  });

  it('puts the leader in the middle of a three-way podium', () => {
    const { container } = render(<Podium players={PLAYERS} unit="pts" />);
    const rendered = steps(container);

    expect(rendered[1].text).toContain('M');
    expect(rendered[1].text).toContain('140');
    expect(rendered.map((step) => step.place)).toEqual(['2', '1', '3']);
  });

  // The pool ladder splits the money between tied players, so the podium has
  // to call them the same place rather than ordering one above the other.
  it('gives level scores the same place', () => {
    const tied = [
      { abbr: 'T', name: 'Tim', value: 182 },
      { abbr: 'G', name: 'Gerry', value: 143 },
      { abbr: 'J', name: 'Jeff', value: 137 },
      { abbr: 'M', name: 'Mark', value: 137 },
    ];
    const { container } = render(<Podium players={tied} unit="pts" />);

    expect(steps(container).map((step) => step.place)).toEqual(['3', '2', '1', '3']);
  });

  it('labels every step with its place', () => {
    render(<Podium players={PLAYERS} unit="pts" />);

    const list = within(screen.getByRole('list'));
    expect(list.getByText('Mark, 1st with 140 pts')).toBeInTheDocument();
    expect(list.getByText('Gerry, 3rd with 20 pts')).toBeInTheDocument();
  });

  it('always stands the leader at full height', () => {
    const runaway = steps(
      render(
        <Podium
          players={[
            { abbr: 'A', name: 'A', value: 600 },
            { abbr: 'B', name: 'B', value: 20 },
          ]}
          unit="pts"
        />,
      ).container,
    );
    const photoFinish = steps(
      render(
        <Podium
          players={[
            { abbr: 'A', name: 'A', value: 600 },
            { abbr: 'B', name: 'B', value: 599 },
          ]}
          unit="pts"
        />,
      ).container,
    );

    const leaderIn = (rendered: ReturnType<typeof steps>) =>
      rendered.find((step) => step.place === '1')!.height;

    expect(leaderIn(runaway)).toBe(leaderIn(photoFinish));
  });

  // Straight proportion leaves a normal field a few pixels apart, so the
  // curve has to push a trailing score further down than its ratio alone
  // would — while a near-tie still has to read as a near-tie.
  it('stretches the gap below the leader', () => {
    const half = steps(
      render(
        <Podium
          players={[
            { abbr: 'A', name: 'A', value: 100 },
            { abbr: 'B', name: 'B', value: 50 },
          ]}
          unit="pts"
        />,
      ).container,
    );
    const [top, bottom] = [
      half.find((step) => step.place === '1')!.height,
      half.find((step) => step.place === '2')!.height,
    ];
    const floor = Math.min(...half.map((step) => step.height)) - 0.001;
    const linear = floor + (top - floor) * 0.5;

    // Half the leader's points sits well under half the leader's step.
    expect(bottom).toBeLessThan(linear);
  });

  it('keeps a photo finish looking close', () => {
    const { container } = render(
      <Podium
        players={[
          { abbr: 'A', name: 'A', value: 600 },
          { abbr: 'B', name: 'B', value: 597 },
        ]}
        unit="pts"
      />,
    );

    const [a, b] = steps(container).map((step) => step.height);
    expect(Math.abs(a - b)).toBeLessThan(2);
  });

  it('stands everyone level when the points are level', () => {
    const { container } = render(
      <Podium
        players={[
          { abbr: 'A', name: 'A', value: 250 },
          { abbr: 'B', name: 'B', value: 250 },
          { abbr: 'C', name: 'C', value: 250 },
        ]}
        unit="pts"
      />,
    );

    const heights = steps(container).map((step) => step.height);
    expect(new Set(heights).size).toBe(1);
  });

  // Doubling everybody changes nobody's share, so the podium must not move.
  it('cares about proportion, not magnitude', () => {
    const small = steps(render(<Podium players={PLAYERS} unit="pts" />).container);
    const large = steps(
      render(<Podium players={PLAYERS.map((p) => ({ ...p, value: p.value * 7 }))} unit="pts" />)
        .container,
    );

    expect(large.map((s) => s.height)).toEqual(small.map((s) => s.height));
  });

  // A taller step for a bigger number is still true within one podium.
  it('scales step height with the score', () => {
    const { container } = render(<Podium players={PLAYERS} unit="pts" />);
    const [jeff, mark, gerry] = steps(container);

    expect(mark.height).toBeGreaterThan(jeff.height);
    expect(jeff.height).toBeGreaterThan(gerry.height);
  });

  it('still renders steps before anyone has scored', () => {
    const { container } = render(
      <Podium players={PLAYERS.map((p) => ({ ...p, value: 0 }))} unit="pts" />,
    );

    expect(steps(container).every((step) => step.height > 0)).toBe(true);
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
