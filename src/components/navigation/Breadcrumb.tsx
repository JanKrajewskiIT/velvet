import { For, type JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Menu } from '../menus/Menu';
import type { MenuItem } from '../menus/menuItem';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Breadcrumb.module.css';
import { BreadcrumbContent } from './BreadcrumbContent';

export interface BreadcrumbItem {
  label: JSX.Element;
  href?: string;
  /** Receives the click event on a rendered link or button, and no argument when chosen from the collapsed menu. */
  onClick?: (event?: MouseEvent) => void;
  icon?: string;
}

export interface BreadcrumbLabels {
  /** Landmark name. */
  navigation: string;
  /** Collapsed-items button name. */
  more: (hiddenCount: number) => string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** @default 4 */
  maxItems?: number;
  labels?: Partial<BreadcrumbLabels>;
  class?: string;
}

type Crumb =
  { kind: 'item'; item: BreadcrumbItem; last: boolean } | { kind: 'more'; hidden: BreadcrumbItem[]; last: false };

const visibleCrumbs = (items: readonly BreadcrumbItem[], maxItems: number): Crumb[] => {
  const asCrumbs = (list: readonly BreadcrumbItem[], lastIndex: number): Crumb[] =>
    list.map((item, i) => ({ kind: 'item', item, last: i === lastIndex }));
  if (items.length <= maxItems || maxItems < 2) return asCrumbs(items, items.length - 1);
  const tailStart = items.length - (maxItems - 1);
  const [first] = items;
  if (!first) return [];
  return [
    { kind: 'item', item: first, last: false },
    { kind: 'more', hidden: items.slice(1, tailStart), last: false },
    ...asCrumbs(items.slice(tailStart), maxItems - 2),
  ];
};

const menuItemFor = (item: BreadcrumbItem): MenuItem => ({
  label: item.label,
  icon: item.icon,
  onSelect: item.onClick
    ? () => item.onClick?.()
    : item.href
      ? () => window.location.assign(item.href ?? '')
      : undefined,
});

/** Location trail. Last item is the current page (not a link). Beyond maxItems the middle collapses into a "…" menu. */
export const Breadcrumb = (props: BreadcrumbProps) => {
  const p = mergeProps({ maxItems: 4 } satisfies Partial<BreadcrumbProps>, props);
  const translate = useTranslate();
  const labels = (): BreadcrumbLabels => ({
    navigation: p.labels?.navigation ?? translate('velvet.navigation.breadcrumb.navigation'),
    more: p.labels?.more ?? ((hiddenCount) => translate('velvet.navigation.breadcrumb.more', { count: hiddenCount })),
  });
  const crumbs = () => visibleCrumbs(p.items, p.maxItems);

  return (
    <nav aria-label={labels().navigation} class={cx(styles.crumbs, p.class)}>
      <ol>
        <For each={crumbs()}>
          {(crumb) => (
            <li class={styles.crumbsPartItem}>
              <Switch>
                <Match when={crumb.kind === 'more' && crumb}>
                  {(more) => (
                    <Menu
                      items={more().hidden.map(menuItemFor)}
                      trigger={
                        <button
                          type="button"
                          class={cx(styles.crumbsPartLink, styles.crumbsPartMore, typographyClass('label'))}
                          aria-label={labels().more(more().hidden.length)}
                        >
                          <Glyph name="more-horizontal" />
                        </button>
                      }
                    />
                  )}
                </Match>
                <Match when={crumb.kind === 'item' && crumb.last && crumb}>
                  {(current) => (
                    <Text as="span" variant="label" tone="inherit" class={styles.crumbsPartCurrent} aria-current="page">
                      <BreadcrumbContent icon={current().item.icon}>{current().item.label}</BreadcrumbContent>
                    </Text>
                  )}
                </Match>
                <Match when={crumb.kind === 'item' && !!crumb.item.href && crumb}>
                  {(link) => (
                    <a
                      class={cx(styles.crumbsPartLink, typographyClass('label'))}
                      href={link().item.href}
                      onClick={(e) => link().item.onClick?.(e)}
                    >
                      <BreadcrumbContent icon={link().item.icon}>{link().item.label}</BreadcrumbContent>
                    </a>
                  )}
                </Match>
                <Match when={crumb.kind === 'item' && crumb}>
                  {(action) => (
                    <button
                      type="button"
                      class={cx(styles.crumbsPartLink, typographyClass('label'))}
                      onClick={(e) => action().item.onClick?.(e)}
                    >
                      <BreadcrumbContent icon={action().item.icon}>{action().item.label}</BreadcrumbContent>
                    </button>
                  )}
                </Match>
              </Switch>
              <Show when={!crumb.last}>
                <Glyph name="chevron-right" class={styles.crumbsPartSep} />
              </Show>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
};
