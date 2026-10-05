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
  number: 4,
  summary: [
    'Nothing happened. Not one bet on this entire board changed hands. Everybody sits exactly ' +
      'where they sat last week, which after a full slate of football is its own kind of ' +
      'embarrassing. Tim is still up $330 and did not have to do anything for it.',

    'The pool is the one place anyone moved. Tim put up 177 and pulled away to 675, Gerry is on ' +
      '630, Mark 617, and Jeff is still scraping along the bottom at 523, paying $300 a week for ' +
      'the pleasure. The gap between second and third is thirteen points. Gerry and Mark are ' +
      'going to be checking this page at 11pm on a Sunday for the rest of the season and they ' +
      'both know it.',

    'Actual news: Tuten is on pace. 277 yards through four, which projects out to 1,177 — over ' +
      'the thousand with room to spare. Gerry has the over on that one, so for the first time in ' +
      'a month something he touched is not on fire. Enjoy it.',

    'Because Jeudy is still a disaster. 62 yards. Sixty-two. That projects to 263 on the season, ' +
      'barely a quarter of what Gerry needs, and he now has to average 73 a game the rest of the ' +
      'way to get there. He is averaging fifteen and a half.',

    'Josh Jacobs has still not scored a point. Four weeks. Zero. Alec Pierce has 14 and has not ' +
      'done anything either, which tells you exactly how low the bar was. AJ Brown is sat on 6 ' +
      'and JSN has 144, so Tim keeps the $100 for the DJ Moore bet essentially by default.',

    'Diggs went to 55 and Moore to 45, which keeps Mark alive on that one. Brooks is still on 8 ' +
      'and has not moved in three weeks. Watson is still the starting quarterback in Cleveland, ' +
      'the ball still thinks he is cooked, and Nubes still has exactly one bet and is still ' +
      'losing it. Same as it ever was.',
  ],
};
