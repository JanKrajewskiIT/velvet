import { createMemo, createUniqueId, For, type JSX, splitProps } from 'solid-js';

import TabButton from '~/components/navigation/Tabs/TabButton/TabButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Tabs.module.css';

interface Tab<T extends string> {
  value: T;
  label: string | JSX.Element;
  id?: string;
  panelId?: string;
  disabled?: boolean;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: 'underline' | 'pill';
  disabled?: boolean;
  activationMode?: 'automatic' | 'manual';
  tabListLabel?: string;
}

const Tabs = <T extends string>(props: Props<TabsProps<T>>) => {
  const generatedId = createUniqueId();
  const [local, rest] = splitProps(props, [
    'tabs',
    'value',
    'onChange',
    'variant',
    'disabled',
    'activationMode',
    'tabListLabel',
    'class',
    'id',
  ]);
  const variant = () => local.variant ?? 'underline';
  const activationMode = () => local.activationMode ?? 'automatic';
  const tabs = () => local.tabs;
  const enabledIndexes = createMemo(() =>
    tabs()
      .map((tab, index) => ({ tab, index }))
      .filter(({ tab }) => !tab.disabled)
      .map(({ index }) => index)
  );
  const getTabId = (tab: Tab<T>, index: number) => tab.id ?? `${local.id ?? generatedId}-tab-${String(index)}`;
  const focusTabAtIndex = (index: number) => {
    const nextTabConfig = tabs()[index];
    if (!nextTabConfig) return;
    const tabList = document.getElementById(local.id ?? generatedId);
    const nextTab = tabList?.querySelector<HTMLElement>(`#${CSS.escape(getTabId(nextTabConfig, index))}`);
    nextTab?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    if (local.disabled) return;
    const availableIndexes = enabledIndexes();
    if (availableIndexes.length === 0) return;

    const currentEnabledIndex = availableIndexes.indexOf(currentIndex);
    const fallbackIndex = currentEnabledIndex >= 0 ? currentEnabledIndex : 0;
    let nextEnabledIndex: number;

    switch (e.key) {
      case 'ArrowRight':
        nextEnabledIndex = fallbackIndex < availableIndexes.length - 1 ? fallbackIndex + 1 : 0;
        break;
      case 'ArrowLeft':
        nextEnabledIndex = fallbackIndex > 0 ? fallbackIndex - 1 : availableIndexes.length - 1;
        break;
      case 'Home':
        nextEnabledIndex = 0;
        break;
      case 'End':
        nextEnabledIndex = availableIndexes.length - 1;
        break;
      case 'Enter':
      case ' ': {
        if (activationMode() !== 'manual') return;
        e.preventDefault();
        const currentTab = tabs()[currentIndex];
        if (currentTab && !currentTab.disabled) {
          local.onChange(currentTab.value);
        }
        return;
      }
      default:
        return;
    }

    e.preventDefault();
    const nextIndex = availableIndexes[nextEnabledIndex];
    const nextTab = nextIndex === undefined ? undefined : tabs()[nextIndex];
    if (nextIndex === undefined || !nextTab) return;
    if (activationMode() === 'automatic') {
      local.onChange(nextTab.value);
    }
    focusTabAtIndex(nextIndex);
  };

  return (
    <div
      {...rest}
      id={local.id ?? generatedId}
      class={classNames(styles.tabs, styles[variant()], local.class)}
      role="tablist"
      aria-label={local.tabListLabel}
      aria-orientation="horizontal"
    >
      <For each={tabs()}>
        {(tab, index) => (
          <TabButton
            id={getTabId(tab, index())}
            label={tab.label}
            selected={local.value === tab.value}
            variant={variant()}
            class={variant() === 'pill' ? styles.pillButton : undefined}
            onClick={() => local.onChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index())}
            role="tab"
            aria-selected={local.value === tab.value}
            aria-controls={tab.panelId}
            tabIndex={local.value === tab.value ? 0 : -1}
            disabled={local.disabled || tab.disabled}
          />
        )}
      </For>
    </div>
  );
};

export type { Tab, TabsProps };
export default Tabs;
