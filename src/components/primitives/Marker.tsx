import { mergeProps, Show, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { Tone } from '../../utils/tone';

export interface MarkerProps extends HtmlProps<HTMLSpanElement> {
  /** sm 24 · md 28 · lg 32. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** soft = tinted (events) · outline = todo / upcoming · solid = done / current / error. @default 'soft' */
  appearance?: 'soft' | 'outline' | 'solid';
  /** Colour. Omit for neutral. */
  tone?: Tone;
  /** Current-step halo. */
  ring?: boolean;
  /** Surface-coloured separation ring — use when the marker sits over a rail line. */
  gap?: boolean;
  /** Render a centred dot instead of children. */
  dot?: boolean;
}

/** Round step / event badge — a number, icon, avatar or dot in a circle. */
export const Marker = (props: MarkerProps) => {
  const merged = mergeProps({ size: 'md', appearance: 'soft' } satisfies MarkerProps, props);
  const [local, rest] = splitProps(merged, ['size', 'appearance', 'tone', 'ring', 'gap', 'dot', 'class', 'children']);
  return (
    <span
      class={cx(
        'vui-marker',
        modifier('vui-marker', local.size, 'md'),
        `vui-marker--${local.appearance}`,
        local.ring && 'vui-marker--ring',
        local.gap && 'vui-marker--gap',
        local.class,
      )}
      data-tone={local.tone}
      {...rest}
    >
      <Show when={local.dot} fallback={local.children}>
        <span class="vui-marker__dot" />
      </Show>
    </span>
  );
};
