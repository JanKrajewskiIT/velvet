import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './TreeSelectRow.module.css';
import type { SelectionState, TreeRow } from './treeSelectRows';

export interface TreeSelectRowProps {
  /** DOM id (target of `aria-activedescendant`). */
  id: string;
  row: TreeRow;
  active: boolean;
  multiple: boolean;
  /** Branch is open — always true while searching. */
  expanded: boolean;
  state: SelectionState;
  onHover: () => void;
  onPick: () => void;
  onToggle: () => void;
}

const INDENT_PX = 18;

/** One `treeitem` row of the TreeSelect: twist, tri-state box (multiple), icon, label, meta, check (single). */
export const TreeSelectRow = (props: TreeSelectRowProps) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- keyboard and focus are handled by the tree owner via aria-activedescendant
  <div
    id={props.id}
    role="treeitem"
    aria-level={props.row.level}
    aria-expanded={props.row.hasChildren ? props.expanded : undefined}
    aria-selected={props.multiple ? undefined : props.state === 'on'}
    aria-checked={props.multiple ? (props.state === 'mixed' ? 'mixed' : props.state === 'on') : undefined}
    class={cx(
      typographyClass('body'),
      styles.option,
      styles.tselectPartRow,
      props.active && styles.optionVariantActive,
    )}
    style={{ 'padding-left': `calc(var(--option-px) + ${(props.row.level - 1) * INDENT_PX}px)` }}
    onMouseEnter={() => props.onHover()}
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => props.onPick()}
  >
    <span
      class={cx(styles.tselectPartTwist, !props.row.hasChildren && styles.tselectPartTwistVariantLeaf)}
      aria-hidden="true"
      onClick={(e) => {
        if (!props.row.hasChildren) return;
        e.stopPropagation();
        props.onToggle();
      }}
    >
      <Show when={props.row.hasChildren}>
        <Glyph name={props.expanded ? 'chevron-down' : 'chevron-right'} />
      </Show>
    </span>
    <Show when={props.multiple}>
      <Text
        as="span"
        variant="caption"
        tone="inherit"
        class={cx(styles.fchipPartBox, props.state !== 'off' && styles.fchipPartBoxVariantOn)}
        aria-hidden="true"
      >
        <Show when={props.state === 'on'}>
          <Glyph name="check" />
        </Show>
        <Show when={props.state === 'mixed'}>
          <Glyph name="minus" />
        </Show>
      </Text>
    </Show>
    <Show when={props.row.node.icon}>{(icon) => <Glyph name={icon()} />}</Show>
    <Text as="span" variant="body" tone="inherit" class={styles.optionPartLabel}>
      {props.row.node.label}
    </Text>
    <Show when={props.row.node.meta != null}>
      <Text as="span" variant="kbd" tone="inherit" class={styles.optionPartKbd}>
        {props.row.node.meta}
      </Text>
    </Show>
    <Show when={!props.multiple && props.state === 'on'}>
      <Glyph name="check" class={styles.selectPartCheck} />
    </Show>
  </div>
);
