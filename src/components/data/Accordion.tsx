import { createUniqueId, For, mergeProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx } from '../../utils/cx';
import { AccordionSection } from './AccordionSection';
import type { AccordionItem, AccordionVariant } from './accordionTypes';

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several open. @default false */
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (open: string[]) => void;
  /** separated = cards with gaps · flush = dividers only · elevated = larger cards, hover lift, brand glow + border when open, gradient separator (legacy VelvetUi look). @default 'separated' */
  variant?: AccordionVariant;
  /** Gap between items (separated / elevated). */
  gap?: 'sm' | 'md' | 'lg';
  /** Staggered fade-up entrance (40ms per item). @default true for elevated */
  animated?: boolean;
  class?: string;
}

const TRIGGER_SELECTOR = ':scope > .vui-accordion__item > .vui-accordion__h > .vui-accordion__trigger';

const itemKey = (item: AccordionItem, index: number) => item.value ?? String(index);

/** Collapsible sections (FAQ, settings groups). Animated height, ↑↓ Home End between headers; closed panels are hidden from focus and screen readers. */
export const Accordion = (props: AccordionProps) => {
  const merged = mergeProps({ multiple: false, variant: 'separated' } satisfies Partial<AccordionProps>, props);
  const baseId = createUniqueId();
  const [open, setOpen] = createControllable<string[]>({
    value: () => props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: (next) => props.onValueChange?.(next),
  });
  const animated = () => merged.animated ?? merged.variant === 'elevated';

  const toggle = (key: string) => {
    const current = open();
    if (current.includes(key)) setOpen(current.filter((openKey) => openKey !== key));
    else setOpen(merged.multiple ? [...current, key] : [key]);
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = props.items.length - 1;
    const target =
      event.key === 'ArrowDown'
        ? (index + 1) % (last + 1)
        : event.key === 'ArrowUp'
          ? (index + last) % (last + 1)
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : undefined;
    if (target === undefined || !(event.currentTarget instanceof HTMLElement)) return;
    event.preventDefault();
    const root = event.currentTarget.closest('.vui-accordion');
    root?.querySelectorAll<HTMLButtonElement>(TRIGGER_SELECTOR)[target]?.focus();
  };

  return (
    <div
      class={cx(
        'vui-accordion',
        `vui-accordion--${merged.variant}`,
        merged.gap && `vui-accordion--gap-${merged.gap}`,
        animated() && 'vui-accordion--animated',
        merged.class,
      )}
    >
      <For each={merged.items}>
        {(item, index) => (
          <AccordionSection
            item={item}
            index={index()}
            open={open().includes(itemKey(item, index()))}
            variant={merged.variant}
            animated={animated()}
            baseId={baseId}
            onToggle={() => toggle(itemKey(item, index()))}
            onKeyDown={(event) => onKeyDown(event, index())}
          />
        )}
      </For>
    </div>
  );
};
