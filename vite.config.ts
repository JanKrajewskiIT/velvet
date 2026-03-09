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
      '~': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: solidMarkdownOptimizeDeps,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VelvetUi',
      fileName: 'velvet-ui',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        'solid-js',
        'solid-js/web',
        'solid-js/store',
        '@solidjs/router',
      ],
      output: {
        globals: {
          'solid-js': 'SolidJS',
          'solid-js/web': 'SolidJSWeb',
          'solid-js/store': 'SolidJSStore',
          '@solidjs/router': 'SolidRouter',
        },
      },
    },
    cssCodeSplit: false,
  },
});
