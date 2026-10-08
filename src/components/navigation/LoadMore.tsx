import { type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Progress } from '../feedback/Progress';

export interface LoadMoreProps {
  /** Items currently rendered. @default 0 */
  shown?: number;
  /** Items available. Renders nothing when 0. @default 0 */
  total?: number;
  /** Page size — the button reads "Show 20 more" (capped at what's left) */
  step?: number;
  onLoadMore?: () => void;
  /** Spinner on the button while the next page loads */
  loading?: boolean;
  /** Button text override */
  label?: JSX.Element;
  /** End text. @default localized "All {total} shown" */
  doneLabel?: JSX.Element;
  /** @default localized "Showing {shown} of {total}" */
  format?: (shown: number, total: number) => JSX.Element;
  class?: string;
}

/**
 * Incremental "Show more" footer for feeds and card lists — a quiet progress bar ("Showing 20 of 120") over a dashed
 * button; replaced by "All N shown" at the end. Use Pagination when users need to jump to a page or share a URL to one.
 */
export const LoadMore = (props: LoadMoreProps) => {
  const p = mergeProps({ shown: 0, total: 0 } satisfies LoadMoreProps, props);
  const translate = useTranslate();
  const countText = (shown: number, total: number): JSX.Element =>
    p.format ? p.format(shown, total) : translate('velvet.navigation.loadMore.format', { shown, total });
  const visibleCount = () => Math.min(p.shown, p.total);
  const remaining = () => Math.max(0, p.total - p.shown);
  const nextBatch = () => (p.step ? Math.min(p.step, remaining()) : null);
  const moreText = () => {
    const batch = nextBatch();
    return batch
      ? translate('velvet.navigation.loadMore.showNext', { count: batch })
      : translate('velvet.navigation.loadMore.showMore');
  };

  return (
    <Show when={p.total > 0}>
      <div class={cx('vui-loadmore', p.class)}>
        <Progress
          value={visibleCount()}
          max={p.total}
          size="sm"
          tone="neutral"
          label={<span class="vui-loadmore__count">{countText(visibleCount(), p.total)}</span>}
          class="vui-loadmore__bar"
        />
        <Show
          when={remaining() > 0}
          fallback={
            <span class="vui-loadmore__done" role="status">
              {p.doneLabel || translate('velvet.navigation.loadMore.doneLabel', { total: p.total })}
            </span>
          }
        >
          <Button
            variant="dashed"
            size="sm"
            iconRight="chevron-down"
            loading={p.loading}
            onClick={() => p.onLoadMore?.()}
          >
            {p.label || moreText()}
          </Button>
        </Show>
      </div>
    </Show>
  );
};
