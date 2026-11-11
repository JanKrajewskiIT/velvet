import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, For, type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { marketDirection } from '../finance/marketDirection';
import styles from './ContributionBar.module.css';

export interface ContributionItem {
  label: JSX.Element;
  value: number;
}
export interface ContributionBarProps extends HtmlProps<HTMLDivElement> {
  items: ContributionItem[];
  max?: number;
  unit?: string;
  digits?: number;
  /** BCP 47 locale. Defaults to the active library locale. */
  locale?: string;
  sort?: boolean;
  labelWidth?: number | string;
}

const contributionValue = (item: ContributionItem): number => (Number.isFinite(item.value) ? item.value : 0);

export const ContributionBar = (props: ContributionBarProps) => {
  const merged = mergeProps({ unit: '', digits: 0, labelWidth: 180 } satisfies Partial<ContributionBarProps>, props);
  const [local, rest] = splitProps(merged, [
    'items',
    'max',
    'unit',
    'digits',
    'locale',
    'sort',
    'labelWidth',
    'class',
    'style',
  ]);
  const i18n = useI18n();
  const rows = createMemo(() =>
    local.sort
      ? [...local.items].sort((a, b) => Math.abs(contributionValue(b)) - Math.abs(contributionValue(a)))
      : local.items,
  );
  const max = () =>
    local.max && Number.isFinite(local.max) && local.max > 0
      ? local.max
      : rows().reduce((m, row) => Math.max(m, Math.abs(contributionValue(row))), 1);
  const formatter = createMemo(
    () =>
      new Intl.NumberFormat(local.locale ?? i18n.locale(), {
        minimumFractionDigits: local.digits,
        maximumFractionDigits: local.digits,
        signDisplay: 'exceptZero',
      }),
  );
  return (
    <div
      {...rest}
      role="list"
      class={cx(styles.root, local.class)}
      style={{
        '--contrib-label': typeof local.labelWidth === 'number' ? `${local.labelWidth}px` : local.labelWidth,
        ...local.style,
      }}
    >
      <For each={rows()}>
        {(row) => {
          const value = () => contributionValue(row);
          const formatted = createMemo(() => `${formatter().format(value()).replace(/^-/u, '−')}${local.unit}`);
          return (
            <div
              class={styles.row}
              role="listitem"
              aria-label={typeof row.label === 'string' ? `${row.label} ${formatted()}` : undefined}
            >
              <span class={styles.label}>{row.label}</span>
              <span class={styles.track} aria-hidden="true">
                <span class={styles.axis} />
                <span
                  class={styles.bar}
                  data-dir={value() < 0 ? 'down' : 'up'}
                  style={{
                    left: value() >= 0 ? '50%' : undefined,
                    right: value() < 0 ? '50%' : undefined,
                    width: `${Math.min(50, (Math.abs(value()) / max()) * 50)}%`,
                  }}
                />
              </span>
              <span class={styles.value} data-dir={marketDirection(value())}>
                {formatted()}
              </span>
            </div>
          );
        }}
      </For>
    </div>
  );
};
