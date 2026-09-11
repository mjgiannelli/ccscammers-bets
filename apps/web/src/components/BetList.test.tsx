import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { Bet } from '@ccscammers/shared';
import { describe, expect, it } from 'vitest';

import { BetList } from './BetList';

function makeBet(overrides: Partial<Bet> = {}): Bet {
  return {
    id: 'bets/abc',
    title: 'Chiefs cover',
    description: null,
    stake: 25,
    odds: 2,
    status: 'open',
    createdBy: 'mark',
    createdAt: '2026-01-01T00:00:00.000Z',
    settledAt: null,
    ...overrides,
  };
}

function renderList(bets: Bet[]) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <BetList bets={bets} />
    </QueryClientProvider>,
  );
}

describe('BetList', () => {
  it('prompts for a first bet when the list is empty', () => {
    renderList([]);

    expect(screen.getByText(/no bets yet/i)).toBeInTheDocument();
  });

  it('shows the potential return while a bet is still open', () => {
    renderList([makeBet()]);

    expect(screen.getByText('To return')).toBeInTheDocument();
    expect(screen.getByText('50.00')).toBeInTheDocument();
  });

  it('shows realised profit once the bet is won', () => {
    // Odds of 3 keep the P/L (50.00) distinct from the stake (25.00).
    renderList([makeBet({ odds: 3, status: 'won', settledAt: '2026-01-02T00:00:00.000Z' })]);

    expect(screen.getByText('P/L')).toBeInTheDocument();
    expect(screen.getByText('50.00')).toBeInTheDocument();
  });

  it('shows a loss as a negative amount', () => {
    renderList([makeBet({ status: 'lost', settledAt: '2026-01-02T00:00:00.000Z' })]);

    expect(screen.getByText('-25.00')).toBeInTheDocument();
  });

  it('hides settle actions for a bet that is already settled', () => {
    renderList([makeBet({ status: 'lost' })]);

    expect(screen.queryByRole('button', { name: 'Won' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});
