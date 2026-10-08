import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx, modifier } from '../../utils/cx';
import { Surface, type SurfaceProps } from '../primitives/Surface';

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
    'class',
    'children',
  ]);
  const body = children(() => local.children);
  return (
    <Surface {...surface} class={cx('vui-card', local.padding !== 'md' && `vui-card--p-${local.padding}`, local.class)}>
      <Show when={local.title || local.actions}>
        <div class="vui-card__header">
          <div class="vui-card__heading">
            <Show when={local.title}>
              <div class="vui-card__title">{local.title}</div>
            </Show>
            <Show when={local.description}>
              <div class="vui-card__desc">{local.description}</div>
            </Show>
          </div>
          <Show when={local.actions}>
            <div class="vui-card__actions">{local.actions}</div>
          </Show>
        </div>
      </Show>
      <Show when={body() != null}>
        <div class="vui-card__body">{body()}</div>
      </Show>
      <Show when={local.footer}>
        <div class={cx('vui-card__footer', modifier('vui-card__footer', local.footerAlign, 'end'))}>{local.footer}</div>
      </Show>
    </Surface>
  );
};
