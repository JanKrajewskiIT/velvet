import { createSolidAppViteConfig } from '@jankrajewskiit/configs/vite';
import { defineConfig } from 'vite';

export default defineConfig(
  createSolidAppViteConfig(
    { root: import.meta.dirname, build: { outDir: '../dist-showcase', emptyOutDir: true } },
    { projectRoot: import.meta.dirname, port: 5174 },
  ),
);
