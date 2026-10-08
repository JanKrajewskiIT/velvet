import * as React from 'react';
export interface AccordionItem { value?: string; title: React.ReactNode; subtitle?: React.ReactNode; icon?: string; meta?: React.ReactNode; content: React.ReactNode; disabled?: boolean; /** elevated: 3px tone stripe on the left + tone glow when open */ tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' }
/** Collapsible sections (FAQ, settings groups). Animated height, ↑↓ Home End between headers; closed panels are hidden from focus and screen readers. */
export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several open. @default false */
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (open: string[]) => void;
  /** separated = cards with gaps · flush = dividers only · elevated = larger cards, hover lift, brand glow + border when open, gradient separator (legacy VelvetUi look). @default 'separated' */
  variant?: 'separated' | 'flush' | 'elevated';
  /** Gap between items (separated / elevated). */
  gap?: 'sm' | 'md' | 'lg';
  /** Staggered fade-up entrance (40ms per item). @default true for elevated */
  animated?: boolean;
  className?: string;
}
export declare function Accordion(props: AccordionProps): JSX.Element;
