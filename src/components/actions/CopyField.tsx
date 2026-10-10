import { mergeProps, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Control } from '../primitives/Control';
import { FieldLabel } from '../primitives/FieldLabel';
import { CopyButton } from './CopyButton';

export interface CopyFieldProps {
  value: string;
  label?: string;
  /** @default true */
  mono?: boolean;
  class?: string;
}

/** Read-only value + copy button — API keys, invite links, IDs. Selects all on focus. */
export const CopyField = (props: CopyFieldProps) => {
  const p = mergeProps({ mono: true } satisfies Partial<CopyFieldProps>, props);
  return (
    <div class={cx('vui-field', p.class)}>
      <Show when={p.label}>
        <FieldLabel>{p.label}</FieldLabel>
      </Show>
      <Control readOnly class="vui-copyfield">
        <input
          class={cx('vui-control__input', p.mono && 'vui-copyfield__mono')}
          value={p.value}
          readOnly
          aria-label={p.label}
          onFocus={(e) => e.currentTarget.select()}
        />
        <CopyButton value={p.value} iconOnly variant="ghost" />
      </Control>
    </div>
  );
};
