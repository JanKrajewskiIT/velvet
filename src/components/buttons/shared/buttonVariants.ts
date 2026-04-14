import type { TypographyTone } from '~/components/typography/Typography/Typography';

export type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'dashed' | 'outline' | 'subtle' | 'navbar';

export const DEFAULT_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_ICON_BUTTON_VARIANT: ButtonVariant = 'subtle';
export const DEFAULT_ROUND_ICON_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_DROPDOWN_BUTTON_VARIANT: ButtonVariant = 'ghost';

const INVERSE_CONTENT_VARIANTS: readonly ButtonVariant[] = ['primary', 'danger', 'navbar'];

export const resolveButtonContentTone = (variant?: ButtonVariant): TypographyTone => {
  const resolvedVariant = variant ?? DEFAULT_BUTTON_VARIANT;
  return INVERSE_CONTENT_VARIANTS.includes(resolvedVariant) ? 'inverse' : 'inherit';
};

export const resolveDropdownTriggerTone = (variant?: ButtonVariant): 'default' | 'inverse' => {
  if (!variant) return 'default';
  return resolveButtonContentTone(variant) === 'inverse' ? 'inverse' : 'default';
};
