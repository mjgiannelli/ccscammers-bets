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
    'Mark scored 205 this week, the most on the board, and dropped to -$170 for it. Fourth of ' +
      'five. He also wrote the sorting function that ranked him there.',

    'The Jacobs bet is why. This page noted last week that his position depended on a man being ' +
      'unavailable to play. Jacobs was cleared on the 19th, played Detroit on the 25th, and put ' +
      'up 24 in an afternoon — more than Alec Pierce has managed since September. The plan ' +
      'lasted exactly as long as the circumstances did.',

    'Gerry should have lost a hundred and did not. Tuten gained nothing at all, which read like ' +
      'a collapse until somebody checked the schedule: Jacksonville were on bye. He did not have ' +
      'a bad week, he had no week. The pace holds, the hundred stays, and Gerry is up to $165 — ' +
      'the only man in profit here besides Tim, which nobody saw coming a fortnight ago.',

    'Jeudy reached 171 and projects 415. Gerry needs 83 a game from here. There is nothing more ' +
      'to say about it that the number does not already say.',

    'Tim: 1,214, +$330, has not moved in a month. Jeff: 173 points, -$300, and last — the only ' +
      'position he has managed to hold all season.',
  ],
};
