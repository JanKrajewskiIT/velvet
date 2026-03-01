import { For, type JSX } from 'solid-js';

import type Props from '../../../models/Props';

import styles from './Tabs.module.css';

interface Tab<T extends string> {
  value: T;
  label: string | JSX.Element;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: 'underline' | 'pill';
  disabled?: boolean;
}

const Tabs = <T extends string>(props: Props<TabsProps<T>>) => {
  const variant = () => props.variant ?? 'underline';

  return (
    <div
      class={`${styles.tabs} ${styles[variant()]} ${props.class ?? ''}`}
      role="tablist"
    >
      <For each={props.tabs}>
        {(tab) => (
          <button
            type="button"
            class={`${styles.tab} ${props.value === tab.value ? styles.tabActive : ''}`}
            onClick={() => props.onChange(tab.value)}
            role="tab"
            aria-selected={props.value === tab.value}
            disabled={props.disabled}
          >
            {tab.label}
          </button>
        )}
      </For>
    </div>
  );
};

export default Tabs;
