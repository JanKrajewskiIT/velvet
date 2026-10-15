import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Surface, type SurfaceProps } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import styles from './Card.module.css';

const CARD_VARIANT_CLASSES = {
  none: styles.cardVariantPNone,
  sm: styles.cardVariantPSm,
  lg: styles.cardVariantPLg,
} as const;

const CARD_PART_FOOTER_CLASSES = {
  start: styles.cardPartFooterVariantStart,
  between: styles.cardPartFooterVariantBetween,
} as const;

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardFooterAlign = 'start' | 'end' | 'between';

/**
 * Content container = Surface + regions (header · body · footer) and their padding. Nothing else.
 * Paint, hue, behaviour and state are Surface props passed straight through. Media, scrim and
 * hairline-divided regions → StructuredCard.
 */
export interface CardProps extends Omit<SurfaceProps, 'title' | 'padding'> {
  title?: JSX.Element;
  description?: JSX.Element;
  /** Top-right slot — usually IconButtons. */
  actions?: JSX.Element;
  bodyClass?: string;
  /** Tinted footer bar — usually Buttons. */
  footer?: JSX.Element;
  /** @default 'end' */
  footerAlign?: CardFooterAlign;
  /** Region padding from `--card-pad-*`. @default 'md' */
  padding?: CardPadding;
}

export const Card = (props: CardProps) => {
  const merged = mergeProps({ footerAlign: 'end', padding: 'md' } satisfies CardProps, props);
  const [local, surface] = splitProps(merged, [
    'title',
    'description',
    'actions',
    'footer',
    'footerAlign',
    'padding',
    'bodyClass',
    'class',
    'children',
  ]);
  const body = children(() => local.children);
  return (
    <Surface
      {...surface}
      class={cx(styles.card, local.padding !== 'md' && variantClass(CARD_VARIANT_CLASSES, local.padding), local.class)}
    >
      <Show when={local.title || local.actions}>
        <div class={styles.cardPartHeader}>
          <div class={styles.cardPartHeading}>
            <Show when={local.title}>
              <Text as="div" variant="title" class="vui-card__title">
                {local.title}
              </Text>
            </Show>
            <Show when={local.description}>
              <Text as="div" variant="body-sm" tone="secondary" class={styles.cardPartDesc}>
                {local.description}
              </Text>
            </Show>
          </div>
          <Show when={local.actions}>
            <div class={styles.cardPartActions}>{local.actions}</div>
          </Show>
        </div>
      </Show>
      <Show when={body() != null}>
        <div class={cx(styles.cardPartBody, local.bodyClass)}>{body()}</div>
      </Show>
      <Show when={local.footer}>
        <div class={cx(styles.cardPartFooter, variantClass(CARD_PART_FOOTER_CLASSES, local.footerAlign, 'end'))}>
          {local.footer}
        </div>
      </Show>
    </Surface>
  );
};
