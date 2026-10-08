import type { JSX } from 'solid-js';

export interface FooterLink {
  label: JSX.Element;
  href?: string;
  /** New tab + external icon. */
  external?: boolean;
  /** Small pill after the label — "New", "Beta". */
  badge?: JSX.Element;
  current?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  icon: string;
  label: string;
  href?: string;
}

export const FOOTER_STATUS = {
  ok: { tone: 'success', labelKey: 'velvet.layout.footerStatus.ok' },
  degraded: { tone: 'warning', labelKey: 'velvet.layout.footerStatus.degraded' },
  down: { tone: 'danger', labelKey: 'velvet.layout.footerStatus.down' },
} as const;

export type FooterStatusState = keyof typeof FOOTER_STATUS;

export interface FooterStatusDetail {
  state: FooterStatusState;
  label?: string;
  href?: string;
}

export type FooterStatusValue = FooterStatusState | FooterStatusDetail;
