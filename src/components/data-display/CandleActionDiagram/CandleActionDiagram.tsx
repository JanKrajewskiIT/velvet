import type { JSX } from 'solid-js';
import { createMemo, For, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './CandleActionDiagram.module.css';

type CandleActionType = 'buy' | 'sell' | 'take-profit' | 'stop-loss' | 'hold';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume?: number;
}

interface CandleAction {
  index: number;
  type: CandleActionType;
  label?: string;
  strength?: number;
}

interface CandleActionLegendItem {
  type: CandleActionType;
  label: string;
  description?: string;
}

interface CandleActionDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
  candles: Candle[];
  actions?: CandleAction[];
  legend?: CandleActionLegendItem[];
  variant?: 'basic' | 'expanded' | 'full';
  width?: number;
  height?: number;
  ariaLabel?: string;
}

const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 320;
const PADDING_X = 40;
const PADDING_Y = 20;
const GRID_LINES = 4;

const MARKER_STYLE: Record<CandleActionType, string | undefined> = {
  buy: styles.markerBuy,
  sell: styles.markerSell,
  'take-profit': styles.markerTakeProfit,
  'stop-loss': styles.markerStopLoss,
  hold: styles.markerHold,
};

const LEGEND_DOT_STYLE: Record<CandleActionType, string | undefined> = {
  buy: styles.legendDotBuy,
  sell: styles.legendDotSell,
  'take-profit': styles.legendDotTakeProfit,
  'stop-loss': styles.legendDotStopLoss,
  hold: styles.legendDotHold,
};

