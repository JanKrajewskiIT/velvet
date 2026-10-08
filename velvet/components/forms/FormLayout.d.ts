import * as React from 'react';
/** Vertical form shell. Renders a <form> (noValidate; onSubmit gets preventDefault for free) or any element. Sets rhythm between sections / grids / fields. */
export interface FormLayoutProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSubmit'> {
  /** @default 'form' */
  as?: 'form' | 'div' | 'section';
  /** sm 12 · md 20 · lg 32 px between children. @default 'md' */
  gap?: 'sm' | 'md' | 'lg';
  /** Max width, e.g. 640 or '40rem' */
  width?: number | string;
  onSubmit?: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}
export declare function FormLayout(props: FormLayoutProps): JSX.Element;
/** Titled group of fields. layout="aside" = settings-page style: title + description in a left column, fields on the right (stacks under 720px). */
export interface FormSectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** @default 'stacked' */
  layout?: 'stacked' | 'aside';
  /** Hairline above the section */
  divider?: boolean;
  /** Right side of the header (stacked) */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function FormSection(props: FormSectionProps): JSX.Element;
/** Responsive field grid. Default auto-fits columns of at least minColumnWidth; pass columns for a fixed count (collapses to 1 under 560px). Wrap a field in <FormSpan> to span columns. */
export interface FormGridProps {
  columns?: 1 | 2 | 3 | 4;
  /** @default 240 */
  minColumnWidth?: number | string;
  /** @default 'md' */
  gap?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}
export declare function FormGrid(props: FormGridProps): JSX.Element;
export interface FormSpanProps { /** Columns to span or 'full'. @default 'full' */ span?: number | 'full'; children?: React.ReactNode; className?: string }
export declare function FormSpan(props: FormSpanProps): JSX.Element;
/** Button row for forms, dialogs and panels. start = left slot (e.g. Delete, "Saved 2 min ago"). sticky = pins to the bottom of the scroll container with a frosted background. Wraps on narrow widths; primary stays last. */
export interface ActionRowProps {
  /** @default 'end' */
  align?: 'start' | 'center' | 'end' | 'between';
  sticky?: boolean;
  divider?: boolean;
  start?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function ActionRow(props: ActionRowProps): JSX.Element;
