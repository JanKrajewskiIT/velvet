import { children, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { Surface, type SurfaceProps } from '../primitives/Surface';

export type StructuredCardFooterAlign = 'start' | 'end' | 'between';

/**
 * Card laid out in hairline-divided regions: media → header → body → footer.
 * Built on Surface (`clip` on); behaviour props are the same as Card. Use when a card has 2+ distinct
 * regions (project, article, event). For a single content block use Card.
 */
export interface StructuredCardProps extends Omit<SurfaceProps, 'title' | 'padding' | 'clip' | 'variant'> {
  /** Full-bleed media region (img / video / placeholder). */
  media?: JSX.Element;
  /** CSS `aspect-ratio` of the media region. @default '16 / 9' */
  mediaRatio?: string;
  /** Floating top-left over media — usually a Badge. */
  mediaTag?: JSX.Element;
  /** Bottom-right over media, white on scrim (e.g. "6 min read"). Turns the scrim on. */
  mediaMeta?: JSX.Element;
  /** Bottom gradient scrim over media. @default true when `mediaMeta` is set */
  scrim?: boolean;
  title?: JSX.Element;
  /** Secondary line under the title — icon + text. */
  meta?: JSX.Element;
  /** Header right slot — Badge / IconButton. */
  badge?: JSX.Element;
  /** Hairline-divided footer row. */
  footer?: JSX.Element;
  /** @default 'between' */
  footerAlign?: StructuredCardFooterAlign;
}

export const StructuredCard = (props: StructuredCardProps) => {
  const merged = mergeProps({ mediaRatio: '16 / 9', footerAlign: 'between' } satisfies StructuredCardProps, props);
  const [local, surface] = splitProps(merged, [
    'media',
    'mediaRatio',
    'mediaTag',
    'mediaMeta',
    'scrim',
    'title',
    'meta',
    'badge',
    'footer',
    'footerAlign',
    'class',
    'children',
  ]);
  const body = children(() => local.children);
  const showScrim = () => local.scrim ?? !!local.mediaMeta;
  return (
    <Surface {...surface} clip class={cx('vui-scard', local.class)}>
      <Show when={local.media}>
        <div class="vui-scard__media" style={local.mediaRatio ? { 'aspect-ratio': local.mediaRatio } : undefined}>
          {local.media}
          <Show when={showScrim()}>
            <span class="vui-scard__scrim" aria-hidden="true" />
          </Show>
          <Show when={local.mediaTag}>
            <span class="vui-scard__tag">{local.mediaTag}</span>
          </Show>
          <Show when={local.mediaMeta}>
            <span class="vui-scard__mmeta">{local.mediaMeta}</span>
          </Show>
        </div>
      </Show>
      <Show when={local.title || local.meta || local.badge}>
        <div class="vui-scard__header">
          <div class="vui-scard__heading">
            <Show when={local.title}>
              <div class="vui-scard__title">{local.title}</div>
            </Show>
            <Show when={local.meta}>
              <div class="vui-scard__meta">{local.meta}</div>
            </Show>
          </div>
          <Show when={local.badge}>
            <div class="vui-scard__badge">{local.badge}</div>
          </Show>
        </div>
      </Show>
      <Show when={body() != null}>
        <div class="vui-scard__body">{body()}</div>
      </Show>
      <Show when={local.footer}>
        <div class={cx('vui-scard__footer', `vui-scard__footer--${local.footerAlign}`)}>{local.footer}</div>
      </Show>
    </Surface>
  );
};
