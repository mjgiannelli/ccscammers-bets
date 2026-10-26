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
    'Mark scored 205 this week. Most on the board. More than Tim, more than Gerry, more than ' +
      'anybody. He is now in last place. Not last in the pool — last on the money, -$170, below ' +
      'Jeff, below Nubes, below a man who has not opened this website since August. Mark had the ' +
      'best week of anybody here and it dropped him to the bottom of his own leaderboard. He ' +
      'wrote the sorting function that put him there.',

    'Here is how. Last week this page observed that his entire winning position rested on one ' +
      'guy being inert and another guy being unavailable for selection. Seven days later Josh ' +
      'Jacobs got cleared, played at Detroit, and put up 24 points in a single afternoon — more ' +
      'than Alec Pierce has managed since September. Mark was beating a man who was not allowed ' +
      'on the field, and the second that stopped being true, so did the bet. That is not bad ' +
      'luck. That was the whole plan and everybody could see it.',

    'Gerry had the opposite week and still found a way to bleed. Jacobs coming back hands him ' +
      '$25. Then Tuten gained nothing at all — not a yard, not a carry worth reporting — and ' +
      'because the season moved on without him, his projection fell from 1,099 to 942 and ' +
      'dropped under the line. That is a hundred dollars gone on a week where his guy did not ' +
      'so much as show up. Gerry goes from +$115 to -$35. The man sells mortgages. He should ' +
      'know better than anyone what happens when you stop making payments.',

    'Jeudy is on 171 after seven games. 171. He projects 415 against a thousand. Gerry needs 83 ' +
      'a game from him for the rest of the season, from a receiver averaging twenty-four, who ' +
      'led the league in drops last year, whose team spent two picks on his replacement, ' +
      'catching from Deshaun Watson. The eight-ball on the next card says the outlook is not so ' +
      'good. The eight-ball is an optimist.',

    'Tim is on 1,214 and has not moved off $330 in a month. Not because he is doing anything — ' +
      'because every bet he is in has been decided since September and he picked the right side ' +
      'of all of them in August. He wrote most of these lines himself, then took the side he ' +
      'liked, and the rest of you signed up. Mortgage originator by trade. He has spent his ' +
      "career on the correct end of other people's optimism and he is not going to stop now.",

    'Jeff put up 173 and stayed exactly where he was, which is becoming his signature move. ' +
      'Senior Vice President of Sales at JD Power — a company whose entire output is a trophy ' +
      'with a category invented around whoever bought one — and the man finishes fourth in a ' +
      'field of four, week after week, like a metronome. Mark overtook him going downwards, ' +
      'which is the only promotion Jeff has had all year.',

    'DJ Moore has now been frozen on 45 points for five consecutive weeks. The shoulder. Never ' +
      'ruled out, never actually plays, turns up on the injury report every Friday like a ghost ' +
      'with a season ticket. Four separate bets on this board depend on him and he has not ' +
      'contributed a thing to any of them since September. Jonathan Brooks is on 8 and has not ' +
      'moved since the first month. Alec Pierce is on 14 and has not moved since the first ' +
      'month. Between the three of them that is roughly $90 of live action riding on men who ' +
      'have functionally retired.',

    'And Nubes is still sitting on one bet, down $25, having not said a word since August — ' +
      'which this week makes him the second-best performer in the entire league. Four men are ' +
      'actively managing their positions and three of them are losing to a guy who stopped ' +
      'participating. Think about that one for a while.',
  ],
};
