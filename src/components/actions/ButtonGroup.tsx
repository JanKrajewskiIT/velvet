import { type Accessor, createContext, createMemo, getOwner, useContext } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { partitionProps, withDefaults } from '../../utils/props';
import type { ButtonSize } from './buttonClass';
import styles from './ButtonGroup.module.css';

const noGroupSize = (): undefined => undefined;
const ButtonGroupSizeContext = createContext<Accessor<ButtonSize | undefined>>(noGroupSize);

/** Size set on the enclosing ButtonGroup, for children that do not set their own. */
export const useButtonGroupSize = (): Accessor<ButtonSize | undefined> =>
  getOwner() === null ? noGroupSize : useContext(ButtonGroupSizeContext);

export interface ButtonGroupProps extends HtmlProps<HTMLDivElement> {
  /** Join the buttons into one segmented control with shared borders. @default true */
  attached?: boolean;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Applied to every child that does not set its own. */
  size?: Exclude<ButtonSize, 'xs'>;
  /** Accessible group name. */
  label?: string;
}

/** Groups related Buttons / IconButtons. For a single choice among options use OptionSwitcher or Tabs. */
export const ButtonGroup = (props: ButtonGroupProps) => {
  const merged = withDefaults({ attached: true, orientation: 'horizontal' } satisfies ButtonGroupProps, props);
  const [local, rest] = partitionProps(merged, ['attached', 'orientation', 'size', 'label', 'class', 'children']);
  const size = createMemo(() => local.size);
  return (
    <ButtonGroupSizeContext value={size}>
      <div
        role="group"
        aria-label={local.label}
        class={cx(
          styles.btngroup,
          local.attached && styles.btngroupVariantAttached,
          local.orientation === 'vertical' && styles.btngroupVariantVertical,
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </div>
    </ButtonGroupSizeContext>
  );
};
