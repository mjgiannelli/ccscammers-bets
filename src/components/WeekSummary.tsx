import { useEffect, useState } from 'react';

import type { Week } from '../bets/week';

const STORAGE_KEY = 'ccscammers:week-summary';

export function WeekSummary({ week }: { week: Week }) {
  const id = identify(week);
  const [collapsed, setCollapsed] = useState(() => readCollapsed(id));

  // A redeploy can swap the write-up under an open page. Re-reading on the id
  // reopens the section, same as a fresh visit would.
  useEffect(() => setCollapsed(readCollapsed(id)), [id]);

  if (week.summary.length === 0) return null;

  function toggle() {
    setCollapsed((wasCollapsed) => {
      const nowCollapsed = !wasCollapsed;
      writeCollapsed(id, nowCollapsed);
      return nowCollapsed;
    });
  }

  return (
    <section className="grid gap-3">
      <h2 className="text-base font-semibold">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls="week-summary"
          className="flex cursor-pointer items-center gap-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)"
        >
          Week {week.number} Summary
          <svg
            viewBox="0 0 16 16"
            className={`size-4 text-muted transition-transform ${collapsed ? '' : 'rotate-90'}`}
            aria-hidden="true"
          >
            <path
              d="M6 3.5 L11 8 L6 12.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h2>

      <div id="week-summary" className="card grid gap-3" hidden={collapsed}>
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

/**
 * Identifies this particular write-up, not just its week. Editing the text
 * counts as a new summary, so a correction reopens the section too.
 */
function identify(week: Week): string {
  let hash = 0;
  for (const character of week.summary.join('\u0000')) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return `${week.number}:${hash.toString(36)}`;
}

/**
 * Collapsing is remembered per write-up, so a new one arrives open however the
 * last one was left. Storage can be unavailable or hold nonsense, and neither
 * is worth breaking the page over — the section just opens.
 */
function readCollapsed(id: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const saved: unknown = JSON.parse(raw);
    return (
      typeof saved === 'object' &&
      saved !== null &&
      (saved as { id?: unknown }).id === id &&
      (saved as { collapsed?: unknown }).collapsed === true
    );
  } catch {
    return false;
  }
}

function writeCollapsed(id: string, collapsed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, collapsed }));
  } catch {
    // Private window, blocked site data. The toggle still works for this visit.
  }
}
