import * as React from 'react';
/** Brand mark. brand="recron" = Recron "R" signet (circuit-node stem) + "ecron" wordmark, ported from Recron's brand-logo spec and recoloured with Velvet tokens: signet --action-primary, wordmark --fg-primary (both theme-aware); tone="inverse" = all --on-color-fg for brand fills (Navbar tone="brand"). Recron clear-space: 0.5× logo height each side; min digital height 32px. brand="quantcore" = QuantCore "Q" signet + "uantcore" wordmark, same rules and colouring as recron. brand="velvet" = type-only placeholder "velvet/ui". */
export interface BrandLogoProps {
  /** @default 'velvet' */
  brand?: 'velvet' | 'recron' | 'quantcore';
  /** lockup = signet + wordmark. 'wordmark' applies to velvet only. @default 'lockup' */
  variant?: 'lockup' | 'wordmark' | 'mark';
  /** @default 'default' */
  tone?: 'default' | 'inverse';
  /** Preset or px. Recron / QuantCore: logo height (sm 24 · md 32 · lg 48 · xl 64). Velvet: wordmark font size. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Velvet only: soft brand elevation under the mark. @default true */
  glow?: boolean;
  /** Accessible name. @default brand name */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function BrandLogo(props: BrandLogoProps): JSX.Element;
