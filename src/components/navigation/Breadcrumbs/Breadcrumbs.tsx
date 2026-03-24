import { FiChevronRight } from 'solid-icons/fi';
import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

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
        <Heading as="span" level={5} aria-current="page">
          {item.label}
        </Heading>
      );
    }
    if (item.href) {
      return (
        <a href={item.href} class={styles.link}>
          <Text as="span" variant="bodySm" tone="secondary">
            {item.label}
          </Text>
        </a>
      );
    }
    if (item.onClick) {
      return (
        <Button variant="subtle" size="sm" onClick={item.onClick}>
          <Text as="span" variant="bodySm">
            {item.label}
          </Text>
        </Button>
      );
    }
    return (
      <Text as="span" variant="bodySm">
        {item.label}
      </Text>
    );
  };

  return (
    <nav aria-label="Breadcrumb" class={classNames(styles.breadcrumbs, props.class)}>
      <ol class={styles.list}>
        <Show when={showEllipsis()}>
          <For each={visibleItems().slice(0, 1)}>
            {(item) => <li class={styles.item}>{renderItem(item, false)}</li>}
          </For>
          <li class={styles.separator} aria-hidden="true">
            {separator()}
          </li>
          <li class={styles.item}>
            <Button variant="subtle" size="sm" onClick={() => setExpanded(true)} aria-label="Show all breadcrumbs">
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
