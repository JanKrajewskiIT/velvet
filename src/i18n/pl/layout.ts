import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { layoutEn } from '../en/layout';

export const layoutPl: TranslationOf<typeof layoutEn> = {
  footer: {
    navigation: 'Stopka',
    legal: 'Informacje prawne',
    social: 'Media społecznościowe',
  },
  footerStatus: {
    ok: 'Wszystkie systemy działają',
    degraded: 'Obniżona wydajność',
    down: 'Awaria usługi',
  },
  searchTrigger: {
    placeholder: 'Szukaj…',
  },
  sidebar: {
    expand: 'Rozwiń panel boczny',
    collapse: 'Zwiń panel boczny',
    expandTitle: 'Rozwiń',
    collapseTitle: 'Zwiń',
  },
  splitPane: {
    label: 'Zmień rozmiar paneli',
  },
};
