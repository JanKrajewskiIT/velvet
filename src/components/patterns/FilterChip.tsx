import { createSignal, createUniqueId, For, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createFrameFocus } from '../../hooks/createFrameFocus';
import { useTranslate } from '../../i18n/useTranslate';
import { createTypeahead } from '../../utils/createTypeahead';
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
  const [root, setRoot] = createSignal<HTMLSpanElement>();
  const [activeValue, setActiveValue] = createSignal<string>();
  const listId = createUniqueId();
  const search = createTypeahead();
  const focusFrame = createFrameFocus(root);
  const active = () =>
    Math.max(
      0,
      props.filter.options.findIndex((option) => option.value === activeValue()),
    );
  const focusOption = (index: number) => {
    setActiveValue(props.filter.options[index]?.value);
    focusFrame('[role="option"][tabindex="0"]');
  };
  const openList = (last = false) => {
    setOpen(true);
    const selected = props.filter.options.findIndex((option) => props.selected.includes(option.value));
    focusOption(last ? props.filter.options.length - 1 : Math.max(0, selected));
  };
  createDismiss(open, () => setOpen(false), root);

  const floating = createFloating(open, root);
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
    const steps: Partial<Record<string, number>> = {
      ArrowDown: Math.min(options.length - 1, at + 1),
      ArrowUp: Math.max(0, at - 1),
      Home: 0,
      End: options.length - 1,
    };
    let next = steps[e.key];
    if (next === undefined && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const found = search(
        e.key,
        options.map((option) => option.querySelector('.vui-option__label')?.textContent ?? ''),
        at,
      );
      if (found >= 0) next = found;
    }
    if (next === undefined || next < 0) return;
    e.preventDefault();
    focusOption(next);
  };

  return (
    <span
      ref={setRoot}
      class="vui-menu-wrap"
      onFocusOut={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        type="button"
        class={cx('vui-fchip', picked().length > 0 && 'vui-fchip--on')}
        aria-haspopup="listbox"
        aria-expanded={open()}
        aria-controls={listId}
        onClick={() => (open() ? setOpen(false) : openList())}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          openList(event.key === 'ArrowUp');
        }}
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
        <div ref={floating.ref} style={floating.style()} class="vui-menu vui-menu--pop vui-fchip__menu">
          <div
            id={listId}
            role="listbox"
            tabIndex={props.filter.options.length ? -1 : 0}
            aria-multiselectable={multiple() || undefined}
            aria-label={props.filter.label}
          >
            <For each={props.filter.options}>
              {(option, index) => {
                const on = () => props.selected.includes(option.value);
                return (
                  <div
                    role="option"
                    aria-selected={on()}
                    tabIndex={index() === active() ? 0 : -1}
                    class="vui-option"
                    onClick={() => toggle(option.value)}
                    onKeyDown={(e) => onOptionKeyDown(e, option.value)}
                    onFocus={() => setActiveValue(option.value)}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  props.onChange([]);
                  focusOption(active());
                }}
              >
                {translate('velvet.common.clear')}
              </Button>
            </div>
          </Show>
        </div>
      </Show>
    </span>
  );
};
