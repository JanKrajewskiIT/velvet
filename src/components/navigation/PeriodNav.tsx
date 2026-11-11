import { mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Button } from '../actions/Button';
import { ButtonGroup } from '../actions/ButtonGroup';
import type { IconButtonProps } from '../actions/IconButton';
import styles from './PeriodNav.module.css';
import { PeriodNavButton } from './PeriodNavButton';

const DEFAULT_VARIANT = 'secondary';
const DEFAULT_SIZE = 'sm';

export interface PeriodNavProps extends HtmlProps<HTMLDivElement, 'onChange'> {
  onPrev?: () => void;
  onNext?: () => void;
  /** Shows the Today button when set. */
  onToday?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  todayLabel?: string;
  /** @default 'secondary' */
  variant?: IconButtonProps['variant'];
  /** Join the previous and next buttons. @default true */
  attached?: boolean;
  /** @default 'sm' */
  size?: 'sm' | 'md';
}

/** Today and previous / next controls for a month, week or day. */
export const PeriodNav = (props: PeriodNavProps) => {
  const merged = mergeProps(
    { variant: DEFAULT_VARIANT, size: DEFAULT_SIZE, attached: true } satisfies PeriodNavProps,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'onPrev',
    'onNext',
    'onToday',
    'prevLabel',
    'nextLabel',
    'todayLabel',
    'variant',
    'attached',
    'size',
    'class',
  ]);
  const translate = useTranslate();
  return (
    <div {...rest} class={cx(styles.periodNav, local.class)}>
      <Show when={local.onToday}>
        <Button variant="secondary" size={local.size} onClick={() => local.onToday?.()}>
          {local.todayLabel ?? translate('velvet.common.today')}
        </Button>
      </Show>
      <ButtonGroup
        attached={local.attached}
        size={local.size}
        label={translate('velvet.navigation.periodNav.navigate')}
        class={cx(!local.attached && styles.pair)}
      >
        <PeriodNavButton
          dir="prev"
          label={local.prevLabel}
          variant={local.variant}
          size={local.size}
          onClick={() => local.onPrev?.()}
        />
        <PeriodNavButton
          dir="next"
          label={local.nextLabel}
          variant={local.variant}
          size={local.size}
          onClick={() => local.onNext?.()}
        />
      </ButtonGroup>
    </div>
  );
};
