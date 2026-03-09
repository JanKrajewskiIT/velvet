import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solid from 'vite-plugin-solid';

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
  optimizeDeps: {
    exclude: ['solid-markdown'],
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
