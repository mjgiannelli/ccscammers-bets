import type { Bet } from './types';

/**
 * Every bet from the Scammers 2026 group chat.
 *
 * This file is the whole database. To update after a week:
 *
 *   1. Update the numbers inside each `progress` block. Those drive the
 *      podium, the yard bars and the see-saws on the cards. Nothing is
 *      computed for you — type in the season totals as they stand.
 *   2. When a bet is decided, set its `result`:
 *        - Head-to-head: `'for'` if the title came true, `'against'` if not.
 *        - Pool: the winner's name, spelled exactly as it is in `players`.
 *        - Either: `'void'` if the bet is off and nobody pays.
 *      A bet is live while `result` is `null`.
 *
 * Names must match exactly across bets or the standings will count one person
 * twice. The roster is: Tim, Jeff, Gerry, Mark, Nubes.
 */
export const BETS: Bet[] = [
  {
    id: 'season-top-points',
    format: 'pool',
    title: 'Jeff vs Mark vs Gerry vs Tim',
    detail:
      'Most total points for the season. Everyone pays $100 to each person who ' +
      'finishes above them: first collects $300, last is out $300.',
    stake: 100,
    players: ['Jeff', 'Mark', 'Gerry', 'Tim'],
    result: null,
    progress: {
      kind: 'podium',
      unit: 'pts',
      players: [
        { abbr: 'J', name: 'Jeff', value: 15 },
        { abbr: 'M', name: 'Mark', value: 17 },
        { abbr: 'G', name: 'Gerry', value: 4 },
        { abbr: 'T', name: 'Tim', value: 18 },
      ],
    },
  },
  {
    id: 'jeudy-1000-receiving',
    format: 'headToHead',
    title: 'Jerry Jeudy hits 1,000 receiving yards',
    detail: 'Gerry has the over, Jeff has the under.',
    stake: 100,
    for: ['Gerry'],
    against: ['Jeff'],
    result: null,
    progress: {
      kind: 'bar',
      unit: 'rec yds',
      player: { abbr: 'JJ', name: 'Jerry Jeudy', value: 0 },
      target: 1000,
      direction: 'over',
    },
  },
  {
    id: 'tuten-1000-rushing',
    format: 'headToHead',
    title: 'Tuten hits 1,000 rushing yards',
    detail: 'Gerry says he gets there on the ground. Jeff says no chance.',
    stake: 100,
    for: ['Gerry'],
    against: ['Jeff'],
    result: null,
    progress: {
      kind: 'bar',
      unit: 'rush yds',
      player: { abbr: 'TU', name: 'Tuten', value: 0 },
      target: 1000,
      direction: 'over',
    },
  },
  {
    id: 'dj-moore-over-ajb-or-jsn',
    format: 'headToHead',
    title: 'DJ Moore outscores either AJ Brown or JSN',
    detail: 'Tim alone against four. He only needs to beat one of the two.',
    stake: 25,
    for: ['Tim'],
    against: ['Jeff', 'Mark', 'Nubes', 'Gerry'],
    result: null,
    progress: {
      kind: 'seesaw',
      unit: 'pts',
      // Only the lower of the two has to be cleared, so that is the one
      // actually holding down this end of the see-saw.
      left: {
        players: [
          { abbr: 'AJB', name: 'AJ Brown', value: 6 },
          { abbr: 'JSN', name: 'JSN', value: 33 },
        ],
        reduce: 'min',
        note: 'lower of the two',
      },
      right: { players: [{ abbr: 'DJM', name: 'DJ Moore', value: 0 }] },
    },
  },
  {
    id: 'dj-moore-over-olave',
    format: 'headToHead',
    title: 'DJ Moore outscores Chris Olave',
    detail: 'Season-long totals. $25 per person.',
    stake: 25,
    for: ['Tim'],
    against: ['Jeff', 'Gerry', 'Mark'],
    result: null,
    progress: {
      kind: 'seesaw',
      unit: 'pts',
      left: { players: [{ abbr: 'OLV', name: 'Chris Olave', value: 0 }] },
      right: { players: [{ abbr: 'DJM', name: 'DJ Moore', value: 0 }] },
    },
  },
  {
    id: 'brooks-over-dj-moore',
    format: 'headToHead',
    title: 'Jonathan Brooks outscores DJ Moore',
    detail: 'Mark has Brooks, Tim has DJ Moore.',
    stake: 25,
    for: ['Mark'],
    against: ['Tim'],
    result: null,
    progress: {
      kind: 'seesaw',
      unit: 'pts',
      left: { players: [{ abbr: 'DJM', name: 'DJ Moore', value: 0 }] },
      right: { players: [{ abbr: 'BRK', name: 'Jonathan Brooks', value: 0 }] },
    },
  },
  {
    id: 'dowdle-over-brooks',
    format: 'headToHead',
    title: 'Rico Dowdle outscores Jonathan Brooks',
    detail: 'Gerry has Dowdle, Mark has Brooks.',
    stake: 20,
    for: ['Gerry'],
    against: ['Mark'],
    result: null,
    progress: {
      kind: 'seesaw',
      unit: 'pts',
      left: { players: [{ abbr: 'BRK', name: 'Jonathan Brooks', value: 0 }] },
      right: { players: [{ abbr: 'DOW', name: 'Rico Dowdle', value: 0 }] },
    },
  },
  {
    id: 'diggs-over-dj-moore',
    format: 'headToHead',
    title: 'Diggs outscores DJ Moore',
    detail: 'Mark has Diggs, Tim has DJ Moore.',
    stake: 20,
    for: ['Mark'],
    against: ['Tim'],
    result: null,
    progress: {
      kind: 'seesaw',
      unit: 'pts',
      left: { players: [{ abbr: 'DJM', name: 'DJ Moore', value: 0 }] },
      right: { players: [{ abbr: 'DIG', name: 'Stefon Diggs', value: 0 }] },
    },
  },
  {
    id: 'watson-browns-qb1',
    format: 'headToHead',
    title: 'Deshaun Watson ends the season as the Browns starting QB',
    detail: 'Gerry says yes, Mark says no.',
    stake: 20,
    for: ['Gerry'],
    against: ['Mark'],
    result: null,
    progress: {
      kind: 'eightBall',
      question: 'Watson still QB1 in week 18?',
      // He has the job today. If he loses it, set `answer` to false and swap
      // the phrase to 'OUTLOOK NOT SO GOOD'.
      answer: true,
      phrase: 'ALL SIGNS POINT TO YES',
    },
  },
  {
    id: 'league-winner',
    format: 'headToHead',
    title: 'League winner pays the other $1,000',
    detail:
      'Jeff vs Tim. Outcome already determined by the Football Gods: ' +
      "both parties fucking suck and no way they're winning.",
    stake: 1000,
    for: ['Jeff'],
    against: ['Tim'],
    result: 'void',
  },
];
