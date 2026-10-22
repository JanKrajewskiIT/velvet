import { createMemo, For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { type HtmlProps, Polymorphic } from '../../utils/polymorphic';
import { Glyph } from '../primitives/Glyph';
import styles from './GateList.module.css';

const ICONS = {
  pass: 'circle-check',
  fail: 'circle-x',
  warn: 'triangle-alert',
  pending: 'clock',
  skip: 'minus',
} as const;

export interface GateItem {
  id?: string;
  label: JSX.Element;
  detail?: JSX.Element;
  status: keyof typeof ICONS;
  code?: string;
}

export interface GateListProps extends HtmlProps<HTMLDivElement> {
  items: GateItem[];
  ordered?: boolean;
  stopAtFirstFail?: boolean;
  size?: 'sm' | 'md';
}

export const GateList = (props: GateListProps) => {
  const merged = mergeProps(
    { ordered: true, stopAtFirstFail: true, size: 'md' } satisfies Partial<GateListProps>,
    props,
  );
  const [local, rest] = splitProps(merged, ['items', 'ordered', 'stopAtFirstFail', 'size', 'class']);
  const translate = useTranslate();
  const firstFail = createMemo(() => local.items.findIndex((item) => item.status === 'fail'));
  const passed = createMemo(() => local.items.filter((item) => item.status === 'pass').length);
  return (
    <div {...rest} class={cx(styles.root, local.class)} data-size={local.size}>
      <Polymorphic
        tag={local.ordered ? 'ol' : 'ul'}
        class={styles.list}
        aria-label={translate('velvet.feedback.gateList.passed', { passed: passed(), total: local.items.length })}
      >
        <For each={local.items}>
          {(item, index) => {
            const blocking = () => local.stopAtFirstFail && index() === firstFail();
            const after = () =>
              local.stopAtFirstFail && firstFail() >= 0 && index() > firstFail() && item.status !== 'fail';
            return (
              <li
                class={cx(styles.item, blocking() && styles.blocking, after() && styles.after)}
                data-status={item.status}
              >
                <span class={styles.icon}>
                  <Glyph name={ICONS[item.status]} label={translate(`velvet.feedback.gateList.${item.status}`)} />
                </span>
                <span class={styles.text}>
                  <span class={styles.title}>{item.label}</span>
                  <Show when={item.detail}>
                    <span class={styles.detail}>{item.detail}</span>
                  </Show>
                </span>
                <Show
                  when={blocking()}
                  fallback={
                    <Show when={item.code}>
                      <span class={styles.code}>{item.code}</span>
                    </Show>
                  }
                >
                  <span class={styles.tag}>{translate('velvet.feedback.gateList.blocks')}</span>
                </Show>
              </li>
            );
          }}
        </For>
      </Polymorphic>
    </div>
  );
};
