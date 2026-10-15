import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Checkmark } from '../primitives/Checkmark';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import type { TransferView } from './createTransferView';
import styles from './TransferPanelHeader.module.css';

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
    <header class={styles.xferPartHead}>
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
      <Heading level={3} variant="title" id={props.titleId} class={styles.xferPartTitle}>
        {props.title}
      </Heading>
      <Text as="span" variant="kbd" tone="inherit" class={styles.xferPartCount}>
        <Show when={props.view.checked().length}>
          <Text as="b" variant="label-sm" tone="inherit">
            {props.view.checked().length}
          </Text>{' '}
          /{' '}
        </Show>
        {props.total}
      </Text>
    </header>
  );
};
