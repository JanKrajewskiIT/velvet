import * as React from 'react';
/** Atom. Vertical list whose items are joined by a connector line under their leading marker (Marker). Timeline renders it; use for activity feeds, audit logs, step lists. */
export interface RailProps extends React.HTMLAttributes<HTMLElement> {
  /** Element. @default 'ol' */
  as?: keyof JSX.IntrinsicElements;
  /** Diameter of the leading markers — the line starts below them. sm 24 · md 28 · lg 32. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Draw the connector. @default true */
  line?: boolean;
  children?: React.ReactNode;
}
export declare function Rail(props: RailProps): JSX.Element;
export interface RailItemProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'li' */
  as?: keyof JSX.IntrinsicElements;
  /** Connector below this item: done = success solid · active = brand · dashed = upcoming */
  state?: 'done' | 'active' | 'dashed';
  children?: React.ReactNode;
}
export declare function RailItem(props: RailItemProps): JSX.Element;
