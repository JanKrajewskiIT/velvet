import { mergeProps, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { IconButton, type IconButtonProps } from '../actions/IconButton';

const DEFAULT_DIRECTION = 'prev';
const DEFAULT_SIZE = 'sm';

export interface PeriodNavButtonProps extends Omit<IconButtonProps, 'dir' | 'icon' | 'label'> {
  /** @default 'prev' */
  dir?: 'prev' | 'next';
  /** Defaults to the localized previous / next label. */
  label?: string;
}

/** Previous or next period arrow. */
export const PeriodNavButton = (props: PeriodNavButtonProps) => {
  const merged = mergeProps({ dir: DEFAULT_DIRECTION, size: DEFAULT_SIZE } satisfies PeriodNavButtonProps, props);
  const [local, rest] = splitProps(merged, ['dir', 'label']);
  const translate = useTranslate();
  return (
    <IconButton
      {...rest}
      icon={local.dir === 'prev' ? 'chevron-left' : 'chevron-right'}
      label={local.label ?? translate(local.dir === 'prev' ? 'velvet.common.previous' : 'velvet.common.next')}
    />
  );
};
