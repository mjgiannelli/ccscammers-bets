import { DocumentConventions } from 'ravendb';
import { describe, expect, it } from 'vitest';

import { BETS_COLLECTION, BetDocument } from '../bets/bet.document';
import { applyConventions } from './ravendb.service';

class UnregisteredDocument {}

describe('applyConventions', () => {
  it('maps a registered entity onto its chosen collection', () => {
    const conventions = new DocumentConventions();

    applyConventions(conventions, [{ entityType: BetDocument, collection: BETS_COLLECTION }]);

    expect(conventions.findCollectionName(BetDocument)).toBe('Bets');
  });

  it('opts into optimistic concurrency so racing writes cannot silently clobber', () => {
    const conventions = new DocumentConventions();
    expect(conventions.useOptimisticConcurrency).toBe(false);

    applyConventions(conventions, []);

    expect(conventions.useOptimisticConcurrency).toBe(true);
  });

  it('falls back to RavenDB pluralisation for unregistered entities', () => {
    const conventions = new DocumentConventions();

    applyConventions(conventions, []);

    expect(conventions.findCollectionName(UnregisteredDocument)).toBe(
      DocumentConventions.defaultGetCollectionName(UnregisteredDocument),
    );
  });
});
