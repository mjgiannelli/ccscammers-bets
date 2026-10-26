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
  number: 7,
  summary: [
    'Mark scored 205 this week, the most on the board, and finished it in last place. -$170 — ' +
      'below Jeff, below Nubes, below a man who has not opened this website since August. He ' +
      'also wrote the sorting function that ranked him there.',

    'The Jacobs bet is why. This page noted last week that his position depended on a man being ' +
      'unavailable to play. Jacobs was cleared on the 19th, played Detroit on the 25th, and put ' +
      'up 24 in an afternoon — more than Alec Pierce has managed since September. The plan ' +
      'lasted exactly as long as the circumstances did.',

    'Gerry collected $25 off that and lost four times as much the same weekend. Tuten did not ' +
      'gain a yard. The season moved on without him, 1,099 became 942, and the hundred Gerry had ' +
      'been carrying went under the line with it. He was in profit seven days ago. He is at -$35 ' +
      'now, having watched a man do nothing.',

    'Jeudy reached 171 and projects 415. Gerry needs 83 a game from here. There is nothing more ' +
      'to say about it that the number does not already say.',

    'Tim: 1,214, +$330, has not moved in a month. Jeff: 173 points and the same fourth place he ' +
      'has held all season, now passed from below by Mark, which is the closest thing to a ' +
      'promotion he has had all year.',
  ],
};
