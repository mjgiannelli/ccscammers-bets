import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Lineup } from './Lineup';
import { lineupTotal, type LineupSide } from '../bets/types';

const CRUSH: LineupSide = {
  team: 'Northern Crush',
  manager: 'Gerry',
  players: [
    { slot: 'QB', name: 'Fernando Mendoza', points: 18.2 },
    { slot: 'RB', name: 'Ashton Jeanty', points: 11.4 },
  ],
};

const PHATTIES: LineupSide = {
  team: 'Florida Phatties',
  manager: 'Mark',
  players: [
    { slot: 'QB', name: 'Jared Goff', points: 9.1 },
    { slot: 'RB', name: 'Ollie Gordon II', points: 4.0 },
  ],
};

const rows = () => within(screen.getByRole('list')).getAllByRole('listitem');

describe('Lineup', () => {
  it('totals each side from its own players', () => {
    render(<Lineup left={CRUSH} right={PHATTIES} week={11} />);

    // 18.2 + 11.4 against 9.1 + 4.0.
    expect(screen.getByText('29.6')).toBeInTheDocument();
    expect(screen.getByText('13.1')).toBeInTheDocument();
  });

  it('pairs the two rosters slot by slot', () => {
    render(<Lineup left={CRUSH} right={PHATTIES} week={11} />);

    expect(rows()[0]).toHaveTextContent('Fernando Mendoza');
    expect(rows()[0]).toHaveTextContent('QB');
    expect(rows()[0]).toHaveTextContent('Jared Goff');
    expect(rows()[1]).toHaveTextContent('Ashton Jeanty');
  });

  // The totals have to sit in the same two columns as the player scores, which
  // is the whole reason this is one grid rather than a header plus a table.
  it('lays the header out on the same grid as the rows', () => {
    const { container } = render(<Lineup left={CRUSH} right={PHATTIES} week={11} />);

    const header = container.querySelector('.border-b')!;
    const columnsOf = (el: Element) =>
      [...el.classList].find((name) => name.startsWith('grid-cols-'));

    expect(columnsOf(header)).toBeDefined();
    expect(columnsOf(header)).toBe(columnsOf(rows()[0]));
  });

  it('greens the side that is ahead and leaves the other alone', () => {
    render(<Lineup left={CRUSH} right={PHATTIES} week={11} />);

    expect(screen.getByText('Northern Crush').className).toContain('text-win');
    expect(screen.getByText('Florida Phatties').className).not.toContain('text-win');
  });

  it('greens nobody before anyone has scored', () => {
    const zeroed = (side: LineupSide): LineupSide => ({
      ...side,
      players: side.players.map((p) => ({ ...p, points: 0 })),
    });

    render(<Lineup left={zeroed(CRUSH)} right={zeroed(PHATTIES)} week={11} />);

    expect(screen.getByText('Northern Crush').className).not.toContain('text-win');
    expect(screen.getByText('Florida Phatties').className).not.toContain('text-win');
  });

  it('survives rosters of different lengths', () => {
    const short: LineupSide = { ...PHATTIES, players: PHATTIES.players.slice(0, 1) };

    render(<Lineup left={CRUSH} right={short} week={11} />);

    expect(rows()).toHaveLength(2);
    expect(rows()[1]).toHaveTextContent('Ashton Jeanty');
  });
});

describe('lineupTotal', () => {
  it('adds a side up without floating-point dust', () => {
    expect(
      lineupTotal({
        ...CRUSH,
        players: [
          { slot: 'QB', name: 'a', points: 0.1 },
          { slot: 'RB', name: 'b', points: 0.2 },
        ],
      }),
    ).toBe(0.3);
  });

  it('is zero for an empty roster', () => {
    expect(lineupTotal({ ...CRUSH, players: [] })).toBe(0);
  });
});
