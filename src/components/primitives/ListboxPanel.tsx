import { createEffect, createSignal } from 'solid-js';

import { assignRef } from '../../utils/assignRef';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { partitionProps, withDefaults } from '../../utils/props';
import styles from './ListboxPanel.module.css';

const MIN_SPACE_BELOW = 260;

export interface ListboxPanelProps extends HtmlProps<HTMLElement> {
  /** @default 'div' */
  as?: ElementTag;
  /** Force the panel above the field. Omit for automatic flipping. */
  up?: boolean;
  /** Flip when there is less than 260px below and more room above. @default true */
  flip?: boolean;
}

/** Floating surface under a select, combobox or picker field. */
export const ListboxPanel = (props: ListboxPanelProps) => {
  const merged = withDefaults({ as: 'div', flip: true } satisfies ListboxPanelProps, props);
  const [local, rest] = partitionProps(merged, ['as', 'up', 'flip', 'ref', 'class']);
  const [node, setNode] = createSignal<HTMLElement>();
  const [auto, setAuto] = createSignal(false);
  createEffect(
    () => [node()?.parentElement, local.up, local.flip] as const,
    ([parent, up, flip]) => {
      if (up !== undefined || !flip || !parent) return;
      const rect = parent.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom;
      setAuto(below < MIN_SPACE_BELOW && rect.top > below);
    },
  );
  const up = () => local.up ?? (local.flip && auto());
  return (
    <Polymorphic
      {...rest}
      tag={local.as}
      ref={(element: HTMLElement) => {
        setNode(element);
        assignRef(local.ref, element);
      }}
      class={cx(styles.panel, up() && styles.up, local.class)}
    />
  );
};
