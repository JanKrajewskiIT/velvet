import { ThemeProvider, ThemeToggle, ToastProvider } from '@jankrajewskiit/ui';
import { createSignal, For, Match, Switch } from 'solid-js';

import AppSection from './sections/AppSection';
import CompositesSection from './sections/CompositesSection';
import DataDisplaySection from './sections/DataDisplaySection';
import DeveloperSection from './sections/DeveloperSection';
import FeedbackSection from './sections/FeedbackSection';
import FormsSection from './sections/FormsSection';
import InputsSection from './sections/InputsSection';
import LayoutSection from './sections/LayoutSection';
import NavigationSection from './sections/NavigationSection';
import OverlaysSection from './sections/OverlaysSection';
import OverviewSection from './sections/OverviewSection';

type SectionId =
  | 'overview'
  | 'inputs'
  | 'forms'
  | 'data-display'
  | 'navigation'
  | 'feedback'
  | 'overlays'
  | 'layout'
  | 'composites'
  | 'app'
  | 'developer';

interface NavGroup {
  label: string;
  items: Array<{ id: SectionId; label: string }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Getting Started',
    items: [{ id: 'overview', label: 'Overview and Installation' }],
  },
  {
    label: 'Inputs',
    items: [{ id: 'inputs', label: 'Buttons, Controls and Fields' }],
  },
  {
    label: 'Forms',
    items: [{ id: 'forms', label: 'Form Layout and Structure' }],
  },
  {
    label: 'Data Display',
    items: [{ id: 'data-display', label: 'Tables, Charts and Content' }],
  },
  {
    label: 'Navigation',
    items: [{ id: 'navigation', label: 'Tabs, Stepper and Pagination' }],
  },
  {
    label: 'Feedback',
    items: [{ id: 'feedback', label: 'States, Chips and Toast' }],
  },
  {
    label: 'Overlays',
    items: [{ id: 'overlays', label: 'Dialogs, Drawers and Tooltips' }],
  },
  {
    label: 'Layout',
    items: [{ id: 'layout', label: 'App Shell and Theme' }],
  },
  {
    label: 'Composites',
    items: [{ id: 'composites', label: 'Wizard, AI Panel and More' }],
  },
  {
    label: 'App-Specific',
    items: [{ id: 'app', label: 'Auth and Locale Helpers' }],
  },
  {
    label: 'Developer Docs',
    items: [{ id: 'developer', label: 'Setup, Tooling and Snippets' }],
  },
];

const PAGE_TITLES: Record<SectionId, { title: string; description: string }> = {
  overview: {
    title: 'VelvetUI Overview',
    description: 'Start here for installation, library goals and a quick snapshot of what is included.',
  },
  inputs: {
    title: 'Inputs',
    description:
      'Buttons, icon buttons, text fields, selects, autocomplete, tag input, checkbox, switch, radio, color picker and dropdown menus.',
  },
  forms: {
    title: 'Forms',
    description: 'Form layout primitives: field wrappers, responsive grids and action rows.',
  },
  'data-display': {
    title: 'Data Display',
    description: 'Tables, accordion, section cards, score rings, radar charts, JSON display and Markdown renderer.',
  },
  navigation: {
    title: 'Navigation',
    description: 'Tabs, stepper, pagination and timeline for navigating between views and steps.',
  },
  feedback: {
    title: 'Feedback',
    description:
      'Chips, stat cards, skeleton loaders, spinners, toast notifications, loading states, empty states and error handling.',
  },
  overlays: {
    title: 'Overlays',
    description: 'Modal dialogs, confirm dialogs, confirm actions, drawers, tooltips and markdown edit dialog.',
  },
  layout: {
    title: 'Layout',
    description: 'App shell composition with Navbar, MainLayout, Footer and ThemeToggle.',
  },
  composites: {
    title: 'Composites',
    description: 'Multi-step wizard, AI result panel, editable collections, file drop zone and flip cards.',
  },
  app: {
    title: 'App-Specific',
    description: 'Locale switcher, authentication redirect and authorization gate helpers.',
  },
  developer: {
    title: 'Developer Technical Docs',
    description: 'Ready-to-copy setup, tooling presets and integration snippets based on the package README.',
  },
};

const AppContent = () => {
  const [activeSection, setActiveSection] = createSignal<SectionId>('overview');

  const meta = () => PAGE_TITLES[activeSection()];

  return (
    <div class="layout">
      <nav class="sidebar" aria-label="Component categories">
        <div class="sidebarLogo">
          <span class="sidebarBadge">VelvetUi library</span>
          <p class="sidebarTitle">VelvetUI</p>
          <p class="sidebarSubtitle">Modern SolidJS component showcase</p>
        </div>

        <For each={NAV_GROUPS}>
          {(group) => (
            <div class="sidebarGroup">
              <p class="sidebarGroupLabel">{group.label}</p>
              <For each={group.items}>
                {(item) => (
                  <button
                    type="button"
                    class={`sidebarItem${activeSection() === item.id ? ' sidebarItemActive' : ''}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    {item.label}
                  </button>
                )}
              </For>
            </div>
          )}
        </For>
      </nav>

      <main class="main">
        <div class="pageHeader">
          <p class="pageEyebrow">Component playground</p>
          <h1 class="pageTitle">{meta().title}</h1>
          <p class="pageDescription">{meta().description}</p>
        </div>

        <Switch>
          <Match when={activeSection() === 'overview'}>
            <OverviewSection />
          </Match>
          <Match when={activeSection() === 'inputs'}>
            <InputsSection />
          </Match>
          <Match when={activeSection() === 'forms'}>
            <FormsSection />
          </Match>
          <Match when={activeSection() === 'data-display'}>
            <DataDisplaySection />
          </Match>
          <Match when={activeSection() === 'navigation'}>
            <NavigationSection />
          </Match>
          <Match when={activeSection() === 'feedback'}>
            <FeedbackSection />
          </Match>
          <Match when={activeSection() === 'overlays'}>
            <OverlaysSection />
          </Match>
          <Match when={activeSection() === 'layout'}>
            <LayoutSection />
          </Match>
          <Match when={activeSection() === 'composites'}>
            <CompositesSection />
          </Match>
          <Match when={activeSection() === 'app'}>
            <AppSection />
          </Match>
          <Match when={activeSection() === 'developer'}>
            <DeveloperSection />
          </Match>
        </Switch>
      </main>

      <div class="themeToggleBar">
        <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider closeLabel="Close notification">
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
