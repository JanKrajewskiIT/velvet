import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { menusEn } from '../en/menus';

export const menusPl: TranslationOf<typeof menusEn> = {
  commandPalette: {
    placeholder: 'Wpisz polecenie lub wyszukaj…',
    emptyText: 'Brak wyników.',
    dialog: 'Paleta poleceń',
    navigate: 'nawiguj',
    open: 'otwórz',
    close: 'zamknij',
    resultCount: '{count, plural, one {# wynik} few {# wyniki} many {# wyników} other {# wyniku}}',
  },
  dropdownButton: {
    menuLabel: 'Więcej opcji',
  },
  menuChip: {
    clearLabel: 'Dowolny',
  },
  toolbar: {
    moreLabel: 'Więcej narzędzi',
    overflowLabel: '{label} ({count})',
  },
};
