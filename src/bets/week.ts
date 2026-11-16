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
  number: 10,
  summary: [
    'Gerry scored 125 in the week the other three all cleared 185, and it has cost him ' +
      'everything. Second to last in the pool, which is a four hundred dollar swing on that bet ' +
      'by itself, and +$165 to -$235 overall. A fortnight ago he was the comeback story of the ' +
      'season. He is now further behind than anybody has been all year.',

    'Mark is in profit. +$30, second in the pool, ahead of Gerry for the first time since week ' +
      'six. He managed it by scoring 189, which this week was only good enough for third best, ' +
      'and by standing still while somebody else fell past him.',

    'Jeff put up 225, the most on the board, and for the first time all season it actually moved ' +
      'him. Three separate weeks he has topped the scoring and finished exactly where he ' +
      'started. This time he is third and -$100, though it should be said the climb was less ' +
      'about Jeff rising than Gerry dropping through him on the way down.',

    'Josh Jacobs has stopped on 49 — fractured a finger against New England in week nine, sat ' +
      'out Minnesota. He is winning Gerry that bet by thirty-five points while not playing, ' +
      'which is thirty-five more than Alec Pierce has managed since September.',

    'Jeudy had the best week of his season, 74 yards, up to 282 — and still projects 479, which ' +
      'tells you everything about the other nine. Tuten added 88, back up to 1,150, cushion ' +
      "restored. That hundred is now the only thing on this entire board going Gerry's way.",
  ],
};
