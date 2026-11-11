import { mergeProps, Show, splitProps } from 'solid-js';

import { assignRef } from '../../utils/assignRef';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Listbox.module.css';
import { ListboxPanel } from './ListboxPanel';

export interface ListboxProps extends HtmlProps<HTMLUListElement> {
  /** False renders a bare list in a panel owned by the caller. @default true */
  floating?: boolean;
  multiselectable?: boolean;
  up?: boolean;
  flip?: boolean;
}

/** Listbox surface; the owning control supplies active-item and selection behavior. */
export const Listbox = (props: ListboxProps) => {
  const merged = mergeProps({ floating: true } satisfies ListboxProps, props);
  const [local, rest] = splitProps(merged, ['floating', 'multiselectable', 'up', 'flip', 'ref', 'class']);
  return (
    <Show
      when={local.floating}
      fallback={
        <ul
          {...rest}
          ref={local.ref}
          role="listbox"
          aria-multiselectable={local.multiselectable || undefined}
          class={cx(styles.list, local.class)}
        />
      }
    >
      <ListboxPanel
        // The explicit ul root preserves the native event targets declared by ListboxProps.
        {...(rest as HtmlProps<HTMLElement>)}
        as="ul"
        ref={(element) => {
          if (element instanceof HTMLUListElement) assignRef(local.ref, element);
        }}
        up={local.up}
        flip={local.flip}
        role="listbox"
        aria-multiselectable={local.multiselectable || undefined}
        class={local.class}
      />
    </Show>
  );
};
