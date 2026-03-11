import {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Button,
  type CandleAction,
  CandleActionDiagram,
  type CandleActionLegendItem,
  Carousel,
  DataCard,
  JsonDisplay,
  List,
  ListItem,
  MarkdownRenderer,
  RadarChart,
  ScoreRing,
  SectionCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jankrajewskiit/ui';
import { IoDocumentText, IoFolder, IoImage } from 'solid-icons/io';

import { PreviewPanel, ShowcaseSection } from '../components/ShowcaseSection';

const SAMPLE_JSON = {
  id: 1,
  name: 'VelvetUI',
  version: '0.3.3',
  tags: ['solid-js', 'ui', 'components'],
  meta: { author: 'JanKrajewskiIT', license: 'MIT' },
};

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

const DataDisplaySection = () => {
  return (
    <div>
      <ShowcaseSection title="Accordion" subtitle="Progressive disclosure for grouped content">
        <PreviewPanel>
          <Accordion>
            <AccordionItem title="What is VelvetUI?">
              <p class="mutedText">
                VelvetUI is a SolidJS component library built with CSS Modules, TypeScript and Vite.
              </p>
            </AccordionItem>
            <AccordionItem title="How to install?">
              <span class="codeInline">npm install @jankrajewskiit/ui</span>
            </AccordionItem>
            <AccordionItem title="Disabled item" disabled>
              <p class="mutedText">This content is not accessible.</p>
            </AccordionItem>
          </Accordion>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="SectionCard" subtitle="Collapsible card for grouped settings">
        <PreviewPanel class="col">
          <SectionCard title="Details" defaultOpen>
            <p class="mutedText">Collapsible section card that starts open.</p>
          </SectionCard>
          <SectionCard title="Advanced options">
            <p class="mutedText">Collapsed by default.</p>
          </SectionCard>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Table" subtitle="Composable table primitives">
        <PreviewPanel>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Version</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>solid-js</TableCell>
                <TableCell>1.9.7</TableCell>
                <TableCell>stable</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>vite</TableCell>
                <TableCell>7.3.1</TableCell>
                <TableCell>stable</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>typescript</TableCell>
                <TableCell>5.9.3</TableCell>
                <TableCell>stable</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </PreviewPanel>
      </ShowcaseSection>

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

      <ShowcaseSection title="JsonDisplay" subtitle="Formatted object preview">
        <PreviewPanel>
          <JsonDisplay data={SAMPLE_JSON} />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="MarkdownRenderer" subtitle="Rich markdown output">
        <PreviewPanel>
          <MarkdownRenderer content={MARKDOWN} />
        </PreviewPanel>
      </ShowcaseSection>

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

      <ShowcaseSection title="DataCard" subtitle="Versatile content container with media and actions">
        <PreviewPanel>
          <div class="row">
            <DataCard
              variant="elevated"
              header={<strong>Project Overview</strong>}
              footer={<Button variant="primary">View details</Button>}
            >
              <p class="mutedText">A summary of the current project status and recent activity.</p>
            </DataCard>
            <DataCard variant="outlined" hoverable>
              <p class="mutedText">An outlined hoverable card without header or footer.</p>
            </DataCard>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Carousel" subtitle="Snap-scroll content slider with auto-play">
        <PreviewPanel>
          <Carousel>
            <div style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}>
              Slide 1
            </div>
            <div style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}>
              Slide 2
            </div>
            <div style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}>
              Slide 3
            </div>
            <div style={{ padding: 'var(--spacing-2xl)', 'text-align': 'center', background: 'var(--color-surface)' }}>
              Slide 4
            </div>
          </Carousel>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default DataDisplaySection;
