import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Tag } from '../display/Tag';
import type { TreeSelectNode } from './treeSelectRows';

export interface TreeSelectValueProps {
  picked: readonly TreeSelectNode[];
  multiple: boolean;
  maxTags: number;
  /** @default localized "Select…" */
  placeholder?: string;
  onRemove: (id: string) => void;
}

/** Trigger content of the TreeSelect: placeholder, single label, or tags with a "+N" overflow. */
export const TreeSelectValue = (props: TreeSelectValueProps) => {
  const translate = useTranslate();
  return (
    <>
      <Show when={props.picked.length === 0}>
        <span class="vui-tselect__ph">{props.placeholder ?? translate('velvet.forms.treeSelect.placeholder')}</span>
      </Show>
      <Show when={!props.multiple && props.picked[0]}>
        {(node) => <span class="vui-tselect__val">{node().label}</span>}
      </Show>
      <Show when={props.multiple}>
        <For each={props.picked.slice(0, props.maxTags)}>
          {(node) => (
            <Tag size="sm" onRemove={() => props.onRemove(node.id)}>
              {node.label}
            </Tag>
          )}
        </For>
        <Show when={props.picked.length > props.maxTags}>
          <Tag size="sm">{`+${props.picked.length - props.maxTags}`}</Tag>
        </Show>
      </Show>
    </>
  );
};
