import {
  ActionRow,
  addToast,
  Avatar,
  AvatarGroup,
  Button,
  Carousel,
  CodeBlock,
  CodeText,
  ComparisonInsightsDialog,
  ComparisonSelectionBar,
  FilterBar,
  type FilterBarFilter,
  Heading,
  ImageGrid,
  type ImageGridItem,
  Lightbox,
  type LightboxImage,
  List,
  ListItem,
  MarkdownEditDialog,
  MarkdownRenderer,
  Marquee,
  RadarChart,
  ScoreRing,
  StatusTimeline,
  Text,
  Timeline,
  TimelineCard,
  TimelineCardEditDialog,
  TradingViewChart,
  type TradingViewChartPoint,
  type TreeNode,
  TreeView,
  useI18n,
  useTradingViewPollingFeed,
  useTradingViewWsFeed,
  VirtualizedList,
} from '@jankrajewskiit/ui';
import type { UTCTimestamp } from 'lightweight-charts';
import { IoDocumentText, IoFolder, IoImage } from 'solid-icons/io';
import { type ComponentProps, createMemo, createSignal, For, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { type DemoI18nMessageKey, getDemoMessages } from '../i18n/messages';
import { interpolateText, renderRichText } from '../i18n/renderRichText';

const createMarkdown = (
  t: (key: DemoI18nMessageKey, params?: Record<string, string | number>) => string,
  buttonLabel: string,
) => `
## VelvetUI

${t('demo.text.dataDisplay.markdown.description')}

- ${t('demo.text.dataDisplay.markdown.bulletTheming')}
- ${t('demo.text.dataDisplay.markdown.bulletStrictMode')}
- ${t('demo.text.dataDisplay.markdown.bulletThemeSupport')}

\`\`\`tsx
import { Button } from '@jankrajewskiit/ui';
<Button variant="primary">${buttonLabel}</Button>
\`\`\`
`;

const asUtcTimestamp = (value: number): UTCTimestamp => value as UTCTimestamp;

const TRADING_VIEW_SAMPLE: TradingViewChartPoint[] = [
  { time: asUtcTimestamp(1704067200), open: 2062.1, high: 2068.9, low: 2059.4, close: 2066.8, volume: 5420 },
  { time: asUtcTimestamp(1704153600), open: 2066.8, high: 2072.5, low: 2061.7, close: 2063.2, volume: 4880 },
  { time: asUtcTimestamp(1704240000), open: 2063.2, high: 2076.4, low: 2060.1, close: 2071.9, volume: 6170 },
  { time: asUtcTimestamp(1704326400), open: 2071.9, high: 2079.8, low: 2067.2, close: 2075.6, volume: 6430 },
  { time: asUtcTimestamp(1704412800), open: 2075.6, high: 2084.2, low: 2073.4, close: 2080.5, volume: 6810 },
  { time: asUtcTimestamp(1704499200), open: 2080.5, high: 2085.3, low: 2074.8, close: 2078.1, volume: 5290 },
  { time: asUtcTimestamp(1704585600), open: 2078.1, high: 2088.6, low: 2076.4, close: 2086.4, volume: 7140 },
  { time: asUtcTimestamp(1704672000), open: 2086.4, high: 2091.7, low: 2080.2, close: 2082.3, volume: 5660 },
  { time: asUtcTimestamp(1704758400), open: 2082.3, high: 2096.5, low: 2079.6, close: 2093.8, volume: 7350 },
  { time: asUtcTimestamp(1704844800), open: 2093.8, high: 2101.1, low: 2089.1, close: 2098.6, volume: 7820 },
  { time: asUtcTimestamp(1704931200), open: 2098.6, high: 2104.2, low: 2092.7, close: 2095.1, volume: 6080 },
  { time: asUtcTimestamp(1705017600), open: 2095.1, high: 2107.4, low: 2091.5, close: 2103.9, volume: 7560 },
];

const createBarGenerator = (initialTime: UTCTimestamp, initialPrice: number) => {
  let cursor = initialTime;
  let price = initialPrice;
  return (): TradingViewChartPoint => {
    cursor = asUtcTimestamp(cursor + 60 * 60);
    const open = price;
    const drift = (Math.random() - 0.5) * 11;
    const close = Math.max(1, open + drift);
    const high = Math.max(open, close) + Math.random() * 5.5;
    const low = Math.min(open, close) - Math.random() * 5.2;
    const volume = 5200 + Math.random() * 2600;
    price = close;
    return {
      time: cursor,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(0)),
    };
  };
};

