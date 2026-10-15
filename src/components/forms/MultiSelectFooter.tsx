import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './MultiSelectFooter.module.css';

export interface MultiSelectFooterProps {
  summary: string;
  canClear: boolean;
  clearLabel?: string;
  onClear: () => void;
}

export const MultiSelectFooter = (props: MultiSelectFooterProps) => {
  const translate = useTranslate();
  return (
    <div class={cx(styles.multiPartFoot, typographyClass('caption'))}>
      <Text as="span" variant="caption" tone="inherit">
        {props.summary}
      </Text>
      <Show when={props.canClear}>
        <Button variant="link" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => props.onClear()}>
          {props.clearLabel ?? translate('velvet.common.clear')}
        </Button>
      </Show>
    </div>
  );
};
