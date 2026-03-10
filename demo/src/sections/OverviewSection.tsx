import { For } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const STATS = [
  { label: 'Components', value: '58+' },
  { label: 'Categories', value: '9' },
  { label: 'Theme Modes', value: '3' },
  { label: 'Hooks', value: '2' },
  { label: 'Tooling Presets', value: '7' },
];

const OverviewSection = () => {
  return (
    <div>
      <ShowcaseSection title="What is VelvetUI?" subtitle="A reusable SolidJS UI component library">
        <PreviewPanel class="col">
          <p class="mutedText">
            VelvetUI is an app-agnostic component library for SolidJS. It uses TypeScript and CSS Modules, and is
            published as
            <span class="codeInline">@jankrajewskiit/ui</span>.
          </p>

          <ul class="overviewList">
            <li>Works with SolidJS and @solidjs/router as peer dependencies</li>
            <li>Supports light, dark and system theme modes</li>
            <li>Exports component styles as @jankrajewskiit/ui/styles</li>
            <li>
              9 categories: inputs, forms, data-display, navigation, feedback, overlays, layout, composites and
              app-specific
            </li>
          </ul>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Installation" subtitle="Install package and required peers">
        <PreviewPanel class="col">
          <pre class="installBlock">
            <code>npm install @jankrajewskiit/ui solid-js @solidjs/router</code>
          </pre>

          <ShowcaseMeta>Import styles once in your app entry point:</ShowcaseMeta>

          <pre class="installBlock">
            <code>import '@jankrajewskiit/ui/styles';</code>
          </pre>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Library Stats" subtitle="Quick snapshot of the current package scope">
        <div class="pageStats">
          <For each={STATS}>
            {(stat) => (
              <div class="statPill">
                <span class="statLabel">{stat.label}</span>
                <span class="statValue">{stat.value}</span>
              </div>
            )}
          </For>
        </div>
      </ShowcaseSection>
    </div>
  );
};

export default OverviewSection;
