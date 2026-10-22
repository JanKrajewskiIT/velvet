import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, For, type JSX, mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './ContributionBar.module.css';
import { marketDirection } from './marketDirection';

export interface ContributionItem {
  label: JSX.Element;
  value: number;
}
export interface ContributionBarProps extends HtmlProps<HTMLDivElement> {
  items: ContributionItem[];
  max?: number;
  unit?: string;
  digits?: number;
  sort?: boolean;
  labelWidth?: number | string;
}

export const ContributionBar = (props: ContributionBarProps) => {
  const merged = mergeProps({ unit: '', digits: 0, labelWidth: 180 } satisfies Partial<ContributionBarProps>, props);
  const [local, rest] = splitProps(merged, ['items', 'max', 'unit', 'digits', 'sort', 'labelWidth', 'class', 'style']);
  const i18n = useI18n();
  const rows = createMemo(() =>
    local.sort ? [...local.items].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)) : local.items,
  );
  const max = () =>
    local.max && local.max > 0 ? local.max : rows().reduce((m, row) => Math.max(m, Math.abs(row.value)), 1);
  const formatter = createMemo(
    () =>
      new Intl.NumberFormat(i18n.locale(), {
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
        {(row) => (
          <div class={styles.row} role="listitem">
            <span class={styles.label}>{row.label}</span>
            <span class={styles.track} aria-hidden="true">
              <span class={styles.axis} />
              <span
                class={styles.bar}
                data-dir={marketDirection(row.value)}
                style={{
                  left: row.value >= 0 ? '50%' : undefined,
                  right: row.value < 0 ? '50%' : undefined,
                  width: `${Math.min(50, (Math.abs(row.value) / max()) * 50)}%`,
                }}
              />
            </span>
            <span class={styles.value} data-dir={marketDirection(row.value)}>
              {formatter().format(row.value)}
              {local.unit}
            </span>
          </div>
        )}
      </For>
    </div>
  );
};
