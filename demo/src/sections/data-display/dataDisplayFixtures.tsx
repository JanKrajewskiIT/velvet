import { type TradingViewChartPoint, type TreeNode } from '@jankrajewskiit/ui';
import type { UTCTimestamp } from 'lightweight-charts';
import { IoDocumentText, IoFolder } from 'solid-icons/io';

export const asUtcTimestamp = (value: number): UTCTimestamp => value as UTCTimestamp;

export const TRADING_VIEW_SAMPLE: TradingViewChartPoint[] = [
  { time: asUtcTimestamp(1704067200), open: 2062.1, high: 2068.9, low: 2059.4, close: 2066.8, volume: 5420 },
  { time: asUtcTimestamp(1704153600), open: 2066.8, high: 2072.5, low: 2061.7, close: 2063.2, volume: 4880 },
  { time: asUtcTimestamp(1704240000), open: 2063.2, high: 2076.4, low: 2060.1, close: 2071.9, volume: 6170 },
  { time: asUtcTimestamp(1704326400), open: 2071.9, high: 2079.8, low: 2067.2, close: 2075.6, volume: 6430 },
  { time: asUtcTimestamp(1704412800), open: 2075.6, high: 2084.2, low: 2073.4, close: 2080.5, volume: 6810 },
  { time: asUtcTimestamp(1704499200), open: 2080.5, high: 2085.3, low: 2074.8, close: 2078.1, volume: 5290 },
  { time: asUtcTimestamp(1704585600), open: 2078.1, high: 2088.6, low: 2076.4, close: 2086.4, volume: 7140 },
  { time: asUtcTimestamp(1704672000), open: 2086.4, high: 2091.7, low: 2080.2, close: 2082.3, volume: 5660 },
  { time: asUtcTimestamp(1704758400), open: 2082.3, high: 2096.5, low: 2079.6, close: 2093.8, volume: 7350 },
  { time: asUtcTimestamp(1704844800), open: 2093.8, high: 2101.1, low: 2089.1, close: 2098.6, volume: 7820 },
  { time: asUtcTimestamp(1704931200), open: 2098.6, high: 2104.2, low: 2092.7, close: 2095.1, volume: 6080 },
  { time: asUtcTimestamp(1705017600), open: 2095.1, high: 2107.4, low: 2091.5, close: 2103.9, volume: 7560 },
];

export const createBarGenerator = (initialTime: UTCTimestamp, initialPrice: number) => {
  let cursor = initialTime;
  let price = initialPrice;
  return (): TradingViewChartPoint => {
    cursor = asUtcTimestamp(cursor + 60 * 60);
    const open = price;
    const drift = (Math.random() - 0.5) * 11;
    const close = Math.max(1, open + drift);
    const high = Math.max(open, close) + Math.random() * 5.5;
    const low = Math.min(open, close) - Math.random() * 5.2;
    const volume = 5200 + Math.random() * 2600;
    price = close;
    return {
      time: cursor,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(0)),
    };
  };
};

export const comparisonAxes = [
  { key: 'salary', label: 'Salary' },
  { key: 'stack', label: 'Tech stack' },
  { key: 'growth', label: 'Growth' },
  { key: 'flexibility', label: 'Flexibility' },
];

export const comparisonDatasets = [
  { label: 'Velvet Labs', values: [88, 92, 84, 73], color: '#1d4ed8' },
  { label: 'Signal Forge', values: [79, 86, 77, 91], color: '#059669' },
];

export const comparisonColumns = [
  { label: 'Velvet Labs', description: 'Platform team', accentColor: '#1d4ed8' },
  { label: 'Signal Forge', description: 'Product engineering', accentColor: '#059669' },
];

export const comparisonRows = [
  { label: 'Compensation', values: ['22-28k PLN B2B', '20-25k PLN B2B'] },
  { label: 'Work mode', values: ['Hybrid, 2 days office', 'Remote first'] },
  { label: 'Hiring process', values: ['3 stages', '4 stages'] },
];

export const isTradingPoint = (value: unknown): value is TradingViewChartPoint => {
  if (!value || typeof value !== 'object') return false;
  return (
    'time' in value && 'open' in value && 'high' in value && 'low' in value && 'close' in value && 'volume' in value
  );
};

export const createCodeSample = (buttonLabel: string) => `import { Button } from '@jankrajewskiit/ui';

const App = () => {
  return <Button variant="primary">${buttonLabel}</Button>;
};

export default App;`;

export const createTreeData = (): TreeNode[] => [
  {
    id: 'src',
    label: 'src',
    icon: <IoFolder />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <IoFolder />,
        children: [
          { id: 'button', label: 'Button.tsx', icon: <IoDocumentText /> },
          { id: 'input', label: 'Input.tsx', icon: <IoDocumentText /> },
        ],
      },
      { id: 'index', label: 'index.ts', icon: <IoDocumentText /> },
    ],
  },
  {
    id: 'lazy-modules',
    label: 'lazy-modules',
    icon: <IoFolder />,
    hasChildren: true,
  },
  {
    id: 'package',
    label: 'package.json',
    icon: <IoDocumentText />,
  },
];
