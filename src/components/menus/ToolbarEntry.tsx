import { Match, Show, Switch } from 'solid-js';

import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Separator } from '../primitives/Separator';
import { isIconOnly, type ToolbarItem } from './toolbarItem';

export interface ToolbarEntryProps {
  item: ToolbarItem;
  /** Position in the toolbar's items. Set on real buttons so keyboard navigation can find them; omitted on measuring copies. */
  index?: number;
  tabIndex?: number;
}

/** One toolbar entry: button, divider or spacer. */
export const ToolbarEntry = (props: ToolbarEntryProps) => (
  <Switch
    fallback={
      <button
        type="button"
        data-tb={props.index}
        tabIndex={props.tabIndex}
        class={cx('vui-toolbar__btn', !isIconOnly(props.item) && 'vui-toolbar__btn--label')}
        disabled={props.item.disabled}
        aria-pressed={props.item.active}
        aria-label={isIconOnly(props.item) ? props.item.label : undefined}
        title={
          isIconOnly(props.item)
            ? `${props.item.label}${props.item.shortcut ? ` (${props.item.shortcut})` : ''}`
            : undefined
        }
        onClick={() => props.item.onClick?.()}
      >
        <Show when={props.item.icon}>{(icon) => <Glyph name={icon()} />}</Show>
        <Show when={!isIconOnly(props.item)}>{props.item.label}</Show>
      </button>
    }
  >
    <Match when={props.item.divider}>
      <Separator semantic class="vui-toolbar__sep" />
    </Match>
    <Match when={props.item.spacer}>
      <span class="vui-toolbar__spacer" />
    </Match>
  </Switch>
);
