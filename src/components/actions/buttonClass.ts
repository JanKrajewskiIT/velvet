import { cx, modifier } from '../../utils/cx';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonClassOptions {
  variant: string;
  size?: ButtonSize;
  icon?: boolean;
  block?: boolean;
  circle?: boolean;
}

/** The one place the `vui-btn` class set is assembled; every component that renders a button skin goes through it. */
export const buttonClass = ({ variant, size, icon, block, circle }: ButtonClassOptions): string =>
  cx(
    'vui-btn',
    `vui-btn--${variant}`,
    modifier('vui-btn', size, 'md'),
    icon && 'vui-btn--icon',
    block && 'vui-btn--block',
    circle && 'vui-btn--circle',
  );
