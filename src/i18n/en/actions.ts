import { defineDictionary } from '@jankrajewskiit/i18n';

export const actionsEn = defineDictionary({
  authButton: {
    signIn: 'Sign in',
    signOut: 'Sign out',
    failed: 'Authentication failed. Try again.',
  },
  calendarEventButton: {
    label: 'Add to calendar',
    added: 'In calendar',
    providers: {
      google: 'Google Calendar',
      outlook: 'Outlook.com',
      ics: 'Apple / other (.ics)',
    },
  },
  copyButton: {
    failed: 'Copy failed',
  },
  localeSwitcher: {
    label: 'Language',
  },
  themeToggle: {
    label: 'Color theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
});
