import { createUniqueId, For, mergeProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { classSelector, variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import styles from './Accordion.module.css';
import { AccordionSection } from './AccordionSection';
import type { AccordionItem, AccordionVariant } from './accordionTypes';

const ACCORDION_CLASSES = {
  separated: styles.accordionVariantSeparated,
  'gap-sm': styles.accordionVariantGapSm,
  'gap-md': styles.accordionVariantGapMd,
  'gap-lg': styles.accordionVariantGapLg,
  elevated: styles.accordionVariantElevated,
} as const;

const ACCORDION_VARIANT_CLASSES = {
  sm: styles.accordionVariantGapSm,
  md: styles.accordionVariantGapMd,
  lg: styles.accordionVariantGapLg,
} as const;

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

const TRIGGER_SELECTOR = ':scope > [data-vui-accordion-section] > * > [data-vui-accordion-trigger]';

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
    const root = event.currentTarget.closest(classSelector(styles.accordion));
    root?.querySelectorAll<HTMLButtonElement>(TRIGGER_SELECTOR)[target]?.focus();
  };

  return (
    <div
      class={cx(
        styles.accordion,
        variantClass(ACCORDION_CLASSES, merged.variant),
        merged.gap && variantClass(ACCORDION_VARIANT_CLASSES, merged.gap),
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
