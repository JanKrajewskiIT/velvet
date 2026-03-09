import { ThemeProvider, ThemeToggle, ToastProvider } from '@jankrajewskiit/ui';
import { createSignal, For, Match, Switch } from 'solid-js';

import ActionsSection from './sections/ActionsSection';
import ComplexSection from './sections/ComplexSection';
import DataDisplaySection from './sections/DataDisplaySection';
import FeedbackSection from './sections/FeedbackSection';
import InputsSection from './sections/InputsSection';
import OverlaysSection from './sections/OverlaysSection';
import StatesSection from './sections/StatesSection';

type SectionId =
  | 'actions'
  | 'inputs'
  | 'feedback'
  | 'overlays'
  | 'data'
  | 'complex'
  | 'states';

interface NavGroup {
  label: string;
  items: Array<{ id: SectionId; label: string }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Primitives',
    items: [
      { id: 'actions', label: 'Actions & Tooltips' },
      { id: 'inputs', label: 'Inputs & Forms' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { id: 'feedback', label: 'Chips, Stats & Toast' },
      { id: 'states', label: 'States & Errors' },
    ],
  },
  {
    label: 'Overlays',
    items: [{ id: 'overlays', label: 'Dialog & Drawer' }],
  },
  {
    label: 'Data',
    items: [{ id: 'data', label: 'Tables, Charts & More' }],
  },
  {
    label: 'Complex',
    items: [{ id: 'complex', label: 'Wizard, FlipCard & Files' }],
  },
];

const PAGE_TITLES: Record<SectionId, { title: string; description: string }> = {
  actions: {
    title: 'Actions & Tooltips',
    description: 'Button variants, icon buttons, tooltips and spinners.',
  },
  inputs: {
    title: 'Inputs & Forms',
    description:
      'Text inputs, selects, autocomplete, tag input, checkbox, switch, radio group, color picker and form layout components.',
  },
  feedback: {
    title: 'Chips, Stats & Toast',
    description:
      'Status chips, tag chips, stat cards, skeleton loaders and toast notifications.',
  },
  overlays: {
    title: 'Dialog & Drawer',
    description: 'Modal dialogs, confirm dialogs and slide-in drawers.',
  },
  data: {
    title: 'Tables, Charts & More',
    description:
      'Tabs, accordion, section cards, tables, pagination, stepper, timeline, score ring, radar chart, JSON display and Markdown renderer.',
  },
  complex: {
    title: 'Wizard, FlipCard & Files',
    description:
      'Multi-step wizard, flip cards and drag-and-drop file drop zone.',
  },
  states: {
    title: 'States & Errors',
    description:
      'Loading containers, empty states, error messages and error fallback pages.',
  },
};

const AppContent = () => {
  const [activeSection, setActiveSection] = createSignal<SectionId>('actions');

  const meta = () => PAGE_TITLES[activeSection()];

  return (
    <div class="layout">
      <nav class="sidebar" aria-label="Component categories">
        <div class="sidebarLogo">
          <p class="sidebarTitle">VelvetUI</p>
          <p class="sidebarSubtitle">Component showcase</p>
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
          <h1 class="pageTitle">{meta().title}</h1>
          <p class="pageDescription">{meta().description}</p>
        </div>

        <Switch>
          <Match when={activeSection() === 'actions'}>
            <ActionsSection />
          </Match>
          <Match when={activeSection() === 'inputs'}>
            <InputsSection />
          </Match>
          <Match when={activeSection() === 'feedback'}>
            <FeedbackSection />
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
          <Match when={activeSection() === 'states'}>
            <StatesSection />
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
