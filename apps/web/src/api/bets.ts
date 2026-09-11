import type {
  Bet,
  BetListResponse,
  BetStatus,
  CreateBetInput,
  SettledBetStatus,
  UpdateBetInput,
} from '@ccscammers/shared';

import { apiFetch } from './client';

export interface ListBetsParams {
  status?: BetStatus;
  skip?: number;
  take?: number;
}

export const betKeys = {
  all: ['bets'] as const,
  list: (params: ListBetsParams) => ['bets', 'list', params] as const,
  detail: (id: string) => ['bets', 'detail', id] as const,
};

export function listBets(params: ListBetsParams, signal?: AbortSignal): Promise<BetListResponse> {
  const search = new URLSearchParams();
  if (params.status) search.set('status', params.status);
  if (params.skip !== undefined) search.set('skip', String(params.skip));
  if (params.take !== undefined) search.set('take', String(params.take));

  const query = search.toString();
  return apiFetch<BetListResponse>(`/bets${query ? `?${query}` : ''}`, { signal });
}

export function getBet(id: string, signal?: AbortSignal): Promise<Bet> {
  return apiFetch<Bet>(`/bets/${encodeURIComponent(id)}`, { signal });
}

export function createBet(input: CreateBetInput): Promise<Bet> {
  return apiFetch<Bet>('/bets', { method: 'POST', body: input });
}

export function updateBet(id: string, input: UpdateBetInput): Promise<Bet> {
  return apiFetch<Bet>(`/bets/${encodeURIComponent(id)}`, { method: 'PATCH', body: input });
}

export function settleBet(id: string, status: SettledBetStatus): Promise<Bet> {
  return apiFetch<Bet>(`/bets/${encodeURIComponent(id)}/settle`, {
    method: 'PATCH',
    body: { status },
  });
}

export function deleteBet(id: string): Promise<void> {
  return apiFetch<void>(`/bets/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
