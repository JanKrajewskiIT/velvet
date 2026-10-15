import { For, Index, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './CascaderColumns.module.css';
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
    <div class={styles.cascPartCols}>
      <Index each={props.columns}>
        {(list, level) => (
          <ul
            class={styles.cascPartCol}
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
                      typographyClass('body'),
                      styles.option,
                      styles.cascPartOpt,
                      highlighted() && styles.cascPartOptVariantOn,
                      highlighted() && level === props.activeColumn && styles.optionVariantActive,
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
                    <Text as="span" variant="body" tone="inherit" class={styles.optionPartLabel}>
                      {node.label}
                    </Text>
                    <Show when={node.meta != null}>
                      <Text as="span" variant="kbd" tone="inherit" class={styles.optionPartKbd}>
                        {node.meta}
                      </Text>
                    </Show>
                    <Show
                      when={hasChildren(node)}
                      fallback={
                        <Show when={picked()}>
                          <Glyph name="check" class={styles.selectPartCheck} />
                        </Show>
                      }
                    >
                      <Glyph name="chevron-right" class={styles.cascPartArrow} />
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
