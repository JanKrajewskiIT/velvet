import { type Accessor, createEffect, createSignal, on } from 'solid-js';

import { clamp } from '../../utils/math';

const POPOVER_WIDTH_PX = 248;
const POPOVER_GAP_PX = 6;
const CARET_LEFT_OFFSET_PX = 8;
const DEFAULT_LINE_HEIGHT_PX = 20;
const MIRRORED_STYLES = [
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'tab-size',
] as const;

export interface MentionLayoutElements {
  textarea: () => HTMLTextAreaElement | undefined;
  highlight: () => HTMLDivElement | undefined;
  measure: () => HTMLDivElement | undefined;
  caret: () => HTMLSpanElement | undefined;
}

export interface MentionLayoutInputs {
  value: Accessor<string>;
  rows: Accessor<number>;
  maxRows: Accessor<number>;
  queryStart: Accessor<number | undefined>;
}

/** Auto-grows the textarea, mirrors its text metrics onto the overlay layers and positions the popover under the caret. */
export const createMentionLayout = (elements: MentionLayoutElements, inputs: MentionLayoutInputs) => {
  const [popoverPosition, setPopoverPosition] = createSignal({ left: 0, top: 0 });

  createEffect(
    on([inputs.value, inputs.rows, inputs.maxRows], () => {
      const textarea = elements.textarea();
      if (!textarea) return;
      const highlight = elements.highlight();
      const computed = getComputedStyle(textarea);
      for (const layer of [highlight, elements.measure()]) {
        for (const name of MIRRORED_STYLES) layer?.style.setProperty(name, computed.getPropertyValue(name));
      }
      const lineHeight = Number.parseFloat(computed.lineHeight) || DEFAULT_LINE_HEIGHT_PX;
      const padding = Number.parseFloat(computed.paddingTop) + Number.parseFloat(computed.paddingBottom);
      const maxHeight = inputs.maxRows() * lineHeight + padding;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, inputs.rows() * lineHeight + padding), maxHeight)}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
      if (highlight) highlight.scrollTop = textarea.scrollTop;
    }),
  );

  createEffect(
    on([inputs.queryStart, inputs.value], ([start]) => {
      const textarea = elements.textarea();
      const caret = elements.caret();
      if (start === undefined || !caret || !textarea) return;
      setPopoverPosition({
        left: clamp(caret.offsetLeft - CARET_LEFT_OFFSET_PX, 0, textarea.clientWidth - POPOVER_WIDTH_PX),
        top: caret.offsetTop + caret.offsetHeight - textarea.scrollTop + POPOVER_GAP_PX,
      });
    }),
  );

  return { popoverPosition };
};
