import { resolve } from 'node:path';

import { createSolidAppViteConfig } from '@jankrajewskiit/configs/vite';
import { defineConfig } from 'vite';

const libRoot = resolve(__dirname, '..');

export default defineConfig(
  createSolidAppViteConfig(
    {
      base: './',
      resolve: {
        alias: [
          { find: '~', replacement: resolve(libRoot, 'src') },
          {
            find: /^@jankrajewskiit\/ui\/styles$/u,
            replacement: resolve(libRoot, 'src/theme/globals.css'),
          },
          { find: /^@jankrajewskiit\/ui$/u, replacement: resolve(libRoot, 'src/index.ts') },
        ],
        dedupe: ['solid-js', '@solidjs/router'],
      },
      server: {
        fs: { allow: [libRoot] },
      },
      optimizeDeps: {
        exclude: ['@jankrajewskiit/ui', 'solid-markdown', 'solid-icons'],
        include: ['remark-gfm', 'debug', 'extend', 'style-to-object', 'inline-style-parser', 'ms'],
        extensions: ['.jsx'],
      },
    },
    {
      alias: null,
      includeSolidMarkdownDeps: false,
      solidPluginOptions: { extensions: ['.jsx', '.tsx'] },
    },
  ),
);
