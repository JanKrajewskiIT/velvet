import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid({ extensions: ['.jsx', '.tsx'] })],
  base: './',
  resolve: {
    alias: [
      {
        find: '~',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: /^@jankrajewskiit\/ui\/styles$/u,
        replacement: resolve(__dirname, '../src/theme/globals.css'),
      },
      {
        find: /^@jankrajewskiit\/ui$/u,
        replacement: resolve(__dirname, '../src/index.ts'),
      },
    ],
    dedupe: ['solid-js', '@solidjs/router'],
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '..')],
    },
  },
  optimizeDeps: {
    exclude: ['@jankrajewskiit/ui', 'solid-markdown', 'solid-icons'],
    include: ['remark-gfm', 'debug', 'extend', 'style-to-object', 'inline-style-parser', 'ms'],
    extensions: ['.jsx'],
  },
});
