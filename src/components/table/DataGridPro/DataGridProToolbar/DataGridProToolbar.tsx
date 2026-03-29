import { type Accessor, For, type JSX, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Input from '~/components/inputs/Input/Input';
import Checkbox from '~/components/switchers/Checkbox/Checkbox';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DataGridProToolbar.module.css';

interface DataGridProToolbarColumn {
  key: string;
  header: string;
}

interface DataGridProToolbarProps {
  show: Accessor<boolean>;
  filterable: boolean | undefined;
  filterQuery: Accessor<string>;
  onFilterInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  filterPlaceholder: string | undefined;
  rowCount: Accessor<number>;
  selectable: Accessor<boolean>;
  selectedCount: Accessor<number>;
  hasPersistence: Accessor<boolean>;
  hasPersistedLayout: Accessor<boolean>;
  persistedBadgeLabel: string | undefined;
  defaultBadgeLabel: string | undefined;
  onClearSelection: () => void;
  onResetView: () => void;
  onResetPersistedLayout: () => void;
  resetPersistenceLabel: string | undefined;
  onImportClick: () => void;
  importSettingsLabel: string | undefined;
  onExportSettings: () => void;
  exportSettingsLabel: string | undefined;
  setImportFileInputRef: (value: HTMLInputElement) => void;
  onImportFile: JSX.EventHandler<HTMLInputElement, Event>;
  setColumnMenuWrapRef: (value: HTMLDivElement) => void;
  columnMenuOpen: Accessor<boolean>;
  onToggleColumnMenu: () => void;
  orderedColumns: Accessor<readonly DataGridProToolbarColumn[]>;
  isColumnVisible: (key: string) => boolean;
  disableUncheckColumn: (key: string) => boolean;
  onToggleColumnVisibility: (key: string) => void;
  onResetColumns: () => void;
  rowsCountLabel?: (count: number) => string;
  selectedCountLabel?: (count: number) => string;
  clearSelectionLabel?: string;
  resetViewLabel?: string;
  columnsLabel?: string;
  columnVisibilityLabel?: string;
  resetColumnsLabel?: string;
}

const DataGridProToolbar = (props: Props<DataGridProToolbarProps>) => {
  const { t } = useI18n();
  const filterPlaceholder = () => props.filterPlaceholder ?? t('table.filterRows');
  const rowsCountLabel = (count: number) => props.rowsCountLabel?.(count) ?? t('table.rowsCount', { count });
  const selectedCountLabel = (count: number) =>
    props.selectedCountLabel?.(count) ?? t('table.selectedCount', { count });
  const persistedBadgeLabel = () => props.persistedBadgeLabel ?? t('common.persisted');
  const defaultBadgeLabel = () => props.defaultBadgeLabel ?? t('common.default');
  const clearSelectionLabel = () => props.clearSelectionLabel ?? t('table.clearSelection');
  const resetViewLabel = () => props.resetViewLabel ?? t('table.resetView');
  const resetSavedLayoutLabel = () => props.resetPersistenceLabel ?? t('table.resetSavedLayout');
  const importJsonLabel = () => props.importSettingsLabel ?? t('common.importJson');
  const exportJsonLabel = () => props.exportSettingsLabel ?? t('common.exportJson');
  const columnsLabel = () => props.columnsLabel ?? t('table.columns');
  const columnVisibilityLabel = () => props.columnVisibilityLabel ?? t('columnManager.columnVisibility');
  const resetColumnsLabel = () => props.resetColumnsLabel ?? t('columnManager.resetColumns');

  return (
    <Show when={props.show()}>
      <div class={classNames(styles.toolbar, props.class)}>
        <div class={styles.toolbarLeft}>
          <Show when={props.filterable}>
            <div class={styles.filterWrap}>
              <Input
                type="search"
                value={props.filterQuery()}
                onInput={props.onFilterInput}
                placeholder={filterPlaceholder()}
                class={styles.filterInput}
              />
            </div>
          </Show>
          <div class={styles.summary}>
            <Text as="span" variant="labelMd" tone="secondary" class={styles.resultsCount}>
              {rowsCountLabel(props.rowCount())}
            </Text>
            <Show when={props.selectable() && props.selectedCount() > 0}>
              <Text as="span" variant="caption" tone="primary" class={styles.selectionSummary}>
                {selectedCountLabel(props.selectedCount())}
              </Text>
            </Show>
          </div>
          <Show when={props.hasPersistence()}>
            <span
              class={classNames(
                styles.persistenceBadge,
                props.hasPersistedLayout() ? styles.badgePersisted : styles.badgeDefault
              )}
            >
              {props.hasPersistedLayout() ? persistedBadgeLabel() : defaultBadgeLabel()}
            </span>
          </Show>
        </div>
        <div class={styles.toolbarRight}>
          <div class={styles.toolbarGroup}>
            <Button
              variant="ghost"
              size="sm"
              class={styles.toolbarButton}
              onClick={props.onClearSelection}
              disabled={props.selectedCount() === 0}
            >
              {clearSelectionLabel()}
            </Button>
            <Button variant="ghost" size="sm" class={styles.toolbarButton} onClick={props.onResetView}>
              {resetViewLabel()}
            </Button>
            <Show when={props.hasPersistence()}>
              <Button variant="ghost" size="sm" class={styles.toolbarButton} onClick={props.onResetPersistedLayout}>
                {resetSavedLayoutLabel()}
              </Button>
            </Show>
          </div>
          <div class={styles.toolbarGroup}>
            <Button variant="ghost" size="sm" class={styles.toolbarButton} onClick={props.onImportClick}>
              {importJsonLabel()}
            </Button>
            <Button variant="ghost" size="sm" class={styles.toolbarButton} onClick={props.onExportSettings}>
              {exportJsonLabel()}
            </Button>
          </div>
          <input
            ref={props.setImportFileInputRef}
            type="file"
            accept="application/json"
            class={styles.hiddenInput}
            onChange={(event) => props.onImportFile(event)}
          />
          <div ref={props.setColumnMenuWrapRef} class={styles.columnMenuWrap}>
            <Button
              variant="ghost"
              size="sm"
              class={styles.toolbarButton}
              onClick={props.onToggleColumnMenu}
              aria-haspopup="dialog"
              aria-expanded={props.columnMenuOpen() ? 'true' : 'false'}
            >
              {columnsLabel()}
            </Button>
            <Show when={props.columnMenuOpen()}>
              <div class={styles.columnMenu} role="group" aria-label={columnVisibilityLabel()}>
                <For each={props.orderedColumns()}>
                  {(column) => (
                    <Checkbox
                      wrapperClass={styles.columnOption}
                      checked={props.isColumnVisible(column.key)}
                      disabled={props.disableUncheckColumn(column.key)}
                      onChange={() => props.onToggleColumnVisibility(column.key)}
                      label={column.header}
                    />
                  )}
                </For>
                <Button variant="ghost" size="sm" class={styles.toolbarButtonSmall} onClick={props.onResetColumns}>
                  {resetColumnsLabel()}
                </Button>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default DataGridProToolbar;
