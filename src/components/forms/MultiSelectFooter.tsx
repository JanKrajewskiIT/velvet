import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';

export interface MultiSelectFooterProps {
  summary: string;
  canClear: boolean;
  clearLabel?: string;
  onClear: () => void;
}

export const MultiSelectFooter = (props: MultiSelectFooterProps) => {
  const translate = useTranslate();
  return (
    <div class="vui-multi__foot">
      <span>{props.summary}</span>
      <Show when={props.canClear}>
        <Button variant="link" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => props.onClear()}>
          {props.clearLabel ?? translate('velvet.common.clear')}
        </Button>
      </Show>
    </div>
  );
};
