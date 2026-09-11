import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { potentialReturn, type CreateBetInput } from '@ccscammers/shared';

import { betKeys, createBet } from '../api/bets';

const EMPTY_FORM = { title: '', description: '', stake: '', odds: '', createdBy: '' };

type FormState = typeof EMPTY_FORM;

export function BetForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateBetInput) => createBet(input),
    onSuccess: async () => {
      setForm(EMPTY_FORM);
      await queryClient.invalidateQueries({ queryKey: betKeys.all });
    },
  });

  const stake = Number(form.stake);
  const odds = Number(form.odds);
  const preview = stake > 0 && odds > 1 ? potentialReturn({ stake, odds }) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({
      title: form.title.trim(),
      description: form.description.trim() || null,
      stake,
      odds,
      createdBy: form.createdBy.trim(),
    });
  }

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form className="card grid gap-3" onSubmit={handleSubmit}>
      <h2 className="text-base font-semibold">Place a bet</h2>

      <label className="field-label">
        Title
        <input
          required
          maxLength={200}
          className="field-input"
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
          placeholder="Chiefs cover the spread"
        />
      </label>

      <label className="field-label">
        Notes
        <textarea
          rows={2}
          maxLength={2000}
          className="field-input resize-y"
          value={form.description}
          onChange={(event) => update('description', event.target.value)}
          placeholder="Divisional round, -3.5"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="field-label">
          Stake
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            className="field-input"
            value={form.stake}
            onChange={(event) => update('stake', event.target.value)}
          />
        </label>

        <label className="field-label">
          Odds (decimal)
          <input
            required
            type="number"
            min="1.0001"
            step="0.01"
            className="field-input"
            value={form.odds}
            onChange={(event) => update('odds', event.target.value)}
          />
        </label>

        <label className="field-label">
          Who
          <input
            required
            maxLength={100}
            className="field-input"
            value={form.createdBy}
            onChange={(event) => update('createdBy', event.target.value)}
            placeholder="mark"
          />
        </label>
      </div>

      {preview !== null && (
        <p className="text-sm text-muted">
          Returns <strong className="text-body tabular-nums">{preview.toFixed(2)}</strong> if it
          wins.
        </p>
      )}

      {mutation.isError && <p className="text-sm text-loss">{mutation.error.message}</p>}

      <button type="submit" className="btn justify-self-start" disabled={mutation.isPending}>
        {mutation.isPending ? 'Placing…' : 'Place bet'}
      </button>
    </form>
  );
}
