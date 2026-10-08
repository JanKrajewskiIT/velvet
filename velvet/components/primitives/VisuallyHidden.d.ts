import * as React from 'react';
/** Accessibility utility. Content for screen readers only (.vui-sr-only) — extra context for icon buttons, table captions, form group names. focusable = becomes visible when it (or a child) receives focus. */
export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> { /** @default 'span' */ as?: keyof JSX.IntrinsicElements; focusable?: boolean; children?: React.ReactNode }
export declare function VisuallyHidden(props: VisuallyHiddenProps): JSX.Element;
/** First focusable element on the page. Hidden until Tab reaches it, then slides in top-left; moves focus to the target landmark (adds tabindex=-1 if needed). */
export interface SkipLinkProps { /** Id of the main landmark. @default '#main' */ href?: string; /** @default 'Skip to main content' */ children?: React.ReactNode; className?: string }
export declare function SkipLink(props: SkipLinkProps): JSX.Element;
/**
 * Announces dynamic changes ("3 results", "Saved", "Upload failed") to screen readers. Mount it once, then change message.
 * To repeat an identical message pass a new object: { text: 'Saved', id: Date.now() }. assertive interrupts — reserve for errors.
 */
export interface LiveRegionProps {
  message?: string | { text: string; id?: string | number };
  /** @default 'polite' */
  politeness?: 'polite' | 'assertive';
  /** ms, 0 = keep. @default 5000 */
  clearAfter?: number;
  /** Also show the text (status line) instead of hiding it */
  visible?: boolean;
  className?: string;
}
export declare function LiveRegion(props: LiveRegionProps): JSX.Element;
