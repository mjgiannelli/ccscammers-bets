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
  number: 11,
  summary: [
    'One point. DJ Moore 120, Diggs 119. That is the whole margin on a bet that had been ' +
      "Mark's since September, and it has gone the other way — twenty dollars to Tim, who " +
      'earned it by owning the man who bothered to turn up.',

    "So here is Mark's week in full. He beat Gerry 154 to 127 in the head-to-head and took ten " +
      'dollars off him. He lost twenty on a single point of Stefon Diggs. He finished on exactly ' +
      'zero. Not up, not down, nothing. He won a matchup by twenty-seven points and the board ' +
      'handed him back precisely what he started with.',

    'Tim is on +$370, the most anyone has had all season, and he scored 186 to go with it. The ' +
      "bet that swung him the twenty did so because somebody else's receiver had a quiet " +
      'afternoon. He has not made a decision since August and he is further ahead than ever.',

    'Four of the frozen numbers have an alibi — Jacobs, JSN, AJ Brown and Jeudy were all on bye. ' +
      'Alec Pierce does not. Indianapolis played, Pierce played, Pierce scored nothing, and he ' +
      'is still sitting on the fourteen points he had in September. Brooks is on eight and has ' +
      'been on injured reserve since the twenty-third of that month, which at this stage is the ' +
      'more dignified way to contribute nothing.',

    'Tuten is on 642 across ten games, projecting 1,091, and Gerry keeps the hundred for another ' +
      'week — the only bet on this board that has gone his way since October. Jeudy had the ' +
      'week off and stayed on 282. He has seven games left to find 718 yards, or 103 a game, ' +
      'having managed twenty-eight.',
  ],
};
