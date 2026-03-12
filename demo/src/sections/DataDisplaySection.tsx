import {
  Accordion,
  AccordionItem,
  ActionRow,
  addToast,
  Avatar,
  AvatarGroup,
  Button,
  Carousel,
  CodeBlock,
  Collapsible,
  DataCard,
  FlipCard,
  ImageGrid,
  type ImageGridItem,
  Kbd,
  List,
  ListItem,
  MarkdownEditDialog,
  MarkdownRenderer,
  Marquee,
  RadarChart,
  ScoreRing,
  SectionCard,
  TradingViewChart,
  type TradingViewChartPoint,
  type TreeNode,
  TreeView,
  useTradingViewPollingFeed,
  useTradingViewWsFeed,
  VirtualizedList,
} from '@jankrajewskiit/ui';
import type { UTCTimestamp } from 'lightweight-charts';
import { IoChevronDown, IoDocumentText, IoFolder, IoImage } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const MARKDOWN = `
## VelvetUI

A **SolidJS** component library with:

- CSS Modules theming
- TypeScript strict mode
- Dark and light mode support

\`\`\`tsx
import { Button } from '@jankrajewskiit/ui';
<Button variant="primary">Click me</Button>
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

const CODE_SAMPLE = `import { Button } from '@jankrajewskiit/ui';

const App = () => {
  return <Button variant="primary">Click me</Button>;
};

export default App;`;

const GALLERY_IMAGES: ImageGridItem[] = [
  { src: 'https://picsum.photos/id/10/400/300', alt: 'Forest', caption: 'Misty forest' },
  { src: 'https://picsum.photos/id/15/400/300', alt: 'Mountains', caption: 'Mountain sunrise' },
  { src: 'https://picsum.photos/id/29/400/300', alt: 'Coast', caption: 'Rocky coastline' },
  { src: 'https://picsum.photos/id/37/400/300', alt: 'Cliff', caption: 'Seaside cliff' },
  { src: 'https://picsum.photos/id/42/400/300', alt: 'Night', caption: 'City at night' },
  { src: 'https://picsum.photos/id/49/400/300', alt: 'Bridge', caption: 'Old bridge' },
];

const VIRTUAL_ITEMS = Array.from({ length: 1200 }, (_, index) => ({
  id: `item-${index + 1}`,
  label: `Virtualized record #${index + 1}`,
  status: index % 3 === 0 ? 'synced' : index % 3 === 1 ? 'queued' : 'draft',
}));

