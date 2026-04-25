import {
  addToast,
  type FilterBarFilter,
  type ImageGridItem,
  type LightboxImage,
  Text,
  TimelineCard,
  TimelineCardEditDialog,
  type TreeNode,
  useTradingViewPollingFeed,
  useTradingViewWsFeed,
} from '@jankrajewskiit/ui';
import { IoDocumentText, IoFolder, IoImage } from 'solid-icons/io';
import { type ComponentProps, createMemo, createSignal } from 'solid-js';

import { useDemoDictionary } from '../../hooks/useDemoDictionary';
import { renderRichText } from '../../i18n/renderRichText';
import {
  asUtcTimestamp,
  comparisonAxes,
  comparisonColumns,
  comparisonDatasets,
  comparisonRows,
  createBarGenerator,
  createCodeSample,
  createTreeData,
  isTradingPoint,
  TRADING_VIEW_SAMPLE,
} from './dataDisplayFixtures';
import { createDataDisplayMarkdown } from './dataDisplayMarkdown';

export const createDataDisplayDemoModel = () => {
  const { t } = useDemoDictionary();
  const clickMeLabel = () => t('demo.text.dataDisplay.codeBlock.clickMe');
  const [selectedNode, setSelectedNode] = createSignal('');
  const [checkedTreeNodes, setCheckedTreeNodes] = createSignal<string[]>([]);
  const [lastMove, setLastMove] = createSignal('');
  const [editorOpen, setEditorOpen] = createSignal(false);
  const [lightboxOpen, setLightboxOpen] = createSignal(false);
  const [comparisonOpen, setComparisonOpen] = createSignal(false);
  const [comparisonPending, setComparisonPending] = createSignal(false);
  const [comparisonReady, setComparisonReady] = createSignal(false);
  const [comparisonSelectionCount] = createSignal(2);
  const [timelineCardValue, setTimelineCardValue] = createSignal<ComponentProps<typeof TimelineCard>['value']>({
    id: 'session-1',
    category: 'review',
    status: 'in-progress',
    dateTime: '2026-03-29T13:30:00.000Z',
    duration: '60',
    location: 'Product sync room',
    notes: 'Review integration checklist and **final acceptance criteria**.',
    isSynced: true,
  });
  const [timelineCardPlannedValue, setTimelineCardPlannedValue] = createSignal<
    ComponentProps<typeof TimelineCard>['value']
  >({
    id: 'session-2',
    category: 'implementation',
    status: 'scheduled',
    dateTime: null,
    duration: '',
    location: '',
    notes: '',
    isSynced: false,
  });
  const [timelineCardCompletedValue, setTimelineCardCompletedValue] = createSignal<
    ComponentProps<typeof TimelineCard>['value']
  >({
    id: 'session-3',
    category: 'release',
    status: 'completed',
    dateTime: '2026-03-31T09:00:00.000Z',
    duration: '90',
    location: 'Release room',
    notes: 'Release retrospective completed. Notes archived in **Delivery hub**.',
    isSynced: true,
  });
  const [timelineCardAddOpen, setTimelineCardAddOpen] = createSignal(false);
  const galleryImages = createMemo<ImageGridItem[]>(() => [
    {
      src: 'https://picsum.photos/id/10/400/300',
      alt: t('demo.text.dataDisplay.gallery.forestAlt'),
      caption: t('demo.text.dataDisplay.gallery.forestCaption'),
    },
    {
      src: 'https://picsum.photos/id/15/400/300',
      alt: t('demo.text.dataDisplay.gallery.mountainsAlt'),
      caption: t('demo.text.dataDisplay.gallery.mountainsCaption'),
    },
    {
      src: 'https://picsum.photos/id/29/400/300',
      alt: t('demo.text.dataDisplay.gallery.coastAlt'),
      caption: t('demo.text.dataDisplay.gallery.coastCaption'),
    },
    {
      src: 'https://picsum.photos/id/37/400/300',
      alt: t('demo.text.dataDisplay.gallery.cliffAlt'),
      caption: t('demo.text.dataDisplay.gallery.cliffCaption'),
    },
    {
      src: 'https://picsum.photos/id/42/400/300',
      alt: t('demo.text.dataDisplay.gallery.nightAlt'),
      caption: t('demo.text.dataDisplay.gallery.nightCaption'),
    },
    {
      src: 'https://picsum.photos/id/49/400/300',
      alt: t('demo.text.dataDisplay.gallery.bridgeAlt'),
      caption: t('demo.text.dataDisplay.gallery.bridgeCaption'),
    },
  ]);
  const lightboxImages = createMemo<LightboxImage[]>(() => [
    {
      src: 'https://picsum.photos/id/10/800/600',
      alt: t('demo.text.dataDisplay.gallery.forestAlt'),
      caption: t('demo.text.dataDisplay.gallery.forestTrailCaption'),
    },
    {
      src: 'https://picsum.photos/id/15/800/600',
      alt: t('demo.text.dataDisplay.gallery.mountainsAlt'),
      caption: t('demo.text.dataDisplay.gallery.mountainsCaption'),
    },
    {
      src: 'https://picsum.photos/id/29/800/600',
      alt: t('demo.text.dataDisplay.gallery.coastAlt'),
      caption: t('demo.text.dataDisplay.gallery.coastCaption'),
    },
  ]);
  const virtualItems = createMemo(() => {
    const items: { id: string; label: string; status: string }[] = [];
    for (let index = 0; index < 1200; index += 1) {
      items.push({
        id: `item-${index + 1}`,
        label: t('demo.text.dataDisplay.virtualizedList.record', { index: index + 1 }),
        status:
          index % 3 === 0
            ? t('demo.text.dataDisplay.virtualizedList.status.synced')
            : index % 3 === 1
              ? t('demo.text.dataDisplay.virtualizedList.status.queued')
              : t('demo.text.dataDisplay.virtualizedList.status.draft'),
      });
    }
    return items;
  });
  const [markdown, setMarkdown] = createSignal(createDataDisplayMarkdown(t, clickMeLabel()));
  const [filtersQuery, setFiltersQuery] = createSignal('');
  const [filtersValue, setFiltersValue] = createSignal([
    { key: 'status', value: 'in-progress' },
    { key: 'priority', value: 'high' },
  ]);
  const reviewQueueItems = createMemo(() => [
    {
      id: 'review-1',
      label: t('demo.text.dataDisplay.virtualizedList.record', { index: 12 }),
      owner: t('demo.text.common.owner.anna'),
      ownerValue: 'anna',
      statusValue: 'in-progress',
      statusLabel: t('demo.text.dataDisplay.filterBar.statusInProgress'),
      priorityValue: 'high',
      priorityLabel: t('demo.text.dataDisplay.filterBar.priorityHigh'),
    },
    {
      id: 'review-2',
      label: t('demo.text.dataDisplay.virtualizedList.record', { index: 18 }),
      owner: t('demo.text.common.owner.marek'),
      ownerValue: 'marek',
      statusValue: 'todo',
      statusLabel: t('demo.text.dataDisplay.filterBar.statusTodo'),
      priorityValue: 'medium',
      priorityLabel: t('demo.text.dataDisplay.filterBar.priorityMedium'),
    },
    {
      id: 'review-3',
      label: t('demo.text.dataDisplay.virtualizedList.record', { index: 24 }),
      owner: t('demo.text.common.owner.kasia'),
      ownerValue: 'kasia',
      statusValue: 'done',
      statusLabel: t('demo.text.dataDisplay.filterBar.statusDone'),
      priorityValue: 'low',
      priorityLabel: t('demo.text.dataDisplay.filterBar.priorityLow'),
    },
    {
      id: 'review-4',
      label: t('demo.text.dataDisplay.virtualizedList.record', { index: 31 }),
      owner: t('demo.text.common.owner.jan'),
      ownerValue: 'jan',
      statusValue: 'in-progress',
      statusLabel: t('demo.text.dataDisplay.filterBar.statusInProgress'),
      priorityValue: 'high',
      priorityLabel: t('demo.text.dataDisplay.filterBar.priorityHigh'),
    },
  ]);
  const filteredReviewQueueItems = createMemo(() => {
    const query = filtersQuery().trim().toLowerCase();
    return reviewQueueItems().filter((item) => {
      const matchesQuery =
        !query ||
        item.label.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.statusLabel.toLowerCase().includes(query) ||
        item.priorityLabel.toLowerCase().includes(query);

      const matchesFilters = filtersValue().every((filter) => {
        if (filter.key === 'status') return item.statusValue === filter.value;
        if (filter.key === 'owner') return item.ownerValue === filter.value;
        if (filter.key === 'priority') return item.priorityValue === filter.value;
        return true;
      });

      return matchesQuery && matchesFilters;
    });
  });
  const nextPollingBar = createBarGenerator(asUtcTimestamp(1705017600), 2103.9);
  const nextWsBar = createBarGenerator(asUtcTimestamp(1705017600), 2098.4);

  const timelineCardCategoryOptions = createMemo(() => [
    {
      value: 'review',
      label: t('demo.text.dataDisplay.timelineCard.stage.review'),
      icon: IoDocumentText,
      chipVariant: 'info' as const,
    },
    {
      value: 'implementation',
      label: t('demo.text.dataDisplay.timelineCard.stage.implementation'),
      icon: IoFolder,
      chipVariant: 'warning' as const,
    },
    {
      value: 'release',
      label: t('demo.text.dataDisplay.timelineCard.stage.release'),
      icon: IoImage,
      chipVariant: 'success' as const,
    },
  ]);

  const timelineCardStatusOptions = createMemo(() => [
    {
      value: 'scheduled',
      label: t('demo.text.dataDisplay.timelineCard.status.scheduled'),
      chipVariant: 'info' as const,
    },
    {
      value: 'in-progress',
      label: t('demo.text.dataDisplay.timelineCard.status.inProgress'),
      chipVariant: 'warning' as const,
    },
    {
      value: 'completed',
      label: t('demo.text.dataDisplay.timelineCard.status.completed'),
      chipVariant: 'success' as const,
    },
  ]);

  const timelineCardLabels = createMemo(() => ({
    category: t('demo.text.dataDisplay.timelineCard.label.category'),
    status: t('demo.text.dataDisplay.timelineCard.label.status'),
    dateTime: t('demo.text.dataDisplay.timelineCard.label.dateTime'),
    duration: t('demo.text.dataDisplay.timelineCard.label.duration'),
    location: t('demo.text.dataDisplay.timelineCard.label.location'),
    notes: t('demo.text.dataDisplay.timelineCard.label.notes'),
    editLabel: t('demo.text.dataDisplay.timelineCard.label.edit'),
    deleteLabel: t('demo.text.dataDisplay.timelineCard.label.delete'),
    editDialogLabel: t('demo.text.dataDisplay.timelineCard.label.editDialog'),
    deleteDialogLabel: t('demo.text.dataDisplay.timelineCard.label.deleteDialog'),
    deleteDialogMessage: t('demo.text.dataDisplay.timelineCard.label.deleteMessage'),
    deleteConfirmLabel: t('demo.text.dataDisplay.timelineCard.label.deleteConfirm'),
    deleteCancelLabel: t('demo.text.dataDisplay.timelineCard.label.deleteCancel'),
    editNotesLabel: t('demo.text.dataDisplay.timelineCard.label.editNotes'),
    saveLabel: t('demo.text.dataDisplay.timelineCard.label.save'),
    syncedLabel: t('demo.text.dataDisplay.timelineCard.label.synced'),
    notSetLabel: t('demo.text.dataDisplay.timelineCard.label.notSet'),
  }));

  const createTimelineCardSave = (
    setter: (value: ComponentProps<typeof TimelineCard>['value']) => void,
  ): NonNullable<ComponentProps<typeof TimelineCard>['onSave']> => {
    return async (value) => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setter(value);
    };
  };

  const handleTimelineCardSave = createTimelineCardSave(setTimelineCardValue);
  const handleTimelineCardPlannedSave = createTimelineCardSave(setTimelineCardPlannedValue);
  const handleTimelineCardCompletedSave = createTimelineCardSave(setTimelineCardCompletedValue);

  const handleTimelineCardDelete: NonNullable<ComponentProps<typeof TimelineCard>['onDelete']> = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    addToast({ type: 'info', message: t('demo.text.dataDisplay.timelineCard.deletedToast') });
  };

  const runComparison = async () => {
    setComparisonPending(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setComparisonPending(false);
    setComparisonReady(true);
  };

  const handleComparisonClose = () => {
    setComparisonOpen(false);
    setComparisonReady(false);
    setComparisonPending(false);
  };

  const handleTimelineCardAddSave: NonNullable<ComponentProps<typeof TimelineCardEditDialog>['onSave']> = async (
    value,
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    setTimelineCardPlannedValue({ ...value, id: `session-new-${Date.now().toString()}` });
    setTimelineCardAddOpen(false);
    addToast({ type: 'success', message: t('demo.text.dataDisplay.timelineCard.addedToast') });
  };

  const timelineItems = createMemo(() => [
    {
      key: '1',
      content: (
        <Text as="span" variant="bodySm">
          <Text as="span" variant="labelMd">
            v0.3.3
          </Text>{' '}
          - {t('demo.text.dataDisplay.timeline.v033')}
        </Text>
      ),
    },
    {
      key: '2',
      content: (
        <Text as="span" variant="bodySm">
          <Text as="span" variant="labelMd">
            v0.1.6
          </Text>{' '}
          - {t('demo.text.dataDisplay.timeline.v016')}
        </Text>
      ),
    },
    {
      key: '3',
      content: (
        <Text as="span" variant="bodySm">
          <Text as="span" variant="labelMd">
            v0.1.0
          </Text>{' '}
          - {t('demo.text.dataDisplay.timeline.v010')}
        </Text>
      ),
    },
  ]);

  const filterDefinitions = createMemo<FilterBarFilter[]>(() => [
    {
      key: 'status',
      label: t('demo.text.dataDisplay.filterBar.statusLabel'),
      options: [
        { value: 'todo', label: t('demo.text.dataDisplay.filterBar.statusTodo') },
        { value: 'in-progress', label: t('demo.text.dataDisplay.filterBar.statusInProgress') },
        { value: 'done', label: t('demo.text.dataDisplay.filterBar.statusDone') },
      ],
      placeholder: t('demo.text.dataDisplay.filterBar.statusPlaceholder'),
    },
    {
      key: 'owner',
      label: t('demo.text.dataDisplay.filterBar.ownerLabel'),
      options: [
        { value: 'anna', label: t('demo.text.dataDisplay.filterBar.ownerAnna') },
        { value: 'marek', label: t('demo.text.dataDisplay.filterBar.ownerMarek') },
        { value: 'jan', label: t('demo.text.dataDisplay.filterBar.ownerJan') },
        { value: 'kasia', label: t('demo.text.dataDisplay.filterBar.ownerKasia') },
      ],
      placeholder: t('demo.text.dataDisplay.filterBar.ownerPlaceholder'),
    },
    {
      key: 'priority',
      label: t('demo.text.dataDisplay.filterBar.priorityLabel'),
      options: [
        { value: 'low', label: t('demo.text.dataDisplay.filterBar.priorityLow') },
        { value: 'medium', label: t('demo.text.dataDisplay.filterBar.priorityMedium') },
        { value: 'high', label: t('demo.text.dataDisplay.filterBar.priorityHigh') },
      ],
      placeholder: t('demo.text.dataDisplay.filterBar.priorityPlaceholder'),
    },
  ]);

  const pollingFeed = useTradingViewPollingFeed({
    intervalMs: 1800,
    url: 'https://demo.local/trading/poll',
    fetcher: () =>
      Promise.resolve(
        new Response(JSON.stringify(nextPollingBar()), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    mapData: (payload) => (isTradingPoint(payload) ? payload : null),
  });

  const wsFeed = useTradingViewWsFeed({
    url: 'wss://demo.local/trading/ws',
    webSocketFactory: () => {
      const target = new EventTarget();
      let timerId = 0;
      let state: number = WebSocket.CONNECTING;
      const socket = {
        get readyState() {
          return state;
        },
        send: () => {},
        close: () => {
          if (state === WebSocket.CLOSED) return;
          state = WebSocket.CLOSED;
          if (timerId) window.clearInterval(timerId);
          target.dispatchEvent(new CloseEvent('close', { code: 1000, reason: 'closed by demo' }));
        },
        addEventListener: target.addEventListener.bind(target),
        removeEventListener: target.removeEventListener.bind(target),
      } as unknown as WebSocket;

      queueMicrotask(() => {
        state = WebSocket.OPEN;
        target.dispatchEvent(new Event('open'));
        timerId = window.setInterval(() => {
          const payload = JSON.stringify(nextWsBar());
          target.dispatchEvent(new MessageEvent('message', { data: payload }));
        }, 2100);
      });

      return socket;
    },
    buildSubscribeMessage: (context) =>
      JSON.stringify({ op: 'subscribe', symbol: context.symbol, interval: context.interval }),
    buildUnsubscribeMessage: (context) =>
      JSON.stringify({ op: 'unsubscribe', symbol: context.symbol, interval: context.interval }),
    mapData: (payload) => (isTradingPoint(payload) ? payload : null),
  });

  const handleTreeMove = (draggedId: string, targetId: string) => {
    setLastMove(`${draggedId} -> ${targetId}`);
    addToast({ type: 'info', message: t('demo.text.dataDisplay.tree.movedToastMessage', { draggedId, targetId }) });
  };

  const renderVirtualItem = (item: ReturnType<typeof virtualItems>[number], index: number) => (
    <div class="virtualRow">
      <Text as="span" variant="bodySm">
        {item.label}
      </Text>
      <Text as="span" variant="overline" tone="muted">
        #{index + 1} - {item.status}
      </Text>
    </div>
  );

  const loadTreeChildren = async (node: TreeNode): Promise<TreeNode[]> => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    if (node.id === 'lazy-modules') {
      return [
        { id: 'virtualized-list', label: 'VirtualizedList.tsx', icon: <IoDocumentText /> },
        { id: 'notification-center', label: 'NotificationCenter.tsx', icon: <IoDocumentText /> },
        { id: 'treeview-v2', label: 'TreeView.v2.tsx', icon: <IoDocumentText /> },
      ];
    }

    return [];
  };

  return {
    addToast,
    asUtcTimestamp,
    checkedTreeNodes,
    clickMeLabel,
    comparisonAxes,
    comparisonColumns,
    comparisonDatasets,
    comparisonOpen,
    comparisonPending,
    comparisonReady,
    comparisonRows,
    comparisonSelectionCount,
    createCodeSample,
    createTreeData,
    editorOpen,
    filterDefinitions,
    filteredReviewQueueItems,
    filtersQuery,
    filtersValue,
    galleryImages,
    handleComparisonClose,
    handleTimelineCardAddSave,
    handleTimelineCardCompletedSave,
    handleTimelineCardDelete,
    handleTimelineCardPlannedSave,
    handleTimelineCardSave,
    handleTreeMove,
    lastMove,
    lightboxImages,
    lightboxOpen,
    loadTreeChildren,
    markdown,
    pollingFeed,
    renderRichText,
    renderVirtualItem,
    runComparison,
    selectedNode,
    setCheckedTreeNodes,
    setComparisonOpen,
    setEditorOpen,
    setFiltersQuery,
    setFiltersValue,
    setLastMove,
    setLightboxOpen,
    setMarkdown,
    setSelectedNode,
    setTimelineCardAddOpen,
    setTimelineCardCompletedValue,
    setTimelineCardPlannedValue,
    setTimelineCardValue,
    t,
    timelineCardAddOpen,
    timelineCardCategoryOptions,
    timelineCardCompletedValue,
    timelineCardLabels,
    timelineCardPlannedValue,
    timelineCardStatusOptions,
    timelineCardValue,
    timelineItems,
    TRADING_VIEW_SAMPLE,
    virtualItems,
    wsFeed,
  };
};
