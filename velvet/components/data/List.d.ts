import * as React from 'react';
export interface ListItem { id: string | number; title: React.ReactNode; description?: React.ReactNode; /** Avatar, icon or Checkbox */ leading?: React.ReactNode; /** Badge, time, IconButton… */ trailing?: React.ReactNode; href?: string; disabled?: boolean }
/** Lightweight rows for people, files, candidates, settings — when a Table's columns would be overkill. Pass onValueChange (selectable, uses value) or onItemClick (plain actions) to make rows interactive. */
export interface ListProps {
  items: ListItem[];
  /** Selected item id */
  value?: string | number;
  onValueChange?: (id: string | number) => void;
  onItemClick?: (item: ListItem) => void;
  /** Hairline between rows. @default true */
  divided?: boolean;
  /** 'sm' 40px · 'md' 56px rows. @default 'md' */
  size?: 'sm' | 'md';
  /** Text when items is empty */
  empty?: React.ReactNode;
  label?: string;
  className?: string;
}
export declare function List(props: ListProps): JSX.Element;
