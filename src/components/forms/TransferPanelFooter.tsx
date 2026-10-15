import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { typographyClass } from '../primitives/typography';
import type { TransferSide } from './transferItem';
import styles from './TransferPanelFooter.module.css';

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
    <footer class={styles.xferPartFoot} data-side={props.side}>
      <button
        type="button"
        class={cx(styles.xferPartMove, typographyClass('label'))}
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
        <button
          type="button"
          class={cx(styles.xferPartLink, typographyClass('caption'))}
          onClick={() => props.onDeselect()}
        >
          {translate('velvet.forms.transferPanel.deselect')}
        </button>
      </Show>
    </footer>
  );
};