const comparisonAxes = [
  { key: 'salary', label: 'Salary' },
  { key: 'stack', label: 'Tech stack' },
  { key: 'growth', label: 'Growth' },
  { key: 'flexibility', label: 'Flexibility' },
];

const comparisonDatasets = [
  { label: 'Velvet Labs', values: [88, 92, 84, 73], color: '#1d4ed8' },
  { label: 'Signal Forge', values: [79, 86, 77, 91], color: '#059669' },
];

const comparisonColumns = [
  { label: 'Velvet Labs', description: 'Platform team', accentColor: '#1d4ed8' },
  { label: 'Signal Forge', description: 'Product engineering', accentColor: '#059669' },
];

const comparisonRows = [
  { label: 'Compensation', values: ['22-28k PLN B2B', '20-25k PLN B2B'] },
  { label: 'Work mode', values: ['Hybrid, 2 days office', 'Remote first'] },
  { label: 'Hiring process', values: ['3 stages', '4 stages'] },
];

const isTradingPoint = (value: unknown): value is TradingViewChartPoint => {
  if (!value || typeof value !== 'object') return false;
  return (
    'time' in value && 'open' in value && 'high' in value && 'low' in value && 'close' in value && 'volume' in value
  );
};

const createTreeData = (): TreeNode[] => [
  {
    id: 'src',
    label: 'src',
    icon: <IoFolder />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <IoFolder />,
        children: [
          { id: 'button', label: 'Button.tsx', icon: <IoDocumentText /> },
          { id: 'input', label: 'Input.tsx', icon: <IoDocumentText /> },
        ],
      },
      { id: 'index', label: 'index.ts', icon: <IoDocumentText /> },
    ],
  },
  {
    id: 'lazy-modules',
    label: 'lazy-modules',
    icon: <IoFolder />,
    hasChildren: true,
  },
  {
    id: 'package',
    label: 'package.json',
    icon: <IoDocumentText />,
  },
];

const createCodeSample = (buttonLabel: string) => `import { Button } from '@jankrajewskiit/ui';

const App = () => {
  return <Button variant="primary">${buttonLabel}</Button>;
};

export default App;`;

