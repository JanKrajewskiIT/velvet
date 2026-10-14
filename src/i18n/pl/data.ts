import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { dataEn } from '../en/data';

export const dataPl: TranslationOf<typeof dataEn> = {
  avatar: {
    statusOnline: 'Dostępny',
    statusAway: 'Nieobecny',
    statusBusy: 'Zajęty',
    statusOffline: 'Niedostępny',
  },
  codeSnippet: {
    copyFailed: 'Nie udało się skopiować',
    copyCode: 'Kopiuj kod',
    copiedAnnouncement: 'Skopiowano do schowka',
  },
  diffSkip: {
    showUnchanged:
      '⋯ Pokaż {count, plural, one {# niezmienioną linię} few {# niezmienione linie} many {# niezmienionych linii} other {# niezmienionej linii}}',
  },
  diffViewer: {
    modeUnified: 'Ujednolicony',
    modeSplit: 'Podzielony',
    statsLabel: 'Dodane linie: {added}, usunięte linie: {removed}',
    viewLabel: 'Widok',
    changesLabel: 'zmiany',
    changesLabelNamed: '{filename} — zmiany',
  },
  eventCalendar: {
    emptyText: 'Brak wydarzeń w tym dniu.',
    allDay: 'Cały dzień',
  },
  featureCard: {
    learnMore: 'Dowiedz się więcej',
  },
  flipCard: {
    label: 'Obróć kartę',
    showingBack: '{label} (widoczny tył)',
    showingFront: '{label} (widoczny przód)',
  },
  kanban: {
    moveError: 'Nie udało się przenieść karty. Spróbuj ponownie.',
    cardFallback: 'Karta',
    cardMoved: '{card}: przeniesiono do {column}, pozycja {position}',
    addCard: 'Dodaj kartę do: {column}',
    listLabel: '{title}, {count, plural, one {# karta} few {# karty} many {# kart} other {# karty}}',
    cardRoleDescription: 'Karta do przeciągania',
    dropHere: 'Upuść karty tutaj',
    help: 'Ctrl i klawisze strzałek przenoszą kartę między kolumnami i pozycjami.',
  },
  list: {
    empty: 'Nic tu jeszcze nie ma.',
  },
  logViewer: {
    title: 'Logi',
    levelsLabel: 'Poziomy',
    filterPlaceholder: 'Filtruj',
    filterLabel: 'Filtruj wiersze logów',
    wrap: 'Zawijaj',
    noWrap: 'Bez zawijania',
    noMatches: 'Żadne wiersze nie pasują do filtra.',
    newLines: 'Nowe: {count}',
    latest: 'Najnowsze',
  },
  questionCard: {
    removeSaved: 'Usuń z zapisanych',
    save: 'Zapisz pytanie',
    difficulty: 'Poziom trudności',
    voted: 'głosów, oddano Twój głos',
    vote: 'głosów, zagłosuj',
    hideAnswer: 'Ukryj odpowiedź',
    showAnswer: 'Pokaż odpowiedź',
  },
  scheduler: {
    slotLabel: 'Dodaj wydarzenie o {time}, {date}. Wybierz termin strzałkami i zatwierdź Enterem.',
    viewDay: 'Dzień',
    viewWeek: 'Tydzień',
    navigateLabel: 'Nawigacja',
    previousDay: 'Poprzedni dzień',
    previousWeek: 'Poprzedni tydzień',
    nextDay: 'Następny dzień',
    nextWeek: 'Następny tydzień',
    viewLabel: 'Widok',
    scheduleLabel: 'Harmonogram',
    addEventOn: 'Dodaj wydarzenie: {date}',
    eventLabel: '{title}, od {start} do {end}',
  },
  scoreCard: {
    label: 'Wynik',
  },
  skillBar: {
    label: 'Poziom umiejętności',
    valueTextWithLevel: '{level}, {percent}%',
  },
  stat: {
    trendLabel: 'Trend',
  },
  table: {
    addRow: 'Dodaj wiersz',
    empty: 'Nic tu jeszcze nie ma.',
    resetWidths: 'Resetuj szerokości',
    bulkActionsLabel: 'Akcje zbiorcze',
    selected: 'Zaznaczono: {count}',
    selectAll: 'Zaznacz wszystko',
    details: 'Szczegóły',
    selectRow: 'Zaznacz wiersz',
    collapseRow: 'Zwiń wiersz',
    expandRow: 'Rozwiń wiersz',
    resizeColumn: 'Zmień szerokość: {name}',
  },
  timeline: {
    addLabel: 'Dodaj wydarzenie',
    errorText: 'Coś poszło nie tak — spróbuj ponownie.',
  },
  timelineActions: {
    actionsLabel: 'Akcje',
    actionLabel: '{action}: {title}',
  },
  timelineConfirm: {
    question: '{action}?',
  },
};
