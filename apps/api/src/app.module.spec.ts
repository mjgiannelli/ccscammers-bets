import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import { AppModule } from './app.module';
import { BetsController } from './bets/bets.controller';
import { BetsService } from './bets/bets.service';
import { HealthController } from './health/health.controller';
import { RavenDbService } from './ravendb/ravendb.service';

/**
 * `compile()` builds the dependency graph without running lifecycle hooks, so
 * this proves the wiring is sound without needing a live RavenDB server.
 */
describe('AppModule', () => {
  it('resolves every controller and provider', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    expect(moduleRef.get(BetsController)).toBeInstanceOf(BetsController);
    expect(moduleRef.get(BetsService)).toBeInstanceOf(BetsService);
    expect(moduleRef.get(HealthController)).toBeInstanceOf(HealthController);
    expect(moduleRef.get(RavenDbService)).toBeInstanceOf(RavenDbService);
  });

  it('reports the store as unavailable before initialisation', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    expect(() => moduleRef.get(RavenDbService).store).toThrow(/has not been initialised/);
  });
});
