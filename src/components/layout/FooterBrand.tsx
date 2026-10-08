import { type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';

export interface FooterBrandProps {
  brand?: JSX.Element;
  /** `undefined` falls back to the brand's first letter; `null` hides the mark. */
  mark?: JSX.Element | null;
  compact?: boolean;
}

const firstLetter = (brand: JSX.Element): string | null =>
  typeof brand === 'string' ? (brand.trim()[0] ?? null) : null;

export const FooterBrand = (props: FooterBrandProps) => {
  const mark = () => (props.mark === undefined ? firstLetter(props.brand) : props.mark);
  return (
    <Show when={props.brand || mark() != null}>
      <span class={cx('vui-footer__brand', props.compact && 'vui-footer__brand--sm')}>
        <Show when={mark() != null}>
          <span class="vui-footer__mark" aria-hidden="true">
            {mark()}
          </span>
        </Show>
        <Show when={props.brand}>
          <span class="vui-footer__name">{props.brand}</span>
        </Show>
      </span>
    </Show>
  );
};
