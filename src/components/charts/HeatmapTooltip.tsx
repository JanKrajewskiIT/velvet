import { ChartTooltip } from './ChartTooltip';

export interface HeatmapTooltipProps {
  title: string;
  label: string;
  value: string;
  color: string | undefined;
  left: number;
  top: number;
}

export const HeatmapTooltip = (props: HeatmapTooltipProps) => (
  <ChartTooltip
    x={props.left}
    y={props.top}
    title={props.title}
    rows={[{ label: props.label, value: props.value, color: props.color }]}
    live={false}
  />
);
