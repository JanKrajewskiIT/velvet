import { FiChevronRight } from 'solid-icons/fi';
import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';

import Button from '../../buttons/Button/Button';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: JSX.Element;
  maxItems?: number;
}

const Breadcrumbs = (props: Props<BreadcrumbsProps>) => {
  const [expanded, setExpanded] = createSignal(false);

  const maxItems = () => props.maxItems ?? Infinity;

  const shouldCollapse = () => props.items.length > maxItems() && !expanded();

  const visibleItems = createMemo<BreadcrumbItem[]>(() => {
    if (!shouldCollapse()) return props.items;
    const tail = maxItems() - 1;
    const first = props.items[0];
    if (!first) return props.items;
    return [first, ...props.items.slice(-tail)];
  });

  const showEllipsis = () => shouldCollapse();

  const separator = () => props.separator ?? <FiChevronRight size={14} />;

  const renderItem = (item: BreadcrumbItem, isCurrentPage: boolean) => {
    if (isCurrentPage) {
      return (
        <span class={styles.current} aria-current="page">
          {item.label}
        </span>
      );
    }
    if (item.href) {
      return (
        <a href={item.href} class={styles.link}>
          {item.label}
        </a>
      );
    }
    if (item.onClick) {
      return (
        <Button class={styles.link} variant="subtle" size="sm" onClick={item.onClick}>
          {item.label}
        </Button>
      );
    }
    return <span class={styles.link}>{item.label}</span>;
  };

  return (
    <nav aria-label="Breadcrumb" class={`${styles.breadcrumbs} ${props.class ?? ''}`}>
      <ol class={styles.list}>
        <Show when={showEllipsis()}>
          <For each={visibleItems().slice(0, 1)}>
            {(item) => <li class={styles.item}>{renderItem(item, false)}</li>}
          </For>
          <li class={styles.separator} aria-hidden="true">
            {separator()}
          </li>
          <li class={styles.item}>
            <Button
              class={styles.ellipsis}
              variant="subtle"
              size="sm"
              onClick={() => setExpanded(true)}
              aria-label="Show all breadcrumbs"
            >
              &hellip;
            </Button>
          </li>
          <li class={styles.separator} aria-hidden="true">
            {separator()}
          </li>
          <For each={visibleItems().slice(1)}>
            {(item, index) => (
              <>
                <li class={styles.item}>{renderItem(item, index() === visibleItems().length - 2)}</li>
                <Show when={index() < visibleItems().length - 2}>
                  <li class={styles.separator} aria-hidden="true">
                    {separator()}
                  </li>
                </Show>
              </>
            )}
          </For>
        </Show>
        <Show when={!showEllipsis()}>
          <For each={visibleItems()}>
            {(item, index) => (
              <>
                <li class={styles.item}>{renderItem(item, index() === visibleItems().length - 1)}</li>
                <Show when={index() < visibleItems().length - 1}>
                  <li class={styles.separator} aria-hidden="true">
                    {separator()}
                  </li>
                </Show>
              </>
            )}
          </For>
        </Show>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