const DataDisplaySection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const [selectedNode, setSelectedNode] = createSignal('');
  const [checkedTreeNodes, setCheckedTreeNodes] = createSignal<string[]>([]);
  const [lastMove, setLastMove] = createSignal('');
  const [collapsibleOpen, setCollapsibleOpen] = createSignal(false);
  const [editorOpen, setEditorOpen] = createSignal(false);
  const [markdown, setMarkdown] = createSignal(MARKDOWN);
  const nextPollingBar = createBarGenerator(asUtcTimestamp(1705017600), 2103.9);
  const nextWsBar = createBarGenerator(asUtcTimestamp(1705017600), 2098.4);

  const pollingFeed = useTradingViewPollingFeed({
    intervalMs: 1800,
    url: 'https://demo.local/trading/poll',
    fetcher: () =>
      Promise.resolve(
        new Response(JSON.stringify(nextPollingBar()), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
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
        <ShowcaseSection title="Kbd" subtitle="Styled keyboard shortcut keys">
          <PreviewPanel>
            <div class="row">
              <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
              <Kbd>⌘</Kbd> + <Kbd>Shift</Kbd> + <Kbd>P</Kbd>
              <Kbd>Esc</Kbd>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="CodeBlock" subtitle="Code display with copy button and line numbers">
          <PreviewPanel class="col">
            <CodeBlock code={CODE_SAMPLE} language="tsx" showLineNumbers copyable />
            <CodeBlock code="npm install @jankrajewskiit/ui" language="bash" />
          </PreviewPanel>
          <ShowcaseMeta>
            Supports <span class="code-inline">showLineNumbers</span> and one-click copy to clipboard.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="MarkdownRenderer" subtitle="Rich markdown output">
          <PreviewPanel>
            <MarkdownRenderer content={MARKDOWN} />
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="MarkdownEditDialog" subtitle="Edit and preview markdown in one flow">
          <PreviewPanel class="col">
            <ActionRow align="start">
              <Button variant="ghost" onClick={() => setEditorOpen(true)}>
                Open markdown editor
              </Button>
            </ActionRow>
            <MarkdownRenderer content={markdown()} />
          </PreviewPanel>
          <MarkdownEditDialog
            open={editorOpen()}
            title="Edit release notes"
            label="Markdown"
            initialValue={markdown()}
            previewLabel="Preview"
            saveLabel="Save changes"
            cancelLabel="Cancel"
            onSave={setMarkdown}
            onClose={() => setEditorOpen(false)}
          />
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-lists'}>
        <ShowcaseSection title="List & ListItem" subtitle="Structured content rows with icons and actions">
          <PreviewPanel class="col">
            <List>
              <ListItem icon={<IoFolder />} secondary="3 files">
                Documents
              </ListItem>
              <ListItem icon={<IoDocumentText />} secondary="Updated yesterday">
                Report.pdf
              </ListItem>
              <ListItem icon={<IoImage />} secondary="Click to preview" onClick={() => {}}>
                Photo.png
              </ListItem>
            </List>
            <List variant="bordered">
              <ListItem icon={<IoFolder />} secondary="Shared folder">
                Projects
              </ListItem>
              <ListItem icon={<IoDocumentText />} secondary="Draft" action={<Button variant="ghost">Edit</Button>}>
                Notes.md
              </ListItem>
            </List>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="VirtualizedList" subtitle="Efficient rendering for long datasets">
          <PreviewPanel class="col">
            <VirtualizedList
              items={VIRTUAL_ITEMS}
              height={320}
              itemHeight={46}
              overscan={6}
              renderItem={(item, index) => (
                <div class="virtual-row">
                  <span class="virtual-label">{item.label}</span>
                  <span class="virtual-meta">
                    #{index + 1} - {item.status}
                  </span>
                </div>
              )}
            />
          </PreviewPanel>
          <ShowcaseMeta>Try fast scrolling: only visible rows are rendered in the DOM.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-cards'}>
        <ShowcaseSection title="Accordion" subtitle="Progressive disclosure for grouped content">
          <PreviewPanel>
            <Accordion>
              <AccordionItem title="What is VelvetUI?">
                <p class="muted-text">
                  VelvetUI is a SolidJS component library built with CSS Modules, TypeScript and Vite.
                </p>
              </AccordionItem>
              <AccordionItem title="How to install?">
                <span class="code-inline">npm install @jankrajewskiit/ui</span>
              </AccordionItem>
              <AccordionItem title="Disabled item" disabled>
                <p class="muted-text">This content is not accessible.</p>
              </AccordionItem>
            </Accordion>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="SectionCard" subtitle="Collapsible card for grouped settings">
          <PreviewPanel class="col">
            <SectionCard title="Details" defaultOpen>
              <p class="muted-text">Collapsible section card that starts open.</p>
            </SectionCard>
            <SectionCard title="Advanced options">
              <p class="muted-text">Collapsed by default.</p>
            </SectionCard>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Collapsible" subtitle="Simple expand and collapse">
          <PreviewPanel class="col">
            <Collapsible
              open={collapsibleOpen()}
              onToggle={() => setCollapsibleOpen((prev) => !prev)}
              trigger={
                <span class="row" style={{ gap: 'var(--spacing-xs)' }}>
                  <IoChevronDown size={16} />
                  <span>{collapsibleOpen() ? 'Hide details' : 'Show details'}</span>
                </span>
              }
            >
              <p class="muted-text">
                This content is revealed when the trigger is clicked. Use Collapsible for simple toggle patterns that do
                not need accordion grouping.
              </p>
            </Collapsible>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="DataCard" subtitle="Versatile content container with media and actions">
          <PreviewPanel>
            <div class="row">
              <DataCard
                variant="elevated"
                header={<strong>Project Overview</strong>}
                footer={<Button variant="primary">View details</Button>}
              >
                <p class="muted-text">A summary of the current project status and recent activity.</p>
              </DataCard>
              <DataCard variant="outlined" hoverable>
                <p class="muted-text">An outlined hoverable card without header or footer.</p>
              </DataCard>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="FlipCard" subtitle="Interactive front/back card">
          <PreviewPanel>
            <div class="flip-card-grid">
              <FlipCard
                width="220px"
                height="140px"
                front={
                  <div class="flip-card-face">
                    <strong class="flip-card-title">VelvetUI</strong>
                    <span class="flip-card-hint">Click to flip</span>
                  </div>
                }
                back={
                  <div class="flip-card-back">
                    <strong>SolidJS plus Vite</strong>
                    <span class="flip-card-hint">TypeScript and CSS Modules</span>
                  </div>
                }
              />
              <FlipCard
                width="220px"
                height="140px"
                front={<div class="flip-card-face">UI System</div>}
                back={<div class="flip-card-simple">Dark and light theme</div>}
              />
            </div>
          </PreviewPanel>
          <ShowcaseMeta>Click a card to flip it.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-tree'}>
        <ShowcaseSection title="TreeView" subtitle="Hierarchical tree with lazy loading, checkboxes and drag and drop">
          <PreviewPanel>
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
              onMove={(draggedId, targetId) => {
                setLastMove(`${draggedId} -> ${targetId}`);
                addToast({ type: 'info', message: `Moved ${draggedId} to ${targetId}` });
              }}
            />
          </PreviewPanel>
          <ShowcaseMeta>
            Selected: <span class="code-inline">{selectedNode() || 'none'}</span> | Checked:{' '}
            <span class="code-inline">{checkedTreeNodes().length}</span> | Last move:{' '}
            <span class="code-inline">{lastMove() || 'none'}</span>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-media'}>
        <ShowcaseSection title="Avatar & AvatarGroup" subtitle="User identity with image, initials or icon fallback">
          <PreviewPanel class="col">
            <div class="row">
              <Avatar src="https://i.pravatar.cc/150?u=a" alt="User photo" />
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
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Carousel" subtitle="Snap-scroll content slider">
          <PreviewPanel>
            <Carousel>
              <div
                style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}
              >
                Slide 1
              </div>
              <div
                style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}
              >
                Slide 2
              </div>
              <div
                style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}
              >
                Slide 3
              </div>
              <div
                style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}
              >
                Slide 4
              </div>
            </Carousel>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Carousel with auto-play and dots" subtitle="Auto-advance and dot indicators">
          <PreviewPanel>
            <Carousel autoPlay interval={4000} showDots showArrows>
              <div
                style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}
              >
                Auto slide 1
              </div>
              <div
                style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}
              >
                Auto slide 2
              </div>
              <div
                style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}
              >
                Auto slide 3
              </div>
            </Carousel>
          </PreviewPanel>
          <ShowcaseMeta>
            <span class="code-inline">autoPlay</span> with <span class="code-inline">interval</span> (ms). Pauses on
            hover. <span class="code-inline">showDots</span> and <span class="code-inline">showArrows</span>{' '}
            configurable.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="ImageGrid" subtitle="CSS Grid image gallery">
          <PreviewPanel>
            <ImageGrid images={GALLERY_IMAGES} columns={3} hoverable rounded />
          </PreviewPanel>
          <ShowcaseMeta>
            Configurable columns, gap, rounded corners and hover effects. Supports optional captions.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Marquee" subtitle="Infinite scrolling ticker">
          <PreviewPanel class="col">
            <Marquee speed={20}>
              <span style={{ padding: '0 var(--spacing-lg)' }}>SolidJS</span>
              <span style={{ padding: '0 var(--spacing-lg)' }}>TypeScript</span>
              <span style={{ padding: '0 var(--spacing-lg)' }}>CSS Modules</span>
              <span style={{ padding: '0 var(--spacing-lg)' }}>Vite</span>
              <span style={{ padding: '0 var(--spacing-lg)' }}>VelvetUI</span>
            </Marquee>
            <Marquee speed={25} direction="right">
              <span style={{ padding: '0 var(--spacing-lg)' }}>ESLint</span>
              <span style={{ padding: '0 var(--spacing-lg)' }}>Prettier</span>
              <span style={{ padding: '0 var(--spacing-lg)' }}>Vitest</span>
              <span style={{ padding: '0 var(--spacing-lg)' }}>PostCSS</span>
            </Marquee>
          </PreviewPanel>
          <ShowcaseMeta>Pauses on hover. Supports left and right directions with configurable speed.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'data-charts'}>
        <ShowcaseSection title="ScoreRing" subtitle="Circular score visualization">
          <PreviewPanel>
            <div class="row">
              <ScoreRing score={92} />
              <ScoreRing score={68} />
              <ScoreRing score={45} />
              <ScoreRing score={22} />
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="RadarChart" subtitle="Multi-axis data comparison">
          <PreviewPanel>
            <RadarChart
              size={280}
              axes={[
                { label: 'Performance', key: 'perf' },
                { label: 'Accessibility', key: 'a11y' },
                { label: 'Best Practices', key: 'bp' },
                { label: 'SEO', key: 'seo' },
                { label: 'PWA', key: 'pwa' },
              ]}
              datasets={[
                { label: 'Desktop', values: [92, 88, 95, 80, 60] },
                { label: 'Mobile', values: [74, 85, 90, 75, 55] },
              ]}
            />
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection
          title="TradingViewChart"
          subtitle="Advanced candlestick chart with intervals, OHLC and overlays"
        >
          <PreviewPanel class="col">
            <TradingViewChart symbol="XAUUSD" />
            <TradingViewChart symbol="XAUUSD custom feed" data={TRADING_VIEW_SAMPLE} height={420} />
            <TradingViewChart
              symbol="XAUUSD polling adapter"
              data={TRADING_VIEW_SAMPLE}
              defaultDrawingTool="trendline"
              liveFeed={pollingFeed}
              drawings={{
                levels: [{ id: 'lvl-res', price: 2104.5, label: 'Resistance' }],
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
          </PreviewPanel>
          <ShowcaseMeta>
            Includes interval switching, volume, SMA/EMA plus RSI/MACD/BB, drawing tools (trend/level/zone) and live
            feed API via polling or websocket callbacks. This demo uses helper hooks{' '}
            <span class="code-inline">useTradingViewPollingFeed</span> and{' '}
            <span class="code-inline">useTradingViewWsFeed</span>.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default DataDisplaySection;
