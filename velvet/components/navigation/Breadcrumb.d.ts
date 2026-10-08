import * as React from 'react';
export interface BreadcrumbItem { label: React.ReactNode; href?: string; onClick?: (e: any) => void; icon?: string }
/** Location trail. Last item is the current page (not a link). Beyond maxItems the middle collapses into a "…" menu. */
export interface BreadcrumbProps { items: BreadcrumbItem[]; /** @default 4 */ maxItems?: number; className?: string }
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
