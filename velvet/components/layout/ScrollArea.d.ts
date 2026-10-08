import * as React from 'react';
/**
 * Scroll container with a thin themed scrollbar and edge fades that appear only when there is more content in that direction.
 * Focusable so keyboard users can scroll it. Use for side panels, long menus, chip rows, code — not for the page itself.
 */
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  /** horizontal lays children in a non-wrapping row. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Fade the edge where content continues. @default true */
  fade?: boolean;
  /** Makes it a labelled region — set when the area holds meaningful content */
  label?: string;
  children?: React.ReactNode;
}
export declare function ScrollArea(props: ScrollAreaProps): JSX.Element;
