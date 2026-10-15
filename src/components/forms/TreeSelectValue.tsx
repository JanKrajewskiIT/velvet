import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Tag } from '../display/Tag';
import { Text } from '../primitives/Text';
import type { TreeSelectNode } from './treeSelectRows';
import styles from './TreeSelectValue.module.css';

export interface TreeSelectValueProps {
  picked: readonly TreeSelectNode[];
  multiple: boolean;
  maxTags: number;
  /** @default localized "Select…" */
  placeholder?: string;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

/** Trigger content of the TreeSelect: placeholder, single label, or tags with a "+N" overflow. */
export const TreeSelectValue = (props: TreeSelectValueProps) => {
  const translate = useTranslate();
  return (
    <>
      <Show when={props.picked.length === 0}>
        <Text as="span" variant="body" tone="inherit" class={styles.tselectPartPh}>
          {props.placeholder ?? translate('velvet.forms.treeSelect.placeholder')}
        </Text>
      </Show>
      <Show when={!props.multiple && props.picked[0]}>
        {(node) => (
          <Text as="span" variant="body" tone="inherit" class={styles.tselectPartVal}>
            {node().label}
          </Text>
        )}
      </Show>
      <Show when={props.multiple}>
        <For each={props.picked.slice(0, props.maxTags)}>
          {(node) => (
            <Tag class={styles.tag} size="sm" disabled={props.disabled} onRemove={() => props.onRemove(node.id)}>
              {node.label}
            </Tag>
          )}
        </For>
        <Show when={props.picked.length > props.maxTags}>
          <Tag class={styles.tag} size="sm">{`+${props.picked.length - props.maxTags}`}</Tag>
        </Show>
      </Show>
    </>
  );
};
