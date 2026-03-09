import type { Options as SolidPluginOptions } from 'vite-plugin-solid';
import type { DepOptimizationOptions, UserConfig } from 'vite';

export interface CreateSolidAppViteConfigOptions {
  alias?: string | null;
  srcDir?: string;
  port?: number | null;
  includeSolidMarkdownDeps?: boolean;
  solidPluginOptions?: Partial<SolidPluginOptions>;
}

export declare const solidMarkdownOptimizeDeps: DepOptimizationOptions;

export declare function createSolidAppViteConfig(
  userConfig?: UserConfig,
  options?: CreateSolidAppViteConfigOptions
): UserConfig;
