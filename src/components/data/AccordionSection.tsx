import { Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Chevron } from '../primitives/Chevron';
import { Glyph } from '../primitives/Glyph';
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
      data-tone={props.item.tone}
      class={cx(
        'vui-accordion__item',
        props.open && 'vui-accordion__item--open',
        props.item.disabled && 'vui-accordion__item--disabled',
        props.item.tone && 'vui-accordion__item--toned',
      )}
      style={props.animated ? { '--acc-i': props.index } : undefined}
    >
      <h3 class="vui-accordion__h">
        <button
          type="button"
          id={triggerId()}
          class="vui-accordion__trigger"
          aria-expanded={props.open}
          aria-controls={panelId()}
          disabled={props.item.disabled}
          onClick={() => props.onToggle()}
          onKeyDown={(event) => props.onKeyDown(event)}
        >
          <Show when={props.item.icon}>{(icon) => <Glyph name={icon()} />}</Show>
          <span class="vui-accordion__title">
            {props.item.title}
            <Show when={props.item.subtitle}>{(text) => <span class="vui-accordion__sub">{text()}</span>}</Show>
          </span>
          <Show when={props.item.meta}>{(meta) => <span class="vui-accordion__meta">{meta()}</span>}</Show>
          <Chevron open={props.open} class="vui-accordion__chev" />
        </button>
      </h3>
      <div
        id={panelId()}
        role="region"
        aria-labelledby={triggerId()}
        class="vui-accordion__panel"
        aria-hidden={!props.open || undefined}
      >
        <div class="vui-accordion__inner">
          <Show when={props.variant === 'elevated'}>
            <div class="vui-accordion__sep" aria-hidden="true" />
          </Show>
          <div class="vui-accordion__content">{props.item.content}</div>
        </div>
      </div>
    </div>
  );
};
