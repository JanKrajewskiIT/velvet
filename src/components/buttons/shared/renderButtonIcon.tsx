import type { IconTypes } from 'solid-icons';
import type { JSX } from 'solid-js';

import Icon, { type IconVariant } from '~/components/media/Icon/Icon';
import type { ComponentSize } from '~/models/Props';

type ButtonIcon = IconTypes | JSX.Element;

export const renderButtonIcon = (icon: ButtonIcon, size: ComponentSize, variant?: IconVariant) => {
  return typeof icon === 'function' ? <Icon icon={icon} size={size} variant={variant} /> : icon;
};

export type { ButtonIcon };
