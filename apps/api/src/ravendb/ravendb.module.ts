import { Global, Module, type DynamicModule } from '@nestjs/common';

import { RAVENDB_ENTITIES } from './ravendb.constants';
import { RavenDbService } from './ravendb.service';
import type { RavenDbModuleOptions } from './ravendb.types';

/**
 * Global so feature modules can inject `RavenDbService` without re-importing.
 * There is exactly one document store per process, so a global is honest here.
 */
@Global()
@Module({})
export class RavenDbModule {
  static forRoot(options: RavenDbModuleOptions = {}): DynamicModule {
    return {
      module: RavenDbModule,
      providers: [{ provide: RAVENDB_ENTITIES, useValue: options.entities ?? [] }, RavenDbService],
      exports: [RavenDbService],
    };
  }
}
