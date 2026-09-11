# ccscammers-bets

A monorepo for tracking bets: a **React + Tailwind** web client, a **NestJS** API, and
**RavenDB** for storage.

## Layout

```
apps/
  api/       NestJS 12 REST API (TypeScript, RavenDB document store)
  web/       React 19 + Vite + Tailwind CSS 4 client
packages/
  shared/    Types and contracts shared by both apps
```

`@ccscammers/shared` holds the wire contract (the `Bet` shape, request/response
types, and the payout maths). Both apps import it, so the client and server
cannot drift apart silently.

## Requirements

- **Node 22.12+** — the toolchain (NestJS 12's CLI, Vite 8, Vitest 5, the
  RavenDB client) requires it. `.nvmrc` pins the major; run `nvm use`.
- npm 10+ (ships with Node 22)
- Docker, for a local RavenDB server

## Getting started

```bash
nvm use
npm install
cp .env.example .env

npm run raven:up        # start RavenDB on http://localhost:8080
npm run dev             # API on :3000, web on :5173
```

`npm run dev` builds `@ccscammers/shared` first, then runs both apps together.

| URL                              | What                               |
| -------------------------------- | ---------------------------------- |
| http://localhost:5173            | Web client                         |
| http://localhost:3000/api        | API                                |
| http://localhost:3000/api/docs   | Swagger UI (non-production only)   |
| http://localhost:3000/api/health | Health check, including a DB probe |
| http://localhost:8080            | RavenDB Studio                     |

## Scripts

Run from the repo root; each also exists per workspace via `npm run <script> -w @ccscammers/api`.

| Script               | What it does                               |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Both apps in watch mode                    |
| `npm run build`      | Build shared, then the API and web bundles |
| `npm test`           | Vitest across all three workspaces         |
| `npm run typecheck`  | `tsc --noEmit` everywhere                  |
| `npm run lint`       | ESLint (flat config) over the monorepo     |
| `npm run format`     | Prettier write                             |
| `npm run raven:up`   | Start RavenDB in Docker                    |
| `npm run raven:down` | Stop it                                    |

## API

All routes are mounted under `/api`.

| Method   | Route              | Purpose                         |
| -------- | ------------------ | ------------------------------- |
| `POST`   | `/bets`            | Place a bet (starts `open`)     |
| `GET`    | `/bets`            | List bets, newest first, paged  |
| `GET`    | `/bets/:id`        | Fetch one bet                   |
| `PATCH`  | `/bets/:id`        | Edit an open bet                |
| `PATCH`  | `/bets/:id/settle` | Settle as `won`, `lost`, `void` |
| `DELETE` | `/bets/:id`        | Delete a bet                    |

Requests are validated by `class-validator` through a global `ValidationPipe`
with `whitelist` and `forbidNonWhitelisted` on, so unknown fields are rejected
rather than silently dropped.

A settled bet is immutable: editing or re-settling one returns `409 Conflict`.

Optimistic concurrency is enabled on the document store, so two clients racing
to settle the same bet do not silently overwrite each other — the loser gets a
`409` telling it to reload. Ids are also checked against the `Bets` collection
before use, since `session.load` in RavenDB is not collection-scoped.

## RavenDB notes

`RavenDbModule.forRoot()` owns a single `DocumentStore` for the process —
RavenDB's store is a heavy shared object, while sessions are the cheap
per-operation unit of work. `RavenDbService.openSession()` hands you one.

Entity classes are mapped to collections explicitly:

```ts
RavenDbModule.forRoot({
  entities: [{ entityType: BetDocument, collection: 'Bets' }],
});
```

Without that, RavenDB would derive the collection from the class name and put
`BetDocument` in a `BetDocuments` collection.

`RAVENDB_ENSURE_DATABASE=true` creates the database at boot if it is missing.
It defaults to on outside production and off in production, where databases
should be provisioned deliberately.

### Securing the connection

The Docker setup in `docker-compose.yml` runs **unsecured** and is for local
development only. Against a secured cluster, point the API at your client
certificate:

```bash
RAVENDB_URLS=https://a.your-cluster.ravendb.community
RAVENDB_CERT_PATH=/path/to/client.pfx
RAVENDB_CERT_PASSPHRASE=...
```

## Configuration

Every variable is documented in `.env.example`. The API reads `apps/api/.env`
first, then falls back to the repo-root `.env`; Vite reads the root `.env`
directly, so a single root file configures both apps.

Config is parsed and validated once at startup (`apps/api/src/config`), so a
malformed `PORT` or `NODE_ENV` fails the boot with a clear message instead of
surfacing later as a confusing runtime error.

## Styling

Tailwind CSS 4, wired in through `@tailwindcss/vite` — there is no
`tailwind.config.js`. The palette lives in an `@theme` block at the top of
`apps/web/src/styles.css`, which makes each token available as a utility
(`bg-surface`, `text-muted`, `border-edge`) alongside the built-ins.

The handful of combinations that repeat — `.card`, `.btn`, `.field-input` —
are defined once in `@layer components` rather than copied across files.
Everything else is utilities in the markup.

`prettier-plugin-tailwindcss` sorts class lists on format, so `npm run format`
keeps them in a canonical order and diffs stay readable.

## Testing

Vitest everywhere. The API uses `unplugin-swc` because Nest's dependency
injection relies on `emitDecoratorMetadata`, which esbuild does not emit.

`apps/api/src/app.module.spec.ts` compiles the whole dependency graph without
running lifecycle hooks, so the wiring is verified without needing a live
RavenDB server.

## License

MIT — see [LICENSE](LICENSE).
