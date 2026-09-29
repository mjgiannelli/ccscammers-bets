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
  number: 3,
  summary: [
    "Tim's sitting on 498 with Gerry nine fucking points behind him, which means Gerry gets to " +
      'spend the entire week refreshing this page like a lunatic instead of enjoying his Sunday. ' +
      "Mark's at 455 and lurking. Jeff is at 387 and currently paying every other man at the " +
      'table $300 for the privilege of being here.',

    'Gerry took the over on Jeudy hitting 1,000 yards. Jeudy has 26. Twenty. Six. Three weeks in ' +
      "and the man is 974 short — he'd need about 70 a game the rest of the way, which would be a " +
      'career year for someone currently out-gained by most punters. Gerry has the Tuten over ' +
      'too. Tuten is on 204, which sounds almost respectable until you do the other half of the ' +
      'arithmetic and find 796 yards still missing.',

    'Sticking with Gerry, because it keeps getting worse: Josh Jacobs has scored zero points. Not ' +
      'a low number. Zero. Alec Pierce is beating him 14 to nothing, and that is $25 Gerry is ' +
      'handing over purely for the crime of trusting a running back.',

    "Tim's DJ Moore bet is the easiest $100 anybody has made this season, mostly because AJ Brown " +
      'has 6 points and appears to have quietly retired without telling his owner. Moore put up ' +
      '42 and handled it. Then Moore walked straight into Olave at 81, so Tim is down $75 there ' +
      "and can wipe that grin off. Nobody's clean.",

    'Two flipped this week. Dowdle finally out-ran Brooks, who is frozen on 8 points and may ' +
      'legally be deceased, which hands that one to Gerry — the only good news he has had all ' +
      "month. And Diggs' 46 went past Moore, so Mark claws his $20 back.",

    'Deshaun Watson is somehow still the starting quarterback of the Cleveland Browns, which is ' +
      "good for Gerry's wallet and terrible for everyone's eyes. Meanwhile Nubes has exactly one " +
      'bet on this entire board and is losing it. Commit to the bit or get the hell off the page.',
  ],
};
