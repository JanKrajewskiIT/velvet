import { type JSX } from '@solidjs/web';

export interface ChipOption {
  value: string;
  label: JSX.Element;
  count?: number;
  /** Velvet icon name. */
  icon?: string;
  disabled?: boolean;
}

export const normalizeChipOption = (option: string | ChipOption): ChipOption =>
  typeof option === 'string' ? { value: option, label: option } : option;
