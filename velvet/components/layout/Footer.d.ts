import * as React from 'react';
export interface FooterLink { label: React.ReactNode; href?: string; /** New tab + external icon */ external?: boolean; /** Small pill after the label — "New", "Beta" */ badge?: React.ReactNode; current?: boolean; }
export interface FooterColumn { title: string; links: FooterLink[]; }
/**
 * Product footer.
 * full — brand mark + name, one-line description, optional CTA (newsletter, download), social icon tiles, up to 4 link columns
 * (links can carry a "New" badge), then a legal bar: copyright · legal links · status + end slot (LocaleSwitcher, ThemeToggle).
 * Under 640px the columns become collapsible groups. compact — one row inside an app: mark, copyright, version, links, status.
 * surface: card (bordered, rounded — sits inside a page or card) or page (full-bleed, top border only). Tokens: --footer-*.
 */
export interface FooterProps {
  /** @default 'full' */
  variant?: 'full' | 'compact';
  /** @default 'card' */
  surface?: 'card' | 'page';
  /** Product name */
  brand?: React.ReactNode;
  /** Mark tile content — letter, <img> or icon. Defaults to the brand's first letter; null hides it. */
  mark?: React.ReactNode | null;
  description?: React.ReactNode;
  columns?: FooterColumn[];
  social?: { icon: string; label: string; href?: string }[];
  legal?: FooterLink[];
  copyright?: React.ReactNode;
  /** compact: extra text after copyright — "v2.4.0" */
  meta?: React.ReactNode;
  /** Link to a status page with a tone dot: 'ok' | 'degraded' | 'down' or { state, label, href } */
  status?: 'ok' | 'degraded' | 'down' | { state: 'ok' | 'degraded' | 'down'; label?: string; href?: string };
  /** Under the description — e.g. a newsletter Input + Button */
  cta?: React.ReactNode;
  /** Right end of the bar */
  end?: React.ReactNode;
  className?: string;
}
export declare function Footer(props: FooterProps): JSX.Element;
