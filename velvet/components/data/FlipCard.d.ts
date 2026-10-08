import * as React from 'react';
import type { CardProps } from '../display/Card';
/** Two-sided card that flips in 3D on click / Enter / Space (fades under reduced motion). Each face is a Card. Flashcards, reveal answers, before/after. */
export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped?: boolean;
  defaultFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  /** px. @default 220 */
  height?: number;
  label?: string;
  /** Front face paint (Card/Surface variant). @default 'default' */
  variant?: CardProps['variant'];
  /** Back face paint. @default 'brand-solid' */
  backVariant?: CardProps['variant'];
  /** Front face hue + accent strip */
  tone?: CardProps['tone'];
  accent?: CardProps['accent'];
  /** px or CSS length; default fills the column */
  width?: number | string;
  /** center = centred stack (vocab card) · start = left-aligned header / body / footer laid out top-to-bottom (Q&A, metric). @default 'center' */
  align?: 'center' | 'start';
  /** Also flip on pointer hover (click still toggles). @default false */
  flipOnHover?: boolean;
  className?: string;
}
export declare function FlipCard(props: FlipCardProps): JSX.Element;
