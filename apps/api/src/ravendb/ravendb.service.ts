import { readFileSync } from 'node:fs';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateDatabaseOperation,
  DocumentConventions,
  DocumentStore,
  GetDatabaseNamesOperation,
  type IAuthOptions,
  type IDocumentSession,
  type IDocumentStore,
  type ObjectTypeDescriptor,
} from 'ravendb';

import { CONFIG_NAMESPACE, type AppConfig, type RavenDbConfig } from '../config/configuration';
import { RAVENDB_ENTITIES } from './ravendb.constants';
import type { EntityRegistration } from './ravendb.types';

/**
 * Owns the single `DocumentStore` for the process. RavenDB's store is a heavy,
 * shareable object meant to be created once; sessions are the cheap,
 * short-lived unit of work opened per operation.
 */
@Injectable()
export class RavenDbService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(RavenDbService.name);
  private readonly config: RavenDbConfig;
  private documentStore: IDocumentStore | null = null;

  constructor(
    configService: ConfigService<{ [CONFIG_NAMESPACE]: AppConfig }, true>,
    @Inject(RAVENDB_ENTITIES) private readonly entities: readonly EntityRegistration[],
  ) {
    this.config = configService.getOrThrow(`${CONFIG_NAMESPACE}.ravendb`, { infer: true });
  }

  /** Safe to read before the store connects — it comes from config, not the store. */
  get databaseName(): string {
    return this.config.database;
  }

  get store(): IDocumentStore {
    if (!this.documentStore) {
      throw new ServiceUnavailableException('RavenDB store has not been initialised yet.');
    }
    return this.documentStore;
  }

  /** Opens a fresh unit of work. Sessions are not safe to share between requests. */
  openSession(): IDocumentSession {
    return this.store.openSession();
  }

  async onModuleInit(): Promise<void> {
    const { urls, database, ensureDatabase } = this.config;

    const authOptions = this.buildAuthOptions();
    const store = authOptions
      ? new DocumentStore(urls, database, authOptions)
      : new DocumentStore(urls, database);

    applyConventions(store.conventions, this.entities);
    store.initialize();
    this.documentStore = store;

    if (ensureDatabase) {
      try {
        await this.ensureDatabaseExists(store, database);
      } catch (error) {
        store.dispose();
        this.documentStore = null;
        throw new Error(
          `Could not reach RavenDB at ${urls.join(', ')}. Is the server running? ` +
            'Start one locally with `npm run raven:up`. ' +
            `Underlying error: ${error instanceof Error ? error.message : String(error)}`,
          { cause: error },
        );
      }
    }

    this.logger.log(`Connected to RavenDB database "${database}" at ${urls.join(', ')}.`);
  }

  onApplicationShutdown(): void {
    this.documentStore?.dispose();
    this.documentStore = null;
  }

  /**
   * Creates the database on first boot so a fresh checkout works against an
   * empty server. Off by default in production, where databases should be
   * provisioned deliberately.
   */
  private async ensureDatabaseExists(store: IDocumentStore, database: string): Promise<void> {
    const existing = await store.maintenance.server.send(new GetDatabaseNamesOperation(0, 1000));
    if (existing.includes(database)) {
      return;
    }

    this.logger.log(`Database "${database}" not found — creating it.`);
    await store.maintenance.server.send(new CreateDatabaseOperation({ databaseName: database }, 1));
  }

  private buildAuthOptions(): IAuthOptions | undefined {
    const { certPath, certPassphrase } = this.config;
    if (!certPath) {
      return undefined;
    }

    return {
      certificate: readFileSync(certPath),
      type: 'pfx',
      password: certPassphrase,
    };
  }
}

/**
 * Wires entity classes and our safety defaults into a conventions object, so
 * documents round-trip as class instances in the collection we chose.
 * Exported for testing.
 */
export function applyConventions(
  conventions: DocumentConventions,
  registrations: readonly EntityRegistration[],
): void {
  // RavenDB defaults to last-write-wins. Opt into change-vector checks so a
  // read-modify-write race fails loudly instead of silently clobbering.
  conventions.useOptimisticConcurrency = true;

  const collectionsByTypeName = new Map(
    registrations.map(({ entityType, collection }) => [entityType.name, collection]),
  );

  for (const { entityType } of registrations) {
    conventions.registerEntityType(entityType);
  }

  conventions.findCollectionName = (typeDescriptor: ObjectTypeDescriptor): string =>
    collectionsByTypeName.get(typeDescriptor.name) ??
    DocumentConventions.defaultGetCollectionName(typeDescriptor);
}
