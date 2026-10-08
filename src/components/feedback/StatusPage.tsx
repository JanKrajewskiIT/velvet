import { children, Index, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { type StateSize, StateTile, type StateTone } from './StateTile';
import { isErrorCode, STATUS_PAGES, type StatusPageCode } from './statusPages';

export interface StatusPageProps extends HtmlProps<HTMLDivElement, 'title'> {
  /** Error code or outcome. @default 404 */
  code?: StatusPageCode;
  /** Alias of `code` — reads better for outcomes: `status="success"`. Wins over `code`. */
  status?: StatusPageCode;
  title?: JSX.Element;
  description?: JSX.Element;
  actions?: JSX.Element;
  icon?: string;
  tone?: StateTone;
  /** lg = full page with a code watermark · md / sm = inside a section, card or dialog. @default 'lg' */
  size?: StateSize;
  /** Details under the actions (receipt, error id). */
  children?: JSX.Element;
}

/** The end of a page or flow — errors (404 / 403 / 500) and outcomes (offline / success / warning / info). Same layout as EmptyState. */
export const StatusPage = (props: StatusPageProps) => {
  const merged = mergeProps({ code: 404, size: 'lg' } satisfies StatusPageProps, props);
  const [local, rest] = splitProps(merged, [
    'code',
    'status',
    'title',
    'description',
    'actions',
    'icon',
    'tone',
    'size',
    'class',
    'children',
  ]);
  const translate = useTranslate();
  const actions = children(() => local.actions);
  const extra = children(() => local.children);
  const current = (): StatusPageCode => local.status ?? local.code;
  const copy = () => STATUS_PAGES[current()];
  const isError = () => isErrorCode(current());
  const hero = () => isError() && local.size === 'lg';
  const icon = () => local.icon ?? copy().icon;
  const tone = () => local.tone ?? copy().tone;
  const errorLabel = () => translate('velvet.feedback.statusPage.error', { code: String(current()) });

  return (
    <div
      {...rest}
      role={current() === 500 ? 'alert' : 'status'}
      class={cx(
        'vui-empty',
        'vui-status-page',
        hero() && 'vui-status-page--hero',
        local.size !== 'lg' && `vui-status-page--${local.size}`,
        `vui-tone--${tone()}`,
        local.class,
      )}
    >
      <Show
        when={hero()}
        fallback={
          <>
            <Show when={isError()}>
              <div class="vui-status-page__overline">{errorLabel()}</div>
            </Show>
            <StateTile icon={icon()} size={local.size} tone={tone()} />
          </>
        }
      >
        <div class="vui-status-page__hero">
          <span class="vui-status-page__tag">
            <Glyph name={icon()} />
            {errorLabel()}
            <Show when={copy().tagKey}>
              {(tagKey) => <span class="vui-status-page__tagsub">{translate(tagKey())}</span>}
            </Show>
          </span>
          <span class="vui-status-page__num" aria-hidden="true">
            <Index each={String(current()).split('')}>{(char, i) => <span style={{ '--d': i }}>{char()}</span>}</Index>
          </span>
        </div>
      </Show>
      <div class="vui-empty__text">
        <h1 class="vui-empty__title">{local.title ?? translate(copy().titleKey)}</h1>
        <p class="vui-empty__desc">{local.description ?? translate(copy().descriptionKey)}</p>
      </div>
      <Show when={actions()}>
        <div class="vui-empty__actions">{actions()}</div>
      </Show>
      <Show when={extra()}>
        <div class="vui-status-page__extra">{extra()}</div>
      </Show>
    </div>
  );
};
