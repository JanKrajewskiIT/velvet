import { createSignal, For, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Count } from '../primitives/Count';
import { Dot } from '../primitives/Dot';
import { Glyph } from '../primitives/Glyph';
import type { FilterDef } from './filterDefs';

export interface FilterChipProps {
  filter: FilterDef;
  selected: string[];
  onChange: (selected: string[]) => void;
}

/** Facet chip that opens a checklist; one pick reads "Label: Value", several show a count. */
export const FilterChip = (props: FilterChipProps) => {
  const translate = useTranslate();
  const [open, setOpen] = createSignal(false);
  let root: HTMLSpanElement | undefined;
  createDismiss(
    open,
    () => setOpen(false),
    () => root,
  );

  const multiple = () => props.filter.multiple !== false;
  const picked = () => props.filter.options.filter((option) => props.selected.includes(option.value));
  const summary = () => (picked().length === 1 ? picked()[0]?.label : null);
  const toggle = (value: string) => {
    if (multiple())
      props.onChange(
        props.selected.includes(value) ? props.selected.filter((x) => x !== value) : [...props.selected, value],
      );
    else props.onChange(props.selected[0] === value ? [] : [value]);
  };
  const onOptionKeyDown = (e: KeyboardEvent, value: string) => {
    const target = e.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(value);
      return;
    }
    const options = Array.from(target.parentElement?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const at = options.indexOf(target);
    const next = {
      ArrowDown: options[at + 1],
      ArrowUp: options[at - 1],
      Home: options[0],
      End: options[options.length - 1],
    }[e.key];
    if (!next) return;
    e.preventDefault();
    next.focus();
  };

  return (
    <span ref={root} class="vui-menu-wrap">
      <button
        type="button"
        class={cx('vui-fchip', picked().length > 0 && 'vui-fchip--on')}
        aria-haspopup="listbox"
        aria-expanded={open()}
        onClick={() => setOpen(!open())}
      >
        <Show when={props.filter.icon}>{(icon) => <Glyph name={icon()} />}</Show>
        <span>
          {props.filter.label}
          <Show when={summary()}>{(value) => <span class="vui-fchip__val">: {value()}</span>}</Show>
        </span>
        <Show when={picked().length > 1}>
          <Count value={picked().length} tone="soft" size="sm" showZero />
        </Show>
        <Glyph name="chevron-down" class="vui-fchip__chev" />
      </button>
      <Show when={open()}>
        <div class="vui-menu vui-menu--pop vui-fchip__menu">
          <div role="listbox" aria-multiselectable={multiple() || undefined} aria-label={props.filter.label}>
            <For each={props.filter.options}>
              {(option) => {
                const on = () => props.selected.includes(option.value);
                return (
                  <div
                    role="option"
                    aria-selected={on()}
                    tabIndex={0}
                    class="vui-option"
                    onClick={() => toggle(option.value)}
                    onKeyDown={(e) => onOptionKeyDown(e, option.value)}
                  >
                    <Show
                      when={multiple()}
                      fallback={
                        <span class="vui-option__check">
                          <Show when={on()}>
                            <Glyph name="check" />
                          </Show>
                        </span>
                      }
                    >
                      <span class={cx('vui-fchip__box', on() && 'vui-fchip__box--on')} aria-hidden="true">
                        <Show when={on()}>
                          <Glyph name="check" />
                        </Show>
                      </span>
                    </Show>
                    <Show when={option.dot}>{(tone) => <Dot tone={tone()} />}</Show>
                    <span class="vui-option__label">{option.label}</span>
                    <Show when={option.count != null}>
                      <span class="vui-option__kbd">{option.count}</span>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
          <Show when={picked().length > 0}>
            <div class="vui-fchip__foot">
              <Button variant="ghost" size="sm" onClick={() => props.onChange([])}>
                {translate('velvet.common.clear')}
              </Button>
            </div>
          </Show>
        </div>
      </Show>
    </span>
  );
};
