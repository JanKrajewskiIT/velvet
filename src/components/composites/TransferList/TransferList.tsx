import { IoChevronBack, IoChevronForward, IoPlayBack, IoPlayForward } from 'solid-icons/io';
import { createEffect, createMemo, createSignal, splitProps } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TransferList.module.css';
import {
  filterTransferItems,
  moveAllTransferItems,
  moveSelectedTransferItems,
  pruneTransferSelection,
  toggleTransferSelection,
} from './TransferList.utils';
import TransferListPanel from './TransferListPanel';

export interface TransferItem {
  id: string;
  label: string;
}

export interface TransferListProps {
  sourceItems: readonly TransferItem[];
  targetItems: readonly TransferItem[];
  onChange: (source: TransferItem[], target: TransferItem[]) => void;
  searchable?: boolean;
}

const TransferList = (props: Props<TransferListProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['sourceItems', 'targetItems', 'onChange', 'searchable', 'class']);
  const [sourceChecked, setSourceChecked] = createSignal(new Set<string>());
  const [targetChecked, setTargetChecked] = createSignal(new Set<string>());
  const [sourceFilter, setSourceFilter] = createSignal('');
  const [targetFilter, setTargetFilter] = createSignal('');

  const filteredSource = createMemo(() => filterTransferItems(local.sourceItems, sourceFilter()));
  const filteredTarget = createMemo(() => filterTransferItems(local.targetItems, targetFilter()));
  const sourceTitle = createMemo(() => ts('transfer.available'));
  const targetTitle = createMemo(() => ts('transfer.selected'));
  const selectItemLabel = (label: string) => ts('transfer.selectItem', { label });

  const toggleSourceChecked = (id: string) => setSourceChecked((current) => toggleTransferSelection(current, id));
  const toggleTargetChecked = (id: string) => setTargetChecked((current) => toggleTransferSelection(current, id));

  createEffect(() => {
    setSourceChecked((current) => pruneTransferSelection(current, local.sourceItems));
  });

  createEffect(() => {
    setTargetChecked((current) => pruneTransferSelection(current, local.targetItems));
  });

  const moveSelectedRight = () => {
    const next = moveSelectedTransferItems(local.sourceItems, local.targetItems, sourceChecked());
    setSourceChecked(new Set<string>());
    local.onChange(next.source, next.target);
  };

  const moveAllRight = () => {
    const next = moveAllTransferItems(local.sourceItems, local.targetItems);
    setSourceChecked(new Set<string>());
    local.onChange(next.source, next.target);
  };

  const moveSelectedLeft = () => {
    const next = moveSelectedTransferItems(local.targetItems, local.sourceItems, targetChecked());
    setTargetChecked(new Set<string>());
    local.onChange(next.target, next.source);
  };

  const moveAllLeft = () => {
    const next = moveAllTransferItems(local.targetItems, local.sourceItems);
    setTargetChecked(new Set<string>());
    local.onChange(next.target, next.source);
  };

  return (
    <div {...rest} class={classNames(styles.wrapper, local.class)}>
      <TransferListPanel
        title={sourceTitle()}
        items={filteredSource()}
        filterValue={sourceFilter()}
        searchable={local.searchable}
        selectItemLabel={selectItemLabel}
        checkedIds={sourceChecked()}
        onFilterChange={setSourceFilter}
        onToggleItem={toggleSourceChecked}
      />

      <div class={styles.controls}>
        <IconButton
          disabled={sourceChecked().size === 0}
          onClick={moveSelectedRight}
          label={ts('transfer.moveSelectedRight')}
          icon={IoChevronForward}
          size="sm"
          variant="ghost"
        />
        <IconButton
          disabled={local.sourceItems.length === 0}
          onClick={moveAllRight}
          label={ts('transfer.moveAllRight')}
          icon={IoPlayForward}
          size="sm"
          variant="ghost"
        />
        <IconButton
          disabled={targetChecked().size === 0}
          onClick={moveSelectedLeft}
          label={ts('transfer.moveSelectedLeft')}
          icon={IoChevronBack}
          size="sm"
          variant="ghost"
        />
        <IconButton
          disabled={local.targetItems.length === 0}
          onClick={moveAllLeft}
          label={ts('transfer.moveAllLeft')}
          icon={IoPlayBack}
          size="sm"
          variant="ghost"
        />
      </div>

      <TransferListPanel
        title={targetTitle()}
        items={filteredTarget()}
        filterValue={targetFilter()}
        searchable={local.searchable}
        selectItemLabel={selectItemLabel}
        checkedIds={targetChecked()}
        onFilterChange={setTargetFilter}
        onToggleItem={toggleTargetChecked}
      />
    </div>
  );
};

export default TransferList;
