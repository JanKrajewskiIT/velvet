import { createSolidLibViteConfig } from '@jankrajewskiit/configs/vite';
import { defineConfig } from 'vite';

export default defineConfig(async () =>
  createSolidLibViteConfig(
    {},
    {
      fileName: 'velvet-ui',
      externalPackages: [
        'solid-js',
        '@solidjs/router',
        'solid-icons',
        'solid-markdown',
        'oidc-client-ts',
        'remark-gfm',
        '@jankrajewskiit/auth',
        '@jankrajewskiit/i18n',
      ],
      dts: { tsconfigPath: './tsconfig.app.json' },
    },
  ),
);
