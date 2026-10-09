export interface HeatmapTooltipProps {
  title: string;
  label: string;
  value: string;
  color: string | undefined;
  left: number;
  top: number;
}

export const HeatmapTooltip = (props: HeatmapTooltipProps) => (
  <div class="vui-chart__tip" style={{ left: `${props.left}px`, top: `${props.top}px` }} aria-hidden="true">
    <div class="vui-chart__tip-t">{props.title}</div>
    <div class="vui-chart__tip-r">
      <i style={{ background: props.color }} />
      {props.label}
      <b>{props.value}</b>
    </div>
  </div>
);
