import { createSignal, For } from 'solid-js';
import { Button } from '../../../src/components/actions/Button';
import {
  BarChart,
  type ChartDatum,
  ComparisonBar,
  ComparisonDialog,
  type ComparisonItem,
  type ComparisonRow,
  DonutChart,
  FunnelChart,
  Gantt,
  type GanttScale,
  type GanttTask,
  Gauge,
  type GaugeThreshold,
  Heatmap,
  type HeatmapCell,
  type HeatmapPoint,
  LineChart,
  RadarChart,
  Sparkline,
} from '../../../src/components/charts';
import { Text } from '../../../src/components/primitives/Text';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SESSIONS = [12, 18, 15, 22, 28, 9, 6];
const PAID = [4, 7, 6, 9, 12, 3, 2];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const REVENUE_2026 = [12400, 13100, 12900, 15200, 16800, 16100, 18400, 19900, 21300, 22800];
const REVENUE_2025 = [9800, 10400, 11200, 11000, 12600, 13300, 13900, 14100, 15800, 16400];
const SPARK = [4, 6, 5, 8, 7, 11, 9, 13, 12, 16];
const SPARK_LABELS = MONTHS;
const HEAT_END = '2026-10-04';
const SHORT_WEEKS = 20;
const LONG_WEEKS = 52;
const DAY_MS = 864e5;

const BAR_DATA: ChartDatum[] = WEEKDAYS.map((label, i) => ({
  label,
  value: SESSIONS[i] ?? 0,
  free: SESSIONS[i] ?? 0,
  paid: PAID[i] ?? 0,
}));
const LINE_DATA: ChartDatum[] = MONTHS.map((label, i) => ({
  label,
  value: REVENUE_2026[i] ?? 0,
  prev: REVENUE_2025[i] ?? 0,
}));
const THRESHOLDS: GaugeThreshold[] = [
  { value: 70, tone: 'warning' },
  { value: 90, tone: 'danger' },
];

const RADAR_AXES = [
  { key: 'craft', label: 'Craft' },
  { key: 'systems', label: 'Systems' },
  { key: 'research', label: 'Research' },
  { key: 'writing', label: 'Writing' },
  { key: 'lead', label: 'Leadership' },
  { key: 'delivery', label: 'Delivery' },
];

const CANDIDATES: ComparisonItem[] = [
  {
    id: 'anna',
    label: 'Anna Kowalska',
    description: 'Senior designer',
    score: '92',
    scores: { craft: 95, systems: 90, research: 60, writing: 80, lead: 70, delivery: 88 },
  },
  {
    id: 'marek',
    label: 'Marek Nowak',
    description: 'Engineering manager',
    score: '88',
    scores: { craft: 70, systems: 85, research: 75, writing: 72, lead: 94, delivery: 90 },
  },
  {
    id: 'ewa',
    label: 'Ewa Zielińska',
    description: 'Product designer',
    score: '81',
    scores: { craft: 82, systems: 70, research: 90, writing: 85, lead: 65, delivery: 74 },
  },
];

const COMPARE_ROWS: ComparisonRow[] = [
  { label: 'Experience', hint: 'years', values: [9, 12, 6], best: 'max' },
  {
    label: 'Salary ask',
    hint: 'PLN / month',
    values: [24000, 28000, 21000],
    best: 'min',
    format: (v) => (typeof v === 'number' ? v.toLocaleString() : (v ?? '—')),
  },
  { label: 'Notice period', values: ['1 month', '3 months', '2 weeks'] },
];

const FUNNEL = [
  { label: 'Applied', value: 1840 },
  { label: 'Screened', value: 920 },
  { label: 'Interviewed', value: 310 },
  { label: 'Offered', value: 84 },
  { label: 'Hired', value: 61 },
];

const STAGES = [
  { label: 'Team', value: 1240 },
  { label: 'Business', value: 860 },
  { label: 'Starter', value: 540 },
  { label: 'Enterprise', value: 210 },
];

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const heatData = (weeks: number, scale: number): HeatmapPoint[] => {
  const end = new Date(`${HEAT_END}T00:00:00`);
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const date = new Date(end.getTime() - i * DAY_MS);
    const weekday = date.getDay();
    const wave = Math.abs(Math.sin(i * 1.7) * Math.cos(i / 5));
    return { date: isoDay(date), value: weekday === 0 || weekday === 6 ? 0 : Math.round(wave * scale) };
  });
};

