import {
  type CandlestickData,
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  type HistogramData,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  LineSeries,
  LineStyle,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import type { JSX } from 'solid-js';
import { createEffect, createMemo, createSignal, For, onCleanup, onMount, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TradingViewChart.module.css';

interface TradingViewChartPoint {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingViewDrawPoint {
  time: UTCTimestamp;
  price: number;
}

interface TradingViewTrendLine {
  id: string;
  from: TradingViewDrawPoint;
  to: TradingViewDrawPoint;
  color?: string;
}

interface TradingViewLevelLine {
  id: string;
  price: number;
  color?: string;
}

interface TradingViewZone {
  id: string;
  fromTime: UTCTimestamp;
  toTime: UTCTimestamp;
  low: number;
  high: number;
  color?: string;
}

interface TradingViewDrawings {
  trendLines: TradingViewTrendLine[];
  levels: TradingViewLevelLine[];
  zones: TradingViewZone[];
}

type TradingViewDrawingTool = 'none' | 'trendline' | 'level' | 'zone';
type TradingViewLiveFeedMode = 'polling' | 'websocket';

interface TradingViewFeedContext {
  symbol: string;
  interval: string;
  lastBar?: TradingViewChartPoint;
}

interface TradingViewLiveFeedConfig {
  mode: TradingViewLiveFeedMode;
  enabled?: boolean;
  intervalMs?: number;
  poll?: (
    context: TradingViewFeedContext
  ) =>
    | TradingViewChartPoint
    | TradingViewChartPoint[]
    | null
    | Promise<TradingViewChartPoint | TradingViewChartPoint[] | null>;
  subscribe?: (
    emit: (bars: TradingViewChartPoint | TradingViewChartPoint[]) => void,
    context: TradingViewFeedContext
  ) => (() => void) | undefined;
}

interface TradingViewChartProps extends DivCoreNativeProps {
  symbol?: string;
  data?: TradingViewChartPoint[];
  height?: number;
  intervalOptions?: string[];
  defaultInterval?: string;
  maxPoints?: number;
  liveFeed?: TradingViewLiveFeedConfig;
  drawings?: Partial<TradingViewDrawings>;
  defaultDrawingTool?: TradingViewDrawingTool;
  onDrawingsChange?: (drawings: TradingViewDrawings) => void;
}

interface ToolbarToggle {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const DEFAULT_HEIGHT = 520;
const DEFAULT_POINTS = 240;
const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d'];
const INTERVAL_SECONDS: Record<string, number> = {
  '1m': 60,
  '5m': 5 * 60,
  '15m': 15 * 60,
  '1h': 60 * 60,
  '4h': 4 * 60 * 60,
  '1d': 24 * 60 * 60,
};

interface ChartPalette {
  bg: string;
  surface: string;
  border: string;
  text: string;
  mutedText: string;
  primary: string;
  success: string;
  error: string;
  info: string;
  warning: string;
}

const readToken = (element: HTMLElement, token: string) =>
  getComputedStyle(element).getPropertyValue(token).trim() || 'currentColor';

const resolvePalette = (element: HTMLElement): ChartPalette => ({
  bg: readToken(element, '--color-bg'),
  surface: readToken(element, '--color-bg-elevated'),
  border: readToken(element, '--color-border'),
  text: readToken(element, '--color-text'),
  mutedText: readToken(element, '--color-text-muted'),
  primary: readToken(element, '--color-primary'),
  success: readToken(element, '--color-success'),
  error: readToken(element, '--color-error'),
  info: readToken(element, '--color-info'),
  warning: readToken(element, '--color-warning'),
});

const toFixed = (value: number, digits = 2) => value.toFixed(digits);

const intervalToSeconds = (interval: string) => INTERVAL_SECONDS[interval] ?? 60 * 60;
const getDrawingId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;

const generateDemoData = (interval: string, size = DEFAULT_POINTS): TradingViewChartPoint[] => {
  const step = intervalToSeconds(interval);
  const end = Math.floor(Date.now() / 1000);
  const start = end - step * size;
  let previousClose = 2890;

  return Array.from({ length: size }, (_, index) => {
    const time = (start + index * step) as UTCTimestamp;
    const trend = Math.sin(index / 13) * 8 + Math.cos(index / 34) * 5;
    const drift = Math.sin(index / 71) * 3.5;
    const open = previousClose;
    const close = Math.max(1, open + trend * 0.18 + drift * 0.12);
    const high = Math.max(open, close) + Math.abs(Math.sin(index / 7)) * 4.2 + 0.4;
    const low = Math.min(open, close) - Math.abs(Math.cos(index / 9)) * 4.1 - 0.4;
    const volume = 1200 + Math.abs(close - open) * 550 + Math.abs(Math.sin(index / 5)) * 900;
    previousClose = close;

    return {
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(0)),
    };
  });
};

const createSimpleMovingAverage = (data: TradingViewChartPoint[], period: number) =>
  data.map((entry, index) => {
    const start = Math.max(0, index - period + 1);
    const window = data.slice(start, index + 1);
    const average = window.reduce((sum, item) => sum + item.close, 0) / Math.max(window.length, 1);
    return { time: entry.time, value: Number(average.toFixed(2)) };
  });

const createExponentialMovingAverage = (data: TradingViewChartPoint[], period: number) => {
  const multiplier = 2 / (period + 1);
  let previousEma = data[0]?.close ?? 0;
  return data.map((entry, index) => {
    if (index === 0) {
      previousEma = entry.close;
      return { time: entry.time, value: Number(previousEma.toFixed(2)) };
    }
    previousEma = entry.close * multiplier + previousEma * (1 - multiplier);
    return { time: entry.time, value: Number(previousEma.toFixed(2)) };
  });
};

const createRsi = (data: TradingViewChartPoint[], period: number) => {
  if (data.length === 0) return [];
  const result: Array<{ time: UTCTimestamp; value: number }> = [];
  const first = data[0];
  if (!first) return result;
  let averageGain = 0;
  let averageLoss = 0;
  for (let i = 1; i <= period && i < data.length; i++) {
    const current = data[i];
    const previous = data[i - 1];
    if (!current || !previous) continue;
    const diff = current.close - previous.close;
    if (diff >= 0) averageGain += diff;
    else averageLoss += Math.abs(diff);
  }
  averageGain /= period;
  averageLoss /= period;
  result.push({ time: first.time, value: 50 });
  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const previous = data[i - 1];
    if (!current || !previous) continue;
    const diff = current.close - previous.close;
    const gain = Math.max(diff, 0);
    const loss = Math.max(-diff, 0);
    if (i <= period) {
      const rs = averageLoss === 0 ? 100 : averageGain / averageLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push({ time: current.time, value: Number(rsi.toFixed(2)) });
      continue;
    }
    averageGain = (averageGain * (period - 1) + gain) / period;
    averageLoss = (averageLoss * (period - 1) + loss) / period;
    const rs = averageLoss === 0 ? 100 : averageGain / averageLoss;
    const rsi = 100 - 100 / (1 + rs);
    result.push({ time: current.time, value: Number(rsi.toFixed(2)) });
  }
  return result;
};

const createMacd = (data: TradingViewChartPoint[]) => {
  const fast = createExponentialMovingAverage(data, 12);
  const slow = createExponentialMovingAverage(data, 26);
  const macdLine = data.map((item, index) => {
    const value = (fast[index]?.value ?? 0) - (slow[index]?.value ?? 0);
    return { time: item.time, value: Number(value.toFixed(4)) };
  });
  const signalInput = macdLine.map((item) => ({ ...item, close: item.value }));
  const signalLine = createExponentialMovingAverage(
    signalInput.map((item) => ({
      time: item.time,
      open: item.close,
      high: item.close,
      low: item.close,
      close: item.close,
      volume: 0,
    })),
    9
  );
  const histogram = macdLine.map((item, index) => {
    const signal = signalLine[index]?.value ?? 0;
    const value = Number((item.value - signal).toFixed(4));
    return { time: item.time, value };
  });
  return { macdLine, signalLine, histogram };
};

const createBollingerBands = (data: TradingViewChartPoint[], period: number, multiplier: number) => {
  const basis = createSimpleMovingAverage(data, period);
  const upper = data.map((item, index) => {
    const start = Math.max(0, index - period + 1);
    const window = data.slice(start, index + 1).map((entry) => entry.close);
    const mean = basis[index]?.value ?? item.close;
    const variance = window.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(window.length, 1);
    const standardDeviation = Math.sqrt(variance);
    return { time: item.time, value: Number((mean + standardDeviation * multiplier).toFixed(2)) };
  });
  const lower = data.map((item, index) => {
    const start = Math.max(0, index - period + 1);
    const window = data.slice(start, index + 1).map((entry) => entry.close);
    const mean = basis[index]?.value ?? item.close;
    const variance = window.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(window.length, 1);
    const standardDeviation = Math.sqrt(variance);
    return { time: item.time, value: Number((mean - standardDeviation * multiplier).toFixed(2)) };
  });
  return { basis, upper, lower };
};

const isCandlestickData = (value: unknown): value is CandlestickData =>
  typeof value === 'object' &&
  value !== null &&
  'open' in value &&
  'high' in value &&
  'low' in value &&
  'close' in value &&
  'time' in value;

const timeKey = (time: Time) => (typeof time === 'object' ? `${time.year}-${time.month}-${time.day}` : String(time));
const isBusinessDay = (value: unknown): value is { year: number; month: number; day: number } =>
  typeof value === 'object' && value !== null && 'year' in value && 'month' in value && 'day' in value;

const TradingViewChart = (props: Props<TradingViewChartProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'symbol',
    'data',
    'height',
    'intervalOptions',
    'defaultInterval',
    'class',
    'maxPoints',
    'liveFeed',
    'drawings',
    'defaultDrawingTool',
    'onDrawingsChange',
  ]);
  const [showVolume, setShowVolume] = createSignal(true);
  const [showSma, setShowSma] = createSignal(true);
  const [showEma, setShowEma] = createSignal(true);
  const [showRsi, setShowRsi] = createSignal(true);
  const [showMacd, setShowMacd] = createSignal(true);
  const [showBb, setShowBb] = createSignal(true);
  const [hoveredBar, setHoveredBar] = createSignal<TradingViewChartPoint | undefined>();
  const [runtimeData, setRuntimeData] = createSignal<TradingViewChartPoint[]>([]);
  const [activeInterval, setActiveInterval] = createSignal(local.defaultInterval ?? INTERVALS[3] ?? '1h');
  const [activeTool, setActiveTool] = createSignal<TradingViewDrawingTool>(local.defaultDrawingTool ?? 'none');
  const [draftPoint, setDraftPoint] = createSignal<TradingViewDrawPoint | undefined>();
  const [trendLines, setTrendLines] = createSignal<TradingViewTrendLine[]>([]);
  const [levels, setLevels] = createSignal<TradingViewLevelLine[]>([]);
  const [zones, setZones] = createSignal<TradingViewZone[]>([]);
  const [overlayRevision, setOverlayRevision] = createSignal(0);
  const [chartSize, setChartSize] = createSignal({ width: 0, height: 0 });

  const intervals = createMemo(() => local.intervalOptions ?? INTERVALS);
  const baseData = createMemo(() =>
    local.data?.length ? local.data : generateDemoData(activeInterval(), DEFAULT_POINTS)
  );
  const chartData = createMemo(() => runtimeData());
  const chartDataByTime = createMemo(() => new Map(chartData().map((item) => [String(item.time), item])));
  const businessDayToTimestamp = createMemo(() => {
    const map = new Map<string, UTCTimestamp>();
    for (const item of chartData()) {
      const date = new Date(item.time * 1000);
      map.set(`${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`, item.time);
    }
    return map;
  });
  const currentBar = createMemo(() => hoveredBar() ?? chartData().at(-1));
  const chartHeight = createMemo(() => local.height ?? DEFAULT_HEIGHT);
  const smaData = createMemo(() => createSimpleMovingAverage(chartData(), 20));
  const emaData = createMemo(() => createExponentialMovingAverage(chartData(), 50));
  const rsiData = createMemo(() => createRsi(chartData(), 14));
  const macdData = createMemo(() => createMacd(chartData()));
  const bollingerData = createMemo(() => createBollingerBands(chartData(), 20, 2));
  const rsiDataByTime = createMemo(() => new Map(rsiData().map((item) => [String(item.time), item.value])));
  const macdDataByTime = createMemo(() => new Map(macdData().macdLine.map((item) => [String(item.time), item.value])));
  const macdSignalByTime = createMemo(
    () => new Map(macdData().signalLine.map((item) => [String(item.time), item.value]))
  );
  const bbUpperByTime = createMemo(() => new Map(bollingerData().upper.map((item) => [String(item.time), item.value])));
  const bbLowerByTime = createMemo(() => new Map(bollingerData().lower.map((item) => [String(item.time), item.value])));
  const indicatorSnapshot = createMemo(() => {
    const time = currentBar()?.time;
    if (!time) return undefined;
    const key = String(time);
    const rsi = rsiDataByTime().get(key);
    const macd = macdDataByTime().get(key);
    const signal = macdSignalByTime().get(key);
    const bbUpper = bbUpperByTime().get(key);
    const bbLower = bbLowerByTime().get(key);
    return { rsi, macd, signal, bbUpper, bbLower };
  });
  const chartSymbol = createMemo(() => local.symbol ?? 'XAUUSD');
  const draftPoints = createMemo(() => {
    const point = draftPoint();
    return point ? [point] : [];
  });
  const toggleIndicatorControls = createMemo<ToolbarToggle[]>(() => [
    {
      id: 'volume',
      label: t('trading.volumeShort'),
      active: showVolume(),
      onClick: () => setShowVolume((value) => !value),
    },
    {
      id: 'sma',
      label: t('trading.smaShort'),
      active: showSma(),
      onClick: () => setShowSma((value) => !value),
    },
    {
      id: 'ema',
      label: t('trading.emaShort'),
      active: showEma(),
      onClick: () => setShowEma((value) => !value),
    },
    {
      id: 'bb',
      label: t('trading.bbShort'),
      active: showBb(),
      onClick: () => setShowBb((value) => !value),
    },
    {
      id: 'rsi',
      label: t('trading.rsiShort'),
      active: showRsi(),
      onClick: () => setShowRsi((value) => !value),
    },
    {
      id: 'macd',
      label: t('trading.macdShort'),
      active: showMacd(),
      onClick: () => setShowMacd((value) => !value),
    },
  ]);
  const drawingControls = createMemo<ToolbarToggle[]>(() => [
    {
      id: 'trendline',
      label: t('trading.trendTool'),
      active: activeTool() === 'trendline',
      onClick: () => setActiveTool((tool) => (tool === 'trendline' ? 'none' : 'trendline')),
    },
    {
      id: 'level',
      label: t('trading.levelTool'),
      active: activeTool() === 'level',
      onClick: () => setActiveTool((tool) => (tool === 'level' ? 'none' : 'level')),
    },
    {
      id: 'zone',
      label: t('trading.zoneTool'),
      active: activeTool() === 'zone',
      onClick: () => setActiveTool((tool) => (tool === 'zone' ? 'none' : 'zone')),
    },
  ]);
  const metricItems = createMemo(() => {
    const bar = currentBar();
    const indicators = indicatorSnapshot();
    return [
      `O: ${toFixed(bar?.open ?? 0)}`,
      `H: ${toFixed(bar?.high ?? 0)}`,
      `L: ${toFixed(bar?.low ?? 0)}`,
      `C: ${toFixed(bar?.close ?? 0)}`,
      `V: ${toFixed(bar?.volume ?? 0, 0)}`,
      `RSI: ${toFixed(indicators?.rsi ?? 0)}`,
      `MACD: ${toFixed(indicators?.macd ?? 0, 4)}`,
      `SIG: ${toFixed(indicators?.signal ?? 0, 4)}`,
      `BB↑: ${toFixed(indicators?.bbUpper ?? 0)}`,
      `BB↓: ${toFixed(indicators?.bbLower ?? 0)}`,
    ];
  });
  const clearLabel = () => t('common.clear');
  const bbUpperTitle = () => t('trading.bbUpper');
  const bbBasisTitle = () => t('trading.bbBasis');
  const bbLowerTitle = () => t('trading.bbLower');
  const smaTitle = () => t('trading.sma20');
  const emaTitle = () => t('trading.ema50');
  const rsiTitle = () => t('trading.rsi14');
  const macdTitle = () => t('trading.macd');
  const macdSignalTitle = () => t('trading.macdSignal');
  const macdHistTitle = () => t('trading.macdHist');

  let wrapperRef: HTMLDivElement | undefined;
  let chartHostRef: HTMLDivElement | undefined;
  let overlayRef: SVGSVGElement | undefined;
  let chart: IChartApi | undefined;
  let candleSeries: ISeriesApi<'Candlestick'> | undefined;
  let volumeSeries: ISeriesApi<'Histogram'> | undefined;
  let smaSeries: ISeriesApi<'Line'> | undefined;
  let emaSeries: ISeriesApi<'Line'> | undefined;
  let bbUpperSeries: ISeriesApi<'Line'> | undefined;
  let bbBasisSeries: ISeriesApi<'Line'> | undefined;
  let bbLowerSeries: ISeriesApi<'Line'> | undefined;
  let rsiSeries: ISeriesApi<'Line'> | undefined;
  let macdSeries: ISeriesApi<'Line'> | undefined;
  let macdSignalSeries: ISeriesApi<'Line'> | undefined;
  let macdHistogramSeries: ISeriesApi<'Histogram'> | undefined;
  let rsiOverboughtLine: ReturnType<ISeriesApi<'Line'>['createPriceLine']> | undefined;
  let rsiOversoldLine: ReturnType<ISeriesApi<'Line'>['createPriceLine']> | undefined;
  let rsiMidLine: ReturnType<ISeriesApi<'Line'>['createPriceLine']> | undefined;
  let crosshairHandler: ((params: MouseEventParams) => void) | undefined;
  let themeObserver: MutationObserver | undefined;
  let timeRangeHandler: (() => void) | undefined;
  let sizeChangeHandler: (() => void) | undefined;
  let feedUnsubscribe: (() => void) | undefined;
  let feedTimer: ReturnType<typeof setInterval> | undefined;
  let latestDataByTime = new Map<string, TradingViewChartPoint>();
  let latestBar: TradingViewChartPoint | undefined;
  let skipFullRenderAtTime: UTCTimestamp | undefined;

  const applyChartTheme = () => {
    if (
      !wrapperRef ||
      !chart ||
      !candleSeries ||
      !smaSeries ||
      !emaSeries ||
      !volumeSeries ||
      !bbUpperSeries ||
      !bbBasisSeries ||
      !bbLowerSeries ||
      !rsiSeries ||
      !macdSeries ||
      !macdSignalSeries ||
      !macdHistogramSeries
    )
      return;
    const palette = resolvePalette(wrapperRef);

    chart.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: palette.bg },
        textColor: palette.text,
      },
      grid: {
        vertLines: { color: palette.border },
        horzLines: { color: palette.border },
      },
      rightPriceScale: { borderColor: palette.border },
      timeScale: { borderColor: palette.border },
      crosshair: {
        mode: CrosshairMode.MagnetOHLC,
        vertLine: { color: palette.primary, width: 1, style: LineStyle.Dashed },
        horzLine: { color: palette.primary, width: 1, style: LineStyle.Dashed },
      },
    });

    candleSeries.applyOptions({
      upColor: palette.success,
      downColor: palette.error,
      borderVisible: false,
      wickUpColor: palette.success,
      wickDownColor: palette.error,
      lastValueVisible: true,
      priceLineVisible: true,
    });

    volumeSeries.applyOptions({
      color: palette.mutedText,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    smaSeries.applyOptions({ color: palette.primary, lineWidth: 2 });
    emaSeries.applyOptions({ color: palette.info, lineWidth: 2 });
    bbUpperSeries.applyOptions({ color: palette.warning, lineWidth: 1, lineStyle: LineStyle.Dotted });
    bbBasisSeries.applyOptions({ color: palette.primary, lineWidth: 1, lineStyle: LineStyle.Dashed });
    bbLowerSeries.applyOptions({ color: palette.warning, lineWidth: 1, lineStyle: LineStyle.Dotted });
    rsiSeries.applyOptions({ color: palette.info, lineWidth: 2 });
    macdSeries.applyOptions({ color: palette.primary, lineWidth: 2 });
    macdSignalSeries.applyOptions({ color: palette.warning, lineWidth: 2 });
    macdHistogramSeries.applyOptions({ color: palette.mutedText, priceLineVisible: false, lastValueVisible: false });
    rsiOverboughtLine?.applyOptions({ color: palette.warning });
    rsiOversoldLine?.applyOptions({ color: palette.warning });
    rsiMidLine?.applyOptions({ color: palette.border });
  };

  const renderSeriesData = () => {
    if (
      !candleSeries ||
      !volumeSeries ||
      !smaSeries ||
      !emaSeries ||
      !bbUpperSeries ||
      !bbBasisSeries ||
      !bbLowerSeries ||
      !rsiSeries ||
      !macdSeries ||
      !macdSignalSeries ||
      !macdHistogramSeries
    )
      return;
    const palette = wrapperRef ? resolvePalette(wrapperRef) : undefined;
    const sma = smaData();
    const ema = emaData();
    const rsi = rsiData();
    const macd = macdData();
    const bollinger = bollingerData();

    const candles: CandlestickData<UTCTimestamp>[] = chartData().map((entry) => ({
      time: entry.time,
      open: entry.open,
      high: entry.high,
      low: entry.low,
      close: entry.close,
    }));

    const histogram: HistogramData<UTCTimestamp>[] = chartData().map((entry) => ({
      time: entry.time,
      value: entry.volume,
      color: entry.close >= entry.open ? (palette?.success ?? 'currentColor') : (palette?.error ?? 'currentColor'),
    }));

    candleSeries.setData(candles);
    volumeSeries.setData(showVolume() ? histogram : []);
    smaSeries.setData(showSma() ? sma : []);
    emaSeries.setData(showEma() ? ema : []);
    bbUpperSeries.setData(showBb() ? bollinger.upper : []);
    bbBasisSeries.setData(showBb() ? bollinger.basis : []);
    bbLowerSeries.setData(showBb() ? bollinger.lower : []);
    rsiSeries.setData(showRsi() ? rsi : []);
    macdSeries.setData(showMacd() ? macd.macdLine : []);
    macdSignalSeries.setData(showMacd() ? macd.signalLine : []);
    macdHistogramSeries.setData(
      showMacd()
        ? macd.histogram.map((item) => ({
            time: item.time,
            value: item.value,
            color: item.value >= 0 ? (palette?.success ?? 'currentColor') : (palette?.error ?? 'currentColor'),
          }))
        : []
    );
  };

  const updateSeriesIncrementally = (latestPoint: TradingViewChartPoint) => {
    if (
      !candleSeries ||
      !volumeSeries ||
      !smaSeries ||
      !emaSeries ||
      !bbUpperSeries ||
      !bbBasisSeries ||
      !bbLowerSeries ||
      !rsiSeries ||
      !macdSeries ||
      !macdSignalSeries ||
      !macdHistogramSeries
    )
      return false;

    const palette = wrapperRef ? resolvePalette(wrapperRef) : undefined;
    candleSeries.update({
      time: latestPoint.time,
      open: latestPoint.open,
      high: latestPoint.high,
      low: latestPoint.low,
      close: latestPoint.close,
    });

    if (showVolume()) {
      volumeSeries.update({
        time: latestPoint.time,
        value: latestPoint.volume,
        color:
          latestPoint.close >= latestPoint.open
            ? (palette?.success ?? 'currentColor')
            : (palette?.error ?? 'currentColor'),
      });
    }

    const lastSma = smaData().at(-1);
    if (showSma() && lastSma) smaSeries.update(lastSma);

    const lastEma = emaData().at(-1);
    if (showEma() && lastEma) emaSeries.update(lastEma);

    const bollinger = bollingerData();
    const lastBbUpper = bollinger.upper.at(-1);
    const lastBbBasis = bollinger.basis.at(-1);
    const lastBbLower = bollinger.lower.at(-1);
    if (showBb() && lastBbUpper && lastBbBasis && lastBbLower) {
      bbUpperSeries.update(lastBbUpper);
      bbBasisSeries.update(lastBbBasis);
      bbLowerSeries.update(lastBbLower);
    }

    const lastRsi = rsiData().at(-1);
    if (showRsi() && lastRsi) rsiSeries.update(lastRsi);

    const macd = macdData();
    const lastMacd = macd.macdLine.at(-1);
    const lastMacdSignal = macd.signalLine.at(-1);
    const lastHistogram = macd.histogram.at(-1);
    if (showMacd() && lastMacd && lastMacdSignal && lastHistogram) {
      macdSeries.update(lastMacd);
      macdSignalSeries.update(lastMacdSignal);
      macdHistogramSeries.update({
        time: lastHistogram.time,
        value: lastHistogram.value,
        color: lastHistogram.value >= 0 ? (palette?.success ?? 'currentColor') : (palette?.error ?? 'currentColor'),
      });
    }

    return true;
  };

  const fitChart = (fitContent = true) => {
    if (!chart || !chartHostRef) return;
    const width = chartHostRef.clientWidth;
    const height = chartHeight();
    setChartSize({ width, height });
    chart.applyOptions({ width, height });
    if (fitContent) chart.timeScale().fitContent();
    setOverlayRevision((value) => value + 1);
  };

  const mergeBars = (current: TradingViewChartPoint[], incoming: TradingViewChartPoint[], maxPoints: number) => {
    const map = new Map(current.map((item) => [String(item.time), item]));
    for (const bar of incoming) map.set(String(bar.time), bar);
    const merged = Array.from(map.values()).sort((a, b) => a.time - b.time);
    return merged.slice(Math.max(0, merged.length - maxPoints));
  };

  const toTimestampFromTime = (time: Time | null): UTCTimestamp | null => {
    if (!time) return null;
    if (typeof time === 'number') return time;
    if (typeof time === 'string') {
      const parsed = Date.parse(time);
      if (Number.isNaN(parsed)) return null;
      return Math.floor(parsed / 1000) as UTCTimestamp;
    }
    if (!isBusinessDay(time)) return null;
    return businessDayToTimestamp().get(`${time.year}-${time.month}-${time.day}`) ?? null;
  };

  const coordinateToDrawPoint = (x: number, y: number): TradingViewDrawPoint | undefined => {
    if (!chart || !candleSeries) return undefined;
    const time = toTimestampFromTime(chart.timeScale().coordinateToTime(x));
    const price = candleSeries.coordinateToPrice(y);
    if (!time || price === null) return undefined;
    return { time, price };
  };

  const timeToX = (time: UTCTimestamp) => chart?.timeScale().timeToCoordinate(time) ?? null;
  const priceToY = (price: number) => candleSeries?.priceToCoordinate(price) ?? null;

  const projectedTrendLines = createMemo(() => {
    overlayRevision();
    return trendLines()
      .map((line) => {
        const x1 = timeToX(line.from.time);
        const y1 = priceToY(line.from.price);
        const x2 = timeToX(line.to.time);
        const y2 = priceToY(line.to.price);
        if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
        return { ...line, x1, y1, x2, y2 };
      })
      .filter(Boolean) as Array<TradingViewTrendLine & { x1: number; y1: number; x2: number; y2: number }>;
  });

  const projectedLevels = createMemo(() => {
    overlayRevision();
    const width = chartSize().width;
    return levels()
      .map((level) => {
        const y = priceToY(level.price);
        if (y === null) return null;
        return { ...level, y, x2: width };
      })
      .filter(Boolean) as Array<TradingViewLevelLine & { y: number; x2: number }>;
  });

  const projectedZones = createMemo(() => {
    overlayRevision();
    return zones()
      .map((zone) => {
        const x1 = timeToX(zone.fromTime);
        const x2 = timeToX(zone.toTime);
        const y1 = priceToY(zone.high);
        const y2 = priceToY(zone.low);
        if (x1 === null || x2 === null || y1 === null || y2 === null) return null;
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        return { ...zone, left, top, width, height };
      })
      .filter(Boolean) as Array<TradingViewZone & { left: number; top: number; width: number; height: number }>;
  });

  const onDrawingsChange = () => {
    local.onDrawingsChange?.({
      trendLines: trendLines(),
      levels: levels(),
      zones: zones(),
    });
  };

  const clearCurrentTool = () => {
    const tool = activeTool();
    if (tool === 'trendline') setTrendLines([]);
    if (tool === 'level') setLevels([]);
    if (tool === 'zone') setZones([]);
    setDraftPoint(undefined);
    onDrawingsChange();
  };

  const handleOverlayPointerDown: JSX.EventHandlerUnion<SVGSVGElement, PointerEvent> = (event) => {
    if (!overlayRef) return;
    const tool = activeTool();
    if (tool === 'none') return;

    const rect = overlayRef.getBoundingClientRect();
    const point = coordinateToDrawPoint(event.clientX - rect.left, event.clientY - rect.top);
    if (!point) return;

    if (tool === 'level') {
      setLevels((prev) => [...prev, { id: getDrawingId('lvl'), price: point.price }]);
      setOverlayRevision((value) => value + 1);
      onDrawingsChange();
      return;
    }

    if (!draftPoint()) {
      setDraftPoint(point);
      return;
    }

    const start = draftPoint();
    if (!start) return;
    if (tool === 'trendline') {
      setTrendLines((prev) => [...prev, { id: getDrawingId('tl'), from: start, to: point }]);
    }
    if (tool === 'zone') {
      setZones((prev) => [
        ...prev,
        {
          id: getDrawingId('zn'),
          fromTime: Math.min(start.time, point.time) as UTCTimestamp,
          toTime: Math.max(start.time, point.time) as UTCTimestamp,
          high: Math.max(start.price, point.price),
          low: Math.min(start.price, point.price),
        },
      ]);
    }
    setDraftPoint(undefined);
    setOverlayRevision((value) => value + 1);
    onDrawingsChange();
  };

  onMount(() => {
    if (!chartHostRef || !wrapperRef) return;
    chart = createChart(chartHostRef, {
      width: chartHostRef.clientWidth,
      height: chartHeight(),
      autoSize: false,
      rightPriceScale: { scaleMargins: { top: 0.15, bottom: 0.22 } },
      timeScale: { timeVisible: true, secondsVisible: false, borderVisible: true },
      localization: { locale: t('trading.locale') },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    });

    candleSeries = chart.addSeries(CandlestickSeries);
    volumeSeries = chart.addSeries(
      HistogramSeries,
      {
        priceFormat: { type: 'volume' },
        priceScaleId: '',
        lastValueVisible: false,
        priceLineVisible: false,
      },
      1
    );
    bbUpperSeries = chart.addSeries(LineSeries, {
      title: bbUpperTitle(),
      priceLineVisible: false,
      lastValueVisible: false,
    });
    bbBasisSeries = chart.addSeries(LineSeries, {
      title: bbBasisTitle(),
      priceLineVisible: false,
      lastValueVisible: false,
    });
    bbLowerSeries = chart.addSeries(LineSeries, {
      title: bbLowerTitle(),
      priceLineVisible: false,
      lastValueVisible: false,
    });
    smaSeries = chart.addSeries(LineSeries, { title: smaTitle(), priceLineVisible: false, lastValueVisible: false });
    emaSeries = chart.addSeries(LineSeries, { title: emaTitle(), priceLineVisible: false, lastValueVisible: false });
    rsiSeries = chart.addSeries(LineSeries, { title: rsiTitle(), priceLineVisible: false, lastValueVisible: false }, 2);
    macdSeries = chart.addSeries(
      LineSeries,
      { title: macdTitle(), priceLineVisible: false, lastValueVisible: false },
      3
    );
    macdSignalSeries = chart.addSeries(
      LineSeries,
      { title: macdSignalTitle(), priceLineVisible: false, lastValueVisible: false },
      3
    );
    macdHistogramSeries = chart.addSeries(
      HistogramSeries,
      { title: macdHistTitle(), priceLineVisible: false, lastValueVisible: false },
      3
    );
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.7, bottom: 0 } });
    rsiSeries.priceScale().applyOptions({ scaleMargins: { top: 0.15, bottom: 0.15 } });
    macdSeries.priceScale().applyOptions({ scaleMargins: { top: 0.2, bottom: 0.2 } });
    macdSignalSeries.priceScale().applyOptions({ scaleMargins: { top: 0.2, bottom: 0.2 } });
    macdHistogramSeries.priceScale().applyOptions({ scaleMargins: { top: 0.2, bottom: 0.2 } });
    const palette = resolvePalette(wrapperRef);
    rsiOverboughtLine = rsiSeries.createPriceLine({
      price: 70,
      color: palette.warning,
      lineStyle: LineStyle.Dashed,
      lineWidth: 1,
    });
    rsiOversoldLine = rsiSeries.createPriceLine({
      price: 30,
      color: palette.warning,
      lineStyle: LineStyle.Dashed,
      lineWidth: 1,
    });
    rsiMidLine = rsiSeries.createPriceLine({
      price: 50,
      color: palette.border,
      lineStyle: LineStyle.Dotted,
      lineWidth: 1,
    });

    crosshairHandler = (params) => {
      if (!candleSeries) return;
      const data = params.seriesData.get(candleSeries);
      if (data && isCandlestickData(data)) {
        setHoveredBar(latestDataByTime.get(timeKey(data.time)));
        return;
      }
      setHoveredBar(undefined);
    };
    chart.subscribeCrosshairMove(crosshairHandler);
    timeRangeHandler = () => setOverlayRevision((value) => value + 1);
    sizeChangeHandler = () => setOverlayRevision((value) => value + 1);
    chart.timeScale().subscribeVisibleTimeRangeChange(timeRangeHandler);
    chart.timeScale().subscribeSizeChange(sizeChangeHandler);

    applyChartTheme();
    renderSeriesData();
    fitChart();

    const onResize = () => fitChart(false);
    window.addEventListener('resize', onResize);

    themeObserver = new MutationObserver(() => applyChartTheme());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    onCleanup(() => {
      window.removeEventListener('resize', onResize);
      if (themeObserver) themeObserver.disconnect();
      if (feedTimer) clearInterval(feedTimer);
      if (feedUnsubscribe) feedUnsubscribe();
      if (chart && crosshairHandler) chart.unsubscribeCrosshairMove(crosshairHandler);
      if (chart && timeRangeHandler) chart.timeScale().unsubscribeVisibleTimeRangeChange(timeRangeHandler);
      if (chart && sizeChangeHandler) chart.timeScale().unsubscribeSizeChange(sizeChangeHandler);
      if (chart) chart.remove();
      rsiOverboughtLine = undefined;
      rsiOversoldLine = undefined;
      rsiMidLine = undefined;
      chart = undefined;
    });
  });

  createEffect(() => {
    setRuntimeData(baseData());
    setHoveredBar(undefined);
  });

  createEffect(() => {
    latestBar = runtimeData().at(-1);
  });

  createEffect(() => {
    latestDataByTime = chartDataByTime();
  });

  createEffect(() => {
    if (!local.drawings) return;
    setTrendLines(local.drawings.trendLines ?? []);
    setLevels(local.drawings.levels ?? []);
    setZones(local.drawings.zones ?? []);
    setOverlayRevision((value) => value + 1);
  });

  createEffect(() => {
    activeTool();
    setDraftPoint(undefined);
  });

  createEffect(() => {
    if (feedTimer) clearInterval(feedTimer);
    if (feedUnsubscribe) feedUnsubscribe();
    feedTimer = undefined;
    feedUnsubscribe = undefined;

    if (!local.liveFeed?.enabled) return;

    const context = (): TradingViewFeedContext => ({
      symbol: chartSymbol(),
      interval: activeInterval(),
      lastBar: latestBar,
    });
    const maxPoints = local.maxPoints ?? 800;
    const append = (payload: TradingViewChartPoint | TradingViewChartPoint[]) => {
      const incoming = Array.isArray(payload) ? payload : [payload];
      let latestIncoming: TradingViewChartPoint | undefined;
      setRuntimeData((current) => {
        const merged = mergeBars(current, incoming, maxPoints);
        latestIncoming = incoming.reduce<TradingViewChartPoint | undefined>((latest, bar) => {
          if (!latest) return bar;
          return bar.time >= latest.time ? bar : latest;
        }, undefined);
        const mergedTail = merged.at(-1);
        const incomingTail = latestIncoming;
        const canIncremental =
          incoming.length === 1 &&
          Boolean(mergedTail) &&
          Boolean(incomingTail) &&
          mergedTail?.time === incomingTail?.time &&
          (incomingTail ? updateSeriesIncrementally(incomingTail) : false);
        if (canIncremental && incomingTail) {
          skipFullRenderAtTime = incomingTail.time;
          setOverlayRevision((value) => value + 1);
        }
        return merged;
      });
      if (!latestIncoming || skipFullRenderAtTime !== latestIncoming.time) {
        setOverlayRevision((value) => value + 1);
      }
    };

    if (local.liveFeed.mode === 'polling' && local.liveFeed.poll) {
      const runPoll = async () => {
        const result = await local.liveFeed?.poll?.(context());
        if (!result) return;
        append(result);
      };
      void runPoll();
      feedTimer = setInterval(
        () => {
          void runPoll();
        },
        local.liveFeed.intervalMs ?? intervalToSeconds(activeInterval()) * 1000
      );
    }

    if (local.liveFeed.mode === 'websocket' && local.liveFeed.subscribe) {
      const subscribe = local.liveFeed.subscribe;
      const handleFeedPayload = (payload: TradingViewChartPoint | TradingViewChartPoint[]) => {
        append(payload);
      };
      const initialContext: TradingViewFeedContext = {
        symbol: chartSymbol(),
        interval: activeInterval(),
        lastBar: latestBar,
      };
      const unsubscribe = subscribe(handleFeedPayload, initialContext);
      if (unsubscribe) feedUnsubscribe = unsubscribe;
    }
  });

  createEffect(() => {
    showVolume();
    showSma();
    showEma();
    showRsi();
    showMacd();
    showBb();
    const latestTime = chartData().at(-1)?.time;
    if (latestTime && skipFullRenderAtTime === latestTime) {
      skipFullRenderAtTime = undefined;
      fitChart(false);
      return;
    }
    skipFullRenderAtTime = undefined;
    renderSeriesData();
    fitChart(false);
  });

  return (
    <div {...rest} ref={wrapperRef} class={classNames(styles.root, local.class)}>
      <div class={styles.toolbar}>
        <div class={styles.toolbarGroup}>
          <Heading as="span" variant="titleMd" class={styles.symbol}>
            {chartSymbol()}
          </Heading>
          <For each={intervals()}>
            {(interval) => (
              <Button
                type="button"
                variant={activeInterval() === interval ? 'primary' : 'ghost'}
                size="sm"
                disabled={Boolean(local.data?.length)}
                onClick={() => setActiveInterval(interval)}
              >
                {interval}
              </Button>
            )}
          </For>
        </div>

        <div class={styles.toolbarGroup}>
          <For each={toggleIndicatorControls()}>
            {(control) => (
              <Button type="button" variant={control.active ? 'primary' : 'ghost'} size="sm" onClick={control.onClick}>
                {control.label}
              </Button>
            )}
          </For>
        </div>

        <div class={styles.toolbarGroup}>
          <For each={drawingControls()}>
            {(control) => (
              <Button type="button" variant={control.active ? 'primary' : 'ghost'} size="sm" onClick={control.onClick}>
                {control.label}
              </Button>
            )}
          </For>
          <Button type="button" variant="ghost" size="sm" onClick={clearCurrentTool}>
            {clearLabel()}
          </Button>
        </div>
      </div>

      <div class={styles.ohlcPanel}>
        <For each={metricItems()}>
          {(item) => (
            <Text as="span" variant="caption" tone="secondary">
              {item}
            </Text>
          )}
        </For>
      </div>

      <div class={styles.chartShell}>
        <div ref={chartHostRef} class={styles.chartHost} />
        <svg
          ref={overlayRef}
          class={styles.drawingOverlay}
          viewBox={`0 0 ${chartSize().width || 1} ${chartSize().height || 1}`}
          onPointerDown={handleOverlayPointerDown}
        >
          <For each={projectedZones()}>
            {(zone) => (
              <rect x={zone.left} y={zone.top} width={zone.width} height={zone.height} class={styles.zoneRect} />
            )}
          </For>
          <For each={projectedTrendLines()}>
            {(line) => <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} class={styles.trendLine} />}
          </For>
          <For each={projectedLevels()}>
            {(level) => <line x1="0" y1={level.y} x2={level.x2} y2={level.y} class={styles.levelLine} />}
          </For>
          <For each={draftPoints()}>
            {(point) => {
              const x = timeToX(point.time);
              const y = priceToY(point.price);
              if (x === null || y === null) return null;
              return <circle cx={x} cy={y} r="4" class={styles.draftPoint} />;
            }}
          </For>
        </svg>
      </div>
    </div>
  );
};

export default TradingViewChart;
export type {
  TradingViewChartPoint,
  TradingViewChartProps,
  TradingViewDrawings,
  TradingViewDrawingTool,
  TradingViewFeedContext,
  TradingViewLevelLine,
  TradingViewLiveFeedConfig,
  TradingViewLiveFeedMode,
  TradingViewTrendLine,
  TradingViewZone,
};
