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
    'Mark is fourteen points ahead of Gerry — 786 to 772 — and that fourteen points is worth two ' +
      'hundred dollars, because it is the gap between collecting a hundred and writing one. One ' +
      'bad Sunday from a tight end either way. Both of these men are going to be awake at 11pm ' +
      'on a Monday watching a kick return they cannot influence, and both of them know it.',

    'Jeff is a Senior Vice President of Sales at JD Power. His entire industry exists to tell ' +
      'people who finished first. He has finished fourth. Out of four. The man has spent a career ' +
      'manufacturing trophies for Highest Ranked In Initial Quality, Mid-Size Segment, Under ' +
      'Forty Thousand Dollars — a company that will find a category for literally anybody — and ' +
      'cannot engineer one for himself out of a field of three other guys. He is $300 down. ' +
      'Highest ranked in nothing.',

    'And he scored 178 this week, more than anybody on the board. Best football of his life. ' +
      'Finished last, lost another hundred when Tuten crossed into on-pace, and went backwards ' +
      'on the week. Jeff sells people an award for being good at something. He cannot buy one.',

    'Gerry originates mortgages. Forty hours a week deciding whether a stranger is good for the ' +
      'money — income verification, employment history, the whole ritual. He then put $25 on ' +
      "Josh Jacobs, who has been on the commissioner's exempt list since before week one and has " +
      'not been on a football field all season. No employment. No income. Gerry did not check. ' +
      'Alec Pierce is beating him fourteen to nothing and Alec Pierce has not got out of bed ' +
      'since September.',

    'He also has $100 on Jerry Jeudy reaching a thousand yards. Jeudy has 81. He led the entire ' +
      'NFL in drops last season with a catch rate under 50%, Cleveland used two picks on ' +
      'receivers specifically to take his job, and the man throwing to him is Deshaun Watson. ' +
      'Gerry needs 77 yards a game from a guy averaging sixteen who cannot catch. A professional ' +
      'risk assessor looked at that and said yes. Twice, if you count that he also has money on ' +
      'Watson keeping the job — so one bet needs Watson to be good and the other needs him to ' +
      'merely still be breathing. Gerry has built a portfolio that pays him for mediocrity and ' +
      'punishes anything better. In his defence, it is the only thing he has done all year that ' +
      'is internally consistent.',

    'Tim does the exact same job as Gerry. Same industry, same training, same professional ' +
      'obligation to look at a set of numbers and work out whether they are lying to you. Tim is ' +
      'up $330. Gerry is down $85 and owns a running back who is contractually unable to run. If ' +
      'you are shopping for a loan in this town, that is the single most useful piece of ' +
      'information in this entire write-up.',

    'Though let us be honest about how Tim got there. He proposed half these bets. He wrote the ' +
      'lines and then took the side he liked, which is not gambling, that is market making. His ' +
      'one big winner is DJ Moore over AJ Brown, and that is only still a winner because Brown ' +
      'got shipped to New England and has produced 6 points, which is not a slump, that is a ' +
      'missing persons case. Moore meanwhile has not scored since week two — AC joint sprain, ' +
      'did not practice, Keon Coleman quietly eating his lunch in Buffalo — and Olave ran off to ' +
      '113 while he sat there. Tim is collecting a hundred dollars purely because somebody else ' +
      'is worse at this than he is. That is the whole strategy and it is working.',

    'Mark is a software developer who built an entire web application to track nine bets worth ' +
      'about four hundred dollars. Standings. Projections. A magic 8-ball. He has shipped more ' +
      'code this season than Jonathan Brooks has scored points, which sounds impressive until ' +
      'you learn Brooks has eight and has not moved in a month. Mark also controls what this ' +
      'page says about everyone. Mark is in second place and has written himself the shortest ' +
      'paragraph. Draw your own conclusions.',

    'Credit where it is owed, grudgingly: Tuten is on pace for 1,187 and is now projected to win ' +
      'Gerry that hundred. Etienne left for New Orleans, Tuten took the job, every projection in ' +
      'the league had him at 756. It is the one correct read Gerry will have all season and it ' +
      'is the only thing between him and the bottom of this page.',

    'And Nubes has one bet. One. On a board with nine of them. He is losing it, has not been ' +
      'heard from in a month, and is down $25 — less than everyone except Tim and Mark. He has ' +
      'achieved almost nothing and it has cost him almost nothing. Statistically he is playing ' +
      'this better than three of you.',
  ],
};