const GANTT_TASKS: GanttTask[] = [
  { id: 'brief', name: 'Discovery brief', start: '2026-10-01', end: '2026-10-05', group: 'Plan', progress: 100 },
  { id: 'kickoff', name: 'Kick-off', start: '2026-10-06', milestone: true, group: 'Plan', dependsOn: 'brief' },
  {
    id: 'design',
    name: 'Design system',
    start: '2026-10-07',
    end: '2026-10-16',
    group: 'Build',
    progress: 55,
    dependsOn: 'kickoff',
  },
  {
    id: 'build',
    name: 'Implementation',
    start: '2026-10-12',
    end: '2026-10-28',
    group: 'Build',
    progress: 20,
    dependsOn: 'design',
  },
  { id: 'qa', name: 'QA', start: '2026-10-26', end: '2026-10-30', group: 'Ship', dependsOn: 'build' },
  { id: 'launch', name: 'Launch', start: '2026-11-02', milestone: true, group: 'Ship', dependsOn: 'qa' },
];
const GANTT_SCALES: GanttScale[] = ['day', 'week', 'month'];
const GANTT_TODAY = '2026-10-08';

const GaugeDemo = () => {
  const [value, setValue] = createSignal(62);
  return (
    <>
      <Gauge value={value()} unit="%" label="CPU" caption="8 cores" thresholds={THRESHOLDS} size="lg" />
      <Button size="xs" variant="secondary" onClick={() => setValue((v) => (v + 11) % 101)}>
        Change value ({value()})
      </Button>
    </>
  );
};

const HeatmapDemo = () => {
  const [picked, setPicked] = createSignal<HeatmapCell>();
  return (
    <>
      <Heatmap
        data={heatData(SHORT_WEEKS, 14)}
        end={HEAT_END}
        weeks={SHORT_WEEKS}
        unit="sessions"
        label="Last 20 weeks"
        onCellClick={setPicked}
      />
      <Text variant="caption" tone="tertiary">
        {picked() ? `Picked ${picked()?.date}: ${picked()?.value}` : 'Click a day to pick it.'}
      </Text>
    </>
  );
};

const GanttDemo = () => {
  const [scale, setScale] = createSignal<GanttScale>('day');
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <For each={GANTT_SCALES}>
          {(s) => (
            <Button
              size="xs"
              variant={scale() === s ? 'primary' : 'secondary'}
              aria-pressed={scale() === s}
              onClick={() => setScale(s)}
            >
              {s}
            </Button>
          )}
        </For>
      </div>
      <Gantt tasks={GANTT_TASKS} scale={scale()} today={GANTT_TODAY} height={320} />
    </>
  );
};

const ComparisonDemo = () => {
  const [selected, setSelected] = createSignal<string[]>(['anna', 'marek']);
  const [open, setOpen] = createSignal(false);
  const [insightsStatus, setInsightsStatus] = createSignal<'idle' | 'loading'>('idle');
  const [insights, setInsights] = createSignal<string>();
  const items = () => CANDIDATES.filter((c) => selected().includes(c.id));
  const toggle = (id: string) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const generate = () => {
    setInsightsStatus('loading');
    setTimeout(() => {
      setInsights('Anna is the stronger systems hire; Marek brings the leadership the role lists as a must.');
      setInsightsStatus('idle');
    }, 900);
  };
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-2)', 'flex-wrap': 'wrap' }}>
        <For each={CANDIDATES}>
          {(c) => (
            <Button
              size="sm"
              variant={selected().includes(c.id) ? 'soft' : 'secondary'}
              aria-pressed={selected().includes(c.id)}
              onClick={() => toggle(c.id)}
            >
              {c.label}
            </Button>
          )}
        </For>
      </div>
      <ComparisonBar
        floating={false}
        items={items()}
        noun={['candidate', 'candidates']}
        onRemove={toggle}
        onClear={() => setSelected([])}
        onCompare={() => setOpen(true)}
      />
      <ComparisonDialog
        open={open()}
        onClose={() => setOpen(false)}
        title="Candidate comparison"
        items={items()}
        axes={RADAR_AXES}
        rows={COMPARE_ROWS}
        insights={insights()}
        insightsStatus={insightsStatus()}
        onGenerateInsights={generate}
      />
    </>
  );
};

