import Card from '~/components/surfaces/Card/Card';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DataGridPro.module.css';
import type {
  DataGridProColumn,
  DataGridProColumnPin,
  DataGridProColumnPinning,
  DataGridProProps,
  DataGridProSortState,
} from './DataGridPro.types';
import DataGridProBody from './DataGridProBody';
import DataGridProHeader from './DataGridProHeader';
import DataGridProToolbar from './DataGridProToolbar';
import useDataGridProState from './useDataGridProState';

const DataGridPro = <T extends Record<string, unknown>>(props: Props<DataGridProProps<T>>) => {
  const state = useDataGridProState(props);

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
        persistedBadgeLabel={props.persistedBadgeLabel}
        defaultBadgeLabel={props.defaultBadgeLabel}
        onClearSelection={state.clearSelection}
        onResetView={state.resetView}
        onResetPersistedLayout={state.resetPersistedLayout}
        resetPersistenceLabel={props.resetPersistenceLabel}
        onImportClick={state.handleImportClick}
        importSettingsLabel={props.importSettingsLabel}
        onExportSettings={state.exportSettings}
        exportSettingsLabel={props.exportSettingsLabel}
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
      />
      <div class={styles.viewport} style={{ height: `${state.viewportHeight()}px` }} onScroll={state.handleScroll}>
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
          />

          <DataGridProBody
            hasRows={state.hasRows}
            emptyMessage={props.emptyMessage}
            bodyHeight={state.bodyHeight}
            totalRowsHeight={state.totalRowsHeight}
            offsetY={state.offsetY}
            visibleRows={state.visibleRows}
            rowClass={state.rowClass}
            rowHeight={state.rowHeight}
            selectable={state.selectable}
            selectedSet={state.selectedSet}
            onToggleRow={state.toggleRow}
            visibleColumns={state.visibleColumns}
            getColumnPin={state.getColumnPin}
            getColumnStyle={state.getColumnStyle}
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
  DataGridProProps,
  DataGridProSortState,
};
