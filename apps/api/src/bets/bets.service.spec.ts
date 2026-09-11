import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RavenDbService } from '../ravendb/ravendb.service';
import { BetDocument } from './bet.document';
import { BetsService } from './bets.service';
import type { CreateBetDto } from './dto';

/** A chainable stand-in for RavenDB's fluent query builder. */
function createQueryStub(results: BetDocument[], totalResults = results.length) {
  const query = {
    statistics: vi.fn((cb: (stats: { totalResults: number }) => void) => {
      cb({ totalResults });
      return query;
    }),
    whereEquals: vi.fn(() => query),
    orderByDescending: vi.fn(() => query),
    skip: vi.fn(() => query),
    take: vi.fn(() => query),
    all: vi.fn(async () => results),
  };
  return query;
}

function createSessionStub(
  loaded: BetDocument | null = null,
  queryResults: BetDocument[] = [],
  collection = 'Bets',
) {
  return {
    store: vi.fn(async (document: BetDocument, id: string) => {
      document.id = id;
    }),
    load: vi.fn(async () => loaded),
    delete: vi.fn(async () => undefined),
    saveChanges: vi.fn(async () => undefined),
    query: vi.fn(() => createQueryStub(queryResults)),
    advanced: { getMetadataFor: vi.fn(() => ({ '@collection': collection })) },
  };
}

async function createService(session: ReturnType<typeof createSessionStub>) {
  const moduleRef = await Test.createTestingModule({
    providers: [BetsService, { provide: RavenDbService, useValue: { openSession: () => session } }],
  }).compile();

  return moduleRef.get(BetsService);
}

function makeDocument(overrides: Partial<BetDocument> = {}): BetDocument {
  return Object.assign(
    new BetDocument(),
    {
      id: 'bets/abc',
      title: 'Chiefs cover',
      description: null,
      stake: 25,
      odds: 1.91,
      status: 'open',
      createdBy: 'mark',
      createdAt: '2026-01-01T00:00:00.000Z',
      settledAt: null,
    } satisfies BetDocument,
    overrides,
  );
}

const createDto: CreateBetDto = {
  title: 'Chiefs cover',
  stake: 25,
  odds: 1.91,
  createdBy: 'mark',
};

describe('BetsService', () => {
  let session: ReturnType<typeof createSessionStub>;

  beforeEach(() => {
    session = createSessionStub();
  });

  describe('create', () => {
    it('opens the bet and assigns a prefixed document id', async () => {
      const service = await createService(session);

      const bet = await service.create(createDto);

      expect(bet.id).toMatch(/^bets\//);
      expect(bet.status).toBe('open');
      expect(bet.settledAt).toBeNull();
      expect(bet.description).toBeNull();
      expect(session.saveChanges).toHaveBeenCalledOnce();
    });
  });

  describe('findAll', () => {
    it('reports the server-side total rather than the page length', async () => {
      const paged = createSessionStub(null, [makeDocument()]);
      const queryStub = createQueryStub([makeDocument()], 42);
      paged.query = vi.fn(() => queryStub);
      const service = await createService(paged);

      const result = await service.findAll({ skip: 0, take: 1 });

      expect(result.total).toBe(42);
      expect(result.items).toHaveLength(1);
      expect(queryStub.whereEquals).not.toHaveBeenCalled();
    });

    it('filters by status when one is supplied', async () => {
      const queryStub = createQueryStub([]);
      session.query = vi.fn(() => queryStub);
      const service = await createService(session);

      await service.findAll({ status: 'won' });

      expect(queryStub.whereEquals).toHaveBeenCalledWith('status', 'won');
    });
  });

  describe('settle', () => {
    it('records the terminal status and the settlement time', async () => {
      const withOpenBet = createSessionStub(makeDocument());
      const service = await createService(withOpenBet);

      const bet = await service.settle('bets/abc', { status: 'won' });

      expect(bet.status).toBe('won');
      expect(bet.settledAt).not.toBeNull();
      expect(withOpenBet.saveChanges).toHaveBeenCalledOnce();
    });

    it('refuses to settle a bet twice', async () => {
      const settled = createSessionStub(makeDocument({ status: 'lost' }));
      const service = await createService(settled);

      await expect(service.settle('bets/abc', { status: 'won' })).rejects.toThrow(
        ConflictException,
      );
      expect(settled.saveChanges).not.toHaveBeenCalled();
    });

    it('404s for an unknown bet', async () => {
      const service = await createService(session);

      await expect(service.settle('bets/missing', { status: 'won' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('applies only the supplied fields', async () => {
      const withOpenBet = createSessionStub(makeDocument());
      const service = await createService(withOpenBet);

      const bet = await service.update('bets/abc', { stake: 50 });

      expect(bet.stake).toBe(50);
      expect(bet.odds).toBe(1.91);
      expect(bet.title).toBe('Chiefs cover');
    });

    it('refuses to edit a settled bet', async () => {
      const settled = createSessionStub(makeDocument({ status: 'won' }));
      const service = await createService(settled);

      await expect(service.update('bets/abc', { stake: 50 })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('404s when the bet does not exist', async () => {
      const service = await createService(session);

      await expect(service.remove('bets/missing')).rejects.toThrow(NotFoundException);
      expect(session.delete).not.toHaveBeenCalled();
    });
  });

  describe('collection scoping', () => {
    // `session.load` is not collection-scoped, so an id from another collection
    // would otherwise be returned as if it were a bet.
    const foreign = () => createSessionStub(makeDocument(), [], 'Users');

    it('404s when the id belongs to another collection', async () => {
      const service = await createService(foreign());

      await expect(service.findOne('users/1')).rejects.toThrow(NotFoundException);
    });

    it('refuses to delete a document outside the Bets collection', async () => {
      const session = foreign();
      const service = await createService(session);

      await expect(service.remove('users/1')).rejects.toThrow(NotFoundException);
      expect(session.delete).not.toHaveBeenCalled();
    });
  });

  describe('concurrent writers', () => {
    function concurrencyFailure() {
      const error = new Error('Optimistic concurrency violation.');
      error.name = 'ConcurrencyException';
      return error;
    }

    it('turns a lost update into a 409 rather than clobbering', async () => {
      const racing = createSessionStub(makeDocument());
      racing.saveChanges = vi.fn(async () => {
        throw concurrencyFailure();
      });
      const service = await createService(racing);

      await expect(service.settle('bets/abc', { status: 'won' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('lets unrelated failures propagate untouched', async () => {
      const broken = createSessionStub(makeDocument());
      broken.saveChanges = vi.fn(async () => {
        throw new Error('disk on fire');
      });
      const service = await createService(broken);

      await expect(service.update('bets/abc', { stake: 5 })).rejects.toThrow('disk on fire');
    });
  });
});
