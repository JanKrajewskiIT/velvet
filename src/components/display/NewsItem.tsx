import { For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Dot } from '../primitives/Dot';
import { Tag } from '../primitives/Tag';
import styles from './NewsItem.module.css';

const IMPACT = { high: 'danger', medium: 'warning', low: 'neutral' } as const;

const sourceHref = (href: string | undefined): string | undefined => {
  if (!href) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(href, 'https://velvet.invalid');
  } catch {
    return undefined;
  }
  return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? href : undefined;
};

export interface NewsItemProps extends HtmlProps<HTMLElement, 'title'> {
  title: JSX.Element;
  href?: string;
  source?: JSX.Element;
  time?: JSX.Element;
  region?: JSX.Element;
  impact?: string;
  bullets?: JSX.Element[];
  tags?: string[];
  onTagClick?: (tag: string) => void;
  /** @deprecated Use tags. */
  tickers?: string[];
  /** @deprecated Use onTagClick. */
  onTickerClick?: (ticker: string) => void;
  aiLabel?: JSX.Element;
  actions?: JSX.Element;
}

export const NewsItem = (props: NewsItemProps) => {
  const merged = mergeProps({ bullets: [] } satisfies Partial<NewsItemProps>, props);
  const [local, rest] = splitProps(merged, [
    'title',
    'href',
    'source',
    'time',
    'region',
    'impact',
    'bullets',
    'tags',
    'onTagClick',
    'tickers',
    'onTickerClick',
    'aiLabel',
    'actions',
    'class',
  ]);
  const translate = useTranslate();
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- tickers remains supported for existing consumers.
  const tags = () => local.tags ?? local.tickers;
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- onTickerClick remains supported for existing consumers.
  const onTagClick = () => local.onTagClick ?? local.onTickerClick;
  const href = () => sourceHref(local.href);
  const impact = () => local.impact?.toLowerCase();
  const tone = () => {
    const key = impact();
    return key && Object.hasOwn(IMPACT, key) ? IMPACT[key as keyof typeof IMPACT] : 'neutral';
  };
  return (
    <article {...rest} class={cx(styles.root, local.class)}>
      <header class={styles.head}>
        <div class={styles.meta}>
          {local.source}
          {local.source && local.time ? ' · ' : ''}
          {local.time}
          {(local.source || local.time) && local.region ? ' · ' : ''}
          {local.region}
        </div>
        <Show when={local.impact}>
          <span class={styles.impact}>
            <Dot tone={tone()} />
            {translate('velvet.finance.newsItem.impact', { impact: local.impact ?? '' })}
          </span>
        </Show>
      </header>
      <h3 class={styles.title}>
        <Show when={href()} fallback={local.title}>
          {(url) => (
            <a class={styles.link} href={url()} target="_blank" rel="noopener noreferrer">
              {local.title}
            </a>
          )}
        </Show>
      </h3>
      <Show when={local.bullets.length}>
        <div class={styles.summary}>
          <span class={styles.ai}>{local.aiLabel ?? translate('velvet.finance.newsItem.aiSummary')}</span>
          <ul class={styles.bullets}>
            <For each={local.bullets}>{(bullet) => <li>{bullet}</li>}</For>
          </ul>
        </div>
      </Show>
      <Show when={tags()?.length || local.actions}>
        <footer class={styles.foot}>
          <div class={styles.tags}>
            <For each={tags()}>
              {(tag) => (
                <Tag size="sm" variant="soft" onClick={onTagClick() ? () => onTagClick()?.(tag) : undefined}>
                  {tag}
                </Tag>
              )}
            </For>
          </div>
          {local.actions}
        </footer>
      </Show>
    </article>
  );
};
