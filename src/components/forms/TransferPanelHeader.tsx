import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Checkmark } from '../primitives/Checkmark';
import type { TransferView } from './createTransferView';

export interface TransferPanelHeaderProps {
  titleId: string;
  title: string;
  total: number;
  view: TransferView;
  onToggleAll: () => void;
}

/** Select-all checkbox, panel title and checked/total counter. */
export const TransferPanelHeader = (props: TransferPanelHeaderProps) => {
  const translate = useTranslate();

  return (
    <header class="vui-xfer__head">
      <Checkmark
        role="checkbox"
        tabIndex={0}
        aria-checked={props.view.allChecked() ? true : props.view.someChecked() ? 'mixed' : false}
        aria-label={translate('velvet.forms.transferPanel.selectAll', { title: props.title })}
        checked={props.view.allChecked()}
        indeterminate={props.view.someChecked()}
        disabled={props.view.enabled().length === 0}
        onClick={() => props.view.enabled().length && props.onToggleAll()}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && props.view.enabled().length) {
            e.preventDefault();
            props.onToggleAll();
          }
        }}
      />
      <h3 id={props.titleId} class="vui-xfer__title">
        {props.title}
      </h3>
      <span class="vui-xfer__count">
        <Show when={props.view.checked().length}>
          <b>{props.view.checked().length}</b> /{' '}
        </Show>
        {props.total}
      </span>
    </header>
  );
};
