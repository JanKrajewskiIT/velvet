import { resolve } from 'node:path';
import { mergeConfig } from 'vite';
import solid from 'vite-plugin-solid';

export const solidMarkdownOptimizeDeps = {
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
};

export function createSolidAppViteConfig(
  userConfig = {},
  {
    alias = '~',
    srcDir = 'src',
    port = null,
    includeSolidMarkdownDeps = true,
    solidPluginOptions = undefined,
  } = {}
) {
  const baseConfig = {
    plugins: [solid(solidPluginOptions)],
    resolve: alias
      ? {
          alias: {
            [alias]: resolve(process.cwd(), srcDir),
          },
        }
      : undefined,
    optimizeDeps: includeSolidMarkdownDeps
      ? solidMarkdownOptimizeDeps
      : undefined,
    server: port ? { port } : undefined,
    preview: port ? { port } : undefined,
  };

  return mergeConfig(baseConfig, userConfig);
}
