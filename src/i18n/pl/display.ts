import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { displayEn } from '../en/display';

export const displayPl: TranslationOf<typeof displayEn> = {
  markdownEditDialog: {
    saving: 'Zapisywanie…',
    saveError: 'Nie udało się zapisać. Zmiany zostały zachowane — spróbuj ponownie.',
    saveShortcut: '{modifier}↵, aby zapisać',
    discardPrompt: 'Odrzucić niezapisane zmiany?',
    keepEditing: 'Kontynuuj edycję',
    discard: 'Odrzuć',
  },
  markdownEditor: {
    placeholder: 'Wpisz tekst w formacie Markdown…',
    previewEmpty: 'Brak treści do podglądu.',
    modesLabel: 'Widok edytora',
    toolbarLabel: 'Formatowanie',
    previewLabel: 'Podgląd',
    markdownSupported: 'Obsługa formatu Markdown',
    wordCount: '{count, plural, one {# słowo} few {# słowa} many {# słów} other {# słowa}}',
    modes: {
      write: 'Edycja',
      split: 'Podział',
      preview: 'Podgląd',
    },
    tools: {
      heading: 'Nagłówek',
      bold: 'Pogrubienie',
      italic: 'Kursywa',
      strikethrough: 'Przekreślenie',
      bulletedList: 'Lista punktowana',
      numberedList: 'Lista numerowana',
      checklist: 'Lista zadań',
      quote: 'Cytat',
      inlineCode: 'Kod w wierszu',
      link: 'Link',
      codeBlock: 'Blok kodu',
    },
    placeholders: {
      linkText: 'tekst linku',
      code: 'kod',
    },
  },
  qrCode: {
    label: 'Kod QR: {value}',
    unavailable: 'Kod QR niedostępny',
    tooLong: 'Zbyt dużo danych dla kodu QR',
  },
  tag: {
    removeItem: 'Usuń: {name}',
  },
  watermark: {
    text: 'Poufne',
  },
};
