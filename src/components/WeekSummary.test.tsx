import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WeekSummary } from './WeekSummary';
import { WEEK } from '../bets/week';

describe('WeekSummary', () => {
  it('heads the section with the week number', () => {
    render(<WeekSummary week={{ number: 7, summary: ['Everyone is bad at this.'] }} />);

    expect(screen.getByRole('heading', { name: 'Week 7 Summary' })).toBeInTheDocument();
    expect(screen.getByText('Everyone is bad at this.')).toBeInTheDocument();
  });

  it('renders a paragraph per entry', () => {
    const { container } = render(
      <WeekSummary week={{ number: 1, summary: ['One.', 'Two.', 'Three.'] }} />,
    );

    expect(container.querySelectorAll('p')).toHaveLength(3);
  });

  // A week nobody has written up yet should not leave an empty card sitting
  // above the standings.
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
