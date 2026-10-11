import { type IconName, VelvetIcons } from './VelvetIcons';

const FILLED_SUFFIX = '-filled';

type FilledSuffix = typeof FILLED_SUFFIX;

/** Base names that have a `<name>-filled` twin. */
export type FilledIconBase = IconName extends infer Name
  ? Name extends `${infer Base}${FilledSuffix}`
    ? Base
    : never
  : never;

const hasFilledTwin = (name: string): name is FilledIconBase => `${name}${FILLED_SUFFIX}` in VelvetIcons;

/** Base names with a filled twin for selected states or contexts where a filled glyph is required, such as print. */
export const IconFilled: readonly FilledIconBase[] = Object.keys(VelvetIcons)
  .filter((name) => name.endsWith(FILLED_SUFFIX))
  .map((name) => name.slice(0, -FILLED_SUFFIX.length))
  .filter(hasFilledTwin);

/** Returns `<name>-filled` when `on` and a filled twin exists, else `name`. */
export const filledIcon = <Name extends string>(name: Name, on?: boolean): Name | `${Name}${FilledSuffix}` =>
  on && hasFilledTwin(name) ? `${name}${FILLED_SUFFIX}` : name;
