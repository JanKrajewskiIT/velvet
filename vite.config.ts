import { createSolidLibViteConfig } from '@jankrajewskiit/configs/vite';
import { defineConfig } from 'vite';

export default defineConfig(async () =>
  createSolidLibViteConfig(
    {},
    {
      fileName: 'velvet-ui',
      externalizeFromPackageJson: true,
      dts: { tsconfigPath: './tsconfig.app.json' },
    },
  ),
);
