import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Seesaw } from './Seesaw';
import { effective, type SeesawSide } from '../bets/types';

const one = (abbr: string, name: string, value: number): SeesawSide => ({
  players: [{ abbr, name, value }],
});

/** Plank endpoints, so we can assert which way it actually tips. */
function plank(container: HTMLElement) {
  const lines = [...container.querySelectorAll('line')];
  const beam = lines.find((line) => line.getAttribute('stroke-width') === '4');
  if (!beam) throw new Error('No plank rendered');

  return {
    leftY: Number(beam.getAttribute('y1')),
    rightY: Number(beam.getAttribute('y2')),
  };
}

describe('Seesaw', () => {
  // SVG y grows downward, so the heavier side has the larger y.
  it('drops the heavier side to the ground', () => {
    const { container } = render(
      <Seesaw
        left={one('DJM', 'DJ Moore', 120)}
        right={one('OLV', 'Chris Olave', 40)}
        unit="pts"
      />,
    );

    const { leftY, rightY } = plank(container);
    expect(leftY).toBeGreaterThan(rightY);
  });

  it('drops the other side when the numbers flip', () => {
    const { container } = render(
      <Seesaw
        left={one('DJM', 'DJ Moore', 40)}
        right={one('OLV', 'Chris Olave', 120)}
        unit="pts"
      />,
    );

    const { leftY, rightY } = plank(container);
    expect(rightY).toBeGreaterThan(leftY);
  });

  it('sits level before anyone has scored', () => {
    const { container } = render(
      <Seesaw left={one('DJM', 'DJ Moore', 0)} right={one('OLV', 'Chris Olave', 0)} unit="pts" />,
    );

    const { leftY, rightY } = plank(container);
    expect(leftY).toBe(rightY);
  });

  it('reads out both sides', () => {
    render(
      <Seesaw
        left={one('DJM', 'DJ Moore', 120)}
        right={one('OLV', 'Chris Olave', 40)}
        unit="pts"
      />,
    );

    expect(screen.getByText('DJ Moore')).toBeInTheDocument();
    expect(screen.getByText('120 pts')).toBeInTheDocument();
  });

  // "DJ Moore beats either AJ Brown or JSN" only has to clear the easier one.
  it('weighs the two-player side by its lower number', () => {
    const pair: SeesawSide = {
      players: [
        { abbr: 'AJB', name: 'AJ Brown', value: 150 },
        { abbr: 'JSN', name: 'JSN', value: 60 },
      ],
      reduce: 'min',
      note: 'lower of the two',
    };

    render(<Seesaw left={pair} right={one('DJM', 'DJ Moore', 100)} unit="pts" />);

    // JSN shows up twice: once on the avatar, once in the readout.
    expect(screen.getAllByText('JSN')).toHaveLength(2);
    expect(screen.getByText('60 pts')).toBeInTheDocument();
    expect(screen.queryByText('AJ Brown')).not.toBeInTheDocument();
    expect(screen.queryByText('150 pts')).not.toBeInTheDocument();
  });
});

describe('effective', () => {
  it('returns the only player when there is one', () => {
    expect(effective(one('DJM', 'DJ Moore', 10)).name).toBe('DJ Moore');
  });

  it('picks the lower of two when the bet only has to clear the easier one', () => {
    const side: SeesawSide = {
      players: [
        { abbr: 'A', name: 'A', value: 90 },
        { abbr: 'B', name: 'B', value: 30 },
      ],
      reduce: 'min',
    };
    expect(effective(side).name).toBe('B');
  });

  it('picks the higher otherwise', () => {
    const side: SeesawSide = {
      players: [
        { abbr: 'A', name: 'A', value: 90 },
        { abbr: 'B', name: 'B', value: 30 },
      ],
      reduce: 'max',
    };
    expect(effective(side).name).toBe('A');
  });
});
