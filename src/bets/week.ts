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
    'Week 11 is in the ground. Washington beat Cincinnati 22-20 on a walk-off field goal, and ' +
      'the entire financial future of this group was decided by two wide receivers standing on ' +
      'opposite sidelines of the same stadium, both of them owned by Mark. Four days of ' +
      'football, nine hundred fantasy points, and it came down to whether a thirty-two-year-old ' +
      'in a losing mood could catch four balls.',

    'He could. Diggs went four for forty-five, no touchdown, and spent the broadcast looking ' +
      'like a man waiting on a refund. Nine points. That is all it took to go past DJ Moore ' +
      '128 to 120 and pull the twenty back off Tim, who had held the lead on that bet for ' +
      'eleven hours. Tim drops to +$330. The entire swing was one annoyed guy doing the ' +
      'absolute minimum, which should terrify everybody still holding a DJ Moore ticket.',

    'And it should, because DJ Moore has 120 points in eleven weeks. Not in a game. In a ' +
      'season. Tim has four separate bets resting on a receiver whose first year in Buffalo ' +
      'has been one long trip to the medical tent, and he is somehow still +$330, because the ' +
      'other four of you keep finding ways to lose money to each other instead. He is winning ' +
      'this thing by accident, like a guy who forgot he bought a lottery ticket.',

    'Mark won the head-to-head 171 to 127 and took ten dollars off Gerry for it. Gerry got ' +
      'forty-one points out of Ashton Jeanty and still lost by forty-four, which takes real ' +
      'commitment: Courtland Sutton nothing, Tank Dell six, Jonathan Taylor seven, Tre Tucker ' +
      'seven. That is not a lineup, that is a hostage situation. A man who prices mortgages for ' +
      'a living looked at those names on Sunday morning and thought yes, this is the ' +
      'competitive one. He is last at -$245.',

    'The funniest part of Mark’s week is the flex. Tee Higgins sat in that slot on zero ' +
      'points for ten straight weeks, played his first game of the season on Monday, and went ' +
      'two for forty-three with a touchdown — seventeen points, delivered into a matchup Mark ' +
      'had already won by twenty-seven. Elsewhere Alec Pierce is still on fourteen for the ' +
      'year, Brooks is on eight from a hospital bed, and Mark is up a grand total of forty ' +
      'dollars. Tuten is pacing 1,091 so Gerry keeps that hundred another week, and Jeudy needs ' +
      '718 yards in seven games having managed 282 in ten. Jeff said nothing all week, gained ' +
      'eighteen points Monday night, and is now forty-six behind Mark in the pool. Sales guys ' +
      'always close quiet.',
  ],
};
