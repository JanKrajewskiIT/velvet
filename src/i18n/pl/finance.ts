import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { financeEn } from '../en/finance';

export const financePl: TranslationOf<typeof financeEn> = {
  money: { hidden: 'Kwota ukryta' },
  priceChange: {
    up: 'wzrost',
    down: 'spadek',
    flat: 'bez zmian',
    description: '{label} {direction} {value}',
  },
  dataState: {
    fresh: 'Aktualne',
    delayed: 'Opóźnione',
    stale: 'Nieaktualne',
    partial: 'Częściowe pokrycie',
    unavailable: 'Niedostępne',
    empty: 'Nic nie znaleziono',
  },
  environmentBar: {
    research: 'BADANIA',
    replay: 'ODTWARZANIE',
    paper: 'SYMULACJA',
    demo: 'DEMO',
    shadow: 'OBSERWACJA',
    live: 'LIVE · PRAWDZIWE ŚRODKI',
    label: 'Środowisko: {environment}',
    kill: 'Zatrzymaj handel',
  },
  valueShift: { expected: 'Oczekiwano', actual: 'uzyskano', worse: 'pogorszenie', better: 'poprawa' },
  newsItem: { aiSummary: 'Podsumowanie AI', impact: 'Wpływ: {impact}' },
  rangeBandChart: {
    band: 'Oczekiwany zakres',
    median: 'Mediana',
    actual: 'Wartość rzeczywista',
    label: 'Wykres zakresu',
    outside:
      '{count, plural, one {# poza zakresem} few {# poza zakresem} many {# poza zakresem} other {# poza zakresem}}',
    instructions:
      '{label}. {count, plural, one {# punkt poza oczekiwanym zakresem} few {# punkty poza oczekiwanym zakresem} many {# punktów poza oczekiwanym zakresem} other {# punktu poza oczekiwanym zakresem}}. Użyj strzałek, aby odczytać wartości.',
    announcement: '{label}: {actualLabel} {actual}, {medianLabel} {median}, {bandLabel} {lo} … {hi}',
  },
};
