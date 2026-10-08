import * as React from 'react';
export interface DescriptionItem { term: React.ReactNode; description?: React.ReactNode; hint?: React.ReactNode; /** Monospace value (IDs, keys) */ mono?: boolean; /** grid layout: columns to span */ span?: number }
/** Key–value details (record pages, invoices, settings summary). row = label left / value right, divided · grid = label over value in N columns. Missing values show an em dash. */
export interface DescriptionListProps { items: DescriptionItem[]; /** @default 'row' */ layout?: 'row' | 'grid'; /** grid only. @default 2 */ columns?: number; className?: string }
export declare function DescriptionList(props: DescriptionListProps): JSX.Element;
