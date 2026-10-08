import * as React from 'react';
/**
 * Text link on --fg-link. Inline in prose or standalone as a call-to-action.
 * For navigation lists use Anchor / Breadcrumb / Tabs; for actions that don't navigate use Button variant="ghost".
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  /** default — faint underline, solid on hover (prose) · plain — underline on hover only (UI) · quiet — secondary text colour (meta, footers). @default 'default' */
  variant?: 'default' | 'plain' | 'quiet';
  /** Semibold, no underline, trailing arrow that nudges on hover. "View all", "Read more". */
  standalone?: boolean;
  /** Opens in a new tab, adds external-link icon + screen-reader hint */
  external?: boolean;
  /** Renders without href, aria-disabled, not focusable */
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function Link(props: LinkProps): JSX.Element;
