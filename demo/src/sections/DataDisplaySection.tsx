import {
  Accordion,
  AccordionItem,
  ActionRow,
  Avatar,
  AvatarGroup,
  Button,
  type CandleAction,
  CandleActionDiagram,
  type CandleActionLegendItem,
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
  type TreeNode,
  TreeView,
} from '@jankrajewskiit/ui';
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

const CANDLE_SAMPLE = [
  { open: 98, close: 104, high: 108, low: 95, volume: 180 },
  { open: 104, close: 101, high: 106, low: 99, volume: 140 },
  { open: 101, close: 112, high: 116, low: 100, volume: 220 },
  { open: 112, close: 108, high: 114, low: 105, volume: 170 },
  { open: 108, close: 115, high: 118, low: 106, volume: 240 },
  { open: 115, close: 110, high: 117, low: 109, volume: 160 },
  { open: 110, close: 118, high: 121, low: 109, volume: 260 },
  { open: 118, close: 122, high: 124, low: 116, volume: 210 },
  { open: 122, close: 117, high: 123, low: 115, volume: 190 },
  { open: 117, close: 125, high: 127, low: 116, volume: 280 },
];

const ACTION_SAMPLE: CandleAction[] = [
  { index: 1, type: 'buy', label: 'Buy', strength: 2 },
  { index: 3, type: 'stop-loss', label: 'SL' },
  { index: 4, type: 'take-profit', label: 'TP' },
  { index: 6, type: 'hold', label: 'Hold' },
  { index: 8, type: 'sell', label: 'Sell', strength: 2 },
];

const ACTION_LEGEND: CandleActionLegendItem[] = [
  { type: 'buy', label: 'Buy', description: 'Entry on bullish confirmation.' },
  { type: 'sell', label: 'Sell', description: 'Exit on distribution spike.' },
  { type: 'take-profit', label: 'Take profit', description: 'Target hit and scaled out.' },
  { type: 'stop-loss', label: 'Stop loss', description: 'Risk control below support.' },
  { type: 'hold', label: 'Hold', description: 'No action while trend holds.' },
];

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

const DataDisplaySection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const [selectedNode, setSelectedNode] = createSignal('');
  const [collapsibleOpen, setCollapsibleOpen] = createSignal(false);
  const [editorOpen, setEditorOpen] = createSignal(false);
  const [markdown, setMarkdown] = createSignal(MARKDOWN);

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
        <ShowcaseSection title="TreeView" subtitle="Hierarchical expandable tree">
          <PreviewPanel>
            <TreeView
              nodes={createTreeData()}
              defaultExpanded={['src']}
              selectedId={selectedNode()}
              onSelect={setSelectedNode}
            />
          </PreviewPanel>
          <ShowcaseMeta>
            Selected: <span class="code-inline">{selectedNode() || 'none'}</span>
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

        <ShowcaseSection title="CandleActionDiagram" subtitle="Action markers over candle formations">
          <PreviewPanel class="col">
            <CandleActionDiagram
              candles={CANDLE_SAMPLE}
              actions={ACTION_SAMPLE}
              variant="basic"
              height={220}
              ariaLabel="Basic candle action diagram"
            />
            <CandleActionDiagram
              candles={CANDLE_SAMPLE}
              actions={ACTION_SAMPLE}
              variant="expanded"
              height={240}
              ariaLabel="Expanded candle action diagram"
            />
            <CandleActionDiagram
              candles={CANDLE_SAMPLE}
              actions={ACTION_SAMPLE}
              variant="full"
              legend={ACTION_LEGEND}
              height={280}
              ariaLabel="Full candle action diagram"
            />
          </PreviewPanel>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default DataDisplaySection;
