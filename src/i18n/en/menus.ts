import { defineDictionary } from '@jankrajewskiit/i18n';

export const menusEn = defineDictionary({
  commandPalette: {
    placeholder: 'Type a command or search…',
    emptyText: 'No results.',
    dialog: 'Command palette',
    navigate: 'navigate',
    open: 'open',
    close: 'close',
    resultCount: '{count, plural, one {# result} other {# results}}',
  },
  dropdownButton: {
    menuLabel: 'More options',
  },
  menuChip: {
    clearLabel: 'Any',
  },
  toolbar: {
    moreLabel: 'More tools',
    overflowLabel: '{label} ({count})',
  },
});
