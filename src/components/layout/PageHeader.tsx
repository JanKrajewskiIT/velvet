import { For, type JSX, Match, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { StatusTone } from '../../utils/tone';
import { IconButton } from '../actions/IconButton';
import { Badge } from '../display/Badge';
import { Breadcrumb, type BreadcrumbItem } from '../navigation/Breadcrumb';
import { type TabItem, Tabs } from '../navigation/Tabs';
import { Glyph } from '../primitives/Glyph';

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
    <header class={cx('vui-page-header', 'vui-page-header--card', hasTabs() && 'vui-page-header--tabs', p.class)}>
      <Show when={hasBreadcrumb()}>
        <Breadcrumb items={p.breadcrumb ?? []} class="vui-page-header__crumb" />
      </Show>
      <Show when={!p.breadcrumb && p.eyebrow}>
        <div class="vui-page-header__eyebrow">{p.eyebrow}</div>
      </Show>
      <div class="vui-page-header__main">
        <Show when={p.onBack}>
          <IconButton
            icon="arrow-left"
            label={backLabel()}
            variant="secondary"
            class="vui-page-header__back"
            onClick={() => p.onBack?.()}
          />
        </Show>
        <div class="vui-page-header__titlewrap">
          <div class="vui-page-header__titlerow">
            <h1 class="vui-page-header__title">{p.title}</h1>
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
            <p class="vui-page-header__desc">{p.description}</p>
          </Show>
          <Show when={p.meta?.length}>
            <ul class="vui-page-header__meta">
              <For each={p.meta}>
                {(item) => (
                  <li>
                    <Show when={item.icon}>{(icon) => <Glyph name={icon()} />}</Show>
                    <span>{item.label}</span>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
        <Show when={p.actions}>
          <div class="vui-page-header__actions">{p.actions}</div>
        </Show>
      </div>
      <Show when={hasTabs()}>
        <Tabs
          class="vui-page-header__tabs"
          items={p.tabs ?? []}
          value={p.activeTab}
          defaultValue={p.defaultTab ?? p.tabs?.[0]?.value}
          onValueChange={(value) => p.onTabChange?.(value)}
        />
      </Show>
    </header>
  );
};
