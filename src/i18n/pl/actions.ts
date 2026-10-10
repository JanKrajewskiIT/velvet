import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { actionsEn } from '../en/actions';

export const actionsPl: TranslationOf<typeof actionsEn> = {
  authButton: {
    signIn: 'Zaloguj się',
    signOut: 'Wyloguj się',
    failed: 'Nie udało się uwierzytelnić. Spróbuj ponownie.',
  },
  calendarEventButton: {
    label: 'Dodaj do kalendarza',
    added: 'W kalendarzu',
    providers: {
      google: 'Google Calendar',
      outlook: 'Outlook.com',
      ics: 'Apple / inne (.ics)',
    },
  },
  copyButton: {
    failed: 'Nie udało się skopiować',
  },
  localeSwitcher: {
    label: 'Język',
  },
  themeToggle: {
    label: 'Motyw kolorystyczny',
    light: 'Jasny',
    dark: 'Ciemny',
    system: 'Systemowy',
  },
};
