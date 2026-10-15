import { For, type JSX, Match, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { StatusTone } from '../../utils/tone';
import { IconButton } from '../actions/IconButton';
import { Badge } from '../display/Badge';
import { Breadcrumb, type BreadcrumbItem } from '../navigation/Breadcrumb';
import { type TabItem, Tabs } from '../navigation/Tabs';
import { Glyph } from '../primitives/Glyph';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './PageHeader.module.css';

export interface PageHeaderMeta {
  icon?: string;
  label: JSX.Element;
}

export interface PageHeaderStatus {
  label: JSX.Element;
  /** @default 'success' */
  tone?: StatusTone;
}

export interface PageHeaderProps {
  /** Location trail above the title; last item = current page. */
  breadcrumb?: BreadcrumbItem[];
  /** Small context line above the title when there is no breadcrumb. */
  eyebrow?: JSX.Element;
  /** Shows a back button left of the title. */
  onBack?: () => void;
  /** @default localized "Back" */
  backLabel?: string;
  title: JSX.Element;
  /** Pill next to the title: 'Active' | `{ label, tone }` | any node. */
  status?: JSX.Element | PageHeaderStatus;
  description?: JSX.Element;
  /** Icon + text facts under the title. */
  meta?: PageHeaderMeta[];
  /** Right-aligned buttons — one primary at most. */
  actions?: JSX.Element;
  /** Section tabs on the bottom edge. */
  tabs?: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  class?: string;
}

/** A plain object is a status description; DOM nodes, arrays and strings are renderable content. */
const isStatusDescription = (status: unknown): status is PageHeaderStatus =>
  typeof status === 'object' &&
  status !== null &&
  Object.getPrototypeOf(status) === Object.prototype &&
  'label' in status;

/** Masthead of a view: breadcrumb, back button, title and status, description, meta facts, actions and section tabs. */
export const PageHeader = (p: PageHeaderProps) => {
  const translate = useTranslate();
  const backLabel = () => p.backLabel ?? translate('velvet.common.back');
  const statusDescription = () => (isStatusDescription(p.status) ? p.status : undefined);
  const statusNode = () => (isStatusDescription(p.status) ? undefined : p.status);
  const statusText = () => (typeof p.status === 'string' ? p.status : undefined);
  const hasBreadcrumb = () => (p.breadcrumb?.length ?? 0) > 0;
  const hasTabs = () => (p.tabs?.length ?? 0) > 0;

  return (
    <header
      class={cx(styles.pageHeader, styles.pageHeaderVariantCard, hasTabs() && styles.pageHeaderVariantTabs, p.class)}
    >
      <Show when={hasBreadcrumb()}>
        <Breadcrumb items={p.breadcrumb ?? []} class="vui-page-header__crumb" />
      </Show>
      <Show when={!p.breadcrumb && p.eyebrow}>
        <Text as="div" variant="caption" tone="tertiary" class="vui-page-header__eyebrow">
          {p.eyebrow}
        </Text>
      </Show>
      <div class={styles.pageHeaderPartMain}>
        <Show when={p.onBack}>
          <IconButton
            icon="arrow-left"
            label={backLabel()}
            variant="secondary"
            class={styles.pageHeaderPartBack}
            onClick={() => p.onBack?.()}
          />
        </Show>
        <div class={styles.pageHeaderPartTitlewrap}>
          <div class={styles.pageHeaderPartTitlerow}>
            <Heading level={1} variant="h2" tone="primary" class={styles.pageHeaderPartTitle}>
              {p.title}
            </Heading>
            <Show when={p.status != null}>
              <Switch fallback={statusNode()}>
                <Match when={statusDescription()}>
                  {(status) => (
                    <Badge tone={status().tone ?? 'success'} dot>
                      {status().label}
                    </Badge>
                  )}
                </Match>
                <Match when={statusText()}>
                  {(text) => (
                    <Badge tone="success" dot>
                      {text()}
                    </Badge>
                  )}
                </Match>
              </Switch>
            </Show>
          </div>
          <Show when={p.description}>
            <Text as="p" variant="body" tone="secondary" class={styles.pageHeaderPartDesc}>
              {p.description}
            </Text>
          </Show>
          <Show when={p.meta?.length}>
            <ul class={cx(styles.pageHeaderPartMeta, typographyClass('body-sm'))}>
              <For each={p.meta}>
                {(item) => (
                  <li>
                    <Show when={item.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                    <Text as="span" variant="caption" tone="inherit">
                      {item.label}
                    </Text>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
        <Show when={p.actions}>
          <div class={styles.pageHeaderPartActions}>{p.actions}</div>
        </Show>
      </div>
      <Show when={hasTabs()}>
        <Tabs
          class={styles.pageHeaderPartTabs}
          items={p.tabs ?? []}
          value={p.activeTab}
          defaultValue={p.defaultTab ?? p.tabs?.[0]?.value}
          onValueChange={(value) => p.onTabChange?.(value)}
        />
      </Show>
    </header>
  );
};
