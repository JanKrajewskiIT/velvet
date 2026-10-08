import * as React from 'react';
/**
 * Card laid out in hairline-divided regions: media → header → body → footer.
 * Built on Surface (clip on); behaviour props are the same as Card (hoverable · interactive · tonal).
 * Use when a card has 2+ distinct regions (project, article, event). For a single content block use Card.
 */
export interface StructuredCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** @default 'div' — 'a' / 'button' with interactive */
  as?: keyof JSX.IntrinsicElements;
  /** Full-bleed media region (img / video / placeholder) */
  media?: React.ReactNode;
  /** @default '16 / 9' */
  mediaRatio?: string;
  /** Floating top-left over media — usually a Badge */
  mediaTag?: React.ReactNode;
  /** Bottom-right over media, white on scrim (e.g. "6 min read"). Turns the scrim on. */
  mediaMeta?: React.ReactNode;
  /** Bottom gradient scrim over media. @default true when mediaMeta is set */
  scrim?: boolean;
  title?: React.ReactNode;
  /** Secondary line under the title — icon + text */
  meta?: React.ReactNode;
  /** Header right slot — Badge / IconButton */
  badge?: React.ReactNode;
  /** Hairline-divided footer row */
  footer?: React.ReactNode;
  /** @default 'between' */
  footerAlign?: 'start' | 'end' | 'between';
  /** Behaviour · neutral hover lift */
  hoverable?: boolean;
  /** Behaviour · whole card is one action. Implies hoverable. */
  interactive?: boolean;
  /** Behaviour · tinted hover tracking tone. Implies hoverable. */
  tonal?: boolean;
  tone?: import('../primitives/Surface').Tone;
  /** 3px top strip in the tone colour (sits over media) */
  accent?: boolean;
  reveal?: boolean | number;
  selected?: boolean;
  /** Body region */
  children?: React.ReactNode;
}
export declare function StructuredCard(props: StructuredCardProps): JSX.Element;
