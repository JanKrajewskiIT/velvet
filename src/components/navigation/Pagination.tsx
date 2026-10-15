import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, Index, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate, useTranslateRich } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Select } from '../forms/Select';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { PAGE_GAP, pageRange, type PageRangeItem } from './pageRange';
import styles from './Pagination.module.css';

const PAGER_VARIANT_CLASSES = {
  full: styles.pagerVariantFull,
} as const;

export interface PaginationLabels {
  /** Landmark name. */
  navigation: string;
  rows: string;
  previous: string;
  next: string;
  page: (page: number) => string;
  /** Receives locale-formatted numbers. */
  range: (from: string, to: string, total: string) => string;
  compact: (page: number, count: number) => JSX.Element;
}

export interface PaginationProps {
  /** Controlled page (1-based). */
  page?: number;
  /** @default 1 */
  defaultPage?: number;
  /** Or pass total + pageSize */
  pageCount?: number;
  onPageChange?: (page: number) => void;
  /** Pages either side of current. @default 1 */
  siblingCount?: number;
  /** Total rows — shows the range label */
  total?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  /** compact = "Page 3 of 12" (auto under 640px for full). @default 'full' */
  variant?: 'full' | 'compact';
  labels?: Partial<PaginationLabels>;
  class?: string;
}

const pageNumber = (item: PageRangeItem): number | undefined => (item === PAGE_GAP ? undefined : item);

/** Page navigation with truncation (1 … 4 5 6 … 20). Optional "1–20 of 243" range and rows-per-page select. */
export const Pagination = (props: PaginationProps) => {
  const p = mergeProps({ defaultPage: 1, siblingCount: 1, variant: 'full' } satisfies Partial<PaginationProps>, props);
  const i18n = useI18n();
  const translate = useTranslate();
  const translateRich = useTranslateRich();
  const labels = (): PaginationLabels => ({
    navigation: p.labels?.navigation ?? translate('velvet.navigation.pagination.navigation'),
    rows: p.labels?.rows ?? translate('velvet.navigation.pagination.rows'),
    previous: p.labels?.previous ?? translate('velvet.navigation.pagination.previous'),
    next: p.labels?.next ?? translate('velvet.navigation.pagination.next'),
    page: p.labels?.page ?? ((page) => translate('velvet.navigation.pagination.page', { page })),
    range:
      p.labels?.range ?? ((from, to, total) => translate('velvet.navigation.pagination.range', { from, to, total })),
    compact:
      p.labels?.compact ??
      ((page, count) =>
        translateRich('velvet.navigation.pagination.compact', {
          page,
          count,
          b: (children) => (
            <Text as="b" variant="label-sm" tone="inherit">
              {children}
            </Text>
          ),
        })),
  });
  const numbers = createMemo(() => new Intl.NumberFormat(i18n.locale()));
  const [current, setCurrent] = createControllable({
    value: () => p.page,
    defaultValue: p.defaultPage,
    onChange: (page) => p.onPageChange?.(page),
  });
  const count = () => Math.max(1, p.pageCount ?? (p.total && p.pageSize ? Math.ceil(p.total / p.pageSize) : 1));
  const range = createMemo(() => {
    const { total, pageSize } = p;
    if (!total || !pageSize) return null;
    return labels().range(
      numbers().format((current() - 1) * pageSize + 1),
      numbers().format(Math.min(total, current() * pageSize)),
      numbers().format(total),
    );
  });
  const go = (page: number) => {
    const next = Math.min(count(), Math.max(1, page));
    if (next !== current()) setCurrent(next);
  };

  return (
    <nav
      aria-label={labels().navigation}
      class={cx(styles.pager, variantClass(PAGER_VARIANT_CLASSES, p.variant), p.class)}
    >
      <Show when={range()}>
        <Text as="span" variant="body-sm" tone="inherit" class={styles.pagerPartInfo}>
          {range()}
        </Text>
      </Show>
      <Show when={p.pageSizeOptions && p.onPageSizeChange}>
        <div class={cx(styles.pagerPartSize, typographyClass('body-sm'))}>
          <Text as="span" variant="caption" tone="inherit">
            {labels().rows}
          </Text>
          <Select
            size="sm"
            class={styles.pagerPartSelect}
            aria-label={labels().rows}
            value={p.pageSize === undefined ? undefined : String(p.pageSize)}
            options={p.pageSizeOptions?.map(String)}
            onValueChange={(value) => p.onPageSizeChange?.(Number(value))}
          />
        </div>
      </Show>
      <div class={styles.pagerPartPages}>
        <button
          type="button"
          class={cx(styles.pagerPartBtn, typographyClass('button-sm'))}
          aria-label={labels().previous}
          disabled={current() <= 1}
          onClick={() => go(current() - 1)}
        >
          <Glyph name="chevron-left" />
        </button>
        <Show
          when={p.variant !== 'compact'}
          fallback={
            <Text as="span" variant="body-sm" tone="inherit" class={styles.pagerPartCompact} aria-live="polite">
              {labels().compact(current(), count())}
            </Text>
          }
        >
          <Index each={pageRange(current(), count(), p.siblingCount)}>
            {(item) => (
              <Show
                when={pageNumber(item())}
                fallback={
                  <Text as="span" variant="body-sm" tone="inherit" class={styles.pagerPartGap} aria-hidden="true">
                    {PAGE_GAP}
                  </Text>
                }
              >
                {(page) => (
                  <button
                    type="button"
                    class={cx(
                      typographyClass('button-sm'),
                      styles.pagerPartBtn,
                      page() === current() && styles.pagerPartBtnVariantOn,
                    )}
                    aria-current={page() === current() ? 'page' : undefined}
                    aria-label={labels().page(page())}
                    onClick={() => go(page())}
                  >
                    {page()}
                  </button>
                )}
              </Show>
            )}
          </Index>
        </Show>
        <button
          type="button"
          class={cx(styles.pagerPartBtn, typographyClass('button-sm'))}
          aria-label={labels().next}
          disabled={current() >= count()}
          onClick={() => go(current() + 1)}
        >
          <Glyph name="chevron-right" />
        </button>
      </div>
    </nav>
  );
};
