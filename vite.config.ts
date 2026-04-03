import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solid from 'vite-plugin-solid';

import { solidMarkdownOptimizeDeps } from './config/vite.mjs';

export default defineConfig({
  plugins: [
    solid(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(import.meta.dirname, 'src'),
    },
  },
  optimizeDeps: solidMarkdownOptimizeDeps,
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      fileName: 'velvet-ui',
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) =>
        id.includes('node_modules') ||
        /^(solid-js|@solidjs\/router|solid-icons|solid-markdown|dompurify|remark-gfm|lightweight-charts)(\/|$)/u.test(
          id,
        ),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: (chunkInfo) => `${chunkInfo.name.replace(/^src[\\/]/u, '')}.js`,
      },
    },
    cssCodeSplit: false,
  },
});
