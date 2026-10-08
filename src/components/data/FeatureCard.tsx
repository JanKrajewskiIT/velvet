import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Card, type CardProps } from '../display/Card';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';

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

const LearnMore = () => {
  const translate = useTranslate();
  return (
    <>
      {translate('velvet.data.featureCard.learnMore')}
      <Glyph name="arrow-right" />
    </>
  );
};

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
        'vui-feature',
        local.look === 'lift' && 'vui-feature--lift',
        local.layout === 'inline' && 'vui-feature--inline',
        local.class,
      )}
    >
      <Show when={local.icon}>
        {(icon) => <IconTile icon={icon()} size="lg" tone={local.tone} class="vui-feature__icon" />}
      </Show>
      <span class="vui-feature__title">{local.title}</span>
      <Show when={local.description}>{(description) => <span class="vui-feature__desc">{description()}</span>}</Show>
      <Show when={action() || local.href}>
        <Show
          when={local.interactive}
          fallback={
            <Show
              when={action()}
              fallback={
                <a class="vui-feature__action" href={local.href}>
                  <LearnMore />
                </a>
              }
            >
              {action()}
            </Show>
          }
        >
          <span class="vui-feature__action">
            <Show when={action()} fallback={<LearnMore />}>
              {action()}
            </Show>
          </span>
        </Show>
      </Show>
    </Card>
  );
};
