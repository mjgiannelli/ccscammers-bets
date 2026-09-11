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

Edit [`src/bets/data.ts`](src/bets/data.ts). Every bet has a `result` field:

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
roster is Tim Huie, Jeff Stafford, Uncle Gerry, Mark, and Nubes.

Then commit and push; the deploy picks it up.

## How the money works

A head-to-head bet settles pairwise against each opponent. One person alone
against four has four separate bets running: they collect four stakes if they
are right, and pay four if they are wrong, while each opponent is only ever in
for one.

A pool is different. Everyone puts in the stake and a single winner takes the
lot, so the winner collects from everyone else but each loser is only down
their own stake.

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
    data.ts      the bets — the only file you edit week to week
    types.ts     bet shapes and per-person upside/downside
    ledger.ts    standings: who is up, who is down, what is at risk
  components/    Standings table and BetCard
  App.tsx        standings, filters, bet list
```
