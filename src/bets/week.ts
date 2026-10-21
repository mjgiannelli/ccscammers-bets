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
  number: 6,
  summary: [
    'Gerry went past Mark and took two hundred dollars off him on the way. Gerry — the man this ' +
      'page has spent a fortnight describing as a cautionary tale — is now up $115 and sitting ' +
      'second. Mark is at -$120. The cautionary tale is beating the guy who commissions the ' +
      'cautionary tales.',

    'Mark wrote this website. He wrote the function that sorts the standings. He wrote the ' +
      'function that colours a number red. He maintains it every Monday, by hand, and this week ' +
      'he logged in to find he had built a machine whose sole remaining purpose is to tell four ' +
      'other men he is fourth out of five. A software developer spent forty hours engineering a ' +
      'dashboard to monitor four hundred dollars, and the dashboard works perfectly. That is the ' +
      'tragedy. It is doing exactly what he built it to do.',

    'He also asked, this week specifically, for the write-up to be meaner to him. He asked for ' +
      'that in the same seven days he dropped two hundred dollars, fell out of the money, and ' +
      'slipped behind Nubes. Nubes placed one bet in August and has not been seen since. No ' +
      'messages, no check-ins, no evidence he knows this website exists. He is ninety-five ' +
      'dollars better off than the man who built it. Mark, the single highest-value move ' +
      'available to you this season was doing nothing, and a guy who stopped replying beat you ' +
      'to it.',

    'His roster is a hospice. Jonathan Brooks: eight points, has not moved since September. Alec ' +
      'Pierce: fourteen points, has not moved since September. Pierce is somehow winning his ' +
      'bet, and only because the man opposite him is Josh Jacobs, who has been on the ' +
      "commissioner's exempt list since before week one and has not played a down all year. " +
      "Mark's entire winning position this season rests on one guy being inert and another guy " +
      'being unavailable for selection. Diggs at 72 is the only player on his team with a pulse.',

    'Gerry and Tim both originate mortgages, which means two of the four men on this board send ' +
      'unsolicited texts that open with "rates just moved — got 10 minutes?" Both own the same ' +
      'quarter-zip. Both have a headshot with the arms folded. Same job, same training, same ' +
      'professional obligation to look at numbers and detect a lie, and there is $215 between ' +
      'them. One of them is qualified to assess your risk profile and the other one has $25 on a ' +
      'man who is not currently permitted to earn an income. Shop accordingly.',

    'Credit to Gerry, and it is genuinely painful: Tuten cleared the pace line by thirty-four ' +
      'yards. 388 through six, projecting 1,099, and that hundred stays with him for another ' +
      'week. A month ago he was $285 in the hole. He is now in profit. The worst gambler in this ' +
      'group has had the single best fortnight in it, which should tell the rest of you ' +
      'something unpleasant about your own process.',

    'Jeudy got 69 yards this week and people are calling it a bounce-back. He is on 150. He ' +
      'projects to 425. Gerry needs 78 a game from here, from a man averaging twenty-five, who ' +
      'led the league in drops last season, whose team drafted two receivers to take his job, ' +
      'catching passes from Deshaun Watson. The ball on the other card says the outlook is not ' +
      'so good and it is being generous.',

    'Jeff is a Senior Vice President of Sales at JD Power. He works for the awards industry. His ' +
      'profession is the manufacture of first place — Highest Ranked In Initial Quality, ' +
      'Mid-Size Segment, a company that will invent a category so narrow that literally anyone ' +
      'can win it — and he cannot conjure one for himself out of a field of four. He scored 135 ' +
      'this week. It moved him nowhere. He is last, he is -$300, and he is the only man here who ' +
      'could have the trophy drawn up by Thursday.',

    'Tim is on 1,015 and up $330 and has not had to think about this league since September. He ' +
      'proposed most of these bets, wrote the lines himself, then took the side he fancied. That ' +
      'is not gambling, that is market making, and the rest of you walked into it holding your ' +
      'wallets open. His DJ Moore bet is still paying purely because AJ Brown got traded to New ' +
      'England and has 12 points in six games, which is not a slump, that is a welfare case.',

    'DJ Moore has been frozen on 45 for four straight weeks — shoulder, never quite ruled out, ' +
      'never quite plays — and he is load-bearing for four separate bets on this board. Four ' +
      'grown men have money riding on a receiver who has not done anything since September. ' +
      'Honestly, at this point he fits right in.',
  ],
};
