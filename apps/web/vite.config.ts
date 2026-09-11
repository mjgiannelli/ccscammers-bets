import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Read the monorepo-root .env so one file configures both apps.
  envDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: {
    port: 5173,
  },
  optimizeDeps: {
    // `@ccscammers/shared` is a linked workspace package emitting CommonJS,
    // so Vite has to pre-bundle it rather than serve it as-is.
    include: ['@ccscammers/shared'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
