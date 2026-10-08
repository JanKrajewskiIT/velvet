import * as React from 'react';
import { BreadcrumbItem } from '../navigation/Breadcrumb';
import { TabItem } from '../navigation/Tabs';
export interface PageHeaderMeta { icon?: string; label: React.ReactNode }
/** Masthead of a view, top to bottom: breadcrumb · back button + title + status · description · meta row (owner, due date, members…) · actions on the right · optional section tabs on the bottom edge. Every region is optional — the minimum is just a title. Always sits on its own raised card surface. Wraps on small screens. */
export interface PageHeaderProps {
  /** Location trail above the title; last item = current page */
  breadcrumb?: BreadcrumbItem[];
  /** Small context line above the title when there is no breadcrumb */
  eyebrow?: React.ReactNode;
  /** Shows a back button left of the title */
  onBack?: () => void;
  /** @default 'Back' */
  backLabel?: string;
  title: React.ReactNode;
  /** Pill next to the title: 'Active' | { label, tone } | any node */
  status?: React.ReactNode | { label: React.ReactNode; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' };
  description?: React.ReactNode;
  /** Icon + text facts under the title */
  meta?: PageHeaderMeta[];
  /** Right-aligned buttons — one primary at most */
  actions?: React.ReactNode;
  /** Section tabs on the bottom edge */
  tabs?: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  className?: string;
}
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
