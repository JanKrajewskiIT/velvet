import { ThemeProvider, ThemeToggle, ToastProvider } from '@jankrajewskiit/ui';
import { createSignal, For, Match, Switch } from 'solid-js';

import ActionsSection from './sections/ActionsSection';
import ComplexSection from './sections/ComplexSection';
import DataDisplaySection from './sections/DataDisplaySection';
import DeveloperSection from './sections/DeveloperSection';
import FeedbackSection from './sections/FeedbackSection';
import InputsSection from './sections/InputsSection';
import LayoutsSection from './sections/LayoutsSection';
import NewComponentsSection from './sections/NewComponentsSection';
import OverlaysSection from './sections/OverlaysSection';
import OverviewSection from './sections/OverviewSection';
import StatesSection from './sections/StatesSection';

type SectionId =
  | 'overview'
  | 'actions'
  | 'inputs'
  | 'layouts'
  | 'feedback'
  | 'states'
  | 'overlays'
  | 'data'
  | 'complex'
  | 'new-components'
  | 'developer';

interface NavGroup {
  label: string;
  items: Array<{ id: SectionId; label: string }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ id: 'overview', label: 'Overview and Installation' }],
  },
  {
    label: 'Actions and Forms',
    items: [
      { id: 'actions', label: 'Actions and Tooltips' },
      { id: 'inputs', label: 'Inputs and Forms' },
    ],
  },
  {
    label: 'Layouts',
    items: [{ id: 'layouts', label: 'Recron App Shell' }],
  },
  {
    label: 'Feedback and States',
    items: [
      { id: 'feedback', label: 'Chips, Stats and Toast' },
      { id: 'states', label: 'States and Errors' },
    ],
  },
  {
    label: 'Overlays',
    items: [{ id: 'overlays', label: 'Dialog and Drawer' }],
  },
  {
    label: 'Data Display',
    items: [{ id: 'data', label: 'Tables, Charts and More' }],
  },
  {
    label: 'Workflows',
    items: [
      { id: 'complex', label: 'Wizard, AI and Files' },
      { id: 'new-components', label: 'New Components Showcase' },
    ],
  },
  {
    label: 'Developer Docs',
    items: [{ id: 'developer', label: 'Technical Docs and Setup' }],
  },
];

const PAGE_TITLES: Record<SectionId, { title: string; description: string }> = {
  overview: {
    title: 'VelvetUI Overview',
    description:
      'Start here for installation, library goals and a quick snapshot of what is included.',
  },
  actions: {
    title: 'Actions and Tooltips',
    description:
      'Buttons, icon buttons, tooltips, locale switcher and action rows.',
  },
  inputs: {
    title: 'Inputs and Forms',
    description:
      'Text inputs, selects, autocomplete, tag input, checkbox, switch, radio group, color picker and form layout components.',
  },
  layouts: {
    title: 'Layouts',
    description:
      'Recron-inspired app shell built from Navbar, MainLayout and Footer composition slots.',
  },
  feedback: {
    title: 'Chips, Stats and Toast',
    description:
      'Status chips, tag chips, stat cards, skeleton loaders and toast notifications.',
  },
  states: {
    title: 'States and Errors',
    description:
      'Loading containers, empty states, error messages and error fallback pages.',
  },
  overlays: {
    title: 'Dialog and Drawer',
    description: 'Modal dialogs, confirm dialogs and slide-in drawers.',
  },
  data: {
    title: 'Tables, Charts and More',
    description:
      'Tabs, accordion, section cards, tables, pagination, stepper, timeline, score ring, radar chart, JSON display and Markdown renderer.',
  },
  complex: {
    title: 'Wizard, AI and Files',
    description:
      'Multi-step wizard, AI result panel, markdown editing, flip cards and drag-and-drop files.',
  },
  'new-components': {
    title: 'New Components',
    description:
      'Interactive demos for ConfirmAction, EditableCollection, AuthRedirect and RequireAuth.',
  },
  developer: {
    title: 'Developer Technical Docs',
    description:
      'Ready-to-copy setup, tooling presets and integration snippets based on the package README.',
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
          <Match when={activeSection() === 'actions'}>
            <ActionsSection />
          </Match>
          <Match when={activeSection() === 'inputs'}>
            <InputsSection />
          </Match>
          <Match when={activeSection() === 'layouts'}>
            <LayoutsSection />
          </Match>
          <Match when={activeSection() === 'feedback'}>
            <FeedbackSection />
          </Match>
          <Match when={activeSection() === 'states'}>
            <StatesSection />
          </Match>
          <Match when={activeSection() === 'overlays'}>
            <OverlaysSection />
          </Match>
          <Match when={activeSection() === 'data'}>
            <DataDisplaySection />
          </Match>
          <Match when={activeSection() === 'complex'}>
            <ComplexSection />
          </Match>
          <Match when={activeSection() === 'new-components'}>
            <NewComponentsSection />
          </Match>
          <Match when={activeSection() === 'developer'}>
            <DeveloperSection />
          </Match>
        </Switch>
      </main>

      <div class="themeToggleBar">
        <ThemeToggle
          lightLabel="Light mode"
          darkLabel="Dark mode"
          groupLabel="Theme"
        />
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
