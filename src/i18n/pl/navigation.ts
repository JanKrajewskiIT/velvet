import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { navigationEn } from '../en/navigation';

export const navigationPl: TranslationOf<typeof navigationEn> = {
  anchor: {
    label: 'Na tej stronie',
  },
  backToTop: {
    label: 'Wróć na górę',
  },
  bottomNav: {
    label: 'Główna',
  },
  breadcrumb: {
    navigation: 'Ścieżka nawigacji',
    more: 'Pokaż jeszcze {count}',
  },
  hierarchyNavigator: {
    path: 'Ścieżka',
    rootLabel: 'Wszystkie',
  },
  link: {
    externalLabel: '(otwiera się w nowej karcie)',
  },
  loadMore: {
    format: 'Wyświetlono {shown} z {total}',
    doneLabel: 'Wyświetlono wszystkie: {total}',
    showNext: 'Pokaż jeszcze {count}',
    showMore: 'Pokaż więcej',
  },
  navbar: {
    label: 'Główna',
    openMenu: 'Otwórz menu',
    closeMenu: 'Zamknij menu',
    mobile: '{label} (widok mobilny)',
  },
  navbarLocale: {
    label: 'Zmień język',
  },
  navbarUser: {
    label: 'Menu konta',
    labelWithName: '{label} — {name}',
  },
  pagination: {
    navigation: 'Stronicowanie',
    rows: 'Wiersze',
    previous: 'Poprzednia strona',
    next: 'Następna strona',
    page: 'Strona {page}',
    range: '{from}–{to} z {total}',
    compact: 'Strona <b>{page}</b> z {count}',
  },
  stepper: {
    navigation: 'Postęp',
    done: 'ukończono',
    error: 'zawiera błędy',
  },
  treeView: {
    loading: 'Ładowanie…',
    loadFailed: 'Nie udało się wczytać',
    positionInstructions:
      'Alt+strzałka w górę lub w dół zmienia kolejność. Alt+strzałka w prawo przenosi do poprzedniego folderu. Alt+strzałka w lewo przenosi poza rodzica. Spacja (Ctrl+spacja w drzewie z polami wyboru) rozpoczyna przenoszenie do folderu, Enter potwierdza, a Escape anuluje.',
    moveInstructions:
      'Aby przenieść element, naciśnij spację (Ctrl+spację w drzewie z polami wyboru), wybierz strzałkami nowego rodzica i naciśnij Enter. Naciśnij Escape, aby anulować.',
    moveStarted: 'Wybierz strzałkami nowego rodzica i naciśnij Enter. Naciśnij Escape, aby anulować.',
    moveCompleted: 'Element został przeniesiony.',
    moveCancelled: 'Anulowano przenoszenie.',
    invalidMove: 'Nie można przenieść elementu do wskazanego elementu.',
  },
  wizard: {
    finish: 'Zakończ',
    step: 'Krok {index} z {count}',
    failed: 'Coś poszło nie tak. Spróbuj ponownie.',
  },
};
