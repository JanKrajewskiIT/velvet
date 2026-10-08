import { For, Index, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { type CascaderNode, hasChildren } from './cascaderPaths';

export type CascaderActivation = 'click' | 'hover';

export interface CascaderColumnsProps {
  columns: readonly (readonly CascaderNode[])[];
  /** Highlighted node id per column. */
  trail: readonly string[];
  /** Column that owns keyboard focus. */
  activeColumn: number;
  /** Currently committed path. */
  picked: readonly CascaderNode[];
  expandTrigger: CascaderActivation;
  onActivate: (level: number, node: CascaderNode, via: CascaderActivation) => void;
}

/** Side-by-side option columns of the Cascader menu. */
export const CascaderColumns = (props: CascaderColumnsProps) => {
  const translate = useTranslate();
  return (
    <div class="vui-casc__cols">
      <Index each={props.columns}>
        {(list, level) => (
          <ul
            class="vui-casc__col"
            role="listbox"
            aria-label={translate('velvet.forms.cascaderColumns.level', { level: level + 1 })}
          >
            <For each={list()}>
              {(node) => {
                const highlighted = () => props.trail[level] === node.id;
                const picked = () => props.picked[level]?.id === node.id;
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled by the Cascader dialog's onKeyDown with a virtual active option
                  <li
                    role="option"
                    aria-selected={highlighted()}
                    aria-disabled={node.disabled || undefined}
                    class={cx(
                      'vui-option',
                      'vui-casc__opt',
                      highlighted() && 'vui-casc__opt--on',
                      highlighted() && level === props.activeColumn && 'vui-option--active',
                      picked() && 'vui-casc__opt--picked',
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => {
                      if (props.expandTrigger === 'hover' && hasChildren(node) && !node.disabled)
                        props.onActivate(level, node, 'hover');
                    }}
                    onClick={() => {
                      if (!node.disabled) props.onActivate(level, node, 'click');
                    }}
                  >
                    <Show when={node.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                    <span class="vui-option__label">{node.label}</span>
                    <Show when={node.meta != null}>
                      <span class="vui-option__kbd">{node.meta}</span>
                    </Show>
                    <Show
                      when={hasChildren(node)}
                      fallback={
                        <Show when={picked()}>
                          <Glyph name="check" class="vui-select__check" />
                        </Show>
                      }
                    >
                      <Glyph name="chevron-right" class="vui-casc__arrow" />
                    </Show>
                  </li>
                );
              }}
            </For>
          </ul>
        )}
      </Index>
    </div>
  );
};
