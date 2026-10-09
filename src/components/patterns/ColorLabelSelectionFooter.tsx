import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import type { ColorLabelSelection } from './createColorLabelSelection';

export interface ColorLabelSelectionFooterProps {
  selection: ColorLabelSelection;
  submitLabel: string;
  cancelLabel: string;
  onClose?: () => void;
  onManage?: () => void;
}

/** Dialog footer: optional Manage, Cancel and Apply. */
export const ColorLabelSelectionFooter = (props: ColorLabelSelectionFooterProps) => {
  const translate = useTranslate();
  return (
    <>
      <Show when={props.onManage}>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="settings"
          class="vui-cls__manage"
          disabled={props.selection.busy()}
          onClick={() => props.onManage?.()}
        >
          {translate('velvet.patterns.colorLabelSelectionDialog.manage')}
        </Button>
      </Show>
      <Button variant="secondary" disabled={props.selection.busy()} onClick={() => props.onClose?.()}>
        {props.cancelLabel}
      </Button>
      <Button
        loading={props.selection.busy()}
        disabled={!props.selection.dirty()}
        onClick={() => void props.selection.submit()}
      >
        {props.selection.busy() ? translate('velvet.patterns.colorLabelSelectionDialog.applying') : props.submitLabel}
      </Button>
    </>
  );
};
