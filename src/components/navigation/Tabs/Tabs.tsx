import { For, type JSX } from 'solid-js';

import TabButton from '~/components/navigation/Tabs/TabButton/TabButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

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

  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    if (props.disabled) return;
    const tabs = props.tabs;
    let nextIndex: number;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    props.onChange(nextTab.value);
    const target = (e.currentTarget as HTMLElement).parentElement?.children[nextIndex] as HTMLElement | undefined;
    target?.focus();
  };

  return (
    <div class={classNames(styles.tabs, styles[variant()], props.class)} role="tablist">
      <For each={props.tabs}>
        {(tab, index) => (
          <TabButton
            label={tab.label}
            selected={props.value === tab.value}
            variant={variant()}
            class={variant() === 'pill' ? styles.pillButton : undefined}
            onClick={() => props.onChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index())}
            role="tab"
            aria-selected={props.value === tab.value}
            tabIndex={props.value === tab.value ? 0 : -1}
            disabled={props.disabled}
          />
        )}
      </For>
    </div>
  );
};

export default Tabs;
