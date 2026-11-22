import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { partitionProps } from '../../utils/props';
import { EmptyText } from './EmptyText';
import styles from './ListboxEmpty.module.css';

export interface ListboxEmptyProps extends HtmlProps<HTMLLIElement> {
  /** Failure styling; the caller may include a Retry action. */
  error?: boolean;
}

/** Empty or failed list content. The owning control places actionable status outside its listbox. */
export const ListboxEmpty = (props: ListboxEmptyProps) => {
  const [local, rest] = partitionProps(props, ['error', 'class']);
  return (
    <EmptyText
      // The explicit li root preserves the native event targets declared by ListboxEmptyProps.
      {...(rest as HtmlProps<HTMLElement>)}
      as="li"
      align="start"
      class={cx(styles.empty, local.error && styles.error, local.class)}
    />
  );
};
