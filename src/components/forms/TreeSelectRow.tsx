import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
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
    class={cx('vui-option', 'vui-tselect__row', props.active && 'vui-option--active')}
    style={{ 'padding-left': `calc(var(--option-px) + ${(props.row.level - 1) * INDENT_PX}px)` }}
    onMouseEnter={() => props.onHover()}
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => props.onPick()}
  >
    <span
      class={cx('vui-tselect__twist', !props.row.hasChildren && 'vui-tselect__twist--leaf')}
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
      <span class={cx('vui-fchip__box', props.state !== 'off' && 'vui-fchip__box--on')} aria-hidden="true">
        <Show when={props.state === 'on'}>
          <Glyph name="check" />
        </Show>
        <Show when={props.state === 'mixed'}>
          <Glyph name="minus" />
        </Show>
      </span>
    </Show>
    <Show when={props.row.node.icon}>{(icon) => <Glyph name={icon()} />}</Show>
    <span class="vui-option__label">{props.row.node.label}</span>
    <Show when={props.row.node.meta != null}>
      <span class="vui-option__kbd">{props.row.node.meta}</span>
    </Show>
    <Show when={!props.multiple && props.state === 'on'}>
      <Glyph name="check" class="vui-select__check" />
    </Show>
  </div>
);
