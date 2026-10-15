import { For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { ListItem as ListRow } from '../primitives/ListItem';
import styles from './List.module.css';

const LIST_VARIANT_CLASSES = {
  divided: styles.listVariantDivided,
} as const;

export interface ListItemData {
  id: string | number;
  title: JSX.Element;
  description?: JSX.Element;
  /** Avatar, icon or Checkbox. */
  leading?: JSX.Element;
  /** Badge, time, IconButton… */
  trailing?: JSX.Element;
  href?: string;
  disabled?: boolean;
}

export interface ListProps {
  items: ListItemData[];
  /** Selected item id. */
  value?: string | number;
  onValueChange?: (id: string | number) => void;
  onItemClick?: (item: ListItemData) => void;
  /** Hairline between rows. @default true */
  divided?: boolean;
  /** 'sm' 40px · 'md' 56px rows. @default 'md' */
  size?: 'sm' | 'md';
  /** Text when items is empty. @default localized "Nothing here yet." */
  empty?: JSX.Element;
  label?: string;
  class?: string;
}

/** Lightweight rows for people, files, candidates, settings. Pass onValueChange (selectable) or onItemClick (plain actions) to make rows interactive. */
export const List = (props: ListProps) => {
  const merged = mergeProps({ divided: true, size: 'md' } satisfies Partial<ListProps>, props);
  const translate = useTranslate();
  const empty = () => merged.empty ?? translate('velvet.data.list.empty');
  const interactive = () => !!(merged.onValueChange || merged.onItemClick);

  const clickHandler = (item: ListItemData): (() => void) | undefined => {
    if (interactive() && !item.href) {
      return () => {
        if (item.disabled) return;
        merged.onValueChange?.(item.id);
        merged.onItemClick?.(item);
      };
    }
    if (!item.href || !merged.onItemClick) return undefined;
    return () => merged.onItemClick?.(item);
  };

  return (
    <Show
      when={merged.items.length}
      fallback={<EmptyText class={cx(styles.listPartEmpty, merged.class)}>{empty()}</EmptyText>}
    >
      <ul
        class={cx(
          styles.list,
          variantClass(LIST_VARIANT_CLASSES, merged.size),
          merged.divided && styles.listVariantDivided,
          merged.class,
        )}
        aria-label={merged.label}
      >
        <For each={merged.items}>
          {(item) => (
            <li class={styles.listPartLi}>
              <ListRow
                size={merged.size}
                leading={item.leading}
                title={item.title}
                description={item.description}
                trailing={item.trailing}
                href={item.href}
                disabled={item.disabled}
                selected={merged.value !== undefined && item.id === merged.value}
                onClick={clickHandler(item)}
              />
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
};
