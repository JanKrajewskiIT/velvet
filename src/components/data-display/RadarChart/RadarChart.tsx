import { createMemo, For } from 'solid-js';

import type Props from '~/models/Props';

import styles from './RadarChart.module.css';

interface RadarAxis {
  label: string;
  key: string;
}

interface RadarDataset {
  label: string;
  values: number[];
  color?: string;
}

interface RadarChartProps {
  axes: RadarAxis[];
  datasets: RadarDataset[];
  size?: number;
}

const DEFAULT_SIZE = 300;
const RADIUS_RATIO = 110 / 300;
const LABEL_OFFSET = 24;
const LEVELS = 4;

const DATASET_COLORS = [
  'var(--color-primary)',
  'var(--color-info)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-error)',
];

const polarToCartesian = (angle: number, radius: number, center: number) => ({
  x: center + radius * Math.cos(angle - Math.PI / 2),
  y: center + radius * Math.sin(angle - Math.PI / 2),
});

const RadarChart = (props: Props<RadarChartProps>) => {
  const chartSize = createMemo(() => props.size ?? DEFAULT_SIZE);
  const center = createMemo(() => chartSize() / 2);
  const radius = createMemo(() => chartSize() * RADIUS_RATIO);
  const angleStep = createMemo(() => (2 * Math.PI) / props.axes.length);

  const gridLevels = createMemo(() => {
    const r = radius();
    const step = angleStep();
    const c = center();
    return Array.from({ length: LEVELS }, (_, i) => {
      const levelRadius = (r / LEVELS) * (i + 1);
      const points = props.axes
        .map((_, j) => {
          const { x, y } = polarToCartesian(j * step, levelRadius, c);
          return `${x},${y}`;
        })
        .join(' ');
      return points;
    });
  });

  const axisLines = createMemo(() =>
    props.axes.map((_, i) => {
      const { x, y } = polarToCartesian(i * angleStep(), radius(), center());
      return { x1: center(), y1: center(), x2: x, y2: y };
    })
  );

  const axisLabels = createMemo(() =>
    props.axes.map((axis, i) => {
      const { x, y } = polarToCartesian(i * angleStep(), radius() + LABEL_OFFSET, center());
      return { ...axis, x, y };
    })
  );

  const datasetPolygons = createMemo(() =>
    props.datasets.map((dataset, datasetIndex) => {
      const points = dataset.values
        .map((value, i) => {
          const normalizedRadius = (value / 100) * radius();
          const { x, y } = polarToCartesian(i * angleStep(), normalizedRadius, center());
          return `${x},${y}`;
        })
        .join(' ');
      return {
        points,
        color: dataset.color ?? DATASET_COLORS[datasetIndex % DATASET_COLORS.length],
        label: dataset.label,
      };
    })
  );

  const dataPoints = createMemo(() =>
    props.datasets.flatMap((dataset, datasetIndex) =>
      dataset.values.map((value, i) => {
        const normalizedRadius = (value / 100) * radius();
        const { x, y } = polarToCartesian(i * angleStep(), normalizedRadius, center());
        return {
          x,
          y,
          color: dataset.color ?? DATASET_COLORS[datasetIndex % DATASET_COLORS.length],
        };
      })
    )
  );

  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      <svg viewBox={`0 0 ${chartSize()} ${chartSize()}`} class={styles.chart}>
        <For each={gridLevels()}>
          {(points) => (
            <polygon
              points={points}
              fill="none"
              stroke="var(--color-border)"
              stroke-width="1"
              class={styles.gridLine}
            />
          )}
        </For>

        <For each={axisLines()}>
          {(line) => (
            <line
              x1={String(line.x1)}
              y1={String(line.y1)}
              x2={String(line.x2)}
              y2={String(line.y2)}
              stroke="var(--color-border)"
              stroke-width="1"
              class={styles.gridLine}
            />
          )}
        </For>

        <For each={datasetPolygons()}>
          {(polygon) => (
            <polygon
              points={polygon.points}
              fill={polygon.color}
              fill-opacity="0.15"
              stroke={polygon.color}
              stroke-width="2"
              stroke-dasharray="1000"
              class={styles.dataPolygon}
            />
          )}
        </For>

        <For each={dataPoints()}>
          {(point, index) => (
            <circle
              cx={String(point.x)}
              cy={String(point.y)}
              r="3.5"
              fill={point.color}
              stroke="var(--color-bg)"
              stroke-width="1.5"
              class={styles.dataPoint}
              style={{ '--point-index': index() }}
            />
          )}
        </For>

        <For each={axisLabels()}>
          {(label) => (
            <text
              x={String(label.x)}
              y={String(label.y)}
              text-anchor="middle"
              dominant-baseline="central"
              class={styles.axisLabel}
            >
              {label.label}
            </text>
          )}
        </For>
      </svg>

      <div class={styles.legend}>
        <For each={props.datasets}>
          {(dataset, i) => (
            <div class={styles.legendItem} style={{ '--item-index': i() }}>
              <span
                class={styles.legendColor}
                style={{
                  'background-color': dataset.color ?? DATASET_COLORS[i() % DATASET_COLORS.length],
                }}
              />
              <span class={styles.legendLabel}>{dataset.label}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default RadarChart;
