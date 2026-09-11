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
            <th className="pb-2 text-right font-medium">At risk</th>
            <th className="pb-2 text-right font-medium">Net</th>
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
              <td className="py-2 text-right text-muted tabular-nums">
                {row.atRisk > 0 ? `$${row.atRisk.toLocaleString('en-US')}` : '—'}
              </td>
              <td className={`py-2 text-right font-medium tabular-nums ${netTone(row.net)}`}>
                {formatMoney(row.net)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!settled && (
        <p className="mt-3 text-sm text-muted">
          Nothing has settled yet, so everyone is even. "At risk" is what each person has riding on
          live bets.
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
