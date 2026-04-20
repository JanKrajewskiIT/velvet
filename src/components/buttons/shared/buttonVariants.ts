export type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'dashed' | 'outline' | 'subtle' | 'navbar';

export const DEFAULT_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_ICON_BUTTON_VARIANT: ButtonVariant = 'subtle';
export const DEFAULT_ROUND_ICON_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_DROPDOWN_BUTTON_VARIANT: ButtonVariant = 'ghost';

const INVERSE_DROPDOWN_TRIGGER_VARIANTS: readonly ButtonVariant[] = ['primary', 'danger', 'navbar'];

export const resolveDropdownTriggerTone = (variant?: ButtonVariant): 'default' | 'inverse' => {
  if (!variant) return 'default';
  return INVERSE_DROPDOWN_TRIGGER_VARIANTS.includes(variant) ? 'inverse' : 'default';
};
