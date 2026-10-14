import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { ListItem } from '../primitives/ListItem';
import type { ColorLabel } from './colorLabel';
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
        class={cx('vui-clm__row', props.manager.draft()?.id === props.label.id && 'vui-clm__row--editing')}
        leading={<span class="vui-clm__dot" style={{ background: props.label.color }} aria-hidden="true" />}
        title={props.label.name}
        trailing={
          <>
            <Show when={props.label.count != null}>
              <span class="vui-clm__count">{props.label.count}</span>
            </Show>
            <IconButton
              icon="pencil"
              label={translate('velvet.patterns.colorLabelManager.edit', { name: props.label.name })}
              size="xs"
              onClick={() => props.manager.startEdit(props.label)}
            />
            <IconButton
              icon="trash-2"
              label={translate('velvet.patterns.colorLabelManager.delete', { name: props.label.name })}
              size="xs"
              class="vui-clm__del"
              aria-expanded={props.manager.confirming() === props.label.id}
              onClick={() => props.manager.toggleConfirm(props.label)}
            />
          </>
        }
      />
      <Show when={props.manager.confirming() === props.label.id}>
        <div class="vui-clm__confirm" role="alert">
          <span class="vui-clm__q">
            {props.label.count
              ? translate('velvet.patterns.colorLabelManager.deleteQuestionUsed', {
                  name: props.label.name,
                  count: props.label.count,
                })
              : translate('velvet.patterns.colorLabelManager.deleteQuestion', { name: props.label.name })}
          </span>
          <Button
            variant="ghost"
            size="xs"
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
