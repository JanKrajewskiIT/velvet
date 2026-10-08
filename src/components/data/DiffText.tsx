import { For, Show } from 'solid-js';

import type { DiffRow } from './diffLines';

export interface DiffTextProps {
  row: DiffRow;
}

const NON_BREAKING_SPACE = ' ';

/** The text of one diff line, with word-level highlights inside changed lines. */
export const DiffText = (props: DiffTextProps) => (
  <span class="vui-diff__txt">
    <Show when={props.row.parts} fallback={props.row.text || NON_BREAKING_SPACE}>
      {(parts) => (
        <For each={parts()}>
          {([text, changed]) => (
            <Show when={changed} fallback={text}>
              <mark class={`vui-diff__w vui-diff__w--${props.row.t}`}>{text}</mark>
            </Show>
          )}
        </For>
      )}
    </Show>
  </span>
);
