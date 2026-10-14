import { createSolidLibViteConfig } from '@jankrajewskiit/configs/vite';
import { defineConfig } from 'vite';

export default defineConfig(async () =>
  createSolidLibViteConfig(
    {
      build: {
        lib: {
          entry: { index: 'src/index.ts', bare: 'src/bare.ts', common: 'src/common.ts', patterns: 'src/patterns.ts' },
          cssFileName: 'velvet-ui',
        },
      },
    },
    {
      fileName: 'velvet-ui',
      dts: { tsconfigPath: './tsconfig.app.json' },
    },
  ),
);
