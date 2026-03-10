import {
  Accordion,
  AccordionItem,
  JsonDisplay,
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
