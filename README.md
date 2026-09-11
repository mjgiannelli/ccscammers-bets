# ccscammers-bets

A static scoreboard for the Scammers 2026 fantasy football side bets: who bet
what, and who is up or down money.

There is no backend and no database. Every bet lives in one file, you edit it
when results come in, and you redeploy.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts: `npm test`, `npm run lint`, `npm run build`.

Node 22.12+ (see `.nvmrc`).

## Updating after a week

Everything lives in [`src/bets/data.ts`](src/bets/data.ts).

### 1. Type in the new numbers

Each bet has a `progress` block holding the season totals it draws. Update the
`value` fields and the card redraws itself — nothing is calculated for you.

| `kind`   | Drawn as                                                               | What to update       |
| -------- | ---------------------------------------------------------------------- | -------------------- |
| `podium` | Ranked steps with an avatar per person, taller step for a bigger score | `value` per player   |
| `bar`    | Horizontal fill toward a yardage threshold                             | the player's `value` |
| `seesaw` | A plank that tips toward whoever is ahead                              | `value` on each side |

A see-saw side can hold two players with `reduce: 'min'`. That is for the
"DJ Moore beats _either_ AJ Brown or JSN" bet, where only the lower of the two
has to be cleared — whichever that currently is shows on the avatar.

### 2. Settle anything that finished

Every bet has a `result` field:

| Bet          | Set `result` to | Meaning                                       |
| ------------ | --------------- | --------------------------------------------- |
| Head-to-head | `null`          | Still live                                    |
|              | `'for'`         | The title came true — the `for` side collects |
|              | `'against'`     | It did not — the `against` side collects      |
| Pool         | `null`          | Still live                                    |
|              | a player's name | That player takes the pot                     |
| Either       | `'void'`        | Bet is off, nobody pays                       |

Adding a bet means appending an object to the `BETS` array. Names must be
spelled identically everywhere or the standings will count someone twice — the
roster is Tim, Jeff, Gerry, Mark, and Nubes.

Then commit and push; the deploy picks it up.

## What the cards show

Each card lists everyone with money on the bet and what they are up or down —
green if they collect, red if they pay. A settled bet says `Final`. A live one
says `If it ended now` and projects from the current numbers, so it moves as
you type new values in.

The standings table at the top carries the same idea: "potential payout" is
the most a person's _live_ bets could still pay them, so a bet drops out of it
once it settles, and "live payout" is their whole position — settled money plus
where the open bets currently stand.

## How the money works

A head-to-head bet settles pairwise against each opponent. One person alone
against four has four separate bets running: they collect four stakes if they
are right, and pay four if they are wrong, while each opponent is only ever in
for one.

A pool is a ladder, not winner-take-all. Everyone pays the stake to each
person who finishes above them and collects it from each person below, so four
players at $100 finish **+$300, +$100, -$100, -$300**. Last place pays all
three; third pays the two above and collects from the one below, netting -$100.
The rungs are symmetric about the middle, which is what makes them sum to
zero.

Either way the standings balance to zero across the group, which
[`src/bets/ledger.test.ts`](src/bets/ledger.test.ts) checks against the real
data.

## Deploying

The build is a plain static site in `dist/`.

- **Vercel** — import the repo. It detects Vite; no configuration needed.
- **Netlify** — `netlify.toml` already sets the build command, publish
  directory, and SPA redirect.

## Layout

```
src/
  bets/
    data.ts        the bets and their numbers — the file you edit week to week
    types.ts       bet shapes, per-person upside/downside, progress shapes
    ledger.ts      standings, live projections, and the pool ladder
  components/
    Standings.tsx  the money table
    BetCard.tsx    one bet, and which progress view it gets
    Podium.tsx     ranked steps for the season-points pool
    ProgressBar.tsx  yardage toward a threshold
    Seesaw.tsx     two players weighed against each other
  App.tsx          standings, filters, bet list
```
