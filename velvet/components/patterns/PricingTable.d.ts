import * as React from 'react';
/** Plan comparison cards in a responsive grid (stack on mobile). One featured tier only — a flag, brand outline and the only primary button are the whole hierarchy; no gradients or tinted cards. Prices may be per billing period: then a Monthly / Yearly switch appears (with optional yearlyNote badge) and the amount fades on change. Non-numeric prices ("Talk to us") drop the period. current marks the user's plan (disabled "Current plan"). Features can be excluded ({ included:false }) and introduced by includes ("Everything in Starter, plus"). */
export type Billing = 'monthly' | 'yearly';
export type PerBilling<T> = T | { monthly: T; yearly: T };
export interface PricingFeature { label: React.ReactNode; included?: boolean }
export interface PricingTier {
  id?: string;
  name: string;
  price: PerBilling<string>;
  /** Overrides periods[billing]; '' hides it */
  period?: PerBilling<string>;
  /** Small line under the price, e.g. "billed yearly" */
  note?: PerBilling<string>;
  blurb?: React.ReactNode;
  features?: Array<React.ReactNode | PricingFeature>;
  /** Lead-in above features, e.g. "Everything in Starter, plus" */
  includes?: React.ReactNode;
  /** @default 'Choose {name}' */
  cta?: string;
  featured?: boolean;
  /** Flag text on the featured tier. @default featuredLabel */
  badge?: string;
}
export interface PricingTableProps {
  tiers: PricingTier[];
  billing?: Billing;
  /** @default 'monthly' */
  defaultBilling?: Billing;
  onBillingChange?: (b: Billing) => void;
  billingLabels?: { monthly: string; yearly: string };
  /** @default { monthly: '/ month', yearly: '/ year' } */
  periods?: { monthly: string; yearly: string };
  /** Badge next to the switch, e.g. "2 months free" */
  yearlyNote?: string;
  /** id (or name) of the user's plan */
  current?: string;
  /** @default 'Most popular' */
  featuredLabel?: string;
  onSelect?: (tier: PricingTier, billing: Billing) => void;
  className?: string;
}
export declare function PricingTable(props: PricingTableProps): JSX.Element;
