import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import solidPlugin from 'eslint-plugin-solid/configs/typescript';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export function createEslintConfig({
  tsconfigRootDir,
  ignorePaths = [],
}) {
  return defineConfig([
    eslint.configs.recommended,
    jsxA11yPlugin.flatConfigs.recommended,
    ...tseslint.configs.strictTypeChecked,
    solidPlugin,
    prettier,
    globalIgnores([
      'dist',
      '**/vite-env.d.ts',
      '**/*.d.ts',
      'vite.config.ts',
      ...ignorePaths,
    ]),
    {
      ignores: ['**/*.mjs', '**/*.mts'],
    },
    {
      files: ['**/*.{js,cjs,ts,jsx,tsx}'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
        globals: { ...globals.browser },
      },
      plugins: {
        'unused-imports': unusedImportsPlugin,
        'simple-import-sort': simpleImportSortPlugin,
      },
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
        'no-console': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-unsafe-type-assertion': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-misused-promises': 'warn',
        'no-unassigned-vars': 'off',
        'solid/reactivity': 'warn',
        'require-unicode-regexp': ['error', { requireFlag: 'u' }],
      },
    },
    {
      files: ['tests/**/*.ts'],
      languageOptions: {
        parserOptions: {
          projectService: false,
          project: ['./tsconfig.test.json'],
          tsconfigRootDir,
        },
      },
    },
  ]);
}
