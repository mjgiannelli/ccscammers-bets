import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WeekSummary } from './WeekSummary';
import { WEEK, type Week } from '../bets/week';

const STORAGE_KEY = 'ccscammers:week-summary';

const WEEK_THREE: Week = { number: 3, summary: ['Gerry is having a rough one.', 'So is Jeff.'] };
const WEEK_FOUR: Week = { number: 4, summary: ['A fresh set of humiliations.'] };

const toggle = () => screen.getByRole('button', { name: /Week \d+ Summary/ });
const body = () => document.getElementById('week-summary');

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('WeekSummary', () => {
  it('heads the section with the week number', () => {
    render(<WeekSummary week={WEEK_THREE} />);

    expect(screen.getByRole('heading', { name: /Week 3 Summary/ })).toBeInTheDocument();
    expect(screen.getByText('Gerry is having a rough one.')).toBeInTheDocument();
  });

  it('renders a paragraph per entry', () => {
    render(<WeekSummary week={WEEK_THREE} />);

    expect(body()?.querySelectorAll('p')).toHaveLength(2);
  });

  it('opens expanded when nothing has been remembered', () => {
    render(<WeekSummary week={WEEK_THREE} />);

    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    expect(body()).toBeVisible();
  });

  it('collapses and expands on click', async () => {
    render(<WeekSummary week={WEEK_THREE} />);

    await userEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    expect(body()).not.toBeVisible();

    await userEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    expect(body()).toBeVisible();
  });

  it('remembers a collapsed section across visits', async () => {
    const first = render(<WeekSummary week={WEEK_THREE} />);
    await userEvent.click(toggle());
    first.unmount();

    render(<WeekSummary week={WEEK_THREE} />);
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
  });

  // The whole point: a new write-up must not stay hidden behind last week's
  // click.
  it('reopens for a new week even if the last one was collapsed', async () => {
    const first = render(<WeekSummary week={WEEK_THREE} />);
    await userEvent.click(toggle());
    first.unmount();

    render(<WeekSummary week={WEEK_FOUR} />);
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  it('reopens when the same week is rewritten', async () => {
    const first = render(<WeekSummary week={WEEK_THREE} />);
    await userEvent.click(toggle());
    first.unmount();

    render(<WeekSummary week={{ ...WEEK_THREE, summary: ['Actually, Gerry is fine.'] }} />);
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  it('reopens without a reload when the write-up swaps under an open page', async () => {
    const view = render(<WeekSummary week={WEEK_THREE} />);
    await userEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');

    view.rerender(<WeekSummary week={WEEK_FOUR} />);
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
  });

  describe('when storage is unavailable', () => {
    it('still renders, expanded', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
      });

      render(<WeekSummary week={WEEK_THREE} />);
      expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    });

    it('still toggles', async () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked');
      });

      render(<WeekSummary week={WEEK_THREE} />);
      await userEvent.click(toggle());

      expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    });

    it('ignores junk left in storage', () => {
      localStorage.setItem(STORAGE_KEY, 'not json');

      render(<WeekSummary week={WEEK_THREE} />);
      expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('renders nothing at all when there is no write-up', () => {
    const { container } = render(<WeekSummary week={{ number: 2, summary: [] }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the write-up that is actually checked in', () => {
    render(<WeekSummary week={WEEK} />);

    expect(
      screen.getByRole('heading', { name: `Week ${WEEK.number} Summary` }),
    ).toBeInTheDocument();
    expect(screen.getByText(WEEK.summary[0])).toBeInTheDocument();
  });
});
