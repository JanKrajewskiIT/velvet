import { children, Index, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import { type StateSize, StateTile, type StateTone } from './StateTile';
import styles from './StatusPage.module.css';
import { isErrorCode, STATUS_PAGES, type StatusPageCode } from './statusPages';

const STATUS_PAGE_CLASSES = {
  hero: styles.statusPageVariantHero,
  md: styles.statusPageVariantMd,
  sm: styles.statusPageVariantSm,
} as const;

const TONE_CLASSES = {
  warning: styles.toneVariantWarning,
  danger: styles.toneVariantDanger,
  info: styles.toneVariantInfo,
  neutral: styles.toneVariantNeutral,
} as const;

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
        styles.empty,
        styles.statusPage,
        hero() && styles.statusPageVariantHero,
        local.size !== 'lg' && variantClass(STATUS_PAGE_CLASSES, local.size),
        variantClass(TONE_CLASSES, tone()),
        local.class,
      )}
    >
      <Show
        when={hero()}
        fallback={
          <>
            <Show when={isError()}>
              <Text as="div" variant="overline" tone="tertiary" class="vui-status-page__overline">
                {errorLabel()}
              </Text>
            </Show>
            <StateTile icon={icon()} size={local.size} tone={tone()} />
          </>
        }
      >
        <div class={styles.statusPagePartHero}>
          <Text as="span" variant="label-sm" tone="inherit" class={styles.statusPagePartTag}>
            <Glyph name={icon()} />
            {errorLabel()}
            <Show when={copy().tagKey}>
              {(tagKey) => (
                <Text as="span" variant="label-sm" tone="inherit" class={styles.statusPagePartTagsub}>
                  {translate(tagKey())}
                </Text>
              )}
            </Show>
          </Text>
          <Text as="span" variant="display-lg" tone="inherit" class={styles.statusPagePartNum} aria-hidden="true">
            <Index each={String(current()).split('')}>{(char, i) => <span style={{ '--d': i }}>{char()}</span>}</Index>
          </Text>
        </div>
      </Show>
      <div class={styles.emptyPartText}>
        <Heading level={1} variant="title-lg" tone="primary" class={styles.emptyPartTitle}>
          {local.title ?? translate(copy().titleKey)}
        </Heading>
        <Text as="p" variant="body-sm" tone="secondary" class={styles.emptyPartDesc}>
          {local.description ?? translate(copy().descriptionKey)}
        </Text>
      </div>
      <Show when={actions()}>
        <div class={styles.emptyPartActions}>{actions()}</div>
      </Show>
      <Show when={extra()}>
        <div class={styles.statusPagePartExtra}>{extra()}</div>
      </Show>
    </div>
  );
};
