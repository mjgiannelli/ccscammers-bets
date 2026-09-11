import { randomUUID } from 'node:crypto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { IDocumentSession, QueryStatistics } from 'ravendb';
import type { Bet, BetListResponse } from '@ccscammers/shared';

import { RavenDbService } from '../ravendb/ravendb.service';
import {
  BETS_COLLECTION,
  BetDocument,
  COLLECTION_METADATA_KEY,
  toBet,
  toBetId,
} from './bet.document';
import type { CreateBetDto, ListBetsQueryDto, SettleBetDto, UpdateBetDto } from './dto';
import { DEFAULT_PAGE_SIZE } from './dto';

@Injectable()
export class BetsService {
  constructor(private readonly ravendb: RavenDbService) {}

  async create(input: CreateBetDto): Promise<Bet> {
    const session = this.ravendb.openSession();

    const document = new BetDocument();
    document.title = input.title;
    document.description = input.description ?? null;
    document.stake = input.stake;
    document.odds = input.odds;
    document.status = 'open';
    document.createdBy = input.createdBy;
    document.createdAt = new Date().toISOString();
    document.settledAt = null;

    await session.store(document, toBetId(randomUUID()));
    await session.saveChanges();

    return toBet(document);
  }

  async findAll(query: ListBetsQueryDto): Promise<BetListResponse> {
    const skip = query.skip ?? 0;
    const take = query.take ?? DEFAULT_PAGE_SIZE;
    const session = this.ravendb.openSession();

    let statistics: QueryStatistics | undefined;
    let documentQuery = session
      .query<BetDocument>({ collection: BETS_COLLECTION })
      .statistics((stats) => {
        statistics = stats;
      });

    if (query.status) {
      documentQuery = documentQuery.whereEquals('status', query.status);
    }

    const items = await documentQuery.orderByDescending('createdAt').skip(skip).take(take).all();

    return {
      items: items.map(toBet),
      // `statistics` is populated as a side effect once the query executes above.
      total: statistics?.totalResults ?? items.length,
      skip,
      take,
    };
  }

  async findOne(id: string): Promise<Bet> {
    const session = this.ravendb.openSession();
    return toBet(await this.loadBet(session, id));
  }

  async update(id: string, input: UpdateBetDto): Promise<Bet> {
    const session = this.ravendb.openSession();
    const document = await this.loadBet(session, id);

    if (document.status !== 'open') {
      throw new ConflictException(`Bet "${id}" is already settled and can no longer be edited.`);
    }

    if (input.title !== undefined) document.title = input.title;
    if (input.description !== undefined) document.description = input.description ?? null;
    if (input.stake !== undefined) document.stake = input.stake;
    if (input.odds !== undefined) document.odds = input.odds;

    await this.save(session, id);
    return toBet(document);
  }

  async settle(id: string, input: SettleBetDto): Promise<Bet> {
    const session = this.ravendb.openSession();
    const document = await this.loadBet(session, id);

    if (document.status !== 'open') {
      throw new ConflictException(`Bet "${id}" was already settled as "${document.status}".`);
    }

    document.status = input.status;
    document.settledAt = new Date().toISOString();

    await this.save(session, id);
    return toBet(document);
  }

  async remove(id: string): Promise<void> {
    const session = this.ravendb.openSession();
    await this.loadBet(session, id);

    await session.delete(id);
    await this.save(session, id);
  }

  /**
   * `session.load` is not collection-scoped, so a caller could otherwise pass
   * any document id in the database and have it mapped as if it were a bet.
   */
  private async loadBet(session: IDocumentSession, id: string): Promise<BetDocument> {
    const document = await session.load<BetDocument>(id);

    if (!document || !isInBetsCollection(session, document)) {
      throw new NotFoundException(`Bet "${id}" was not found.`);
    }
    return document;
  }

  /**
   * Optimistic concurrency is on, so a racing writer turns into a
   * `ConcurrencyException` here rather than a silently lost update.
   */
  private async save(session: IDocumentSession, id: string): Promise<void> {
    try {
      await session.saveChanges();
    } catch (error) {
      if (error instanceof Error && error.name === 'ConcurrencyException') {
        throw new ConflictException(
          `Bet "${id}" was modified by someone else. Reload it and try again.`,
        );
      }
      throw error;
    }
  }
}

function isInBetsCollection(session: IDocumentSession, document: BetDocument): boolean {
  return session.advanced.getMetadataFor(document)[COLLECTION_METADATA_KEY] === BETS_COLLECTION;
}
