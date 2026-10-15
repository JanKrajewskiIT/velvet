import { For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Dialog } from '../feedback/Dialog';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { LABEL_COLORS } from './colorLabel';
import { ColorLabelForm } from './ColorLabelForm';
import styles from './ColorLabelManager.module.css';
import { ColorLabelManagerFooter } from './ColorLabelManagerFooter';
import type { ColorLabelManagerConfig, ColorLabelManagerProps } from './colorLabelManagerTypes';
import { ColorLabelRow } from './ColorLabelRow';
import { createColorLabelManager } from './createColorLabelManager';

export type { ColorLabelManagerProps } from './colorLabelManagerTypes';

/** Compact dialog listing labels as dot + name with edit / delete; edit and "Add label" open a Name + Color form; delete confirms inline. */
export const ColorLabelManager = (props: ColorLabelManagerProps) => {
  const p: ColorLabelManagerConfig = mergeProps(
    { colors: LABEL_COLORS } satisfies Partial<ColorLabelManagerProps>,
    props,
  );
  const translate = useTranslate();
  const title = () => p.title ?? translate('velvet.patterns.colorLabelManager.title');
  const errorText = () => p.errorText ?? translate('velvet.patterns.colorLabelManager.errorText');
  const manager = createColorLabelManager(p);

  return (
    <Dialog
      open={p.open}
      onClose={p.onClose}
      title={title()}
      size="sm"
      class="vui-clm"
      footer={<ColorLabelManagerFooter manager={manager} />}
    >
      <Show when={manager.failed()}>
        <Text
          as="div"
          variant="body-sm"
          tone="danger"
          class={styles.confirmPartErr}
          role="alert"
          style={{ 'margin-bottom': 'var(--space-3)' }}
        >
          <Glyph name="alert-circle" />
          {errorText()}
        </Text>
      </Show>
      <ul class={styles.clmPartList}>
        <For each={p.labels}>{(label) => <ColorLabelRow label={label} manager={manager} />}</For>
        <Show when={p.labels.length === 0}>
          <EmptyText as="li" class="vui-clm__empty">
            {translate('velvet.patterns.colorLabelManager.empty')}
          </EmptyText>
        </Show>
      </ul>
      <Show when={manager.draft()}>
        {(current) => <ColorLabelForm draft={current()} colors={p.colors} manager={manager} />}
      </Show>
    </Dialog>
  );
};
