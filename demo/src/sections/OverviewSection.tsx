import { For } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const STATS = [
  { label: 'Components', value: '58+' },
  { label: 'Categories', value: '9' },
  { label: 'Theme Modes', value: '3' },
  { label: 'Hooks', value: '3' },
  { label: 'Tooling Presets', value: '7' },
];

const OverviewSection = () => {
  return (
    <div>
      <ShowcaseSection title="What is VelvetUI?" subtitle="A reusable SolidJS UI component library">
        <PreviewPanel class="col">
          <p class="muted-text">
            VelvetUI is an app-agnostic component library for SolidJS. It uses TypeScript and CSS Modules, and is
            published as
            <span class="code-inline">@jankrajewskiit/ui</span>.
          </p>

          <ul class="overview-list">
            <li>Works with SolidJS and @solidjs/router as peer dependencies</li>
            <li>Supports light, dark and system theme modes</li>
            <li>Exports component styles as @jankrajewskiit/ui/styles</li>
            <li>
              9 categories: inputs (including form layout), data-display, navigation, feedback, overlays, layout,
              composites and app-specific
            </li>
          </ul>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Installation" subtitle="Install package and required peers">
        <PreviewPanel class="col">
          <pre class="install-block">
            <code>npm install @jankrajewskiit/ui solid-js @solidjs/router</code>
          </pre>

          <ShowcaseMeta>Import styles once in your app entry point:</ShowcaseMeta>

          <pre class="install-block">
            <code>import '@jankrajewskiit/ui/styles';</code>
          </pre>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Library Stats" subtitle="Quick snapshot of the current package scope">
        <div class="page-stats">
          <For each={STATS}>
            {(stat) => (
              <div class="stat-pill">
                <span class="stat-label">{stat.label}</span>
                <span class="stat-value">{stat.value}</span>
              </div>
            )}
          </For>
        </div>
      </ShowcaseSection>
    </div>
  );
};

export default OverviewSection;
