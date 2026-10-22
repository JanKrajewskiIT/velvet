import { defineDictionary } from '@jankrajewskiit/i18n';

export const financeEn = defineDictionary({
  money: { hidden: 'Amount hidden' },
  priceChange: {
    up: 'up',
    down: 'down',
    flat: 'unchanged',
    description: '{label} {direction} {value}',
  },
  dataState: {
    fresh: 'Fresh',
    delayed: 'Delayed',
    stale: 'Stale',
    partial: 'Partial coverage',
    unavailable: 'Unavailable',
    empty: 'Nothing found',
  },
  environmentBar: {
    research: 'RESEARCH',
    replay: 'REPLAY',
    paper: 'PAPER',
    demo: 'DEMO',
    shadow: 'SHADOW',
    live: 'LIVE · REAL FUNDS',
    label: 'Environment: {environment}',
    kill: 'Kill Switch',
  },
  valueShift: { expected: 'Expected', actual: 'actual', worse: 'worse', better: 'better' },
  newsItem: { aiSummary: 'AI summary', impact: '{impact} impact' },
  rangeBandChart: {
    band: 'Expected range',
    median: 'Median',
    actual: 'Actual',
    label: 'Range band chart',
    outside: '{count, plural, one {# outside range} other {# outside range}}',
    instructions:
      '{label}. {count, plural, one {# point outside the expected range} other {# points outside the expected range}}. Use arrow keys to read values.',
    announcement: '{label}: {actualLabel} {actual}, {medianLabel} {median}, {bandLabel} {lo} … {hi}',
  },
});
