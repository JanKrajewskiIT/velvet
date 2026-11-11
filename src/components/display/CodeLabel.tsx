import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { IconTile } from '../primitives/IconTile';
import styles from './CodeLabel.module.css';

export interface CodeLabelProps extends HtmlProps<HTMLElement, 'onClick'> {
  code: string;
  name?: JSX.Element;
  /** Short tag shown beside the code. */
  tag?: string;
  /** Logo node or text used for the initials tile. Defaults to the code. */
  mark?: JSX.Element;
  showMark?: boolean;
  meta?: JSX.Element;
  size?: 'sm' | 'md';
  selected?: boolean;
  onClick?: (event: MouseEvent) => void;
}

/** Identifier with an optional tag, description, and mark. */
export const CodeLabel = (props: CodeLabelProps) => {
  const merged = mergeProps({ size: 'md' } satisfies Partial<CodeLabelProps>, props);
  const [local, rest] = splitProps(merged, [
    'code',
    'name',
    'tag',
    'mark',
    'showMark',
    'meta',
    'size',
    'selected',
    'onClick',
    'class',
  ]);
  const mark = () =>
    typeof local.mark === 'string' || local.mark == null
      ? (local.mark || local.code)
          .replace(/[^A-Za-z0-9]/gu, '')
          .slice(0, 3)
          .toUpperCase()
      : local.mark;
  return (
    <Polymorphic
      {...rest}
      tag={local.onClick ? 'button' : 'span'}
      type={local.onClick ? 'button' : undefined}
      onClick={local.onClick}
      aria-pressed={local.onClick ? !!local.selected : undefined}
      class={cx(styles.root, local.class)}
      data-size={local.size}
      data-selected={!!local.selected}
    >
      <Show when={local.showMark}>
        <IconTile size="sm" class={styles.mark}>
          {mark()}
        </IconTile>
      </Show>
      <span class={styles.text}>
        <span class={styles.row}>
          <span class={styles.code}>{local.code}</span>
          <Show when={local.tag}>
            <span class={styles.tag}>{local.tag}</span>
          </Show>
        </span>
        <Show when={local.name || local.meta}>
          <span class={styles.name}>
            {local.name}
            {local.name && local.meta ? ' · ' : ''}
            {local.meta}
          </span>
        </Show>
      </span>
    </Polymorphic>
  );
};
