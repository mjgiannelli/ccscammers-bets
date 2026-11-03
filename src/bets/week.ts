/**
 * The week's write-up, shown above the standings.
 *
 * Rewrite this every week along with the numbers in `data.ts`. One string per
 * paragraph. Nothing here is computed — say whatever you want, as coarsely as
 * the group deserves.
 */
export interface Week {
  number: number;
  summary: string[];
}

export const WEEK: Week = {
  number: 8,
  summary: [
    'A full week of football and not a single one of these ten bets changed hands. Same money, ' +
      'same order, same five men. Everyone played, nobody moved.',

    'Jeff scored 214, the most on the board, and remains -$300 and last. That is twice now he ' +
      'has topped the scoring and gained nothing from it. He is reliably the best player here ' +
      'for seven days at a time and reliably the poorest for the other twenty-four weeks, which ' +
      'is a genuinely difficult thing to arrange.',

    'The pool is suddenly a race. Gerry is 27 points behind Tim — 1,350 to 1,377 — after Tim has ' +
      'spent two months not having to look at it. One of those men has been coasting since ' +
      'September and the other has been quietly closing, and the $400 between first and last ' +
      'suddenly has a question attached to it.',

    'DJ Moore finally scored. Shoulder since the Detroit game in week two, re-aggravated it ' +
      'against New England, sat out week six, had the bye to recover, and came back against ' +
      'Baltimore — 45 up to 64. It changed absolutely nothing. All four of his bets were decided ' +
      'weeks before he made it back onto a field. A man returns from a two-month injury, ' +
      'contributes, and the board does not so much as blink.',

    'Tuten put up 104 and projects 1,195, the safest Gerry has felt about anything all year. ' +
      'Jeudy caught nothing. Not a quiet afternoon — zero receptions, zero yards, in a 6-27 ' +
      'defeat at Pittsburgh. He is on sixteen catches and no touchdowns through eight games, so ' +
      'Gerry has a hundred dollars on a thousand-yard season from a man who has not reached an ' +
      'end zone all year. 171 yards. Projecting 363.',
  ],
};
