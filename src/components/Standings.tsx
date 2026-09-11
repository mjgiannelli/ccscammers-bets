import { formatMoney, type Standing } from '../bets/ledger';

export function Standings({ rows }: { rows: Standing[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted">No bets on the board yet.</p>;
  }

  const settled = rows.some((row) => row.won > 0 || row.lost > 0);

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[0.7rem] tracking-wide text-muted uppercase">
            <th className="pb-2 font-medium">Who</th>
            <th className="pb-2 text-right font-medium">Record</th>
            <th className="pb-2 text-right font-medium">
              <span className="block">Potential</span>
              <span className="block">payout</span>
            </th>
            <th className="pb-2 text-right font-medium">
              <span className="block">Live</span>
              <span className="block">payout</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-edge">
              <td className="py-2 font-medium">{row.name}</td>
              <td className="py-2 text-right text-muted tabular-nums">
                {row.won}-{row.lost}
                {row.open > 0 && <span className="ml-1">({row.open} live)</span>}
              </td>
              {/* What is still on the table to win stays muted; only where the
                  money actually sits today gets a colour. */}
              <td className="py-2 text-right text-muted tabular-nums">
                {row.open > 0 ? `+$${row.potential.toLocaleString('en-US')}` : '—'}
              </td>
              <td className={`py-2 text-right font-medium tabular-nums ${netTone(row.live)}`}>
                {formatMoney(row.live)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!settled && (
        <p className="mt-3 text-sm text-muted">
          Nothing has settled yet. "Potential payout" is the most the season can still pay someone;
          "live payout" is where they would land if it stopped today.
        </p>
      )}
    </div>
  );
}

function netTone(net: number): string {
  if (net > 0) return 'text-win';
  if (net < 0) return 'text-loss';
  return 'text-muted';
}
