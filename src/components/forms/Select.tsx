import { createEffect, createMemo, createSignal, createUniqueId, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { useTranslate } from '../../i18n/useTranslate';
import { cx, modifier } from '../../utils/cx';
import { Chevron } from '../primitives/Chevron';
import { Field } from '../primitives/Field';
import { Glyph, renderIcon } from '../primitives/Glyph';
import { ComboboxOption } from './ComboboxOption';
import { ComboboxOptionText } from './ComboboxOptionText';
import { normalizeOption, type SelectOption } from './selectOption';

const TYPEAHEAD_RESET_MS = 600;
const OPENING_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
const NO_OPTIONS: ReadonlyArray<string | SelectOption> = [];

export interface SelectChangeEvent {
  target: { value: string; name?: string };
}

export interface SelectProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  /** Options as strings or `{ value, label, icon, description, disabled }`. */
  options?: ReadonlyArray<string | SelectOption>;
  /** Shown when nothing is selected. @default localized "Select…" */
  placeholder?: string;
  /** Glyph name or node. */
  iconLeft?: JSX.Element;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  /** Adds a hidden input for form submission. */
  name?: string;
  /** Controlled value. */
  value?: string;
  defaultValue?: string;
  /** Called with the new value. */
  onValueChange?: (value: string) => void;
  /** Native-like: receives `{ target: { value, name } }`. */
  onChange?: (event: SelectChangeEvent) => void;
  /** Styles the trigger. */
  class?: string;
  /** Accessible name when there is no visible label (inline use in query rows, table cells, toolbars). */
  'aria-label'?: string;
}

/** Custom listbox select (WAI-ARIA select-only combobox). ↑ ↓ Home End Enter Space Esc and type-ahead; the list flips upward near the viewport bottom and is not clipped by scrolling ancestors. */
export const Select = (props: SelectProps) => {
  const p = mergeProps({ options: NO_OPTIONS, size: 'md', defaultValue: '' } satisfies SelectProps, props);
  const translate = useTranslate();
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const listId = () => `${id()}-list`;
  const optionId = (index: number) => `${listId()}-${index}`;

  const options = createMemo(() => p.options.map(normalizeOption));
  const [current, setCurrent] = createControllable({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (value) => {
      p.onValueChange?.(value);
      p.onChange?.({ target: { value, name: p.name } });
    },
  });
  const selected = () => options().find((option) => option.value === current());

  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(-1);
  const [root, setRoot] = createSignal<HTMLElement>();
  let trigger!: HTMLButtonElement;
  let typed = '';
  let typedAt = 0;

  createDismiss(open, () => setOpen(false), root);
  const floating = createFloating(open, root, { matchWidth: true });

  const openList = () => {
    if (p.disabled) return;
    setActive(
      Math.max(
        0,
        options().findIndex((option) => option.value === current()),
      ),
    );
    setOpen(true);
  };
  const pick = (option: SelectOption | undefined) => {
    if (!option || option.disabled) return;
    setCurrent(option.value);
    setOpen(false);
    trigger.focus();
  };
  const move = (direction: 1 | -1) => {
    const list = options();
    let index = active();
    for (let tried = 0; tried < list.length; tried++) {
      index = (index + direction + list.length) % list.length;
      if (!list[index]?.disabled) break;
    }
    setActive(index);
  };
  const jumpTo = (edge: 'first' | 'last') => {
    const enabled = options().flatMap((option, index) => (option.disabled ? [] : [index]));
    setActive((edge === 'first' ? enabled[0] : enabled.at(-1)) ?? active());
  };
  const typeahead = (key: string) => {
    const now = Date.now();
    typed = (now - typedAt > TYPEAHEAD_RESET_MS ? '' : typed) + key.toLowerCase();
    typedAt = now;
    const match = options().findIndex((option) => !option.disabled && option.label.toLowerCase().startsWith(typed));
    if (match >= 0) setActive(match);
  };

  const onKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (e) => {
    if (!open()) {
      if (OPENING_KEYS.includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        move(e.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        pick(options()[active()]);
        break;
      case 'Home':
      case 'End':
        e.preventDefault();
        jumpTo(e.key === 'Home' ? 'first' : 'last');
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) typeahead(e.key);
    }
  };

  createEffect(() => {
    if (!open() || active() < 0) return;
    const row = document.getElementById(optionId(active()));
    const list = row?.parentElement;
    if (
      row &&
      list &&
      (row.offsetTop < list.scrollTop || row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight)
    ) {
      list.scrollTop = row.offsetTop - list.clientHeight / 2 + row.offsetHeight / 2;
    }
  });

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} id={id()}>
      {(control) => (
        <div ref={setRoot} class="vui-select">
          <button
            ref={trigger}
            type="button"
            id={control.id}
            disabled={p.disabled}
            role="combobox"
            aria-label={p['aria-label']}
            aria-haspopup="listbox"
            aria-expanded={open()}
            aria-controls={listId()}
            aria-activedescendant={open() && active() >= 0 ? optionId(active()) : undefined}
            aria-describedby={control.describedBy}
            aria-invalid={control.invalid || undefined}
            class={cx(
              'vui-control',
              'vui-select__trigger',
              modifier('vui-control', p.size, 'md'),
              control.invalid && 'vui-control--invalid',
              p.disabled && 'vui-control--disabled',
              open() && 'vui-select__trigger--open',
              p.class,
            )}
            onClick={() => (open() ? setOpen(false) : openList())}
            onKeyDown={onKeyDown}
          >
            <Show when={p.iconLeft}>
              <span class="vui-control__adorn">{renderIcon(p.iconLeft)}</span>
            </Show>
            <span class={cx('vui-select__value', !selected() && 'vui-select__value--placeholder')}>
              {selected()?.label ?? p.placeholder ?? translate('velvet.forms.select.placeholder')}
            </span>
            <Chevron class="vui-select__chevron" />
          </button>
          <Show when={p.name}>
            <input type="hidden" name={p.name} value={current()} />
          </Show>
          <Show when={open()}>
            <ul
              ref={floating.ref}
              id={listId()}
              role="listbox"
              aria-labelledby={p.label ? undefined : control.id}
              class={cx('vui-select__menu', floating.side() === 'top' && 'vui-select__menu--up')}
              style={floating.style()}
            >
              <For each={options()}>
                {(option, index) => (
                  <ComboboxOption
                    id={optionId(index())}
                    selected={option.value === current()}
                    active={index() === active()}
                    disabled={option.disabled}
                    onHover={() => !option.disabled && setActive(index())}
                    onPick={() => pick(option)}
                  >
                    {renderIcon(option.icon)}
                    <ComboboxOptionText label={option.label} description={option.description} />
                    <Show when={option.value === current()}>
                      <Glyph name="check" class="vui-select__check" />
                    </Show>
                  </ComboboxOption>
                )}
              </For>
            </ul>
          </Show>
        </div>
      )}
    </Field>
  );
};