const DataDisplaySection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey, params?: Record<string, string | number>): string =>
    interpolateText(dictionary()[key], params);
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
    const items = [];
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
  const [markdown, setMarkdown] = createSignal(createMarkdown(t, clickMeLabel()));
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

  return (
    <div>
      <Show when={sectionId() === 'data-content'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.codeBlock.title')}
          subtitle={t('demo.showcase.dataDisplay.codeBlock.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.dataDisplay.codeBlock.tsxSnippet.title')}>
              <CodeBlock code={createCodeSample(clickMeLabel())} language="tsx" />
            </PreviewGroup>
            <PreviewGroup title={t('demo.text.dataDisplay.codeBlock.cliSnippet.title')}>
              <CodeBlock code="npm install @jankrajewskiit/ui" language="bash" />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.codeBlock.meta')}</ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.markdownRenderer.title')}
          subtitle={t('demo.showcase.dataDisplay.markdownRenderer.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <MarkdownRenderer content={createMarkdown(t, clickMeLabel())} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.markdownEditDialog.title')}
          subtitle={t('demo.showcase.dataDisplay.markdownEditDialog.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <ActionRow align="start">
                <Button variant="ghost" onClick={() => setEditorOpen(true)}>
                  {t('demo.text.dataDisplay.markdownEdit.openButton')}
                </Button>
              </ActionRow>
              <MarkdownRenderer content={markdown()} />
              <MarkdownEditDialog
                open={editorOpen()}
                label={t('demo.text.dataDisplay.markdownEdit.label')}
                initialValue={markdown()}
                onSave={setMarkdown}
                onClose={() => setEditorOpen(false)}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-lists'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.listAndListItem.title')}
          subtitle={t('demo.showcase.dataDisplay.listAndListItem.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <List>
                <ListItem
                  icon={<IoFolder />}
                  secondary={t('demo.text.dataDisplay.list.threeFiles')}
                  label={t('demo.text.dataDisplay.list.documents')}
                />
                <ListItem
                  icon={<IoDocumentText />}
                  secondary={t('demo.text.dataDisplay.list.updatedYesterday')}
                  label={t('demo.text.dataDisplay.list.reportPdf')}
                />
                <ListItem
                  icon={<IoImage />}
                  secondary={t('demo.text.dataDisplay.list.clickToPreview')}
                  onClick={() => {}}
                  label={t('demo.text.dataDisplay.list.photoPng')}
                />
              </List>
              <List variant="bordered">
                <ListItem
                  icon={<IoFolder />}
                  secondary={t('demo.text.dataDisplay.list.sharedFolder')}
                  label={t('demo.text.dataDisplay.list.projects')}
                />
                <ListItem
                  icon={<IoDocumentText />}
                  secondary={t('demo.text.dataDisplay.list.draft')}
                  action={<Button variant="ghost">{t('demo.text.dataDisplay.list.edit')}</Button>}
                  label={t('demo.text.dataDisplay.list.notesMd')}
                />
              </List>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.virtualizedList.title')}
          subtitle={t('demo.showcase.dataDisplay.virtualizedList.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <VirtualizedList
                items={virtualItems()}
                height={320}
                itemHeight={46}
                overscan={6}
                renderItem={renderVirtualItem}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.virtualizedList.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-filters'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.filterBar.title')}
          subtitle={t('demo.showcase.dataDisplay.filterBar.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="scenarioShell">
                <div class="scenarioHeader">
                  <div class="scenarioHeaderCopy">
                    <Text as="p" variant="overline" tone="primary">
                      {t('demo.page.dataFilters.title')}
                    </Text>
                    <Heading level={3} variant="titleLg">
                      {t('demo.page.dataFilters.description')}
                    </Heading>
                  </div>
                  <div class="scenarioMetricRow">
                    <div class="scenarioMetric">
                      <Text as="span" variant="overline" tone="tertiary">
                        {t('demo.text.dataDisplay.filterBar.activeFilters')}
                      </Text>
                      <Text as="span" variant="labelLg">
                        {filtersValue().length}
                      </Text>
                    </div>
                    <div class="scenarioMetric">
                      <Text as="span" variant="overline" tone="tertiary">
                        {t('demo.text.dataDisplay.filterBar.query')}
                      </Text>
                      <Text as="span" variant="labelLg">
                        {filtersQuery() || t('demo.text.dataDisplay.filterBar.none')}
                      </Text>
                    </div>
                    <div class="scenarioMetric">
                      <Text as="span" variant="overline" tone="tertiary">
                        {t('demo.page.dataTables.title')}
                      </Text>
                      <Text as="span" variant="labelLg">
                        {filteredReviewQueueItems().length}
                      </Text>
                    </div>
                  </div>
                </div>

                <FilterBar
                  filters={filterDefinitions()}
                  value={filtersValue()}
                  onChange={setFiltersValue}
                  search={filtersQuery()}
                  onSearchChange={setFiltersQuery}
                />

                <div class="scenarioBody">
                  <List variant="bordered">
                    <For each={filteredReviewQueueItems()}>
                      {(item) => (
                        <ListItem
                          label={item.label}
                          secondary={`${item.owner} • ${item.statusLabel} • ${item.priorityLabel}`}
                        />
                      )}
                    </For>
                  </List>
                </div>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.filterBar.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-timeline'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.timeline.title')}
          subtitle={t('demo.showcase.dataDisplay.timeline.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Timeline items={timelineItems()} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.statusTimeline.title')}
          subtitle={t('demo.showcase.dataDisplay.statusTimeline.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title="Example">
              <div class="recronDemoMedium">
                <StatusTimeline
                  emptyMessage={t('demo.text.dataDisplay.statusTimeline.emptyMessage')}
                  items={[
                    {
                      key: 'timeline-1',
                      statusTone: 'success',
                      content: <Text as="p">{t('demo.text.dataDisplay.statusTimeline.item.done')}</Text>,
                    },
                    {
                      key: 'timeline-2',
                      statusTone: 'default',
                      content: <Text as="p">{t('demo.text.dataDisplay.statusTimeline.item.inProgress')}</Text>,
                    },
                    {
                      key: 'timeline-3',
                      statusTone: 'muted',
                      content: <Text as="p">{t('demo.text.dataDisplay.statusTimeline.item.todo')}</Text>,
                    },
                  ]}
                  action={<Button size="sm" variant="ghost" label={t('demo.text.dataDisplay.statusTimeline.action')} />}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="TimelineCard" subtitle={t('demo.showcase.dataDisplay.timelineCardComposite.subtitle')}>
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="recronDemoMedium">
                <TimelineCard
                  value={timelineCardValue()}
                  labels={timelineCardLabels()}
                  categoryOptions={timelineCardCategoryOptions()}
                  statusOptions={timelineCardStatusOptions()}
                  calendarAction={
                    <Button
                      size="sm"
                      variant="ghost"
                      label={t('demo.text.dataDisplay.timelineCard.label.calendarAction')}
                    />
                  }
                  onSave={handleTimelineCardSave}
                  onDelete={handleTimelineCardDelete}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.timelineCardComposite.title')}
          subtitle={t('demo.showcase.dataDisplay.timelineCardComposite.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="timelineCompositeDemo">
                <StatusTimeline
                  emptyMessage={t('demo.text.dataDisplay.statusTimeline.emptyMessage')}
                  items={[
                    {
                      key: 'composite-session-1',
                      statusTone: 'default',
                      content: (
                        <TimelineCard
                          value={timelineCardValue()}
                          labels={timelineCardLabels()}
                          categoryOptions={timelineCardCategoryOptions()}
                          statusOptions={timelineCardStatusOptions()}
                          calendarAction={
                            <Button
                              size="sm"
                              variant="ghost"
                              label={t('demo.text.dataDisplay.timelineCard.label.calendarAction')}
                            />
                          }
                          onSave={handleTimelineCardSave}
                          onDelete={handleTimelineCardDelete}
                        />
                      ),
                    },
                    {
                      key: 'composite-session-2',
                      statusTone: 'muted',
                      content: (
                        <TimelineCard
                          value={timelineCardPlannedValue()}
                          labels={timelineCardLabels()}
                          categoryOptions={timelineCardCategoryOptions()}
                          statusOptions={timelineCardStatusOptions()}
                          onSave={handleTimelineCardPlannedSave}
                          onDelete={handleTimelineCardDelete}
                        />
                      ),
                    },
                    {
                      key: 'composite-session-3',
                      statusTone: 'success',
                      content: (
                        <TimelineCard
                          value={timelineCardCompletedValue()}
                          labels={timelineCardLabels()}
                          categoryOptions={timelineCardCategoryOptions()}
                          statusOptions={timelineCardStatusOptions()}
                          calendarAction={
                            <Button
                              size="sm"
                              variant="ghost"
                              label={t('demo.text.dataDisplay.timelineCard.label.calendarAction')}
                            />
                          }
                          onSave={handleTimelineCardCompletedSave}
                          onDelete={handleTimelineCardDelete}
                        />
                      ),
                    },
                  ]}
                  action={
                    <Button
                      size="sm"
                      variant="ghost"
                      label={t('demo.text.dataDisplay.timelineCard.label.addAction')}
                      onClick={() => setTimelineCardAddOpen(true)}
                    />
                  }
                />
                <TimelineCardEditDialog
                  open={timelineCardAddOpen()}
                  value={{
                    id: 'session-new',
                    category: timelineCardCategoryOptions()[0]?.value ?? 'review',
                    status: timelineCardStatusOptions()[0]?.value ?? 'scheduled',
                    dateTime: null,
                    duration: '',
                    location: '',
                    notes: '',
                    isSynced: false,
                  }}
                  labels={{
                    ...timelineCardLabels(),
                    editDialogLabel: t('demo.text.dataDisplay.timelineCard.label.addDialog'),
                  }}
                  categoryOptions={timelineCardCategoryOptions()}
                  statusOptions={timelineCardStatusOptions()}
                  onClose={() => setTimelineCardAddOpen(false)}
                  onSave={handleTimelineCardAddSave}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-tree'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.treeView.title')}
          subtitle={t('demo.showcase.dataDisplay.treeView.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <TreeView
                nodes={createTreeData()}
                defaultExpanded={['src']}
                selectedId={selectedNode()}
                onSelect={setSelectedNode}
                checkable
                checkedIds={checkedTreeNodes()}
                onCheckedIdsChange={setCheckedTreeNodes}
                loadChildren={loadTreeChildren}
                draggable
                onMove={handleTreeMove}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {t('demo.text.dataDisplay.tree.selected')}:{' '}
            <CodeText as="span" class="codeInline">
              {selectedNode() || t('demo.text.dataDisplay.tree.none')}
            </CodeText>{' '}
            | {t('demo.text.dataDisplay.tree.checked')}:{' '}
            <CodeText as="span" class="codeInline">
              {String(checkedTreeNodes().length)}
            </CodeText>{' '}
            | {t('demo.text.dataDisplay.tree.lastMove')}:{' '}
            <CodeText as="span" class="codeInline">
              {lastMove() || t('demo.text.dataDisplay.tree.none')}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-media'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.avatarAndAvatarGroup.title')}
          subtitle={t('demo.showcase.dataDisplay.avatarAndAvatarGroup.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <Avatar src="https://i.pravatar.cc/150?u=a" alt={t('demo.text.dataDisplay.avatar.userPhotoAlt')} />
                <Avatar name="Jan Krajewski" />
                <Avatar />
              </div>
              <div class="row">
                <Avatar src="https://i.pravatar.cc/150?u=a" size="sm" />
                <Avatar src="https://i.pravatar.cc/150?u=a" size="md" />
                <Avatar src="https://i.pravatar.cc/150?u=a" size="lg" />
                <Avatar src="https://i.pravatar.cc/150?u=a" size="xl" />
              </div>
              <AvatarGroup max={3}>
                <Avatar src="https://i.pravatar.cc/150?u=a" />
                <Avatar src="https://i.pravatar.cc/150?u=b" />
                <Avatar src="https://i.pravatar.cc/150?u=c" />
                <Avatar src="https://i.pravatar.cc/150?u=d" />
                <Avatar src="https://i.pravatar.cc/150?u=e" />
              </AvatarGroup>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.carousel.title')}
          subtitle={t('demo.showcase.dataDisplay.carousel.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Carousel>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.slide1')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.slide2')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.slide3')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.slide4')}</div>
              </Carousel>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.carouselAutoPlayAndDots.title')}
          subtitle={t('demo.showcase.dataDisplay.carouselAutoPlayAndDots.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Carousel autoPlay interval={4000}>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.autoSlide1')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.autoSlide2')}</div>
                <div class="surfacePanel">{t('demo.text.dataDisplay.carousel.autoSlide3')}</div>
              </Carousel>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.dataDisplay.carousel.meta'), {
              autoPlay: (
                <CodeText as="span" class="codeInline">
                  autoPlay
                </CodeText>
              ),
              interval: (
                <CodeText as="span" class="codeInline">
                  interval
                </CodeText>
              ),
              showDots: (
                <CodeText as="span" class="codeInline">
                  showDots
                </CodeText>
              ),
              showArrows: (
                <CodeText as="span" class="codeInline">
                  showArrows
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.imageGrid.title')}
          subtitle={t('demo.showcase.dataDisplay.imageGrid.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <ImageGrid images={galleryImages()} columns={3} hoverable rounded />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.imageGrid.meta')}</ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.lightbox.title')}
          subtitle={t('demo.showcase.dataDisplay.lightbox.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Button variant="ghost" onClick={() => setLightboxOpen(true)}>
                {t('demo.text.dataDisplay.lightbox.openButton')}
              </Button>
              <Lightbox images={lightboxImages()} open={lightboxOpen()} onClose={() => setLightboxOpen(false)} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.marquee.title')}
          subtitle={t('demo.showcase.dataDisplay.marquee.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <Marquee speed={20}>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagSolid')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagTypeScript')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagCssModules')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagVite')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagVelvetUi')}
                </Text>
              </Marquee>
              <Marquee speed={25} direction="right">
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagEslint')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagPrettier')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagVitest')}
                </Text>
                <Text as="span" variant="labelMd" class="marqueeTag">
                  {t('demo.text.dataDisplay.marquee.tagPostcss')}
                </Text>
              </Marquee>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>{t('demo.text.dataDisplay.marquee.meta')}</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-charts'}>
        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.scoreRing.title')}
          subtitle={t('demo.showcase.dataDisplay.scoreRing.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="row">
                <ScoreRing score={92} />
                <ScoreRing score={68} />
                <ScoreRing score={45} />
                <ScoreRing score={22} />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.radarChart.title')}
          subtitle={t('demo.showcase.dataDisplay.radarChart.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <RadarChart
                size={280}
                axes={[
                  { label: t('demo.text.dataDisplay.radar.performance'), key: 'perf' },
                  { label: t('demo.text.dataDisplay.radar.accessibility'), key: 'a11y' },
                  { label: t('demo.text.dataDisplay.radar.bestPractices'), key: 'bp' },
                  { label: 'SEO', key: 'seo' },
                  { label: 'PWA', key: 'pwa' },
                ]}
                datasets={[
                  { label: t('demo.text.dataDisplay.radar.desktop'), values: [92, 88, 95, 80, 60] },
                  { label: t('demo.text.dataDisplay.radar.mobile'), values: [74, 85, 90, 75, 55] },
                ]}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title="ComparisonSelectionBar"
          subtitle={t('demo.recron.showcase.comparisonSelectionBar.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <div class="recronDemoWide recronDemoSurface">
                <ComparisonSelectionBar
                  selectedCount={comparisonSelectionCount()}
                  compareDisabled={comparisonSelectionCount() < 2 || comparisonSelectionCount() > 5}
                  onClear={() => addToast({ type: 'info', message: 'Selection cleared in demo.' })}
                  onCompare={() => setComparisonOpen(true)}
                />
                <ComparisonInsightsDialog
                  open={comparisonOpen()}
                  title={t('demo.recron.offer.comparison.dialog.title')}
                  prompt={t('demo.recron.offer.comparison.dialog.prompt')}
                  isPending={comparisonPending()}
                  hasResult={comparisonReady()}
                  selectionSummary={t('demo.recron.offer.comparison.dialog.selectionSummary')}
                  axes={comparisonAxes}
                  datasets={comparisonDatasets}
                  columns={comparisonColumns}
                  rows={comparisonRows}
                  onClose={handleComparisonClose}
                  onCompare={runComparison}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title={t('demo.showcase.dataDisplay.tradingViewChart.title')}
          subtitle={t('demo.showcase.dataDisplay.tradingViewChart.subtitle')}
        >
          <PreviewPanel>
            <PreviewGroup title={t('demo.text.common.examples')}>
              <TradingViewChart symbol="XAUUSD" />
              <TradingViewChart symbol="XAUUSD custom feed" data={TRADING_VIEW_SAMPLE} height={420} />
              <TradingViewChart
                symbol="XAUUSD polling adapter"
                data={TRADING_VIEW_SAMPLE}
                defaultDrawingTool="trendline"
                liveFeed={pollingFeed}
                drawings={{
                  levels: [{ id: 'lvl-res', price: 2104.5 }],
                  zones: [
                    {
                      id: 'zone-demand',
                      fromTime: asUtcTimestamp(1704672000),
                      toTime: asUtcTimestamp(1704931200),
                      low: 2088,
                      high: 2094,
                    },
                  ],
                }}
                height={460}
              />
              <TradingViewChart
                symbol="XAUUSD websocket adapter"
                data={TRADING_VIEW_SAMPLE}
                liveFeed={wsFeed}
                height={420}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            {renderRichText(t('demo.text.dataDisplay.trading.meta'), {
              pollingFeed: (
                <CodeText as="span" class="codeInline">
                  useTradingViewPollingFeed
                </CodeText>
              ),
              wsFeed: (
                <CodeText as="span" class="codeInline">
                  useTradingViewWsFeed
                </CodeText>
              ),
            })}
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default DataDisplaySection;
