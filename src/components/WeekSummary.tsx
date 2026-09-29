import type { Week } from '../bets/week';

export function WeekSummary({ week }: { week: Week }) {
  if (week.summary.length === 0) return null;

  return (
    <section className="grid gap-3">
      <h2 className="text-base font-semibold">Week {week.number} Summary</h2>

      <div className="card grid gap-3">
        {week.summary.map((paragraph, index) => (
          <p
            key={paragraph.slice(0, 40)}
            // The opening line carries the week, so it gets to be louder.
            className={index === 0 ? 'text-sm text-body' : 'text-sm text-muted'}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
