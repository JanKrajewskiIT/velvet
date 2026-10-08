import * as React from 'react';
import type { CardProps } from '../display/Card';
/** Feature tile built on Card: tone icon tile, title, copy, optional action. Default = hoverable + tonal: reacts with the tone lift but is NOT one action — the action link inside is. Other Card / Surface props pass through. */
export interface FeatureCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Velvet icon name */
  icon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Custom action slot — e.g. <Link standalone> */
  action?: React.ReactNode;
  /** Renders a "Learn more →" link (or the whole card's href when interactive) */
  href?: string;
  /** Hue for icon tile, tonal hover and accent. @default 'brand' */
  tone?: CardProps['tone'];
  /** @default true */
  tonal?: boolean;
  /** Whole card becomes the link. @default false */
  interactive?: boolean;
  /** card = Card hover behaviour · lift = legacy VelvetUi tile: lifts 4px with tone border + layered tone glow. @default 'card' */
  look?: 'card' | 'lift';
  /** stack = icon above text · inline = icon left, compact. @default 'stack' */
  layout?: 'stack' | 'inline';
  /** Card pass-through */
  padding?: CardProps['padding'];
  variant?: CardProps['variant'];
  accent?: CardProps['accent'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
}
export declare function FeatureCard(props: FeatureCardProps): JSX.Element;