export const chartsDemos: DemoEntry[] = [
  {
    id: 'bar-chart',
    group: '25 Data viz',
    title: 'BarChart',
    description:
      'Grouped or stacked bars. Hover, or focus and use the arrow keys to read each group; the values are announced.',
    render: () => (
      <>
        <Example
          title="Single series"
          stack
          code={'<BarChart data={[{ label: \'Mon\', value: 12 }]} label="Sessions per weekday" />'}
        >
          <BarChart data={BAR_DATA} label="Sessions per weekday" />
        </Example>
        <Example
          title="Stacked, two series"
          stack
          code={
            "<BarChart stacked data={data} series={[{ key: 'free', label: 'Free' }, { key: 'paid', label: 'Paid' }]} />"
          }
        >
          <BarChart
            stacked
            data={BAR_DATA}
            series={[
              { key: 'free', label: 'Free' },
              { key: 'paid', label: 'Paid' },
            ]}
            height={220}
            label="Sessions by plan"
          />
        </Example>
      </>
    ),
  },
  {
    id: 'line-chart',
    group: '25 Data viz',
    title: 'LineChart',
    description:
      'Line and area chart with a crosshair. The Table toggle shows the same data as an accessible table with period-over-period change.',
    render: () => (
      <>
        <Example
          title="Two series"
          stack
          code={
            "<LineChart data={data} series={[{ key: 'value', label: '2026' }, { key: 'prev', label: '2025', color: 'var(--dv-8)' }]} />"
          }
        >
          <LineChart
            data={LINE_DATA}
            series={[
              { key: 'value', label: '2026' },
              { key: 'prev', label: '2025', color: 'var(--dv-8)' },
            ]}
            format={(v) => `€${(v / 1000).toFixed(1)}k`}
            label="Revenue"
          />
        </Example>
        <Example
          title="Single series, straight lines, no area"
          stack
          code={'<LineChart data={data} curved={false} area={false} />'}
        >
          <LineChart data={LINE_DATA} curved={false} area={false} height={200} label="Revenue 2026" />
        </Example>
        <Example title="Starts as table" stack code={'<LineChart data={data} showTable />'}>
          <LineChart data={LINE_DATA.slice(0, 5)} showTable label="Revenue 2026" />
        </Example>
      </>
    ),
  },
  {
    id: 'donut-chart',
    group: '25 Data viz',
    title: 'DonutChart',
    description: 'Part-to-whole with an interactive legend. Click an entry to exclude it and recut the rest.',
    render: () => (
      <>
        <Example title="Default" code={'<DonutChart data={data} centerLabel="Accounts" />'}>
          <DonutChart data={STAGES} size={190} centerLabel="Accounts" label="Accounts by plan" />
        </Example>
        <Example
          title="Thin ring, custom colours"
          code={"<DonutChart thickness={12} data={[{ label: 'Won', value: 40, color: 'var(--dv-3)' }]} />"}
        >
          <DonutChart
            thickness={12}
            size={160}
            centerLabel="Deals"
            label="Deals by outcome"
            data={[
              { label: 'Won', value: 40, color: 'var(--dv-3)' },
              { label: 'Lost', value: 25, color: 'var(--dv-5)' },
              { label: 'Open', value: 35, color: 'var(--dv-1)' },
            ]}
          />
        </Example>
      </>
    ),
  },
  {
    id: 'funnel-chart',
    group: '25 Data viz',
    title: 'FunnelChart',
    description: 'Conversion funnel with drop-off between steps. Each step is focusable and reads its numbers aloud.',
    render: () => (
      <>
        <Example title="Against the previous step" stack code={'<FunnelChart data={data} label="Hiring funnel Q3" />'}>
          <FunnelChart data={FUNNEL} label="Hiring funnel Q3" />
        </Example>
        <Example
          title="Against the first step, no conversion rows"
          stack
          code={'<FunnelChart data={data} relativeTo="first" showConversion={false} />'}
        >
          <FunnelChart data={FUNNEL} relativeTo="first" showConversion={false} label="Hiring funnel Q3" />
        </Example>
      </>
    ),
  },
  {
    id: 'gauge',
    group: '25 Data viz',
    title: 'Gauge',
    description:
      'Half-circle meter for one value against a range. Thresholds recolour the arc and add a notch; the number is always printed.',
    render: () => (
      <>
        <Example
          title="Thresholds"
          code={
            '<Gauge value={78} unit="%" label="Memory" thresholds={[{ value: 70, tone: \'warning\' }, { value: 90, tone: \'danger\' }]} />'
          }
        >
          <Gauge value={42} unit="%" label="Disk" caption="420 / 1000 GB" thresholds={THRESHOLDS} />
          <Gauge value={78} unit="%" label="Memory" caption="12.5 / 16 GB" thresholds={THRESHOLDS} />
          <Gauge value={94} unit="%" label="Error budget used" caption="this month" thresholds={THRESHOLDS} />
        </Example>
        <Example
          title="Custom range and size"
          code={'<Gauge value={64} min={-100} max={100} label="NPS" tone="success" size="sm" />'}
        >
          <Gauge value={64} min={-100} max={100} label="NPS" tone="success" size="sm" />
        </Example>
        <Example title="Live value" code={'<Gauge value={value()} size="lg" />'}>
          <GaugeDemo />
        </Example>
      </>
    ),
  },
  {
    id: 'heatmap',
    group: '25 Data viz',
    title: 'Heatmap',
    description:
      'Calendar density grid. Arrow through days (left/right = week, up/down = day, Home/End); every cell has a spoken label.',
    render: () => (
      <>
        <Example
          title="20 weeks, clickable"
          stack
          code={'<Heatmap data={data} weeks={20} unit="sessions" onCellClick={setPicked} />'}
        >
          <HeatmapDemo />
        </Example>
        <Example
          title="A year, fixed thresholds"
          stack
          code={'<Heatmap data={data} weeks={52} cellMax={11} thresholds={[2, 4, 6]} unit="commits" />'}
        >
          <Heatmap
            data={heatData(LONG_WEEKS, 9)}
            end={HEAT_END}
            weeks={LONG_WEEKS}
            cellMax={11}
            thresholds={[2, 4, 6]}
            unit="commits"
            label="Last year"
          />
        </Example>
      </>
    ),
  },
  {
    id: 'radar-chart',
    group: '25 Data viz',
    title: 'RadarChart',
    description:
      'Compare 1–3 profiles across 5–8 dimensions. The legend toggles series; every value is in the accessible name.',
    render: () => (
      <>
        <Example
          title="Two series"
          code={
            "<RadarChart axes={axes} max={5} series={[{ label: 'Anna', values }, { label: 'Role target', values }]} />"
          }
        >
          <RadarChart
            axes={RADAR_AXES}
            max={5}
            label="Skill profile"
            series={[
              { label: 'Anna', values: { craft: 5, systems: 4.5, research: 3, writing: 4, lead: 3.5, delivery: 4 } },
              {
                label: 'Role target',
                values: { craft: 4, systems: 4, research: 4, writing: 3.5, lead: 4, delivery: 4 },
              },
            ]}
          />
        </Example>
        <Example title="Single series, outline only" code={'<RadarChart fill={false} showLegend={false} … />'}>
          <RadarChart
            axes={RADAR_AXES}
            max={5}
            fill={false}
            size={260}
            label="Team health"
            series={[
              { label: 'Team', values: { craft: 3, systems: 4, research: 2, writing: 3, lead: 5, delivery: 4 } },
            ]}
          />
        </Example>
      </>
    ),
  },
  {
    id: 'sparkline',
    group: '25 Data viz',
    title: 'Sparkline',
    description: 'Tiny inline trend. Scrub with the mouse or focus and use the arrow keys; the readout is announced.',
    render: () => (
      <>
        <Example title="Line and area" stack code={'<Sparkline data={data} labels={labels} area label="Signups" />'}>
          <Sparkline data={SPARK} labels={SPARK_LABELS} label="Signups" area={false} />
          <Sparkline data={SPARK} labels={SPARK_LABELS} label="Signups" />
        </Example>
        <Example
          title="Height and colour"
          stack
          code={'<Sparkline data={data} height={64} color="var(--status-success-solid)" />'}
        >
          <Sparkline
            data={SPARK}
            height={64}
            color="var(--status-success-solid)"
            format={(v) => `${v} signups`}
            label="Signups"
          />
          <Sparkline data={[...SPARK].reverse()} color="var(--status-danger-solid)" label="Churn" />
        </Example>
      </>
    ),
  },
  {
    id: 'gantt',
    group: '25 Data viz',
    title: 'Gantt',
    description:
      'Timeline with groups, milestones, progress and finish-to-start dependencies. Bars are buttons that read name, dates and progress.',
    render: () => (
      <Example title="Scales" stack code={'<Gantt tasks={tasks} scale="week" height={320} />'}>
        <GanttDemo />
      </Example>
    ),
  },
  {
    id: 'comparison',
    group: '25 Data viz',
    title: 'ComparisonBar and ComparisonDialog',
    description:
      'Pick 2–4 things, then compare them side by side in a dialog with radar, criteria table (best values starred) and on-demand insights.',
    render: () => (
      <Example
        title="Selection tray and dialog"
        stack
        code={
          '<ComparisonBar items={items} onCompare={open} />\n<ComparisonDialog open items={items} axes={axes} rows={rows} />'
        }
      >
        <ComparisonDemo />
      </Example>
    ),
  },
];
