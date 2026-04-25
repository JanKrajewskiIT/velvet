import { FiChevronRight } from 'solid-icons/fi';
import { createMemo, createSignal, For, type JSX, Show, splitProps } from 'solid-js';

import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
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
  separator?: JSX.Element | (() => JSX.Element);
  maxItems?: number;
}

const Breadcrumbs = (props: Props<BreadcrumbsProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['class', 'items', 'separator', 'maxItems']);
  const [expanded, setExpanded] = createSignal(false);

  const maxItems = createMemo(() => local.maxItems ?? Infinity);

  const shouldCollapse = createMemo(() => local.items.length > maxItems() && !expanded());
  const separatorElement = createMemo(() => {
    const separator = local.separator;
    if (typeof separator === 'function') return separator();
    return separator ?? <FiChevronRight size={14} />;
  });

  const visibleItems = createMemo<BreadcrumbItem[]>(() => {
    if (!shouldCollapse()) return local.items;
    const tail = maxItems() - 1;
    const first = local.items[0];
    if (!first) return local.items;
    return [first, ...local.items.slice(-tail)];
  });

  const showEllipsis = createMemo(() => shouldCollapse());

  const handleShowAllClick = () => setExpanded(true);

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
          <Text as="span" variant="bodySm" tone="secondary">
            {item.label}
          </Text>
        </Button>
      );
    }
    return (
      <Text as="span" variant="bodySm" tone="secondary">
        {item.label}
      </Text>
    );
  };

  return (
    <nav {...rest} aria-label={ts('breadcrumbs.label')} class={local.class}>
      <ol class={styles.list}>
        <Show when={showEllipsis()}>
          <For each={visibleItems().slice(0, 1)}>
            {(item) => <li class={styles.item}>{renderItem(item, false)}</li>}
          </For>
          <li class={styles.separator} aria-hidden="true">
            {separatorElement()}
          </li>
          <li class={styles.item}>
            <Button variant="subtle" size="sm" onClick={handleShowAllClick} aria-label={ts('breadcrumbs.showAll')}>
              &hellip;
            </Button>
          </li>
          <li class={styles.separator} aria-hidden="true">
            {separatorElement()}
          </li>
          <For each={visibleItems().slice(1)}>
            {(item, index) => (
              <>
                <li class={styles.item}>{renderItem(item, index() === visibleItems().length - 2)}</li>
                <Show when={index() < visibleItems().length - 2}>
                  <li class={styles.separator} aria-hidden="true">
                    {separatorElement()}
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
                    {separatorElement()}
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
