import { For, Show } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import type { DiffRow } from './diffLines';
import styles from './DiffText.module.css';

const DIFF_PART_W_CLASSES = {
  add: styles.diffPartWVariantAdd,
  del: styles.diffPartWVariantDel,
} as const;

export interface DiffTextProps {
  row: DiffRow;
  class?: string;
}

const NON_BREAKING_SPACE = ' ';

/** The text of one diff line, with word-level highlights inside changed lines. */
export const DiffText = (props: DiffTextProps) => (
  <Text as="span" variant="code" tone="inherit" class={cx(styles.diffPartTxt, props.class)}>
    <Show when={props.row.parts} fallback={props.row.text || NON_BREAKING_SPACE}>
      {(parts) => (
        <For each={parts()}>
          {([text, changed]) => (
            <Show when={changed} fallback={text}>
              <mark class={cx(styles.diffPartW, variantClass(DIFF_PART_W_CLASSES, props.row.t))}>{text}</mark>
            </Show>
          )}
        </For>
      )}
    </Show>
  </Text>
);
