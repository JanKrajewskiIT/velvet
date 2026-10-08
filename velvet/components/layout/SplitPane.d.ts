import * as React from 'react';
/** Two resizable panes (list/detail, editor/preview). Fills its parent (height:100%) so it nests — put a vertical SplitPane inside a horizontal one. Drag the handle, or focus it and use arrows (Shift ×5), Home/End, Enter / double-click to reset. Size is the first pane in %; minPx keeps both panes usable on narrow containers. */
export interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode] | React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  /** % @default 50 */
  defaultSize?: number;
  size?: number;
  onSizeChange?: (pct: number) => void;
  /** % @default 15 */
  min?: number;
  /** % @default 85 */
  max?: number;
  /** Floor for BOTH panes in px. @default 120 */
  minPx?: number;
  /** Drag past half of min (or Home / double-click) to collapse the first pane to 0; Enter restores. @default false */
  collapsible?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function SplitPane(props: SplitPaneProps): JSX.Element;
