import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    root: import.meta.dirname,
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/main.ts'],
    },
  },
  // Nest relies on `emitDecoratorMetadata` for constructor injection, which
  // esbuild (vitest's default transformer) does not emit. SWC does.
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
