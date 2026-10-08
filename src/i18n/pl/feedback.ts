import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { feedbackEn } from '../en/feedback';

export const feedbackPl: TranslationOf<typeof feedbackEn> = {
  banner: {
    label: 'Ogłoszenie',
  },
  bottomSheet: {
    label: 'Panel',
  },
  confirmDialog: {
    title: 'Czy na pewno?',
    errorMessage: 'Coś poszło nie tak — spróbuj ponownie.',
    typeToConfirm: 'Wpisz <code>{text}</code>, aby potwierdzić',
  },
  countdown: {
    days: 'Dni',
    hours: 'Godz.',
    minutes: 'Min',
    seconds: 'Sek',
    remaining: 'Pozostało: {summary}',
  },
  errorState: {
    title: 'Coś poszło nie tak',
    description: 'Nie udało się tego wczytać. Sprawdź połączenie i spróbuj ponownie.',
    retryLabel: 'Spróbuj ponownie',
    showDetails: 'Pokaż szczegóły',
    hideDetails: 'Ukryj szczegóły',
  },
  loadingOverlay: {
    label: 'Ładowanie…',
  },
  notificationCenter: {
    title: 'Powiadomienia',
    unreadLabel: '{title}, nieprzeczytane: {count}',
    newCount: 'Nowe: {count}',
    markAllRead: 'Oznacz wszystkie jako przeczytane',
    viewAll: 'Zobacz całą aktywność',
  },
  notificationList: {
    emptyText: 'Nie masz nowych powiadomień.',
    unread: 'Nieprzeczytane',
  },
  setupChecklist: {
    title: 'Zacznij tutaj',
    progress: 'Ukończono {done} z {total}',
    stepDone: '(ukończono)',
  },
  statusPage: {
    error: 'Błąd {code}',
    notFound: {
      tag: 'Nie znaleziono',
      title: 'Nie znaleziono strony',
      description: 'Strona, której szukasz, nie istnieje lub została przeniesiona.',
    },
    forbidden: {
      tag: 'Brak dostępu',
      title: 'Nie masz dostępu',
      description: 'Poproś administratora przestrzeni roboczej o zaproszenie lub przełącz się na konto z dostępem.',
    },
    serverError: {
      tag: 'Błąd serwera',
      title: 'Coś poszło nie tak po naszej stronie',
      description: 'Problem został zgłoszony i już go sprawdzamy. Spróbuj ponownie za chwilę.',
    },
    offline: {
      title: 'Brak połączenia',
      description: 'Połącz się ponownie, aby kontynuować — zmiany są zapisane lokalnie.',
    },
    success: {
      title: 'Gotowe',
      description: 'Wszystko przebiegło pomyślnie. Możesz kontynuować.',
    },
    warning: {
      title: 'Zakończono z ostrzeżeniami',
      description: 'Niektóre elementy wymagają uwagi, zanim zostaną ukończone.',
    },
    info: {
      title: 'Wysłano zgłoszenie',
      description: 'Damy znać, gdy zostanie rozpatrzone.',
    },
  },
  tour: {
    done: 'Zakończ',
    missing: 'Ta część strony nie jest teraz widoczna.',
  },
};
