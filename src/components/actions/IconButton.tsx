import { type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { renderIcon } from '../primitives/Glyph';
import { buttonClass, type ButtonSize } from './buttonClass';
import { useButtonGroupSize } from './ButtonGroup';

export type IconButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'raised' | 'overlay';

export interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Glyph name or node. */
  icon: JSX.Element;
  /** Accessible label (also used as the title). */
  label: string;
  /** raised = floating over content (carousel arrows) · overlay = on media / dark scrims (lightbox). @default 'ghost' */
  variant?: IconButtonVariant;
  /** circle for floating nav arrows / media controls. @default 'square' */
  shape?: 'square' | 'circle';
  /** xs 24 · sm 32 · md 40 · lg 48. xs is for dense rows, table cells and chips. @default 'md' */
  size?: ButtonSize;
}

/** Square icon-only button. Always carries an accessible label. */
export const IconButton = (props: IconButtonProps) => {
  const merged = mergeProps(
    { variant: 'ghost', shape: 'square', type: 'button' } satisfies Partial<IconButtonProps>,
    props,
  );
  const [local, rest] = splitProps(merged, ['icon', 'label', 'variant', 'shape', 'size', 'class']);
  const groupSize = useButtonGroupSize();
  return (
    <button
      aria-label={local.label}
      title={local.label}
      class={cx(
        buttonClass({
          variant: local.variant,
          size: local.size ?? groupSize,
          icon: true,
          circle: local.shape === 'circle',
        }),
        local.class,
      )}
      {...rest}
    >
      {renderIcon(local.icon)}
    </button>
  );
};
