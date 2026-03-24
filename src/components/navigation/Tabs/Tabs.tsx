import { For, type JSX, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Text from '~/components/typography/Text/Text';
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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.disabled) return;
    const tabs = props.tabs;
    const currentIndex = tabs.findIndex((t) => t.value === props.value);
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
    const target = (e.currentTarget as HTMLElement).children[nextIndex] as HTMLElement | undefined;
    target?.focus();
  };

  return (
    <div
      class={classNames(styles.tabs, styles[variant()], props.class)}
      role="tablist"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <For each={props.tabs}>
        {(tab) => (
          <Show
            when={variant() === 'pill'}
            fallback={
              <button
                type="button"
                class={classNames(styles.tab, props.value === tab.value && styles.tabActive)}
                onClick={() => props.onChange(tab.value)}
                role="tab"
                aria-selected={props.value === tab.value}
                tabIndex={props.value === tab.value ? 0 : -1}
                disabled={props.disabled}
              >
                <Text as="span" variant="bodySm" class={styles.tabLabel}>
                  {tab.label}
                </Text>
              </button>
            }
          >
            <Button
              variant={props.value === tab.value ? 'primary' : 'ghost'}
              size="sm"
              class={styles.pillButton}
              onClick={() => props.onChange(tab.value)}
              role="tab"
              aria-selected={props.value === tab.value}
              tabIndex={props.value === tab.value ? 0 : -1}
              disabled={props.disabled}
            >
              {tab.label}
            </Button>
          </Show>
        )}
      </For>
    </div>
  );
};

export default Tabs;
