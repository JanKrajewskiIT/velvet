import { type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { assignRef } from '../../utils/assignRef';
import { cx } from '../../utils/cx';
import { CloseButton } from '../primitives/CloseButton';
import { Control } from '../primitives/Control';
import { Glyph } from '../primitives/Glyph';

export interface DateFieldProps {
  id: string;
  ref?: JSX.HTMLAttributes<HTMLButtonElement>['ref'];
  'aria-label'?: string;
  'aria-labelledby'?: string;
  describedBy?: string;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  text: string;
  placeholder: string;
  open: boolean;
  onToggle: () => void;
  /** Shows the clear button while there is text. */
  onClear?: () => void;
  /** @default localized "Clear date" */
  clearLabel?: string;
  /** @default 'calendar' */
  icon?: string;
  /** Tabular figures for date + time text. */
  tabular?: boolean;
}

/** The button-styled field that opens a picker popover: icon, value or placeholder, optional clear. */
export const DateField = (props: DateFieldProps) => {
  const p = mergeProps({ icon: 'calendar' } satisfies Partial<DateFieldProps>, props);
  const translate = useTranslate();
  return (
    <Control size={p.size} invalid={p.invalid} disabled={p.disabled}>
      <button
        ref={(element) => assignRef(p.ref, element)}
        id={p.id}
        type="button"
        class="vui-datefield"
        disabled={p.disabled}
        aria-haspopup="dialog"
        aria-expanded={p.open}
        aria-describedby={p.describedBy}
        aria-label={p['aria-label']}
        aria-labelledby={p['aria-labelledby']}
        onClick={() => p.onToggle()}
      >
        <Glyph name={p.icon} />
        <span
          class={cx('vui-datefield__text', !p.text && 'vui-datefield__text--empty')}
          style={p.tabular ? { 'font-variant-numeric': 'tabular-nums' } : undefined}
        >
          {p.text || p.placeholder}
        </span>
      </button>
      <Show when={p.text && p.onClear && !p.disabled}>
        <CloseButton
          variant="field"
          label={p.clearLabel ?? translate('velvet.forms.dateField.clearLabel')}
          onClick={() => p.onClear?.()}
        />
      </Show>
    </Control>
  );
};
