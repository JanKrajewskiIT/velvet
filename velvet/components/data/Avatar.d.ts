import * as React from 'react';
/** Initials or image avatar with optional presence dot. */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  initials?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'brand' | 'neutral';
  /** Solid fill (any CSS colour, e.g. var(--dv-3)) with on-colour initials — series / person colour coding.
   *  'auto' = stable --dv-1…8 hue hashed from name — companies / people in lists get a consistent colour without storing one. */
  color?: 'auto' | (string & {});
  /** Custom content (icon, node) instead of image / initials */
  children?: React.ReactNode;
  /** Presence indicator, bottom-right */
  status?: 'online' | 'away' | 'busy' | 'offline';
}
export declare function Avatar(props: AvatarProps): JSX.Element;
export interface AvatarGroupProps { children?: React.ReactNode; className?: string }
export declare function AvatarGroup(props: AvatarGroupProps): JSX.Element;
