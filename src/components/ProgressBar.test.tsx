import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressBar } from './ProgressBar';

const JEUDY = { abbr: 'JJ', name: 'Jerry Jeudy', value: 250 };

/** [actual, on-pace] — the card draws the real total first, the projection second. */
const bars = () => screen.getAllByRole('progressbar');
const width = (bar: HTMLElement) => (bar.firstElementChild as HTMLElement).style.width;

describe('ProgressBar', () => {
  it('fills to the share of the target and counts what is left', () => {
    render(<ProgressBar player={JEUDY} target={1000} unit="yds" gamesPlayed={4} />);

    expect(bars()[0]).toHaveAttribute('aria-valuenow', '250');
    expect(screen.getByText(/25% there/)).toBeInTheDocument();
    expect(screen.getByText(/750 to go/)).toBeInTheDocument();
  });

  it('caps the fill once the target is passed', () => {
    render(
      <ProgressBar
        player={{ abbr: 'TU', name: 'Tuten', value: 1400 }}
        target={1000}
        unit="yds"
        gamesPlayed={4}
      />,
    );

    expect(width(bars()[0])).toBe('100%');
    expect(screen.queryByText(/to go/)).not.toBeInTheDocument();
    expect(screen.getByText(/already there/)).toBeInTheDocument();
  });

  describe('the pace bar', () => {
    // 250 in 4 games is 62.5 a game, which over 17 rounds to 1,063.
    it('projects the full season from the games played so far', () => {
      render(<ProgressBar player={JEUDY} target={1000} unit="yds" gamesPlayed={4} />);

      expect(screen.getByText('1,063 yds')).toBeInTheDocument();
      expect(bars()[1]).toHaveAttribute('aria-valuenow', '1063');
    });

    // Same yards, more games gone: the same total is now a worse pace.
    it('falls as the season runs out', () => {
      render(<ProgressBar player={JEUDY} target={1000} unit="yds" gamesPlayed={10} />);

      expect(screen.getByText('425 yds')).toBeInTheDocument();
    });

    it('says what is needed per game from here', () => {
      render(<ProgressBar player={JEUDY} target={1000} unit="yds" gamesPlayed={4} />);

      // 750 left across the 13 games still to play.
      expect(screen.getByText(/needs 58 yds a game from here/)).toBeInTheDocument();
      expect(screen.getByText(/4 games in/)).toBeInTheDocument();
    });

    it('is left out before anyone has played', () => {
      render(
        <ProgressBar player={{ ...JEUDY, value: 0 }} target={1000} unit="yds" gamesPlayed={0} />,
      );

      expect(bars()).toHaveLength(1);
      expect(screen.queryByText(/On pace for/)).not.toBeInTheDocument();
    });

    it('survives a season that is already over', () => {
      render(
        <ProgressBar player={JEUDY} target={1000} unit="yds" gamesPlayed={17} seasonGames={17} />,
      );

      expect(screen.getByText('250 yds')).toBeInTheDocument();
      expect(screen.queryByText(/a game from here/)).not.toBeInTheDocument();
    });
  });
});
