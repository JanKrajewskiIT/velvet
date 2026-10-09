import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Glyph } from '../primitives/Glyph';
import type { TransferSide } from './transferItem';

export interface TransferPanelFooterProps {
  side: TransferSide;
  moveLabel: string;
  checkedCount: number;
  /** Move is blocked: the right list reached its maximum size. */
  limitHit: boolean;
  onMove: () => void;
  onDeselect: () => void;
}

/** Move button and deselect link of a panel. */
export const TransferPanelFooter = (props: TransferPanelFooterProps) => {
  const translate = useTranslate();

  return (
    <footer class="vui-xfer__foot">
      <button
        type="button"
        class="vui-xfer__move"
        disabled={props.checkedCount === 0 || (props.side === 'left' && props.limitHit)}
        onClick={() => props.onMove()}
      >
        <Show when={props.side === 'right'}>
          <Glyph name="arrow-left" />
        </Show>
        {props.moveLabel}
        {props.checkedCount ? ` ${props.checkedCount}` : ''}
        <Show when={props.side === 'left'}>
          <Glyph name="arrow-right" />
        </Show>
      </button>
      <Show when={props.checkedCount > 0}>
        <button type="button" class="vui-xfer__link" onClick={() => props.onDeselect()}>
          {translate('velvet.forms.transferPanel.deselect')}
        </button>
      </Show>
    </footer>
  );
};
