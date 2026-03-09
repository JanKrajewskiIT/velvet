import {
  Accordion,
  AccordionItem,
  JsonDisplay,
  MarkdownRenderer,
  Pagination,
  RadarChart,
  ScoreRing,
  SectionCard,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Timeline,
} from '@jankrajewskiit/ui';
import { createSignal, For } from 'solid-js';

import {
  PreviewPanel,
  ShowcaseMeta,
  ShowcaseSection,
} from '../components/ShowcaseSection';

const SAMPLE_JSON = {
  id: 1,
  name: 'VelvetUI',
  version: '0.1.6',
  tags: ['solid-js', 'ui', 'components'],
  meta: { author: 'JanKrajewskiIT', license: 'MIT' },
};

const TIMELINE_ITEMS = [
  {
    key: '1',
    content: (
      <span>
        <strong>v0.1.6</strong> - Added Wizard, Stepper and Timeline
      </span>
    ),
  },
  {
    key: '2',
    content: (
      <span>
        <strong>v0.1.4</strong> - Added Accordion, Drawer and Tooltip
      </span>
    ),
  },
  {
    key: '3',
    content: (
      <span>
        <strong>v0.1.0</strong> - Initial release
      </span>
    ),
  },
];

const STEPPER_STEPS = [
  { value: 'info', label: 'Info' },
  { value: 'details', label: 'Details' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

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

type TabValue = 'preview' | 'code' | 'props';

const DataDisplaySection = () => {
  const [tab, setTab] = createSignal<TabValue>('preview');
  const [activeStep, setActiveStep] = createSignal('details');
  const [page, setPage] = createSignal(5);

  return (
    <div>
      <ShowcaseSection title="Tabs" subtitle="Underline and segmented variants">
        <PreviewPanel>
          <Tabs<TabValue>
            tabs={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
              { value: 'props', label: 'Props' },
            ]}
            value={tab()}
            onChange={setTab}
            variant="underline"
          />
          <ShowcaseMeta>
            Active tab: <strong>{tab()}</strong>
          </ShowcaseMeta>
          <Tabs<TabValue>
            tabs={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
              { value: 'props', label: 'Props' },
            ]}
            value={tab()}
            onChange={setTab}
            variant="pill"
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Accordion"
        subtitle="Progressive disclosure for grouped content"
      >
        <PreviewPanel>
          <Accordion>
            <AccordionItem title="What is VelvetUI?">
              <p class="mutedText">
                VelvetUI is a SolidJS component library built with CSS Modules,
                TypeScript and Vite.
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

      <ShowcaseSection
        title="SectionCard"
        subtitle="Collapsible card for grouped settings"
      >
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

      <ShowcaseSection title="Pagination" subtitle="Navigate large result sets">
        <PreviewPanel>
          <Pagination
            page={page()}
            totalPages={19}
            onChange={setPage}
            previousLabel="Previous"
            nextLabel="Next"
            ariaLabel="Table pages"
          />
          <ShowcaseMeta>
            Current page: <strong>{page()}</strong>
          </ShowcaseMeta>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Stepper"
        subtitle="Visual progress through ordered steps"
      >
        <PreviewPanel>
          <Stepper steps={STEPPER_STEPS} activeStep={activeStep()} />
          <div class="stepButtons">
            <For each={STEPPER_STEPS}>
              {(s) => (
                <button
                  type="button"
                  class={`miniButton${activeStep() === s.value ? ' miniButtonActive' : ''}`}
                  onClick={() => setActiveStep(s.value)}
                >
                  {s.label}
                </button>
              )}
            </For>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Timeline"
        subtitle="Chronological list of releases"
      >
        <PreviewPanel>
          <Timeline items={TIMELINE_ITEMS} />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="ScoreRing"
        subtitle="Circular score visualization"
      >
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
    </div>
  );
};

export default DataDisplaySection;
