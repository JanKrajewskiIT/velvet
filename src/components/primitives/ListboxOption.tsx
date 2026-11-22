import { callHandler } from '../../utils/callHandler';
import { partitionProps, withDefaults } from '../../utils/props';
import { Option, type OptionProps } from './Option';

export interface ListboxOptionProps extends OptionProps {
  /** @default true */
  checkEnd?: boolean;
}

/** Option row whose mousedown keeps focus in the owning field. */
export const ListboxOption = (props: ListboxOptionProps) => {
  const merged = withDefaults({ as: 'li', checkEnd: true } satisfies ListboxOptionProps, props);
  const [local, rest] = partitionProps(merged, ['onMouseDown']);
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
