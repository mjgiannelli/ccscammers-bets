import type { Bet } from './types';

/**
 * Every bet from the Scammers 2026 group chat.
 *
 * This file is the whole database. To update after a week:
 *
 *   - A bet is live while `result` is `null`.
 *   - Head-to-head: set `result` to `'for'` if the title came true, or
 *     `'against'` if it did not.
 *   - Pool: set `result` to the winner's name, exactly as it is spelled in
 *     `players`.
 *   - Either kind: set `result` to `'void'` if the bet is off. Nobody pays.
 *
 * Names must match exactly across bets or the standings will count one person
 * twice. The roster is: Tim Huie, Jeff Stafford, Uncle Gerry, Mark, Nubes.
 */
export const BETS: Bet[] = [
  {
    id: 'season-top-points',
    format: 'pool',
    title: 'Most total points for the season',
    detail: 'Winner collects $100 from each of the other three.',
    stake: 100,
    players: ['Jeff Stafford', 'Mark', 'Uncle Gerry', 'Tim Huie'],
    result: null,
  },
  {
    id: 'jeudy-under-1000',
    format: 'headToHead',
    title: 'Jerry Jeudy finishes under 1,000 receiving yards',
    detail: 'Gerry has the under, Stafford has the over.',
    stake: 100,
    for: ['Uncle Gerry'],
    against: ['Jeff Stafford'],
    result: null,
  },
  {
    id: 'tuten-1000-rushing',
    format: 'headToHead',
    title: 'Tuten hits 1,000 rushing yards',
    detail: 'Gerry says he gets there on the ground. Stafford says no chance.',
    stake: 100,
    for: ['Uncle Gerry'],
    against: ['Jeff Stafford'],
    result: null,
  },
  {
    id: 'dj-moore-over-ajb-or-jsn',
    format: 'headToHead',
    title: 'DJ Moore outscores either AJ Brown or JSN',
    detail: 'Tim alone against four. He only needs to beat one of the two.',
    stake: 20,
    for: ['Tim Huie'],
    against: ['Jeff Stafford', 'Mark', 'Nubes', 'Uncle Gerry'],
    result: null,
  },
  {
    id: 'dj-moore-over-olave',
    format: 'headToHead',
    title: 'DJ Moore outscores Chris Olave',
    detail: 'Season-long totals. $25 per person.',
    stake: 25,
    for: ['Tim Huie'],
    against: ['Jeff Stafford', 'Uncle Gerry', 'Mark'],
    result: null,
  },
  {
    id: 'brooks-over-dj-moore',
    format: 'headToHead',
    title: 'Jonathan Brooks outscores DJ Moore',
    detail: 'Mark has Brooks, Tim has DJ Moore.',
    stake: 25,
    for: ['Mark'],
    against: ['Tim Huie'],
    result: null,
  },
  {
    id: 'dowdle-over-brooks',
    format: 'headToHead',
    title: 'Rico Dowdle outscores Jonathan Brooks',
    detail: 'Gerry has Dowdle, Mark has Brooks.',
    stake: 20,
    for: ['Uncle Gerry'],
    against: ['Mark'],
    result: null,
  },
  {
    id: 'diggs-over-dj-moore',
    format: 'headToHead',
    title: 'Diggs outscores DJ Moore',
    detail: 'Mark has Diggs, Tim has DJ Moore.',
    stake: 20,
    for: ['Mark'],
    against: ['Tim Huie'],
    result: null,
  },
  {
    id: 'league-winner',
    format: 'headToHead',
    title: 'League winner pays the other $1,000',
    detail:
      'Stafford vs Huie. Outcome already determined by the commissioner: ' +
      'both parties collect exactly $0.00.',
    stake: 1000,
    for: ['Jeff Stafford'],
    against: ['Tim Huie'],
    result: 'void',
  },
];
