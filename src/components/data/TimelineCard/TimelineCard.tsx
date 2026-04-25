import type { IconTypes } from 'solid-icons';
import { FiCalendar, FiClock, FiEdit2, FiMapPin, FiTrash2 } from 'solid-icons/fi';
import { createMemo, createSignal, type JSX, Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import MarkdownRenderer from '~/components/composites/MarkdownRenderer/MarkdownRenderer';
import Chip from '~/components/feedback/Chip/Chip';
import ConfirmAction from '~/components/overlays/ConfirmAction/ConfirmAction';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TimelineCard.module.css';
import TimelineCardEditDialog from './TimelineCardEditDialog';

type TimelineCardChipVariant = 'info' | 'warning' | 'success' | 'error' | 'primary' | 'primaryOutline' | 'subtle';
type TimelineCardIcon = IconTypes | JSX.Element;

interface TimelineCardOption {
  value: string;
  label: string;
  icon?: TimelineCardIcon;
  chipVariant?: TimelineCardChipVariant;
}

interface TimelineCardData {
  id: string;
  category: string;
  status: string;
  dateTime: string | null;
  duration: string;
  location: string;
  notes: string;
  isSynced?: boolean;
}

interface TimelineCardLabels {
  category: string;
  status: string;
  dateTime: string;
  duration: string;
  location: string;
  notes: string;
  editDialogLabel: string;
  deleteDialogLabel: string;
  deleteDialogMessage: string;
  syncedLabel: string;
}

interface TimelineCardProps {
  value: TimelineCardData;
  labels: TimelineCardLabels;
  categoryOptions: readonly TimelineCardOption[];
  statusOptions: readonly TimelineCardOption[];
  onSave: (value: TimelineCardData) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  calendarAction?: JSX.Element;
  formatDate?: (value: string) => string;
  formatTime?: (value: string) => string | null | undefined;
  formatDuration?: (value: string) => string;
}

const defaultFormatDate = (value: string): string =>
  new Date(value).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const defaultFormatTime = (value: string): string =>
  new Date(value).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

const defaultFormatDuration = (value: string): string => `${value} min`;

const TimelineCard = (props: Props<TimelineCardProps>) => {
  const { ts } = useI18n();
  const [editOpen, setEditOpen] = createSignal(false);
  const [isSaving, setIsSaving] = createSignal(false);

  const selectedCategory = createMemo(() =>
    props.categoryOptions.find((option) => option.value === props.value.category),
  );
  const selectedStatus = createMemo(() => props.statusOptions.find((option) => option.value === props.value.status));
  const displayedDate = createMemo(() => {
    if (!props.value.dateTime) return ts('common.notSet');
    return (props.formatDate ?? defaultFormatDate)(props.value.dateTime);
  });
  const displayedTime = createMemo(() => {
    if (!props.value.dateTime) return null;
    return (props.formatTime ?? defaultFormatTime)(props.value.dateTime) ?? null;
  });
  const displayedDuration = createMemo(() => {
    if (!props.value.duration.trim()) return null;
    return (props.formatDuration ?? defaultFormatDuration)(props.value.duration);
  });

  const handleEditClose = (): void => {
    if (isSaving()) return;
    setEditOpen(false);
  };

  const handleEditSave = async (value: TimelineCardData): Promise<void> => {
    setIsSaving(true);
    try {
      await props.onSave(value);
      setEditOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const categoryIcon = () => {
    const icon = selectedCategory()?.icon;
    if (!icon) return null;
    return typeof icon === 'function' ? icon({}) : icon;
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  return (
    <ConfirmAction
      label={props.labels.deleteDialogLabel}
      message={props.labels.deleteDialogMessage}
      confirmLabel={ts('common.confirm')}
      variant="danger"
      onConfirm={props.onDelete}
    >
      {({ openConfirm }) => (
        <div class={classNames(styles.card, props.class)}>
          <Show when={categoryIcon()}>{(icon) => <div class={styles.categoryIcon}>{icon()}</div>}</Show>
          <div class={styles.body}>
            <div class={styles.header}>
              <Text as="p" variant="bodyMd" tone="default" class={styles.categoryName}>
                {selectedCategory()?.label ?? props.value.category}
              </Text>
              <Show when={selectedStatus()}>
                {(status) => <Chip label={status().label} variant={status().chipVariant ?? 'subtle'} size="sm" />}
              </Show>
            </div>
            <div class={styles.meta}>
              <Text as="span" variant="bodySm" tone="muted" class={styles.metaItem}>
                <span class={styles.metaIcon}>
                  <FiCalendar />
                </span>
                {displayedDate()}
                <Show when={displayedTime()}>{(time) => <>, {time()}</>}</Show>
              </Text>
              <Show when={props.value.isSynced}>
                <Chip label={props.labels.syncedLabel} variant="success" size="sm" />
              </Show>
              <Show when={props.value.location.trim()}>
                <Text as="span" variant="bodySm" tone="muted" class={styles.metaItem}>
                  <span class={styles.metaIcon}>
                    <FiMapPin />
                  </span>
                  {props.value.location}
                </Text>
              </Show>
              <Show when={displayedDuration()}>
                {(duration) => (
                  <Text as="span" variant="bodySm" tone="muted" class={styles.metaItem}>
                    <span class={styles.metaIcon}>
                      <FiClock />
                    </span>
                    {duration()}
                  </Text>
                )}
              </Show>
            </div>
            <Show when={props.value.notes.trim()}>
              <div class={styles.notes}>
                <MarkdownRenderer content={props.value.notes} />
              </div>
            </Show>
          </div>
          <div class={styles.actions}>
            <Show when={props.calendarAction}>{props.calendarAction}</Show>
            <IconButton icon={FiEdit2} label={ts('common.edit')} onClick={handleEditOpen} size="sm" />
            <IconButton icon={FiTrash2} label={ts('common.delete')} onClick={openConfirm} size="sm" />
          </div>
          <TimelineCardEditDialog
            open={editOpen()}
            loading={isSaving()}
            value={props.value}
            labels={props.labels}
            categoryOptions={props.categoryOptions}
            statusOptions={props.statusOptions}
            onClose={handleEditClose}
            onSave={handleEditSave}
          />
        </div>
      )}
    </ConfirmAction>
  );
};

export type { TimelineCardData, TimelineCardLabels, TimelineCardOption, TimelineCardProps };
export default TimelineCard;
