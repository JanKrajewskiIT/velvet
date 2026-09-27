import { fixupConfigRules } from '@eslint/compat';
import {
  buildLiteralI18nKeySelectors,
  buildNoChildrenPropSelectors,
  createEslintConfig,
} from '@jankrajewskiit/configs/eslint';

const noChildrenComponents = [
  { component: 'DialogTitle', prop: 'label', forbid: [] },
  { component: 'Alert', prop: 'message', forbid: ['children', 'title'] },
  { component: 'Banner', prop: 'message', forbid: [] },
  { component: 'ErrorMessage', prop: 'message', forbid: [] },
  { component: 'ListItem', prop: 'label', forbid: [] },
  { component: 'Chip', prop: 'label', forbid: [] },
  { component: 'EmptyState', prop: 'action', forbid: [] },
  { component: 'IconButton', prop: 'label', forbid: ['title'] },
  { component: 'RoundIconButton', prop: 'label', forbid: ['title'] },
  { component: 'MediaNavButton', prop: 'label', forbid: ['title'] },
  { component: 'SidebarNav', prop: 'label', forbid: ['title'] },
  { component: 'Sheet', prop: 'label', forbid: ['title'] },
  { component: 'AccordionItem', prop: 'label', forbid: ['title'] },
  { component: 'SectionCard', prop: 'label', forbid: ['title'] },
  { component: 'ConfirmDialog', prop: 'label', forbid: ['title'] },
  { component: 'ConfirmAction', prop: 'label', forbid: ['title'] },
  { component: 'MarkdownEditDialog', prop: 'label', forbid: ['title'] },
  { component: 'ColumnManager', prop: 'label', forbid: ['title'] },
  { component: 'QueryBuilder', prop: 'label', forbid: ['title'] },
  { component: 'NotificationCenter', prop: 'label', forbid: ['title'] },
  { component: 'FallbackState', prop: 'label', forbid: ['title'] },
  { component: 'ErrorFallback', prop: 'label', forbid: ['title'] },
  { component: 'AccessDenied', prop: 'label', forbid: ['title'] },
];

export default fixupConfigRules(
  createEslintConfig({
    tsconfigRootDir: import.meta.dirname,
    extraConfigs: [
      {
        files: ['src/**/*.{ts,tsx,js,jsx}'],
        rules: {
          'no-restricted-syntax': [
            'error',
            ...buildNoChildrenPropSelectors(noChildrenComponents),
            ...buildLiteralI18nKeySelectors(),
          ],
        },
      },
      {
        files: ['src/**/*.tsx'],
        rules: {
          'no-unassigned-vars': 'off',
        },
      },
    ],
  }),
);
