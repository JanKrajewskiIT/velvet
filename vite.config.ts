import { defineConfig } from 'vite';
import { createSolidLibViteConfig } from '@jankrajewskiit/configs/vite';

export default defineConfig(async () =>
  createSolidLibViteConfig(
    {},
    {
      fileName: 'velvet-ui',
      externalPackages: ['solid-js', '@solidjs/router', 'solid-icons', 'solid-markdown', 'dompurify', 'remark-gfm'],
      dts: { tsconfigPath: './tsconfig.app.json' },
    },
  ),
);
