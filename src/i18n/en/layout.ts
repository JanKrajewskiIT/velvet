import { defineDictionary } from '@jankrajewskiit/i18n';

export const layoutEn = defineDictionary({
  footer: {
    navigation: 'Footer',
    legal: 'Legal',
    social: 'Social',
  },
  footerStatus: {
    ok: 'All systems operational',
    degraded: 'Degraded performance',
    down: 'Service disruption',
  },
  searchTrigger: {
    placeholder: 'Search…',
  },
  sidebar: {
    expand: 'Expand sidebar',
    collapse: 'Collapse sidebar',
    expandTitle: 'Expand',
    collapseTitle: 'Collapse',
  },
  splitPane: {
    label: 'Resize panels',
  },
});
