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

import type Props from '~/models/Props';

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
  label?: string;
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

interface TradingViewChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
  const currentBar = createMemo(() => hoveredBar() ?? chartData().at(-1));
  const chartHeight = createMemo(() => local.height ?? DEFAULT_HEIGHT);
  const smaData = createMemo(() => createSimpleMovingAverage(chartData(), 20));
  const emaData = createMemo(() => createExponentialMovingAverage(chartData(), 50));
  const rsiData = createMemo(() => createRsi(chartData(), 14));
  const macdData = createMemo(() => createMacd(chartData()));
  const bollingerData = createMemo(() => createBollingerBands(chartData(), 20, 2));
  const indicatorSnapshot = createMemo(() => {
    const time = currentBar()?.time;
    if (!time) return undefined;
    const key = String(time);
    const rsi = rsiData().find((item) => String(item.time) === key)?.value;
    const macd = macdData().macdLine.find((item) => String(item.time) === key)?.value;
    const signal = macdData().signalLine.find((item) => String(item.time) === key)?.value;
    const bbUpper = bollingerData().upper.find((item) => String(item.time) === key)?.value;
    const bbLower = bollingerData().lower.find((item) => String(item.time) === key)?.value;
    return { rsi, macd, signal, bbUpper, bbLower };
  });
  const chartSymbol = createMemo(() => local.symbol ?? 'XAUUSD');
  const draftPoints = createMemo(() => {
    const point = draftPoint();
    return point ? [point] : [];
  });

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
  let crosshairHandler: ((params: MouseEventParams) => void) | undefined;
  let themeObserver: MutationObserver | undefined;
  let timeRangeHandler: (() => void) | undefined;
  let sizeChangeHandler: (() => void) | undefined;
  let feedUnsubscribe: (() => void) | undefined;
  let feedTimer: ReturnType<typeof setInterval> | undefined;
  let latestDataByTime = new Map<string, TradingViewChartPoint>();
  let latestBar: TradingViewChartPoint | undefined;

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
    smaSeries.setData(showSma() ? smaData() : []);
    emaSeries.setData(showEma() ? emaData() : []);
    bbUpperSeries.setData(showBb() ? bollingerData().upper : []);
    bbBasisSeries.setData(showBb() ? bollingerData().basis : []);
    bbLowerSeries.setData(showBb() ? bollingerData().lower : []);
    rsiSeries.setData(showRsi() ? rsiData() : []);
    macdSeries.setData(showMacd() ? macdData().macdLine : []);
    macdSignalSeries.setData(showMacd() ? macdData().signalLine : []);
    macdHistogramSeries.setData(
      showMacd()
        ? macdData().histogram.map((item) => ({
            time: item.time,
            value: item.value,
            color: item.value >= 0 ? (palette?.success ?? 'currentColor') : (palette?.error ?? 'currentColor'),
          }))
        : []
    );
  };

  const fitChart = () => {
    if (!chart || !chartHostRef) return;
    const width = chartHostRef.clientWidth;
    const height = chartHeight();
    setChartSize({ width, height });
    chart.applyOptions({ width, height });
    chart.timeScale().fitContent();
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
    const match = chartData().find((item) => {
      const date = new Date(item.time * 1000);
      return (
        date.getUTCFullYear() === time.year && date.getUTCMonth() + 1 === time.month && date.getUTCDate() === time.day
      );
    });
    return match?.time ?? null;
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
      localization: { locale: 'en-US' },
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
      title: 'BB Upper',
      priceLineVisible: false,
      lastValueVisible: false,
    });
    bbBasisSeries = chart.addSeries(LineSeries, {
      title: 'BB Basis',
      priceLineVisible: false,
      lastValueVisible: false,
    });
    bbLowerSeries = chart.addSeries(LineSeries, {
      title: 'BB Lower',
      priceLineVisible: false,
      lastValueVisible: false,
    });
    smaSeries = chart.addSeries(LineSeries, { title: 'SMA 20', priceLineVisible: false, lastValueVisible: false });
    emaSeries = chart.addSeries(LineSeries, { title: 'EMA 50', priceLineVisible: false, lastValueVisible: false });
    rsiSeries = chart.addSeries(LineSeries, { title: 'RSI 14', priceLineVisible: false, lastValueVisible: false }, 2);
    macdSeries = chart.addSeries(LineSeries, { title: 'MACD', priceLineVisible: false, lastValueVisible: false }, 3);
    macdSignalSeries = chart.addSeries(
      LineSeries,
      { title: 'MACD Signal', priceLineVisible: false, lastValueVisible: false },
      3
    );
    macdHistogramSeries = chart.addSeries(
      HistogramSeries,
      { title: 'MACD Hist', priceLineVisible: false, lastValueVisible: false },
      3
    );
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.7, bottom: 0 } });
    rsiSeries.priceScale().applyOptions({ scaleMargins: { top: 0.15, bottom: 0.15 } });
    macdSeries.priceScale().applyOptions({ scaleMargins: { top: 0.2, bottom: 0.2 } });
    macdSignalSeries.priceScale().applyOptions({ scaleMargins: { top: 0.2, bottom: 0.2 } });
    macdHistogramSeries.priceScale().applyOptions({ scaleMargins: { top: 0.2, bottom: 0.2 } });
    rsiSeries.createPriceLine({ price: 70, color: 'var(--color-warning)', lineStyle: LineStyle.Dashed, lineWidth: 1 });
    rsiSeries.createPriceLine({ price: 30, color: 'var(--color-warning)', lineStyle: LineStyle.Dashed, lineWidth: 1 });
    rsiSeries.createPriceLine({ price: 50, color: 'var(--color-border)', lineStyle: LineStyle.Dotted, lineWidth: 1 });

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

    const onResize = () => fitChart();
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
    if (!local.liveFeed?.enabled) return;

    if (feedTimer) clearInterval(feedTimer);
    if (feedUnsubscribe) feedUnsubscribe();
    feedTimer = undefined;
    feedUnsubscribe = undefined;

    const context = (): TradingViewFeedContext => ({
      symbol: chartSymbol(),
      interval: activeInterval(),
      lastBar: latestBar,
    });
    const maxPoints = local.maxPoints ?? 800;
    const append = (payload: TradingViewChartPoint | TradingViewChartPoint[]) => {
      const incoming = Array.isArray(payload) ? payload : [payload];
      setRuntimeData((current) => mergeBars(current, incoming, maxPoints));
      setOverlayRevision((value) => value + 1);
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
      const initialContext: TradingViewFeedContext = {
        symbol: chartSymbol(),
        interval: activeInterval(),
        lastBar: latestBar,
      };
      const unsubscribe = subscribe((payload) => append(payload), initialContext);
      if (unsubscribe) feedUnsubscribe = unsubscribe;
    }
  });

  createEffect(() => {
    renderSeriesData();
    fitChart();
  });

  return (
    <div {...rest} ref={wrapperRef} class={`${styles.root} ${local.class ?? ''}`}>
      <div class={styles.toolbar}>
        <div class={styles.toolbarGroup}>
          <span class={styles.symbol}>{chartSymbol()}</span>
          <For each={intervals()}>
            {(interval) => (
              <button
                type="button"
                class={`${styles.toolbarButton} ${activeInterval() === interval ? styles.toolbarButtonActive : ''}`}
                disabled={Boolean(local.data?.length)}
                onClick={() => setActiveInterval(interval)}
              >
                {interval}
              </button>
            )}
          </For>
        </div>

        <div class={styles.toolbarGroup}>
          <button
            type="button"
            class={`${styles.toolbarButton} ${showVolume() ? styles.toolbarButtonActive : ''}`}
            onClick={() => setShowVolume((value) => !value)}
          >
            Vol
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${showSma() ? styles.toolbarButtonActive : ''}`}
            onClick={() => setShowSma((value) => !value)}
          >
            SMA
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${showEma() ? styles.toolbarButtonActive : ''}`}
            onClick={() => setShowEma((value) => !value)}
          >
            EMA
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${showBb() ? styles.toolbarButtonActive : ''}`}
            onClick={() => setShowBb((value) => !value)}
          >
            BB
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${showRsi() ? styles.toolbarButtonActive : ''}`}
            onClick={() => setShowRsi((value) => !value)}
          >
            RSI
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${showMacd() ? styles.toolbarButtonActive : ''}`}
            onClick={() => setShowMacd((value) => !value)}
          >
            MACD
          </button>
        </div>

        <div class={styles.toolbarGroup}>
          <button
            type="button"
            class={`${styles.toolbarButton} ${activeTool() === 'trendline' ? styles.toolbarButtonActive : ''}`}
            onClick={() => setActiveTool((tool) => (tool === 'trendline' ? 'none' : 'trendline'))}
          >
            Trend
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${activeTool() === 'level' ? styles.toolbarButtonActive : ''}`}
            onClick={() => setActiveTool((tool) => (tool === 'level' ? 'none' : 'level'))}
          >
            Level
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${activeTool() === 'zone' ? styles.toolbarButtonActive : ''}`}
            onClick={() => setActiveTool((tool) => (tool === 'zone' ? 'none' : 'zone'))}
          >
            Zone
          </button>
          <button type="button" class={styles.toolbarButton} onClick={clearCurrentTool}>
            Clear
          </button>
        </div>
      </div>

      <div class={styles.ohlcPanel}>
        <span class={styles.ohlcItem}>O: {toFixed(currentBar()?.open ?? 0)}</span>
        <span class={styles.ohlcItem}>H: {toFixed(currentBar()?.high ?? 0)}</span>
        <span class={styles.ohlcItem}>L: {toFixed(currentBar()?.low ?? 0)}</span>
        <span class={styles.ohlcItem}>C: {toFixed(currentBar()?.close ?? 0)}</span>
        <span class={styles.ohlcItem}>V: {toFixed(currentBar()?.volume ?? 0, 0)}</span>
        <span class={styles.ohlcItem}>RSI: {toFixed(indicatorSnapshot()?.rsi ?? 0)}</span>
        <span class={styles.ohlcItem}>MACD: {toFixed(indicatorSnapshot()?.macd ?? 0, 4)}</span>
        <span class={styles.ohlcItem}>SIG: {toFixed(indicatorSnapshot()?.signal ?? 0, 4)}</span>
        <span class={styles.ohlcItem}>BB↑: {toFixed(indicatorSnapshot()?.bbUpper ?? 0)}</span>
        <span class={styles.ohlcItem}>BB↓: {toFixed(indicatorSnapshot()?.bbLower ?? 0)}</span>
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
            {(level) => (
              <>
                <line x1="0" y1={level.y} x2={level.x2} y2={level.y} class={styles.levelLine} />
                {level.label && (
                  <text x="6" y={Math.max(level.y - 6, 12)} class={styles.levelLabel}>
                    {level.label}
                  </text>
                )}
              </>
            )}
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
