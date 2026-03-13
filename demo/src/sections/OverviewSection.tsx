import { CodeText, Heading, Text } from '@jankrajewskiit/ui';
import { For } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const STATS = [
  { label: 'Components', value: '58+' },
  { label: 'Categories', value: '9' },
  { label: 'Theme Modes', value: '3' },
  { label: 'Hooks', value: '3' },
  { label: 'Tooling Presets', value: '7' },
];

const OverviewSection = () => {
  return (
    <>
      <ShowcaseSection title="What is VelvetUI?" subtitle="A reusable SolidJS UI component library">
        <PreviewPanel>
          <PreviewGroup title="Core idea">
            <Text as="p" variant="bodySm" tone="muted" class="mutedText">
              VelvetUI is an app-agnostic component library for SolidJS. It uses TypeScript and CSS Modules, and is{' '}
              published as{' '}
              <CodeText as="span" class="codeInline">
                @jankrajewskiit/ui
              </CodeText>
              .
            </Text>
          </PreviewGroup>

          <PreviewGroup title="Highlights" subtitle="What you get out of the box">
            <ul class="overviewList">
              <li>Works with SolidJS and @solidjs/router as peer dependencies</li>
              <li>Supports light, dark and system theme modes</li>
              <li>Exports component styles as @jankrajewskiit/ui/styles</li>
              <li>
                9 categories: inputs (including form layout), data-display, navigation, feedback, overlays, layout,
                composites and app-specific
              </li>
            </ul>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Installation" subtitle="Install package and required peers">
        <PreviewPanel>
          <PreviewGroup title="Install dependencies">
            <CodeText as="pre" variant="block" size="md" class="installBlock">
              npm install @jankrajewskiit/ui solid-js @solidjs/router
            </CodeText>
          </PreviewGroup>

          <PreviewGroup title="Import styles">
            <CodeText as="pre" variant="block" size="md" class="installBlock">
              import '@jankrajewskiit/ui/styles';
            </CodeText>
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>Import styles once in your app entry point:</ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="Library Stats" subtitle="Quick snapshot of the current package scope">
        <PreviewPanel>
          <PreviewGroup title="Current package shape">
            <div class="pageStats">
              <For each={STATS}>
                {(stat) => (
                  <div class="statPill">
                    <Text as="span" variant="overline" tone="tertiary" class="stat-label">
                      {stat.label}
                    </Text>
                    <Heading as="span" level={4} variant="titleLg" class="stat-value">
                      {stat.value}
                    </Heading>
                  </div>
                )}
              </For>
            </div>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>
    </>
  );
};

export default OverviewSection;
