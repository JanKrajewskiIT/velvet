import { type Accessor, For, type JSX, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Input from '~/components/inputs/Input/Input';
import Checkbox from '~/components/switchers/Checkbox/Checkbox';
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
}

const DataGridProToolbar = (props: Props<DataGridProToolbarProps>) => {
  const { t } = useI18n();

  return (
    <Show when={props.show()}>
      <div class={classNames(styles.toolbar, props.class)}>
        <div class={styles.toolbarLeft}>
          <Show when={props.filterable}>
            <Input
              type="search"
              value={props.filterQuery()}
              onInput={props.onFilterInput}
              placeholder={props.filterPlaceholder ?? t('table.filterRows')}
              class={styles.filterInput}
            />
          </Show>
          <span class={styles.resultsCount}>
            {t('table.rowsCount', { count: props.rowCount() })}
            <Show when={props.selectable()}> - {t('table.selectedCount', { count: props.selectedCount() })}</Show>
          </span>
          <Show when={props.hasPersistence()}>
            <span
              class={classNames(
                styles.persistenceBadge,
                props.hasPersistedLayout() ? styles.badgePersisted : styles.badgeDefault
              )}
            >
              {props.hasPersistedLayout()
                ? (props.persistedBadgeLabel ?? t('common.persisted'))
                : (props.defaultBadgeLabel ?? t('common.default'))}
            </span>
          </Show>
        </div>
        <div class={styles.toolbarRight}>
          <Button
            variant="ghost"
            size="sm"
            class={styles.toolbarButton}
            onClick={props.onClearSelection}
            disabled={props.selectedCount() === 0}
          >
            {t('table.clearSelection')}
          </Button>
          <Button variant="ghost" size="sm" class={styles.toolbarButton} onClick={props.onResetView}>
            {t('table.resetView')}
          </Button>
          <Show when={props.hasPersistence()}>
            <Button variant="ghost" size="sm" class={styles.toolbarButton} onClick={props.onResetPersistedLayout}>
              {props.resetPersistenceLabel ?? t('table.resetSavedLayout')}
            </Button>
          </Show>
          <Button variant="ghost" size="sm" class={styles.toolbarButton} onClick={props.onImportClick}>
            {props.importSettingsLabel ?? t('common.importJson')}
          </Button>
          <Button variant="ghost" size="sm" class={styles.toolbarButton} onClick={props.onExportSettings}>
            {props.exportSettingsLabel ?? t('common.exportJson')}
          </Button>
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
              aria-haspopup="menu"
              aria-expanded={props.columnMenuOpen() ? 'true' : 'false'}
            >
              {t('table.columns')}
            </Button>
            <Show when={props.columnMenuOpen()}>
              <div class={styles.columnMenu} role="menu" aria-label={t('columnManager.columnVisibility')}>
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
                  {t('columnManager.resetColumns')}
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
