import { For, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Pagination.module.css';

type PageItem = number | 'left-ellipsis' | 'right-ellipsis';

interface PaginationOwnProps extends Omit<
  JSX.HTMLAttributes<HTMLElement>,
  'onChange'
> {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
  maxVisible?: number;
  ariaLabel?: string;
}

const buildPageItems = (
  page: number,
  totalPages: number,
  maxVisible: number
): PageItem[] => {
  if (totalPages <= 0) return [];
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pages = new Set<number>([
    1,
    totalPages,
    safePage,
    safePage - 1,
    safePage + 1,
  ]);
  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];

  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i];
    if (current === undefined) continue;

    const previous = sorted[i - 1];
    if (previous !== undefined && current - previous > 1) {
      items.push(previous === 1 ? 'left-ellipsis' : 'right-ellipsis');
    }

    items.push(current);
  }

  return items;
};

const Pagination = (props: Props<PaginationOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'page',
    'totalPages',
    'onChange',
    'previousLabel',
    'nextLabel',
    'maxVisible',
    'ariaLabel',
    'class',
  ]);

  const current = () => Math.min(Math.max(local.page, 1), local.totalPages);
  const pages = () =>
    buildPageItems(current(), local.totalPages, local.maxVisible ?? 7);

  return (
    <nav
      {...rest}
      class={`${styles.nav} ${local.class ?? ''}`}
      aria-label={local.ariaLabel ?? 'Pagination'}
    >
      <button
        type="button"
        class={styles.navButton}
        disabled={current() <= 1}
        onClick={() => local.onChange(current() - 1)}
      >
        {local.previousLabel}
      </button>

      <div class={styles.pages}>
        <For each={pages()}>
          {(item) => {
            if (typeof item !== 'number') {
              return <span class={styles.ellipsis}>...</span>;
            }

            const active = () => item === current();

            return (
              <button
                type="button"
                class={`${styles.pageButton} ${active() ? styles.active : ''}`}
                aria-current={active() ? 'page' : undefined}
                onClick={() => local.onChange(item)}
              >
                {item}
              </button>
            );
          }}
        </For>
      </div>

      <button
        type="button"
        class={styles.navButton}
        disabled={current() >= local.totalPages}
        onClick={() => local.onChange(current() + 1)}
      >
        {local.nextLabel}
      </button>
    </nav>
  );
};

export default Pagination;
