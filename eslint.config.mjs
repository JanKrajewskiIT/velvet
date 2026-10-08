import { fixupConfigRules } from '@eslint/compat';
import { buildLiteralI18nKeySelectors, createEslintConfig } from '@jankrajewskiit/configs/eslint';

export default fixupConfigRules(
  createEslintConfig({
    tsconfigRootDir: import.meta.dirname,
    ignorePaths: ['velvet/**', 'dist-showcase/**'],
    extraConfigs: [
      {
        files: ['src/**/*.{ts,tsx,js,jsx}'],
        rules: {
          'no-restricted-syntax': ['error', ...buildLiteralI18nKeySelectors({ staticFunction: 'translate' })],
        },
      },
      {
        files: ['src/**/*.tsx'],
        rules: {
          'no-unassigned-vars': 'off',
          // FieldLabel keeps the reference prop name `htmlFor`; className and key are already rejected by the JSX types.
          'solid/no-react-specific-props': 'off',
        },
      },
    ],
  }),
);
