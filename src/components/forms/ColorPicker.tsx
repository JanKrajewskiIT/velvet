import { createSignal, For, type JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { FieldLabel } from '../primitives/FieldLabel';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { callbackAlias } from './callbackAlias';
import { ColorPanel } from './ColorPanel';
import styles from './ColorPicker.module.css';

export interface ColorPickerProps {
  label?: JSX.Element;
  /** Hex, e.g. "#8b0036". */
  value?: string;
  /** @default '#8b0036' */
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  /** Alias of `onValueChange`. */
  onChange?: (hex: string) => void;
  /** Preset hexes. Defaults to brand + data-viz hues. [] hides. */
  swatches?: string[];
  /** Render the panel directly instead of a popover. */
  inline?: boolean;
  /** full = area + hue + hex + presets · swatches = curated swatch grid only (selected ring + check) with a "Selected" value chip. @default 'full' */
  variant?: 'full' | 'swatches';
  /** swatches variant: show the Selected value chip. @default true */
  showValue?: boolean;
  disabled?: boolean;
  class?: string;
}

const DEFAULT_SWATCHES = ['#8b0036', '#c92d62', '#d98200', '#1f9254', '#1b8a9c', '#2f6fdc', '#7a52cc', '#3a3437'];

/** Colour field → popover with saturation/brightness area, hue strip, hex input and preset swatches. `inline` renders the panel directly. */
export const ColorPicker = (props: ColorPickerProps) => {
  const p = mergeProps(
    {
      defaultValue: '#8b0036',
      swatches: DEFAULT_SWATCHES,
      variant: 'full',
      showValue: true,
    } satisfies Partial<ColorPickerProps>,
    props,
  );
  const translate = useTranslate();
  const labelText = () => (typeof p.label === 'string' ? p.label : translate('velvet.forms.colorPicker.label'));
  const [current, setCurrent] = createControllable<string>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const [open, setOpen] = createSignal(false);
  const [wrap, setWrap] = createSignal<HTMLElement>();
  createDismiss(open, () => setOpen(false), wrap, { refocus: 'button' });
  const floating = createFloating(open, wrap);
  const isSelected = (swatch: string) => swatch.toLowerCase() === current().toLowerCase();

  return (
    <Switch>
      <Match when={p.variant === 'swatches'}>
        <div class={cx(styles.cswatch, p.disabled && styles.cswatchVariantDisabled, p.class)}>
          <Show when={p.label}>
            <FieldLabel>{p.label}</FieldLabel>
          </Show>
          <div class={styles.cswatchPartRow}>
            <div class={styles.cswatchPartGrid} role="radiogroup" aria-label={labelText()}>
              <For each={p.swatches}>
                {(swatch) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected(swatch)}
                    aria-label={swatch}
                    disabled={p.disabled}
                    class={cx(styles.swatch, styles.swatchVariantLg)}
                    style={{ '--swatch': swatch }}
                    onClick={() => setCurrent(swatch.toLowerCase())}
                  >
                    <Show when={isSelected(swatch)}>
                      <Glyph name="check" />
                    </Show>
                  </button>
                )}
              </For>
            </div>
            <Show when={p.showValue}>
              <div class={styles.cswatchPartVal}>
                <span class={styles.swatch} style={{ '--swatch': current() }} />
                <div>
                  <Text as="div" variant="section" tone="inherit" class={styles.cswatchPartK}>
                    {translate('velvet.forms.colorPicker.selected')}
                  </Text>
                  <Text as="div" variant="code" tone="inherit" class={styles.cswatchPartHex}>
                    {current().toUpperCase()}
                  </Text>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Match>
      <Match when={p.inline}>
        <div class={p.class}>
          <Show when={p.label}>
            <FieldLabel as="div" style={{ 'margin-bottom': '8px' }}>
              {p.label}
            </FieldLabel>
          </Show>
          <ColorPanel hex={current()} onChange={setCurrent} swatches={p.swatches} />
        </div>
      </Match>
      <Match when={true}>
        <div class={cx(styles.field, p.class)}>
          <Show when={p.label}>
            <FieldLabel>{p.label}</FieldLabel>
          </Show>
          <span ref={setWrap} class={styles.popoverWrap}>
            <button
              type="button"
              class={cx(styles.control, styles.colorPartTrigger)}
              disabled={p.disabled}
              aria-haspopup="dialog"
              aria-expanded={open()}
              aria-label={translate('velvet.forms.colorPicker.triggerLabel', { name: labelText(), value: current() })}
              onClick={() => setOpen(!open())}
            >
              <span class={styles.swatch} style={{ '--swatch': current() }} />
              <Text as="span" variant="code" tone="inherit" class={styles.colorPartValue}>
                {current().toUpperCase()}
              </Text>
              <Glyph name="chevron-down" />
            </button>
            <Show when={open()}>
              <div
                ref={floating.ref}
                style={floating.style()}
                class={cx(styles.popover, styles.colorPartPop, typographyClass('body'))}
                role="dialog"
                aria-label={translate('velvet.forms.colorPicker.dialogLabel')}
              >
                <ColorPanel hex={current()} onChange={setCurrent} swatches={p.swatches} />
              </div>
            </Show>
          </span>
        </div>
      </Match>
    </Switch>
  );
};
