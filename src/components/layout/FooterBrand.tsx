import { type JSX, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import styles from './FooterBrand.module.css';

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
      <span class={cx(styles.footerPartBrand, props.compact && styles.footerPartBrandVariantSm)}>
        <Show when={mark() != null}>
          <span class={styles.footerPartMark} aria-hidden="true">
            {mark()}
          </span>
        </Show>
        <Show when={props.brand}>
          <Text as="span" variant={props.compact ? 'label' : 'title-lg'} class={styles.footerPartName}>
            {props.brand}
          </Text>
        </Show>
      </span>
    </Show>
  );
};
