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
    'Mark went past Gerry and the whole board moved with him. Nineteen points is all it was — ' +
      '745 to 726 — and it swings two hundred dollars, because second place collects a hundred ' +
      'and third place hands one over. Mark is in the black at $80 for the first time all ' +
      'season. Gerry is at -$285, which is not just last, it is further back than everyone else ' +
      'combined.',

    'Now the genuinely insulting part. Jeff put up 178 points this week, more than anybody — ' +
      'more than Tim, more than the guy who just leapfrogged into second — and he is still dead ' +
      'last. Twenty-five points off third. Best week of his life and he is still writing the ' +
      'same $300 cheque. Tim, meanwhile, put up 177 for the second week running, has 852, and ' +
      'at this point is just filling in time.',

    'Tuten remains the one thing Gerry owns that works. 349 yards through five, on pace for ' +
      '1,187, needs 55 a game and has been clearing that comfortably. Hold that thought.',

    'Because Jeudy has 81 yards. Five weeks. Eighty-one. That projects to 275 and he now needs ' +
      '77 a game for the rest of the season to get to a thousand, which is roughly five times ' +
      'what he has managed so far. Gerry has $100 on that and should consider setting it on fire ' +
      'instead, for the warmth.',

    'DJ Moore scored nothing this week. Not a low number — nothing. Still on 45, same as last ' +
      'week, while Olave jumped to 113 and dragged Tim another step into the hole on that one. ' +
      'The only reason Moore is not costing Tim more is that AJ Brown is somehow still on 6 ' +
      'points, so that $100 keeps paying out purely because the alternative is worse.',

    'Josh Jacobs has now gone five full weeks without scoring a single point, which at this ' +
      'stage is less a slump than a lifestyle. Alec Pierce has not scored since September either ' +
      'and is still winning that bet 14 to nothing. Brooks is frozen on 8. Watson is still the ' +
      'starting quarterback in Cleveland and the ball still does not believe in him. And Nubes ' +
      'has one bet, is losing it, and has not been heard from since.',
  ],
};
