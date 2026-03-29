import { createMemo } from 'solid-js';

import Card from '~/components/surfaces/Card/Card';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DataGridPro.module.css';
import type {
  DataGridProColumn,
  DataGridProColumnPin,
  DataGridProColumnPinning,
  DataGridProMessages,
  DataGridProProps,
  DataGridProSortState,
} from './DataGridPro.types';
import DataGridProBody from './DataGridProBody/DataGridProBody';
import DataGridProHeader from './DataGridProHeader/DataGridProHeader';
import DataGridProToolbar from './DataGridProToolbar/DataGridProToolbar';
import useDataGridProState from './useDataGridProState';

const DataGridPro = <T extends Record<string, unknown>>(props: Props<DataGridProProps<T>>) => {
  const { t } = useI18n();
  const state = useDataGridProState(props);
  const messages = createMemo(() => props.messages ?? {});
  const rowsCountLabel = (count: number) => messages().rowsCountLabel?.(count) ?? t('table.rowsCount', { count });
  const selectedCountLabel = (count: number) =>
    messages().selectedCountLabel?.(count) ?? t('table.selectedCount', { count });
  const clearSelectionLabel = () => messages().clearSelectionLabel ?? t('table.clearSelection');
  const resetViewLabel = () => messages().resetViewLabel ?? t('table.resetView');
  const columnsLabel = () => messages().columnsLabel ?? t('table.columns');
  const columnVisibilityLabel = () => messages().columnVisibilityLabel ?? t('columnManager.columnVisibility');
  const resetColumnsLabel = () => messages().resetColumnsLabel ?? t('columnManager.resetColumns');
  const persistedBadgeLabel = () => props.persistedBadgeLabel ?? t('common.persisted');
  const defaultBadgeLabel = () => props.defaultBadgeLabel ?? t('common.default');
  const resetPersistenceLabel = () => props.resetPersistenceLabel ?? t('table.resetSavedLayout');
  const importSettingsLabel = () => props.importSettingsLabel ?? t('common.importJson');
  const exportSettingsLabel = () => props.exportSettingsLabel ?? t('common.exportJson');
  const selectAllVisibleRowsLabel = () => messages().selectAllVisibleRowsLabel ?? t('table.selectAllVisibleRows');
  const resizeColumnLabel = (label: string) =>
    messages().resizeColumnLabel?.(label) ?? t('table.resizeColumn', { label });
  const noRowsLabel = () => messages().noRowsLabel ?? t('table.noRows');
  const selectRowLabel = (id: string) => messages().selectRowLabel?.(id) ?? t('table.selectRow', { id });

  return (
    <Card class={classNames(styles.wrapper, props.class)}>
      <DataGridProToolbar
        show={state.showToolbar}
        filterable={props.filterable}
        filterQuery={state.filterQuery}
        onFilterInput={state.handleFilterInput}
        filterPlaceholder={props.filterPlaceholder}
        rowCount={state.rowCount}
        selectable={state.selectable}
        selectedCount={() => state.selectedSet().size}
        hasPersistence={state.hasPersistence}
        hasPersistedLayout={state.hasPersistedLayout}
        persistedBadgeLabel={persistedBadgeLabel()}
        defaultBadgeLabel={defaultBadgeLabel()}
        onClearSelection={state.clearSelection}
        onResetView={state.resetView}
        onResetPersistedLayout={state.resetPersistedLayout}
        resetPersistenceLabel={resetPersistenceLabel()}
        onImportClick={state.handleImportClick}
        importSettingsLabel={importSettingsLabel()}
        onExportSettings={state.exportSettings}
        exportSettingsLabel={exportSettingsLabel()}
        setImportFileInputRef={state.setImportFileInputRef}
        onImportFile={state.handleImportFile}
        setColumnMenuWrapRef={state.setColumnMenuWrapRef}
        columnMenuOpen={state.columnMenuOpen}
        onToggleColumnMenu={state.toggleColumnMenu}
        orderedColumns={state.orderedColumns}
        isColumnVisible={state.isColumnVisible}
        disableUncheckColumn={state.disableUncheckColumn}
        onToggleColumnVisibility={state.handleColumnVisibilityToggle}
        onResetColumns={state.resetColumns}
        rowsCountLabel={rowsCountLabel}
        selectedCountLabel={selectedCountLabel}
        clearSelectionLabel={clearSelectionLabel()}
        resetViewLabel={resetViewLabel()}
        columnsLabel={columnsLabel()}
        columnVisibilityLabel={columnVisibilityLabel()}
        resetColumnsLabel={resetColumnsLabel()}
      />
      <div
        class={styles.viewport}
        role="grid"
        aria-rowcount={state.rowCount()}
        aria-colcount={state.visibleColumns().length + (state.selectable() ? 1 : 0)}
        aria-multiselectable={state.selectable() ? 'true' : undefined}
        style={{ height: `${state.viewportHeight()}px` }}
        onScroll={state.handleScroll}
      >
        <div class={styles.grid} style={{ width: `${state.gridWidth()}px` }}>
          <DataGridProHeader
            headerHeight={state.headerHeight}
            selectable={state.selectable}
            allVisibleSelected={state.allVisibleSelected}
            onToggleAllVisible={state.toggleAllVisible}
            visibleColumns={state.visibleColumns}
            isColumnSortable={state.isColumnSortable}
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            onSort={state.handleSort}
            getAriaSort={state.getAriaSort}
            getColumnPin={state.getColumnPin}
            getColumnStyle={state.getColumnStyle}
            reorderable={state.reorderable}
            draggingColumnKey={state.draggingColumnKey}
            dragOverColumnKey={state.dragOverColumnKey}
            onHeaderDragStart={state.handleHeaderDragStart}
            onHeaderDragOver={state.handleHeaderDragOver}
            onHeaderDrop={state.handleHeaderDrop}
            onHeaderDragEnd={state.handleHeaderDragEnd}
            onResizeStart={state.handleResizeStart}
            selectAllVisibleRowsLabel={selectAllVisibleRowsLabel()}
            resizeColumnLabel={resizeColumnLabel}
          />

          <DataGridProBody
            hasRows={state.hasRows}
            emptyMessage={props.emptyMessage}
            bodyHeight={state.bodyHeight}
            totalRowsHeight={state.totalRowsHeight}
            offsetY={state.offsetY}
            visibleRows={state.visibleRows}
            striped={() => props.striped ?? false}
            rowHeight={state.rowHeight}
            selectable={state.selectable}
            selectedSet={state.selectedSet}
            onToggleRow={state.toggleRow}
            visibleColumns={state.visibleColumns}
            getColumnPin={state.getColumnPin}
            getColumnStyle={state.getColumnStyle}
            noRowsLabel={noRowsLabel()}
            selectRowLabel={selectRowLabel}
          />
        </div>
      </div>
    </Card>
  );
};

export { DataGridPro };
export type {
  DataGridProColumn,
  DataGridProColumnPin,
  DataGridProColumnPinning,
  DataGridProMessages,
  DataGridProProps,
  DataGridProSortState,
};
