import { For, Index, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Listbox } from '../primitives/Listbox';
import { ListboxOption } from '../primitives/ListboxOption';
import styles from './CascaderColumns.module.css';
import { type CascaderNode, hasChildren } from './cascaderPaths';

export type CascaderActivation = 'click' | 'hover';
export interface CascaderColumnsProps {
  columns: readonly (readonly CascaderNode[])[];
  trail: readonly string[];
  activeColumn: number;
  picked: readonly CascaderNode[];
  expandTrigger: CascaderActivation;
  onActivate: (level: number, node: CascaderNode, via: CascaderActivation) => void;
}

export const CascaderColumns = (props: CascaderColumnsProps) => {
  const translate = useTranslate();
  return (
    <div class={styles.cascPartCols}>
      <Index each={props.columns}>
        {(list, level) => (
          <Listbox
            floating={false}
            class={styles.cascPartCol}
            aria-label={translate('velvet.forms.cascaderColumns.level', { level: level + 1 })}
          >
            <For each={list()}>
              {(node) => {
                const highlighted = () => props.trail[level] === node.id;
                const picked = () => props.picked[level]?.id === node.id;
                return (
                  <ListboxOption
                    icon={node.icon}
                    label={node.label}
                    shortcut={node.meta}
                    selected={picked()}
                    active={highlighted() && level === props.activeColumn}
                    disabled={node.disabled}
                    class={cx(styles.cascPartOpt, highlighted() && styles.cascPartOptVariantOn)}
                    checkEnd={!hasChildren(node)}
                    trailing={
                      <Show when={hasChildren(node)}>
                        <Glyph name="chevron-right" class={styles.cascPartArrow} />
                      </Show>
                    }
                    onMouseEnter={() => {
                      if (props.expandTrigger === 'hover' && hasChildren(node) && !node.disabled)
                        props.onActivate(level, node, 'hover');
                    }}
                    onClick={() => props.onActivate(level, node, 'click')}
                  />
                );
              }}
            </For>
          </Listbox>
        )}
      </Index>
    </div>
  );
};
