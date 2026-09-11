import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BETS_COLLECTION, BetDocument } from './bets/bet.document';
import { BetsModule } from './bets/bets.module';
import { configuration } from './config/configuration';
import { HealthModule } from './health/health.module';
import { RavenDbModule } from './ravendb/ravendb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      // The repo-root .env is the shared one; an app-local .env wins over it.
      envFilePath: ['.env', '../../.env'],
    }),
    RavenDbModule.forRoot({
      entities: [{ entityType: BetDocument, collection: BETS_COLLECTION }],
    }),
    HealthModule,
    BetsModule,
  ],
})
export class AppModule {}
