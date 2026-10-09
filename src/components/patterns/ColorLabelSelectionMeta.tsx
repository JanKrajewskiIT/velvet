import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import type { ColorLabelSelection } from './createColorLabelSelection';

export interface ColorLabelSelectionMetaProps {
  selection: ColorLabelSelection;
}

/** Selected-count line with a Clear button for multi-select dialogs. */
export const ColorLabelSelectionMeta = (props: ColorLabelSelectionMetaProps) => {
  const translate = useTranslate();
  const selectedCount = () => {
    const count = props.selection.selection().length;
    const max = props.selection.max();
    const limit = max != null && max > 1 ? max : undefined;
    const key = count
      ? limit === undefined
        ? 'velvet.patterns.colorLabelSelectionDialog.selected'
        : 'velvet.patterns.colorLabelSelectionDialog.selectedMax'
      : limit === undefined
        ? 'velvet.patterns.colorLabelSelectionDialog.none'
        : 'velvet.patterns.colorLabelSelectionDialog.noneMax';
    return translate(key, { count, max: limit });
  };

  return (
    <div class="vui-cls__meta">
      <span>{selectedCount()}</span>
      <Show when={props.selection.selection().length > 0 && !props.selection.single()}>
        <Button variant="link" size="xs" disabled={props.selection.busy()} onClick={props.selection.clear}>
          {translate('velvet.common.clear')}
        </Button>
      </Show>
    </div>
  );
};