const CandleActionDiagram = (props: Props<CandleActionDiagramProps>) => {
  const [local, rest] = splitProps(props, [
    'candles',
    'actions',
    'legend',
    'variant',
    'width',
    'height',
    'class',
    'ariaLabel',
  ]);

  const w = createMemo(() => local.width ?? DEFAULT_WIDTH);
  const h = createMemo(() => local.height ?? DEFAULT_HEIGHT);
  const showTrend = createMemo(() => local.variant !== 'basic');
  const showVolume = createMemo(() => local.variant === 'full');
  const showLegend = createMemo(() => local.variant === 'full' && (local.legend?.length ?? 0) > 0);

  const volumeHeight = createMemo(() => (showVolume() ? 48 : 0));
  const chartTop = PADDING_Y;
  const chartBottom = createMemo(() => h() - PADDING_Y - volumeHeight() - (showVolume() ? 8 : 0));
  const chartHeight = createMemo(() => chartBottom() - chartTop);
  const chartWidth = createMemo(() => w() - PADDING_X * 2);

  const priceRange = createMemo(() => {
    if (local.candles.length === 0) return { min: 0, max: 1 };
    let min = Infinity;
    let max = -Infinity;
    for (const c of local.candles) {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    }
    const spread = Math.max(max - min, Math.abs(max) * 0.02, 1);
    const pad = spread * 0.1;
    return { min: min - pad, max: max + pad };
  });

  const yScale = (value: number) => {
    const { min, max } = priceRange();
    const ratio = (value - min) / (max - min || 1);
    return chartTop + chartHeight() * (1 - ratio);
  };

  const slotWidth = createMemo(() => chartWidth() / Math.max(local.candles.length, 1));
  const bodyWidth = createMemo(() => Math.max(4, Math.min(slotWidth() * 0.55, 20)));

  const gridLines = createMemo(() => {
    const range = priceRange();
    const cHeight = chartHeight();
    return Array.from({ length: GRID_LINES + 1 }, (_, i) => {
      const value = range.max - (range.max - range.min) * (i / GRID_LINES);
      const ratio = (value - range.min) / (range.max - range.min || 1);
      const y = chartTop + cHeight * (1 - ratio);
      return { value, y };
    });
  });

  const trendPath = createMemo(() => {
    if (!showTrend() || local.candles.length < 2) return '';
    const points = local.candles.map((c, i) => {
      const x = PADDING_X + slotWidth() * i + slotWidth() / 2;
      const y = yScale(c.close);
      return { x, y };
    });
    const first = points[0];
    if (points.length < 2 || !first) return '';
    let path = `M ${first.x} ${first.y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      if (!p0 || !p1) continue;
      const cpx = (p0.x + p1.x) / 2;
      path += ` C ${cpx} ${p0.y}, ${cpx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  });

  const volumeBars = createMemo(() => {
    if (!showVolume()) return [];
    const values = local.candles.map((c) => c.volume ?? Math.abs(c.close - c.open));
    const maxVol = Math.max(...values, 1);
    const volTop = chartBottom() + 8;
    const volH = volumeHeight();
    return local.candles.map((c, i) => {
      const barH = ((values[i] ?? 0) / maxVol) * volH;
      return {
        x: PADDING_X + slotWidth() * i + (slotWidth() - bodyWidth()) / 2,
        y: volTop + volH - barH,
        width: bodyWidth(),
        height: barH,
        isUp: c.close >= c.open,
        index: i,
      };
    });
  });

  const markers = createMemo(() => {
    const counters = new Map<number, number>();
    const sw = slotWidth();
    const range = priceRange();
    const cHeight = chartHeight();
    const scale = (value: number) => {
      const ratio = (value - range.min) / (range.max - range.min || 1);
      return chartTop + cHeight * (1 - ratio);
    };
    return (local.actions ?? [])
      .filter((a) => a.index >= 0 && a.index < local.candles.length)
      .reduce<
        Array<{
          x: number;
          y: number;
          size: number;
          type: CandleActionType;
          label?: string;
          above: boolean;
          markerIdx: number;
          baseY: number;
        }>
      >((acc, action, markerIdx) => {
        const candle = local.candles[action.index];
        if (!candle) return acc;
        const x = PADDING_X + sw * action.index + sw / 2;
        const count = counters.get(action.index) ?? 0;
        counters.set(action.index, count + 1);
        const above = action.type === 'sell' || action.type === 'take-profit' || action.type === 'hold';
        const baseY = above ? scale(candle.high) : scale(candle.low);
        const offset = 14 + count * 14;
        const y = above ? baseY - offset : baseY + offset;
        const size = 5 + Math.min(action.strength ?? 1, 3) * 1.2;
        acc.push({ x, y, size, type: action.type, label: action.label, above, markerIdx, baseY });
        return acc;
      }, []);
  });

  const markerShape = (type: CandleActionType, x: number, y: number, size: number) => {
    switch (type) {
      case 'buy':
        return (
          <polygon
            points={`${x},${y - size} ${x + size},${y + size * 0.6} ${x - size},${y + size * 0.6}`}
            class={styles.markerShape}
          />
        );
      case 'sell':
        return (
          <polygon
            points={`${x},${y + size} ${x + size},${y - size * 0.6} ${x - size},${y - size * 0.6}`}
            class={styles.markerShape}
          />
        );
      case 'take-profit':
        return (
          <polygon
            points={`${x},${y - size} ${x + size * 0.87},${y + size * 0.5} ${x - size * 0.87},${y + size * 0.5}`}
            class={styles.markerShape}
          />
        );
      case 'stop-loss':
        return (
          <rect
            x={x - size * 0.7}
            y={y - size * 0.7}
            width={size * 1.4}
            height={size * 1.4}
            rx="2"
            class={styles.markerShape}
          />
        );
      case 'hold':
        return <circle cx={x} cy={y} r={size * 0.7} class={styles.markerShape} />;
    }
  };

  return (
    <div {...rest} class={`${styles.wrapper} ${local.class ?? ''}`} role="img" aria-label={local.ariaLabel}>
      <div class={styles.card}>
        <svg viewBox={`0 0 ${w()} ${h()}`} class={styles.chart}>
          <For each={gridLines()}>
            {(line) => (
              <g>
                <line
                  x1={String(PADDING_X)}
                  x2={String(w() - PADDING_X)}
                  y1={String(line.y)}
                  y2={String(line.y)}
                  class={styles.gridLine}
                />
                <text
                  x={String(PADDING_X - 6)}
                  y={String(line.y)}
                  text-anchor="end"
                  dominant-baseline="central"
                  class={styles.gridLabel}
                >
                  {line.value.toFixed(2)}
                </text>
              </g>
            )}
          </For>

          {showTrend() && trendPath() && (
            <>
              <path d={trendPath()} class={styles.trendGlow} />
              <path d={trendPath()} class={styles.trendLine} />
            </>
          )}

          <For each={local.candles}>
            {(candle, index) => {
              const cx = () => PADDING_X + slotWidth() * index() + slotWidth() / 2;
              const x = () => cx() - bodyWidth() / 2;
              const yOpen = () => yScale(candle.open);
              const yClose = () => yScale(candle.close);
              const yHigh = () => yScale(candle.high);
              const yLow = () => yScale(candle.low);
              const bodyTop = () => Math.min(yOpen(), yClose());
              const bodyH = () => Math.max(1.5, Math.abs(yOpen() - yClose()));
              const isUp = candle.close >= candle.open;

              return (
                <g class={styles.candleGroup} style={{ '--candle-index': index() }}>
                  <line
                    x1={String(cx())}
                    x2={String(cx())}
                    y1={String(yHigh())}
                    y2={String(yLow())}
                    class={`${styles.wick} ${isUp ? styles.wickUp : styles.wickDown}`}
                  />
                  <rect
                    x={String(x())}
                    y={String(bodyTop())}
                    width={String(bodyWidth())}
                    height={String(bodyH())}
                    rx="2"
                    class={isUp ? styles.bodyUp : styles.bodyDown}
                  />
                </g>
              );
            }}
          </For>

          <For each={volumeBars()}>
            {(bar) => (
              <rect
                x={String(bar.x)}
                y={String(bar.y)}
                width={String(bar.width)}
                height={String(bar.height)}
                rx="1"
                class={`${styles.volumeBar} ${bar.isUp ? styles.volumeBarUp : styles.volumeBarDown}`}
                style={{ '--bar-index': bar.index }}
              />
            )}
          </For>

          <For each={markers()}>
            {(m) => (
              <g
                class={`${styles.markerGroup} ${MARKER_STYLE[m.type]}`}
                style={{ '--marker-index': m.markerIdx }}
                fill="currentcolor"
              >
                <line
                  x1={String(m.x)}
                  y1={String(m.baseY)}
                  x2={String(m.x)}
                  y2={String(m.y)}
                  class={styles.markerLine}
                />
                <circle cx={String(m.x)} cy={String(m.y)} r={String(m.size + 2)} class={styles.markerGlow} />
                {markerShape(m.type, m.x, m.y, m.size)}
                {m.label && (
                  <text
                    x={String(m.x)}
                    y={String(m.y + (m.above ? -m.size - 6 : m.size + 8))}
                    class={styles.markerLabel}
                  >
                    {m.label}
                  </text>
                )}
              </g>
            )}
          </For>
        </svg>
      </div>

      {showLegend() && (
        <div class={styles.legend}>
          <For each={local.legend}>
            {(item, i) => (
              <div class={styles.legendItem} style={{ '--item-index': i() }}>
                <span class={`${styles.legendDot} ${LEGEND_DOT_STYLE[item.type]}`} />
                <div class={styles.legendText}>
                  <span class={styles.legendLabel}>{item.label}</span>
                  {item.description && <span class={styles.legendDescription}>{item.description}</span>}
                </div>
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
};

export default CandleActionDiagram;
export type { Candle, CandleAction, CandleActionDiagramProps, CandleActionLegendItem, CandleActionType };
