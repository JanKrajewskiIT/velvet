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
        <strong>v0.1.6</strong> - Added Wizard, Stepper, Timeline
      </span>
    ),
  },
  {
    key: '2',
    content: (
      <span>
        <strong>v0.1.4</strong> - Added Accordion, Drawer, Tooltip
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
- Dark / light mode support

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
      <div class="section">
        <h2 class="sectionTitle">Tabs</h2>
        <div class="previewBox">
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
          <div
            style={{
              'padding-top': 'var(--spacing-md)',
              color: 'var(--color-text-muted)',
              'font-size': 'var(--font-size-sm)',
            }}
          >
            Active tab: <strong>{tab()}</strong>
          </div>
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
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Accordion</h2>
        <div class="previewBox">
          <Accordion>
            <AccordionItem title="What is VelvetUI?">
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                VelvetUI is a SolidJS component library built with CSS Modules,
                TypeScript and Vite.
              </p>
            </AccordionItem>
            <AccordionItem title="How to install?">
              <code style={{ 'font-size': 'var(--font-size-sm)' }}>
                npm install @jankrajewskiit/ui
              </code>
            </AccordionItem>
            <AccordionItem title="Disabled item" disabled>
              <p style={{ margin: 0 }}>This content is not accessible.</p>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">SectionCard</h2>
        <div class="previewBox col">
          <SectionCard title="Details" defaultOpen>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
              Collapsible section card - starts open.
            </p>
          </SectionCard>
          <SectionCard title="Advanced options">
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
              Collapsed by default.
            </p>
          </SectionCard>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Table</h2>
        <div class="previewBox">
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
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Pagination</h2>
        <div class="previewBox">
          <Pagination
            page={page()}
            totalPages={19}
            onChange={setPage}
            previousLabel="Previous"
            nextLabel="Next"
            ariaLabel="Table pages"
          />
          <p
            style={{
              'margin-top': 'var(--spacing-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            Current page: <strong>{page()}</strong>
          </p>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Stepper</h2>
        <div class="previewBox">
          <Stepper steps={STEPPER_STEPS} activeStep={activeStep()} />
          <div class="row" style={{ 'margin-top': 'var(--spacing-md)' }}>
            <For each={STEPPER_STEPS}>
              {(s) => (
                <button
                  type="button"
                  onClick={() => setActiveStep(s.value)}
                  style={{
                    padding: '4px 10px',
                    'border-radius': 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background:
                      activeStep() === s.value
                        ? 'var(--color-primary-light)'
                        : 'transparent',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    'font-size': 'var(--font-size-sm)',
                  }}
                >
                  {s.label}
                </button>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Timeline</h2>
        <div class="previewBox">
          <Timeline items={TIMELINE_ITEMS} />
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">ScoreRing</h2>
        <div class="previewBox">
          <div class="row">
            <ScoreRing score={92} />
            <ScoreRing score={68} />
            <ScoreRing score={45} />
            <ScoreRing score={22} />
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">RadarChart</h2>
        <div class="previewBox">
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
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">JsonDisplay</h2>
        <div class="previewBox">
          <JsonDisplay data={SAMPLE_JSON} />
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">MarkdownRenderer</h2>
        <div class="previewBox">
          <MarkdownRenderer content={MARKDOWN} />
        </div>
      </div>
    </div>
  );
};

export default DataDisplaySection;
