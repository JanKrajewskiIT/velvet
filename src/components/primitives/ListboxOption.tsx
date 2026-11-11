import { mergeProps, splitProps } from 'solid-js';

import { callHandler } from '../../utils/callHandler';
import { Option, type OptionProps } from './Option';

export interface ListboxOptionProps extends OptionProps {
  /** @default true */
  checkEnd?: boolean;
}

/** Option row whose mousedown keeps focus in the owning field. */
export const ListboxOption = (props: ListboxOptionProps) => {
  const merged = mergeProps({ as: 'li', checkEnd: true } satisfies ListboxOptionProps, props);
  const [local, rest] = splitProps(merged, ['onMouseDown']);
  return (
    <Option
      {...rest}
      role="option"
      onMouseDown={(event) => {
        event.preventDefault();
        callHandler(local.onMouseDown, event);
      }}
    />
  );
};
