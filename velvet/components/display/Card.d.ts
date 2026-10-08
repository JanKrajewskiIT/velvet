import * as React from 'react';
import type { SurfaceProps } from '../primitives/Surface';
/**
 * Content container = Surface + regions (header · body · footer) and their padding. Nothing else.
 * Paint, hue, behaviour and state are Surface props passed straight through — see Surface for their meaning.
 * Media, scrim and hairline-divided regions → StructuredCard.
 * Built on Card: FeatureCard · FlipCard · Stat · ScoreCard · QuestionCard.
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Top-right slot — usually IconButtons */
  actions?: React.ReactNode;
  /** Tinted footer bar — usually Buttons */
  footer?: React.ReactNode;
  /** @default 'end' */
  footerAlign?: 'start' | 'end' | 'between';
  /** Region padding from --card-pad-*. @default 'md' */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Surface pass-through */
  as?: SurfaceProps['as'];
  variant?: SurfaceProps['variant'];
  tone?: SurfaceProps['tone'];
  accent?: SurfaceProps['accent'];
  hoverable?: SurfaceProps['hoverable'];
  interactive?: SurfaceProps['interactive'];
  tonal?: SurfaceProps['tonal'];
  reveal?: SurfaceProps['reveal'];
  selected?: SurfaceProps['selected'];
  clip?: SurfaceProps['clip'];
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
