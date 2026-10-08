import type { TranslationOf } from '@jankrajewskiit/i18n';

import type { chartsEn } from '../en/charts';

export const chartsPl: TranslationOf<typeof chartsEn> = {
  barChart: {
    label: 'Wykres słupkowy',
    instructions: '{label}. Użyj klawiszy strzałek, aby odczytać wartości.',
  },
  chartSeries: {
    valueLabel: 'Wartość',
  },
  comparisonBar: {
    compareLabel: 'Porównaj',
    compareCount: '{label} {count, plural, one {# element} few {# elementy} many {# elementów} other {# elementu}}',
    hintSelectMore: 'Wybierz jeszcze {count}, aby porównać',
    hintTooMany: 'Porównaj maksymalnie {max} — usuń {excess}',
    hintSelected: 'Wybrano {count} z {max}',
    regionLabel: 'Porównanie',
    removeLabel: 'Usuń „{label}” z porównania',
  },
  comparisonDialog: {
    title: 'Porównanie',
    insightsLabel: 'Wygeneruj wnioski AI',
    error: 'Nie udało się przygotować porównania. Spróbuj ponownie.',
    comparingLabel: 'Porównywanie',
    comparing:
      'Trwa porównywanie: {count, plural, one {# element} few {# elementy} many {# elementów} other {# elementu}}…',
    tryAgain: 'Spróbuj ponownie',
    criterion: 'Kryterium',
    best: 'Najlepszy',
    insights: 'Wnioski',
    writingInsights: 'Przygotowywanie wniosków…',
    insightsPrompt: 'Pozwól AI podsumować kompromisy i wskazać rekomendację.',
  },
  donutChart: {
    label: 'Wykres pierścieniowy',
    centerLabel: 'Razem',
  },
  funnelChart: {
    label: 'Lejek',
    dropOff: '−{value} odpadło',
    stepLabel: '{step}: {value}',
    stepLabelOfFirst: '{step}: {value}, {percent} z {first}',
    stepLabelFromBase: '{step}: {value}, {percent} z {first}, {conversion} względem {base}',
  },
  gantt: {
    label: 'Oś czasu projektu',
    taskHeader: 'Zadanie',
    milestone: 'Kamień milowy: {description}',
    taskLabel: '{name}, {dates}',
    taskLabelProgress: '{name}, {dates}, ukończono {progress}%',
  },
  heatmap: {
    label: 'Aktywność',
    less: 'Mniej',
    more: 'Więcej',
    valueLabel: 'Wartość',
  },
  lineChart: {
    label: 'Wykres liniowy',
    instructions: '{label}. Użyj klawiszy strzałek, aby odczytać wartości.',
    chart: 'Wykres',
    table: 'Tabela',
    periodHeader: 'Okres',
  },
  radarChart: {
    label: 'Wykres radarowy',
  },
  sparkline: {
    label: 'Trend',
  },
};
