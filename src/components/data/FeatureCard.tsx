import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Card, type CardProps } from '../display/Card';
import { IconTile } from '../primitives/IconTile';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './FeatureCard.module.css';
import { FeatureCardActionText } from './FeatureCardActionText';

export interface FeatureCardProps extends HtmlProps<HTMLElement, 'title'> {
  /** Velvet icon name. */
  icon?: string;
  title: JSX.Element;
  description?: JSX.Element;
  /** Custom action slot — e.g. <Link standalone>. */
  action?: JSX.Element;
  /** Renders a localized "Learn more →" link (or the whole card's href when interactive). */
  href?: string;
  /** Hue for icon tile, tonal hover and accent. @default 'brand' */
  tone?: CardProps['tone'];
  /** @default true */
  tonal?: boolean;
  /** Whole card becomes the link. @default false */
  interactive?: boolean;
  /** card = Card hover behaviour · lift = legacy VelvetUi tile: lifts 4px with tone border + layered tone glow. @default 'card' */
  look?: 'card' | 'lift';
  /** stack = icon above text · inline = icon left, compact. @default 'stack' */
  layout?: 'stack' | 'inline';
  /** Card pass-through. */
  padding?: CardProps['padding'];
  variant?: CardProps['variant'];
  accent?: CardProps['accent'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
}

/** Feature tile built on Card: tone icon tile, title, copy, optional action. Hoverable + tonal by default, but only the action inside is a link unless `interactive`. */
export const FeatureCard = (props: FeatureCardProps) => {
  const merged = mergeProps(
    {
      tone: 'brand',
      tonal: true,
      interactive: false,
      look: 'card',
      layout: 'stack',
    } satisfies Partial<FeatureCardProps>,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'icon',
    'title',
    'description',
    'action',
    'href',
    'tone',
    'tonal',
    'interactive',
    'look',
    'layout',
    'class',
  ]);
  const action = children(() => local.action);
  const asLink = () => local.interactive && !!local.href;
  const linkAttributes = () => (local.interactive ? { href: local.href } : {});

  return (
    <Card
      {...rest}
      {...linkAttributes()}
      as={asLink() ? 'a' : 'div'}
      hoverable
      tonal={local.tonal}
      interactive={local.interactive}
      tone={local.tone}
      class={cx(
        styles.feature,
        local.look === 'lift' && styles.featureVariantLift,
        local.layout === 'inline' && styles.featureVariantInline,
        local.class,
      )}
      bodyClass={styles.cardBody}
    >
      <Show when={local.icon}>
        {(icon) => <IconTile icon={icon()} size="lg" tone={local.tone} class={styles.featurePartIcon} />}
      </Show>
      <Text as="span" variant="title" class={styles.featurePartTitle}>
        {local.title}
      </Text>
      <Show when={local.description}>
        {(description) => (
          <Text as="span" variant="body-sm" tone="secondary" class={styles.featurePartDesc}>
            {description()}
          </Text>
        )}
      </Show>
      <Show when={action() || local.href}>
        <Show
          when={local.interactive}
          fallback={
            <Show
              when={action()}
              fallback={
                <a class={cx(styles.featurePartAction, typographyClass('label'))} href={local.href}>
                  <FeatureCardActionText />
                </a>
              }
            >
              {action()}
            </Show>
          }
        >
          <Text as="span" variant="label" tone="inherit" class={styles.featurePartAction}>
            <Show when={action()} fallback={<FeatureCardActionText />}>
              {action()}
            </Show>
          </Text>
        </Show>
      </Show>
    </Card>
  );
};
