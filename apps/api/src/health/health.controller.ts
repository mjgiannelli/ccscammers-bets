import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RavenDbService } from '../ravendb/ravendb.service';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  uptimeSeconds: number;
  ravendb: {
    status: 'up' | 'down';
    database: string;
    error?: string;
  };
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly ravendb: RavenDbService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness plus a RavenDB round trip.' })
  async check(): Promise<HealthResponse> {
    const uptimeSeconds = Math.round(process.uptime());
    // Read from config, not from the store: the store getter throws while the
    // connection is down, which is exactly when this endpoint must still answer.
    const database = this.ravendb.databaseName;

    try {
      // Cheapest honest round trip: ask the session for a document we know is
      // absent. It proves the server is reachable and the database exists.
      await this.ravendb.openSession().load('health/probe');

      return {
        status: 'ok',
        uptimeSeconds,
        ravendb: { status: 'up', database },
      };
    } catch (error) {
      return {
        status: 'degraded',
        uptimeSeconds,
        ravendb: {
          status: 'down',
          database,
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }
}
