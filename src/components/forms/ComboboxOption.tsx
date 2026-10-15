import type { JSX } from 'solid-js';

import { cx } from '../../utils/cx';
import { typographyClass } from '../primitives/typography';
import styles from './ComboboxOption.module.css';

export interface ComboboxOptionProps {
  id: string;
  selected: boolean;
  active: boolean;
  disabled?: boolean | undefined;
  class?: string;
  onHover?: () => void;
  onPick: () => void;
  children?: JSX.Element;
}

/** One row of a combobox popup; focus stays on the owning control, which handles the keyboard through `aria-activedescendant`. */
export const ComboboxOption = (props: ComboboxOptionProps) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled by the owning control via aria-activedescendant
  <li
    id={props.id}
    role="option"
    aria-selected={props.selected}
    aria-disabled={props.disabled || undefined}
    class={cx(
      typographyClass('body'),
      styles.selectPartOption,
      props.class,
      props.active && styles.selectPartOptionVariantActive,
    )}
    onMouseEnter={() => props.onHover?.()}
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => props.onPick()}
  >
    {props.children}
  </li>
);
