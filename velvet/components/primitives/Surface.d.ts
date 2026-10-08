import * as React from 'react';
export type Tone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'blue' | 'indigo' | 'violet' | 'magenta' | 'teal' | 'cyan' | 'olive' | 'slate';
export type SurfaceVariant = 'default' | 'low' | 'flat' | 'raised' | 'subtle' | 'sunken' | 'brand' | 'brand-solid' | 'inverse' | 'overlay' | 'dialog' | 'glass';
/**
 * Atom. The one primitive that paints a container — background, border, radius, elevation, padding, tone and behaviour.
 * Hierarchy: Surface → Card (adds header/body/footer) → FeatureCard · FlipCard · Stat · ScoreCard · QuestionCard (add an interior).
 * Floating panels (Popover, Menu, Dialog) sit on Surface directly. Retune via --surface-* tokens, never per instance.
 */
export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default 'div' */
  as?: keyof JSX.IntrinsicElements;
  /** Paint at rest. default (card) · low (control-level shadow — toolbars, filter bars) · flat (border only) · raised (shadow, no border) · subtle · sunken · brand (tinted) · brand-solid (filled, on-colour text) · inverse · overlay (menus/popovers) · dialog · glass. @default 'default' */
  variant?: SurfaceVariant;
  /** Inner padding from --surface-pad-*. @default 'none' */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Sets --tone / --tone-fg / --tone-bg for the accent strip, tonal hover and any tinted child */
  tone?: Tone;
  /** 3px top strip in the tone colour */
  accent?: boolean;
  /** Behaviour · visual feedback only — neutral lift on hover. Does NOT make the box clickable. Use for previews / cards with their own inner actions. */
  hoverable?: boolean;
  /** Behaviour · the whole box is one action: pointer, focus ring. Implies hoverable. Render as 'a' or 'button' when possible; a div gets tabIndex=0. */
  interactive?: boolean;
  /** Behaviour · tinted hover — lift (-4px), border and glow track --tone instead of the neutral ladder. Implies hoverable; set tone to pick the hue (defaults to brand). */
  tonal?: boolean;
  /** Staggered entrance. true = no delay; a number = list index (50ms per step). Honours reduced motion. */
  reveal?: boolean | number;
  /** Brand-tinted selected state */
  selected?: boolean;
  /** overflow:hidden — for media that must follow the radius */
  clip?: boolean;
  children?: React.ReactNode;
}
export declare function Surface(props: SurfaceProps): JSX.Element;
