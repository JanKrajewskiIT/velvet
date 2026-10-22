import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { ListItem } from '../primitives/ListItem';
import { Text } from '../primitives/Text';
import type { ColorLabel } from './colorLabel';
import styles from './ColorLabelRow.module.css';
import type { ColorLabelManagerController } from './createColorLabelManager';

export interface ColorLabelRowProps {
  label: ColorLabel;
  manager: ColorLabelManagerController;
}

/** One label: dot + name with edit / delete, and the inline delete confirmation beneath it. */
export const ColorLabelRow = (props: ColorLabelRowProps) => {
  const translate = useTranslate();
  return (
    <li class="vui-clm__item">
      <ListItem
        size="sm"
        class={cx(styles.clmPartRow, props.manager.draft()?.id === props.label.id && styles.clmPartRowVariantEditing)}
        leading={<span class={styles.clmPartDot} style={{ background: props.label.color }} aria-hidden="true" />}
        title={props.label.name}
        trailing={
          <>
            <Show when={props.label.count != null}>
              <Text as="span" variant="caption" tone="tertiary" tabular class={styles.clmPartCount}>
                {props.label.count}
              </Text>
            </Show>
            <IconButton
              icon="pencil"
              label={translate('velvet.patterns.colorLabelManager.edit', { name: props.label.name })}
              size="xs"
              disabled={props.manager.busy()}
              onClick={() => props.manager.startEdit(props.label)}
            />
            <IconButton
              icon="trash-2"
              label={translate('velvet.patterns.colorLabelManager.delete', { name: props.label.name })}
              size="xs"
              class={styles.clmPartDel}
              disabled={props.manager.busy()}
              aria-expanded={props.manager.confirming() === props.label.id}
              onClick={() => props.manager.toggleConfirm(props.label)}
            />
          </>
        }
        titleVariant="label"
      />
      <Show when={props.manager.confirming() === props.label.id}>
        <div class={styles.clmPartConfirm} role="alert">
          <Text as="span" variant="body-sm" tone="primary" class={styles.clmPartQ}>
            {props.label.count
              ? translate('velvet.patterns.colorLabelManager.deleteQuestionUsed', {
                  name: props.label.name,
                  count: props.label.count,
                })
              : translate('velvet.patterns.colorLabelManager.deleteQuestion', { name: props.label.name })}
          </Text>
          <Button
            variant="ghost"
            size="xs"
            disabled={props.manager.busy()}
            onClick={props.manager.cancelConfirm}
            ref={(el: HTMLButtonElement) => queueMicrotask(() => el.focus())}
          >
            {translate('velvet.common.cancel')}
          </Button>
          <Button
            variant="danger"
            size="xs"
            loading={props.manager.busy()}
            onClick={() => void props.manager.remove(props.label).catch(reportAsyncError)}
          >
            {translate('velvet.common.delete')}
          </Button>
        </div>
      </Show>
    </li>
  );
};
