import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Chevron } from '../primitives/Chevron';
import { Glyph } from '../primitives/Glyph';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './AccordionSection.module.css';
import type { AccordionItem, AccordionVariant } from './accordionTypes';

export interface AccordionSectionProps {
  item: AccordionItem;
  index: number;
  open: boolean;
  variant: AccordionVariant;
  animated: boolean;
  /** Unique prefix for the trigger / panel ids. */
  baseId: string;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
}

/** One header + collapsible panel of an Accordion. */
export const AccordionSection = (props: AccordionSectionProps) => {
  const triggerId = () => `${props.baseId}-b${props.index}`;
  const panelId = () => `${props.baseId}-p${props.index}`;
  return (
    <div
      data-vui-accordion-section
      data-variant={props.variant}
      data-animated={props.animated}
      data-tone={props.item.tone}
      class={cx(
        styles.accordionPartItem,
        props.open && styles.accordionPartItemVariantOpen,
        props.item.disabled && styles.accordionPartItemVariantDisabled,
        props.item.tone && styles.accordionPartItemVariantToned,
      )}
      style={props.animated ? { '--acc-i': props.index } : undefined}
    >
      <Heading level={3} variant="h5" class={styles.accordionPartH}>
        <button
          type="button"
          data-vui-accordion-trigger
          id={triggerId()}
          class={cx(styles.accordionPartTrigger, typographyClass('h5'))}
          aria-expanded={props.open}
          aria-controls={panelId()}
          disabled={props.item.disabled}
          onClick={() => props.onToggle()}
          onKeyDown={(event) => props.onKeyDown(event)}
        >
          <Show when={props.item.icon}>{(icon) => <Glyph name={icon()} />}</Show>
          <Text
            as="span"
            variant={props.variant === 'elevated' ? 'body' : 'h5'}
            tone="inherit"
            class={styles.accordionPartTitle}
          >
            {props.item.title}
            <Show when={props.item.subtitle}>
              {(text) => (
                <Text as="span" variant="body-sm" tone="inherit" class={styles.accordionPartSub}>
                  {text()}
                </Text>
              )}
            </Show>
          </Text>
          <Show when={props.item.meta}>
            {(meta) => (
              <Text as="span" variant="body-sm" tone="inherit" class={styles.accordionPartMeta}>
                {meta()}
              </Text>
            )}
          </Show>
          <Chevron open={props.open} class={styles.accordionPartChev} />
        </button>
      </Heading>
      <div
        id={panelId()}
        role="region"
        aria-labelledby={triggerId()}
        class={styles.accordionPartPanel}
        aria-hidden={!props.open || undefined}
      >
        <div class={styles.accordionPartInner}>
          <Show when={props.variant === 'elevated'}>
            <div class={styles.accordionPartSep} aria-hidden="true" />
          </Show>
          <Text as="div" variant="body-sm" tone="secondary" class={styles.accordionPartContent}>
            {props.item.content}
          </Text>
        </div>
      </div>
    </div>
  );
};
