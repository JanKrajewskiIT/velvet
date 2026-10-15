import { mergeProps, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { FieldLabel } from '../primitives/FieldLabel';
import { CopyButton } from './CopyButton';
import styles from './CopyField.module.css';

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
    <div class={cx(styles.field, p.class)}>
      <Show when={p.label}>
        <FieldLabel>{p.label}</FieldLabel>
      </Show>
      <Control readOnly class={styles.copyfield}>
        <ControlInput
          textVariant={p.mono ? 'code' : 'body'}
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
