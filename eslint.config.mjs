import {
  buildAllowEmptyInterfaceConfig,
  buildLiteralI18nKeyRule,
  buildRuleOverrideConfig,
  buildSolidHtmlForCompatConfig,
  createEslintConfig,
} from '@jankrajewskiit/configs/eslint';

export default createEslintConfig({
  tsconfigRootDir: import.meta.dirname,
  ignorePaths: ['velvet/**'],
  extraConfigs: [
    buildRuleOverrideConfig({
      name: 'ui/literal-i18n-keys',
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      rules: { 'no-restricted-syntax': buildLiteralI18nKeyRule({ staticFunction: 'translate' }) },
    }),
    buildSolidHtmlForCompatConfig(['src/**/*.tsx']),
    buildAllowEmptyInterfaceConfig(['src/i18n/augment.ts']),
  ],
});
