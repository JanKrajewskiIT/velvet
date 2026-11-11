import { createSignal, createUniqueId, For, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { createFrameFocus } from '../../hooks/createFrameFocus';
import { useTranslate } from '../../i18n/useTranslate';
import { createTypeahead } from '../../utils/createTypeahead';
import { classSelector } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Chip } from '../forms/Chip';
import { Chevron } from '../primitives/Chevron';
import { Count } from '../primitives/Count';
import { Dot } from '../primitives/Dot';
import { Glyph } from '../primitives/Glyph';
import { Listbox } from '../primitives/Listbox';
import { ListboxPanel } from '../primitives/ListboxPanel';
import { Option } from '../primitives/Option';
import { Text } from '../primitives/Text';
import styles from './FilterChip.module.css';
import type { FilterDef } from './filterDefs';

export interface FilterChipProps {
  filter: FilterDef;
  selected: string[];
  onChange: (selected: string[]) => void;
}

const optionLabelText = (label: FilterDef['options'][number]['label']): string => {
  if (typeof label === 'string' || typeof label === 'number') return String(label);
  if (Array.isArray(label)) return label.map(optionLabelText).join('');
  return typeof Node !== 'undefined' && label instanceof Node ? (label.textContent ?? '') : '';
};

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
    focusFrame(props.filter.options.length ? '[role="option"][tabindex="0"]' : '[role="listbox"]');
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
  const summary = () => (picked().length === 1 ? optionLabelText(picked()[0]?.label) : '');
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
        options.map((option) => option.querySelector(classSelector(styles.optionPartLabel))?.textContent ?? ''),
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
      class={styles.menuWrap}
      onFocusOut={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <Chip
        size="sm"
        check={false}
        icon={props.filter.icon}
        class={cx(styles.fchip, picked().length > 0 && styles.fchipVariantOn)}
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
        <Text as="span" variant="label" tone="inherit">
          {props.filter.label}
          <Show when={summary()}>{(value) => <span class={styles.fchipPartValue}>: {value()}</span>}</Show>
        </Text>
        <Show when={picked().length > 1}>
          <Count value={picked().length} tone="soft" size="sm" showZero />
        </Show>
        <Chevron open={open()} class={styles.fchipPartChev} />
      </Chip>
      <Show when={open()}>
        <ListboxPanel
          ref={floating.ref}
          style={floating.style()}
          flip={false}
          up={floating.side() === 'top'}
          class={styles.fchipPartMenu}
        >
          <Listbox
            floating={false}
            id={listId}
            tabIndex={props.filter.options.length ? -1 : 0}
            multiselectable={multiple()}
            aria-label={props.filter.label}
          >
            <For each={props.filter.options}>
              {(option, index) => {
                const on = () => props.selected.includes(option.value);
                return (
                  <Option
                    as="li"
                    selected={on()}
                    showCheck={!multiple()}
                    tabIndex={index() === active() ? 0 : -1}
                    onClick={() => toggle(option.value)}
                    onKeyDown={(e) => onOptionKeyDown(e, option.value)}
                    onFocus={() => setActiveValue(option.value)}
                    leading={
                      <Show when={multiple()}>
                        <Text
                          as="span"
                          variant="caption"
                          tone="inherit"
                          class={cx(styles.fchipPartBox, on() && styles.fchipPartBoxVariantOn)}
                          aria-hidden="true"
                        >
                          <Show when={on()}>
                            <Glyph name="check" />
                          </Show>
                        </Text>
                      </Show>
                    }
                    icon={<Show when={option.dot}>{(tone) => <Dot tone={tone()} />}</Show>}
                    label={option.label}
                    shortcut={option.count == null ? undefined : String(option.count)}
                  />
                );
              }}
            </For>
          </Listbox>
          <Show when={picked().length > 0}>
            <div class={styles.fchipPartFoot}>
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
        </ListboxPanel>
      </Show>
    </span>
  );
};
