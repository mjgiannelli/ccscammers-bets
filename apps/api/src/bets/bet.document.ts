import type { Bet, BetStatus } from '@ccscammers/shared';

export const BETS_COLLECTION = 'Bets';

/** RavenDB stamps every document's collection into its metadata under this key. */
export const COLLECTION_METADATA_KEY = '@collection';

/** Document id prefix; RavenDB ids are `<collection-prefix>/<key>`. */
export const BET_ID_PREFIX = 'bets';

/**
 * The shape persisted in RavenDB. It is deliberately a class: RavenDB uses the
 * constructor to pick a collection and to rehydrate documents on load.
 *
 * `id` is assigned by the session on store, so it is optional here.
 */
export class BetDocument {
  id?: string;
  title!: string;
  description!: string | null;
  stake!: number;
  odds!: number;
  status!: BetStatus;
  createdBy!: string;
  createdAt!: string;
  settledAt!: string | null;
}

export function toBetId(key: string): string {
  return `${BET_ID_PREFIX}/${key}`;
}

/** Maps a stored document onto the wire contract shared with the web client. */
export function toBet(document: BetDocument): Bet {
  if (!document.id) {
    throw new Error('Cannot map a bet document that has not been assigned an id.');
  }

  return {
    id: document.id,
    title: document.title,
    description: document.description,
    stake: document.stake,
    odds: document.odds,
    status: document.status,
    createdBy: document.createdBy,
    createdAt: document.createdAt,
    settledAt: document.settledAt,
  };
}
