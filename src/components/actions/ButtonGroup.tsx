import { type Accessor, createContext, createMemo, mergeProps, splitProps, useContext } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { ButtonSize } from './buttonClass';

const ButtonGroupSizeContext = createContext<Accessor<ButtonSize | undefined>>();

/** Size set on the enclosing ButtonGroup, for children that do not set their own. */
export const useButtonGroupSize = (): ButtonSize | undefined => useContext(ButtonGroupSizeContext)?.();

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
  const merged = mergeProps({ attached: true, orientation: 'horizontal' } satisfies ButtonGroupProps, props);
  const [local, rest] = splitProps(merged, ['attached', 'orientation', 'size', 'label', 'class', 'children']);
  const size = createMemo(() => local.size);
  return (
    <ButtonGroupSizeContext.Provider value={size}>
      <div
        role="group"
        aria-label={local.label}
        class={cx(
          'vui-btngroup',
          local.attached && 'vui-btngroup--attached',
          local.orientation === 'vertical' && 'vui-btngroup--vertical',
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </div>
    </ButtonGroupSizeContext.Provider>
  );
};
