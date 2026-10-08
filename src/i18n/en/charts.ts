import { defineDictionary } from '@jankrajewskiit/i18n';

export const chartsEn = defineDictionary({
  barChart: {
    label: 'Bar chart',
    instructions: '{label}. Use arrow keys to read values.',
  },
  chartSeries: {
    valueLabel: 'Value',
  },
  comparisonBar: {
    compareLabel: 'Compare',
    compareCount: '{label} {count, plural, one {# item} other {# items}}',
    hintSelectMore: 'Select {count} more to compare',
    hintTooMany: 'Compare up to {max} — remove {excess}',
    hintSelected: '{count} of {max} selected',
    regionLabel: 'Comparison',
    removeLabel: 'Remove {label} from comparison',
  },
  comparisonDialog: {
    title: 'Comparison',
    insightsLabel: 'Generate AI insights',
    error: 'Couldn’t build the comparison. Try again.',
    comparingLabel: 'Comparing',
    comparing: 'Comparing {count, plural, one {# item} other {# items}}…',
    tryAgain: 'Try again',
    criterion: 'Criterion',
    best: 'Best',
    insights: 'Insights',
    writingInsights: 'Writing insights…',
    insightsPrompt: 'Let AI summarise trade-offs and pick a recommendation.',
  },
  donutChart: {
    label: 'Donut chart',
    centerLabel: 'Total',
  },
  funnelChart: {
    label: 'Funnel',
    dropOff: '−{value} drop-off',
    stepLabel: '{step}: {value}',
    stepLabelOfFirst: '{step}: {value}, {percent} of {first}',
    stepLabelFromBase: '{step}: {value}, {percent} of {first}, {conversion} from {base}',
  },
  gantt: {
    label: 'Project timeline',
    taskHeader: 'Task',
    milestone: 'Milestone: {description}',
    taskLabel: '{name}, {dates}',
    taskLabelProgress: '{name}, {dates}, {progress}% done',
  },
  heatmap: {
    label: 'Activity',
    less: 'Less',
    more: 'More',
    valueLabel: 'Value',
  },
  lineChart: {
    label: 'Line chart',
    instructions: '{label}. Use arrow keys to read values.',
    chart: 'Chart',
    table: 'Table',
    periodHeader: 'Period',
  },
  radarChart: {
    label: 'Radar chart',
  },
  sparkline: {
    label: 'Trend',
  },
});
