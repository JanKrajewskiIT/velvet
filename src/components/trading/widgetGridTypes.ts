import type { JSX } from 'solid-js';

export interface WidgetGridWidget {
  id: string;
  title: string;
  span?: number;
  content: JSX.Element;
}
export interface WidgetGridLayout {
  order?: readonly string[];
  hidden?: readonly string[];
  spans?: Readonly<Record<string, number>>;
}
export interface WidgetGridResolvedLayout {
  order: string[];
  hidden: string[];
  spans: Record<string, number>;
}
export interface WidgetGridLabels {
  earlier: string;
  later: string;
  wider: string;
  narrower: string;
  hide: string;
  hiddenTitle: string;
  show: string;
  drag: string;
}
export interface WidgetGridProps {
  widgets: readonly WidgetGridWidget[];
  layout?: WidgetGridLayout;
  onLayoutChange?: (layout: WidgetGridResolvedLayout) => void;
  editing?: boolean;
  columns?: 2 | 3 | 4;
  labels?: Partial<WidgetGridLabels>;
  class?: string;
}
