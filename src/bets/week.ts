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
  number: 5,
  summary: [
    'Mark went past Gerry by nineteen fucking points and took two hundred dollars off him doing ' +
      'it. 786 to 772. That is the margin — less than one decent afternoon from a tight end — ' +
      'and it is the difference between collecting a hundred and writing one. Mark is in the ' +
      'black at $80 for the first time all year. Gerry is at -$85 and would be buried next to ' +
      'Jeff if Tuten were not single-handedly keeping him alive.',

    'Jeff scored 178 this week. More than Tim. More than anyone. Best week any of you has had ' +
      'all season — and he is dead last in the pool, twenty-five points off third, AND the worst ' +
      'man on the board at -$300. He outscored every single person here and went backwards for ' +
      'it, because Tuten crossing into on-pace territory took another hundred off him on the way ' +
      'past. Tim put up 177 for the second week running, sits on 852, and has not had to think ' +
      'about this league since September.',

    'Now Gerry. Sit down for this one. Josh Jacobs has not scored a point because Josh Jacobs ' +
      "has not played a down — he has been on the commissioner's exempt list since before the " +
      'season started and has not been on a football field all year. Gerry put $25 on a man who ' +
      'is not employed in the sport at the moment. Alec Pierce has 14 points and has barely got ' +
      'out of bed since September, and he is still winning that bet by fourteen, because ' +
      'fourteen is a larger number than nothing. Five minutes of reading. That is all it would ' +
      'have taken.',

    'It gets worse, because Gerry also has $100 on Jerry Jeudy reaching a thousand yards. Jeudy ' +
      'has 81. He led the entire NFL in drops last season with a catch rate under 50%, the ' +
      'Browns spent two high picks on receivers specifically to get him off the field, and the ' +
      'man throwing him the ball is Deshaun Watson. Gerry needs 77 yards a game from a guy ' +
      'averaging sixteen, who cannot catch, in an offense that scored ten points in week one. ' +
      'Projecting 275 on the season. Set the hundred on fire instead — at least you get warm.',

    'And the beautiful part, the genuinely perfect part, is that Gerry is simultaneously winning ' +
      'money on Watson keeping his job. So his Jeudy bet needs Watson to be good and his Watson ' +
      'bet needs Watson to merely still be breathing on the roster while Shedeur Sanders stands ' +
      'behind him holding a clipboard and a stopwatch. Gerry has built a portfolio that pays him ' +
      'for mediocrity and punishes him for anything better. Genius.',

    'Credit where it is due, and it physically hurts to type this: Tuten is actually good, and ' +
      'as of this week he is projected to win Gerry that bet. 349 through five, on pace for ' +
      '1,187, needs 55 a game and has been clearing it comfortably. Etienne left for New ' +
      'Orleans, Tuten took the job, and every projection in the league had him down for 756. ' +
      'Gerry found the one correct opinion he will have all season, it is worth a hundred ' +
      'dollars, and it is the only thing standing between him and the bottom of this page.',

    'DJ Moore scored nothing this week, which is not even his fault — AC joint sprain in week ' +
      'two, aggravated it against New England, did not practice at all, and Keon Coleman is ' +
      'quietly eating his lunch in Buffalo. He is frozen on 45 while Olave ran off to 113, so ' +
      "Tim is deeper in the hole on that one. Tim's saving grace is AJ Brown, who got shipped to " +
      'New England and has produced 6 points, which is not a slump, that is a missing persons ' +
      'case. Tim is collecting $100 purely because somebody else is worse at this than he is.',

    'Elsewhere: Brooks has not moved off 8 points in three weeks and should probably be checked ' +
      'for a pulse. Dowdle is on 12 and winning a bet, which says more about Brooks than Dowdle. ' +
      'And Nubes has one single bet on this entire board, is losing it, has not been heard from ' +
      'in weeks, and is somehow still only down $25 — which makes him the smartest man here by a ' +
      'distance none of you want to think about.',
  ],
};
