import type { ObjectTypeDescriptor } from 'ravendb';

/**
 * Maps an entity class onto the RavenDB collection that stores it. Without a
 * registration RavenDB derives the collection from the class name, so
 * `BetDocument` would land in `BetDocuments` rather than `Bets`.
 */
export interface EntityRegistration {
  entityType: ObjectTypeDescriptor;
  collection: string;
}

export interface RavenDbModuleOptions {
  entities?: EntityRegistration[];
}
