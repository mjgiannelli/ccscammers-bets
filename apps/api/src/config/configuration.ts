export interface RavenDbConfig {
  urls: string[];
  database: string;
  /** Create the database at boot if it is missing. Handy in dev, off in prod. */
  ensureDatabase: boolean;
  /** Path to a .pfx client certificate. Required by a secured cluster. */
  certPath?: string;
  certPassphrase?: string;
}

export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  corsOrigins: string[];
  ravendb: RavenDbConfig;
}

export const CONFIG_NAMESPACE = 'app';

/** Reads and validates the environment once, at module load. */
export function configuration(): { [CONFIG_NAMESPACE]: AppConfig } {
  const nodeEnv = readEnum('NODE_ENV', ['development', 'test', 'production'], 'development');

  return {
    [CONFIG_NAMESPACE]: {
      nodeEnv,
      port: readInt('PORT', 3000),
      corsOrigins: readList('CORS_ORIGINS', ['http://localhost:5173']),
      ravendb: {
        urls: readList('RAVENDB_URLS', ['http://localhost:8080']),
        database: readString('RAVENDB_DATABASE', 'ccscammers-bets'),
        ensureDatabase: readBool('RAVENDB_ENSURE_DATABASE', nodeEnv !== 'production'),
        certPath: optionalString('RAVENDB_CERT_PATH'),
        certPassphrase: optionalString('RAVENDB_CERT_PASSPHRASE'),
      },
    },
  };
}

function optionalString(key: string): string | undefined {
  const raw = process.env[key]?.trim();
  return raw ? raw : undefined;
}

function readString(key: string, fallback: string): string {
  return optionalString(key) ?? fallback;
}

function readInt(key: string, fallback: number): number {
  const raw = optionalString(key);
  if (raw === undefined) return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    throw new Error(`Environment variable ${key} must be an integer, received "${raw}".`);
  }
  return parsed;
}

function readBool(key: string, fallback: boolean): boolean {
  const raw = optionalString(key)?.toLowerCase();
  if (raw === undefined) return fallback;
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;

  throw new Error(`Environment variable ${key} must be a boolean, received "${raw}".`);
}

function readList(key: string, fallback: string[]): string[] {
  const raw = optionalString(key);
  if (raw === undefined) return fallback;

  const items = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) {
    throw new Error(`Environment variable ${key} must contain at least one entry.`);
  }
  return items;
}

function readEnum<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  const raw = optionalString(key);
  if (raw === undefined) return fallback;
  if (!allowed.includes(raw as T)) {
    throw new Error(`Environment variable ${key} must be one of ${allowed.join(', ')}.`);
  }
  return raw as T;
}
