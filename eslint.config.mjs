import {
  buildLiteralI18nKeySelectors,
  buildNoChildrenPropSelectors,
  createEslintConfig,
} from '@jankrajewskiit/configs/eslint';

const noChildrenComponents = [
  { component: 'DialogTitle', prop: 'label' },
  { component: 'Alert', prop: 'message', forbid: ['children', 'title'] },
  { component: 'Banner', prop: 'message' },
  { component: 'ErrorMessage', prop: 'message' },
  { component: 'ListItem', prop: 'label' },
  { component: 'Chip', prop: 'label' },
  { component: 'EmptyState', prop: 'action' },
  { component: 'IconButton', prop: 'label', forbid: 'title' },
  { component: 'RoundIconButton', prop: 'label', forbid: 'title' },
  { component: 'MediaNavButton', prop: 'label', forbid: 'title' },
  { component: 'SidebarNav', prop: 'label', forbid: 'title' },
  { component: 'Sheet', prop: 'label', forbid: 'title' },
  { component: 'AccordionItem', prop: 'label', forbid: 'title' },
  { component: 'SectionCard', prop: 'label', forbid: 'title' },
  { component: 'ConfirmDialog', prop: 'label', forbid: 'title' },
  { component: 'ConfirmAction', prop: 'label', forbid: 'title' },
  { component: 'MarkdownEditDialog', prop: 'label', forbid: 'title' },
  { component: 'ColumnManager', prop: 'label', forbid: 'title' },
  { component: 'QueryBuilder', prop: 'label', forbid: 'title' },
  { component: 'NotificationCenter', prop: 'label', forbid: 'title' },
  { component: 'FallbackState', prop: 'label', forbid: 'title' },
  { component: 'ErrorFallback', prop: 'label', forbid: 'title' },
  { component: 'AccessDenied', prop: 'label', forbid: 'title' },
];

export default createEslintConfig({
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
  ],
});
