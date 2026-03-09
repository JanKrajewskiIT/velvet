import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid({ extensions: ['.jsx', '.tsx'] })],
  base: './',
  resolve: {
    alias: [
      {
        find: /^@jankrajewskiit\/ui\/styles$/u,
        replacement: resolve(__dirname, '../src/theme/globals.css'),
      },
      {
        find: /^@jankrajewskiit\/ui$/u,
        replacement: resolve(__dirname, '../src/index.ts'),
      },
    ],
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '..')],
    },
  },
  optimizeDeps: {
    exclude: ['@jankrajewskiit/ui', 'solid-markdown', 'solid-icons'],
    include: [
      'remark-gfm',
      'solid-markdown > extend',
      'solid-markdown > style-to-object',
      'solid-markdown > inline-style-parser',
      'solid-markdown > debug',
      'solid-markdown > ms',
    ],
    extensions: ['.jsx'],
  },
});
