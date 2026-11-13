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
  number: 9,
  summary: [
    'Thirteen points separate Mark from Gerry — 1,467 to 1,454 — and that thirteen is worth two ' +
      'hundred dollars, because it is the line between second and third. Mark scored 172 this ' +
      'week, most on the board, and pulled 55 points back. He is still third. He is still -$170.',

    'Which brings us to Jonathan Brooks, who has eight points, and has had eight points since ' +
      'September, because Carolina put him on injured reserve on the 23rd after core muscle ' +
      'surgery and he has not taken a snap since. Mark holds two separate bets that require ' +
      'Brooks to outscore somebody. A fortnight ago this page noted he had built a position on a ' +
      'man who was not available to play. He did it twice, in the same season, and the second ' +
      'one has been in a hospital gown for seven weeks.',

    'Tuten gained 29 yards and his projection slid from 1,195 to 1,107. Still clear, still ' +
      "Gerry's hundred, but the line he has to beat climbs every Sunday whether he turns up or " +
      'not, and he has had one real week in the last three. That cushion was 195 yards. It is ' +
      'now 107.',

    'Jeudy caught something, which this season counts as news. Thirty-seven yards, up to 208, ' +
      'projecting 393. To get home he needs 792 yards from eight games — 99 a game, from a man ' +
      'averaging twenty-three. That is not a bounce-back, that is a different player wearing the ' +
      'same shirt.',

    'Nothing changed hands. Second week running. Tim sits on +$330 and has not had to think ' +
      'about this league since September, while Jeff has outscored him in three of the last five ' +
      'weeks and is still -$300. The board has stopped moving, and the only live question left ' +
      'on it is whether Mark can find thirteen points.',
  ],
};
