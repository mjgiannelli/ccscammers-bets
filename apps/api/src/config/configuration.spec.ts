import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { CONFIG_NAMESPACE, configuration } from './configuration';

const KEYS = [
  'NODE_ENV',
  'PORT',
  'CORS_ORIGINS',
  'RAVENDB_URLS',
  'RAVENDB_DATABASE',
  'RAVENDB_ENSURE_DATABASE',
  'RAVENDB_CERT_PATH',
] as const;

describe('configuration', () => {
  let snapshot: Record<string, string | undefined>;

  beforeEach(() => {
    snapshot = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));
    for (const key of KEYS) delete process.env[key];
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(snapshot)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it('falls back to local development defaults', () => {
    const { [CONFIG_NAMESPACE]: config } = configuration();

    expect(config.port).toBe(3000);
    expect(config.nodeEnv).toBe('development');
    expect(config.ravendb.urls).toEqual(['http://localhost:8080']);
    expect(config.ravendb.ensureDatabase).toBe(true);
    expect(config.ravendb.certPath).toBeUndefined();
  });

  it('splits comma-separated lists and trims blanks', () => {
    process.env.RAVENDB_URLS = 'http://a:8080, http://b:8080 ,';

    const { [CONFIG_NAMESPACE]: config } = configuration();

    expect(config.ravendb.urls).toEqual(['http://a:8080', 'http://b:8080']);
  });

  it('does not auto-create the database in production', () => {
    process.env.NODE_ENV = 'production';

    const { [CONFIG_NAMESPACE]: config } = configuration();

    expect(config.ravendb.ensureDatabase).toBe(false);
  });

  it('rejects a non-numeric port', () => {
    process.env.PORT = 'not-a-port';

    expect(() => configuration()).toThrow(/PORT must be an integer/);
  });

  it('rejects an unknown NODE_ENV', () => {
    process.env.NODE_ENV = 'staging';

    expect(() => configuration()).toThrow(/NODE_ENV must be one of/);
  });
});
