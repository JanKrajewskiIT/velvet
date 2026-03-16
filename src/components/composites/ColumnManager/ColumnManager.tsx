import { IoArrowDown, IoArrowUp } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createMemo, createUniqueId, For, Show, splitProps } from 'solid-js';

import Card from '~/components/data-display/Card/Card';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import IconButton from '../../buttons/IconButton/IconButton';
import Select from '../../inputs/Input/Select';
import CheckboxControl from '../../switchers/CheckboxControl/CheckboxControl';
import styles from './ColumnManager.module.css';

export type ColumnManagerPin = 'left' | 'right' | null;
export type ColumnManagerPinning = Partial<Record<string, ColumnManagerPin>>;
export type ColumnManagerVisibility = Record<string, boolean>;

export interface ColumnManagerColumn {
  key: string;
  label: string;
  canHide?: boolean;
  canPin?: boolean;
}

interface ColumnManagerOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  columns: readonly ColumnManagerColumn[];
  order: readonly string[];
  visibility: ColumnManagerVisibility;
  onOrderChange: (next: string[]) => void;
  onVisibilityChange: (next: ColumnManagerVisibility) => void;
  pinning?: ColumnManagerPinning;
  onPinningChange?: (next: ColumnManagerPinning) => void;
  defaultOrder?: readonly string[];
  defaultVisibility?: ColumnManagerVisibility;
  defaultPinning?: ColumnManagerPinning;
  title?: string;
  description?: string;
  visibilityLabel?: string;
  pinLabel?: string;
  moveUpLabel?: string;
  moveDownLabel?: string;
  resetLabel?: string;
  disabled?: boolean;
}

const toPinValue = (raw: string): ColumnManagerPin => {
  if (raw === 'left') return 'left';
  if (raw === 'right') return 'right';
  return null;
};

const ColumnManager = (props: Props<ColumnManagerOwnProps>) => {
  const idPrefix = createUniqueId();
  const [local] = splitProps(props, [
    'columns',
    'order',
    'visibility',
    'onOrderChange',
    'onVisibilityChange',
    'pinning',
    'onPinningChange',
    'defaultOrder',
    'defaultVisibility',
    'defaultPinning',
    'title',
    'description',
    'visibilityLabel',
    'pinLabel',
    'moveUpLabel',
    'moveDownLabel',
    'resetLabel',
    'disabled',
    'class',
  ]);

  const orderedColumns = createMemo(() => {
    const byKey = new Map(local.columns.map((column) => [column.key, column]));
    const orderedKeys = [
      ...local.order.filter((key) => byKey.has(key)),
      ...local.columns.map((column) => column.key).filter((key) => !local.order.includes(key)),
    ];
    return orderedKeys.map((key) => byKey.get(key)).filter(Boolean) as ColumnManagerColumn[];
  });

  const isVisible = (key: string) => local.visibility[key] !== false;
  const isHidable = (column: ColumnManagerColumn) => column.canHide !== false;
  const visibleCount = createMemo(() => orderedColumns().filter((column) => isVisible(column.key)).length);

  const toggleVisibility = (column: ColumnManagerColumn) => {
    if (local.disabled || !isHidable(column)) return;
    const currentlyVisible = isVisible(column.key);
    if (currentlyVisible && visibleCount() <= 1) return;
    local.onVisibilityChange({
      ...local.visibility,
      [column.key]: !currentlyVisible,
    });
  };

  const moveColumn = (columnKey: string, direction: -1 | 1) => {
    if (local.disabled) return;
    const order = orderedColumns().map((column) => column.key);
    const currentIndex = order.indexOf(columnKey);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= order.length) return;
    const nextOrder = [...order];
    const [moved] = nextOrder.splice(currentIndex, 1);
    if (!moved) return;
    nextOrder.splice(nextIndex, 0, moved);
    local.onOrderChange(nextOrder);
  };

  const setPinning = (columnKey: string, nextPin: ColumnManagerPin) => {
    local.onPinningChange?.({
      ...(local.pinning ?? {}),
      [columnKey]: nextPin,
    });
  };

  const resetAll = () => {
    const resetOrder = [...(local.defaultOrder ?? local.columns.map((column) => column.key))];
    const resetVisibility: ColumnManagerVisibility = {};
    const resetPinning: ColumnManagerPinning = {};

    for (const column of local.columns) {
      resetVisibility[column.key] = local.defaultVisibility?.[column.key] ?? true;
      resetPinning[column.key] = local.defaultPinning?.[column.key] ?? null;
    }

    local.onOrderChange(resetOrder);
    local.onVisibilityChange(resetVisibility);
    local.onPinningChange?.(resetPinning);
  };

  return (
    <Card class={classNames(styles.card, local.class)}>
      <div class={styles.header}>
        <div class={styles.headerCopy}>
          <Text as="h3" variant="labelLg">
            {local.title ?? 'Column manager'}
          </Text>
          <Show when={local.description}>
            <Text as="p" variant="caption" tone="muted">
              {local.description}
            </Text>
          </Show>
        </div>
        <Button variant="ghost" size="sm" onClick={resetAll} disabled={local.disabled}>
          {local.resetLabel ?? 'Reset columns'}
        </Button>
      </div>

      <div class={styles.rows}>
        <For each={orderedColumns()}>
          {(column, index) => {
            const pinId = `${idPrefix}-${column.key}`;
            const pinValue = () => local.pinning?.[column.key] ?? null;
            const disableVisibilityToggle = () =>
              local.disabled || !isHidable(column) || (isVisible(column.key) && visibleCount() <= 1);

            return (
              <div class={styles.row}>
                <label class={styles.visibility}>
                  <CheckboxControl
                    checked={isVisible(column.key)}
                    disabled={disableVisibilityToggle()}
                    onChange={() => toggleVisibility(column)}
                  />
                  <Text as="span" variant="bodySm">
                    {column.label}
                  </Text>
                </label>

                <Show when={local.onPinningChange && column.canPin !== false}>
                  <div class={styles.pin}>
                    <label class={styles.pinLabel} for={pinId}>
                      {local.pinLabel ?? 'Pin'}
                    </label>
                    <Select
                      id={pinId}
                      size="sm"
                      value={pinValue() ?? ''}
                      disabled={local.disabled || !isVisible(column.key)}
                      onChange={(e) => setPinning(column.key, toPinValue(e.currentTarget.value))}
                    >
                      <option value="">{local.visibilityLabel ?? 'None'}</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </Select>
                  </div>
                </Show>

                <div class={styles.reorder}>
                  <IconButton
                    icon={<IoArrowUp />}
                    title={local.moveUpLabel ?? 'Move up'}
                    size="sm"
                    disabled={local.disabled || index() === 0}
                    onClick={() => moveColumn(column.key, -1)}
                  />
                  <IconButton
                    icon={<IoArrowDown />}
                    title={local.moveDownLabel ?? 'Move down'}
                    size="sm"
                    disabled={local.disabled || index() === orderedColumns().length - 1}
                    onClick={() => moveColumn(column.key, 1)}
                  />
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </Card>
  );
};

export default ColumnManager;
