import { ThemeProvider, ThemeToggle, ToastProvider } from '@jankrajewskiit/ui';
import { createSignal, For, Match, Switch } from 'solid-js';

import CompositesSection from './sections/CompositesSection';
import DataDisplaySection from './sections/DataDisplaySection';
import DeveloperSection from './sections/DeveloperSection';
import FeedbackSection from './sections/FeedbackSection';
import InputsSection from './sections/InputsSection';
import LayoutSection from './sections/LayoutSection';
import NavigationSection from './sections/NavigationSection';
import OverlaysSection from './sections/OverlaysSection';
import OverviewSection from './sections/OverviewSection';
import TablesSection from './sections/TablesSection';

export type SectionId =
  | 'overview'
  | 'developer'
  | 'inputs-buttons'
  | 'inputs-dropdowns'
  | 'inputs-fields'
  | 'inputs-controls'
  | 'inputs-datetime'
  | 'inputs-other'
  | 'inputs-form-layout'
  | 'data-content'
  | 'data-cards'
  | 'data-media'
  | 'data-charts'
  | 'data-tables'
  | 'data-lists'
  | 'data-tree'
  | 'nav-tabs-stepper'
  | 'nav-breadcrumbs'
  | 'nav-timeline'
  | 'nav-command-fab'
  | 'nav-mobile'
  | 'feedback-badges-chips'
  | 'feedback-progress'
  | 'feedback-alerts'
  | 'feedback-states'
  | 'overlays-tooltips'
  | 'overlays-dialogs'
  | 'overlays-drawers'
  | 'overlays-context'
  | 'overlays-lightbox'
  | 'layout-shell'
  | 'layout-sidebar'
  | 'composites-lists'
  | 'composites-wizard-ai';

interface NavGroup {
  label: string;
  items: Array<{ id: SectionId; label: string }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview and Installation' },
      { id: 'developer', label: 'Developer and Tooling' },
    ],
  },
  {
    label: 'Layout & Navigation',
    items: [
      { id: 'layout-shell', label: 'App shell' },
      { id: 'layout-sidebar', label: 'Sidebar & utilities' },
      { id: 'nav-tabs-stepper', label: 'Tabs & Stepper' },
      { id: 'nav-timeline', label: 'Timeline' },
      { id: 'nav-command-fab', label: 'Command palette & FAB' },
      { id: 'nav-mobile', label: 'Mobile nav & Back to top' },
    ],
  },
  {
    label: 'Inputs & Forms',
    items: [
      { id: 'inputs-buttons', label: 'Buttons & toggles' },
      { id: 'inputs-fields', label: 'Text & search' },
      { id: 'inputs-controls', label: 'Selectors & pickers' },
      { id: 'inputs-dropdowns', label: 'Dropdowns & autocomplete' },
      { id: 'inputs-datetime', label: 'Date & time' },
      { id: 'inputs-other', label: 'File & upload' },
      { id: 'inputs-form-layout', label: 'Form layout' },
    ],
  },
  {
    label: 'Data Display',
    items: [
      { id: 'data-content', label: 'Content & code' },
      { id: 'data-lists', label: 'Lists' },
      { id: 'data-tree', label: 'Tree' },
      { id: 'data-cards', label: 'Cards & collapsible' },
      { id: 'data-media', label: 'Media & galleries' },
      { id: 'data-charts', label: 'Charts' },
      { id: 'data-tables', label: 'Tables & pagination' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { id: 'feedback-badges-chips', label: 'Badges, chips & stats' },
      { id: 'feedback-progress', label: 'Progress & loading' },
      { id: 'feedback-alerts', label: 'Alerts, banners & toasts' },
      { id: 'feedback-states', label: 'States & empty pages' },
    ],
  },
  {
    label: 'Overlays',
    items: [
      { id: 'overlays-tooltips', label: 'Tooltip & Popover' },
      { id: 'overlays-dialogs', label: 'Dialogs & confirm' },
      { id: 'overlays-drawers', label: 'Drawers & sheets' },
      { id: 'overlays-context', label: 'Context menu' },
      { id: 'overlays-lightbox', label: 'Lightbox & tours' },
    ],
  },
  {
    label: 'Composites & Flows',
    items: [
      { id: 'composites-lists', label: 'Transfer & editable list' },
      { id: 'composites-wizard-ai', label: 'Wizard & AI panel' },
    ],
  },
];

const PAGE_TITLES: Record<SectionId, { title: string; description: string }> = {
  overview: {
    title: 'VelvetUI Overview',
    description: 'Start here for installation, library goals and a quick snapshot of what is included.',
  },
  developer: {
    title: 'Developer & Tooling',
    description:
      'ESLint, Prettier, Stylelint, TypeScript, Vite, lint-staged and Husky presets plus usage snippets and design principles.',
  },
  'inputs-buttons': {
    title: 'Inputs & Forms · Buttons & toggles',
    description: 'Button, IconButton, ActionRow, CopyButton, LocaleSwitcher and ThemeToggle.',
  },
  'inputs-dropdowns': {
    title: 'Inputs & Forms · Dropdowns & autocomplete',
    description: 'DropdownButton, DropdownMenu, Autocomplete and Select for searchable menus and option selection.',
  },
  'inputs-fields': {
    title: 'Inputs & Forms · Text & search',
    description:
      'Input, PasswordInput, TextArea, SearchInput, TagInput, OtpInput and NumberInput for text, numeric entry and search.',
  },
  'inputs-controls': {
    title: 'Inputs & Forms · Selectors & pickers',
    description:
      'Checkbox, Switch, RadioGroup, SegmentedControl, Slider, Rating and ColorPicker for on/off, choice and scoring controls.',
  },
  'inputs-datetime': {
    title: 'Inputs & Forms · Date & time',
    description: 'DatePicker, DateRangePicker and TimePicker for calendar-driven date and time selection.',
  },
  'inputs-other': {
    title: 'Inputs & Forms · File & upload',
    description: 'FileDropZone and FileInput for drag-and-drop and multi-file upload flows.',
  },
  'inputs-form-layout': {
    title: 'Inputs & Forms · Form layout',
    description: 'FormField, FormGrid, FormLayout and ActionRow for structured and responsive form pages.',
  },
  'data-content': {
    title: 'Data Display · Content & code',
    description:
      'Kbd, CodeBlock, MarkdownRenderer and MarkdownEditDialog for documentation, code snippets and markdown editing.',
  },
  'data-cards': {
    title: 'Data Display · Cards & collapsible',
    description:
      'Accordion, SectionCard, Collapsible, DataCard and FlipCard for grouped, collapsible and interactive card layouts.',
  },
  'data-media': {
    title: 'Data Display · Media & galleries',
    description: 'Avatar, AvatarGroup, Carousel, ImageGrid and Marquee for people, galleries and ticker-style content.',
  },
  'data-charts': {
    title: 'Data Display · Charts',
    description: 'ScoreRing, RadarChart and TradingViewChart for data visualization.',
  },
  'data-tables': {
    title: 'Data Display · Tables & pagination',
    description:
      'Table primitives, DataTable with sorting and pagination plus standalone Pagination for lists and grids.',
  },
  'data-lists': {
    title: 'Data Display · Lists',
    description: 'List and ListItem for structured rows with icons, secondary text and inline actions.',
  },
  'data-tree': {
    title: 'Data Display · Tree',
    description: 'TreeView for hierarchical expandable tree navigation.',
  },
  'nav-tabs-stepper': {
    title: 'Layout & Navigation · Tabs, Stepper & Breadcrumbs',
    description:
      'Tabs, Stepper and Breadcrumbs for switching views, visualizing progress and showing hierarchical paths.',
  },
  'nav-timeline': {
    title: 'Layout & Navigation · Timeline',
    description: 'Timeline for chronological list of events.',
  },
  'nav-command-fab': {
    title: 'Layout & Navigation · Command palette & FAB',
    description: 'CommandPalette for keyboard-driven search and SpeedDial for floating primary actions.',
  },
  'nav-mobile': {
    title: 'Layout & Navigation · Mobile nav & Back to top',
    description: 'BottomNav for mobile navigation bars and BackToTop for long-scrolling layouts.',
  },
  'feedback-badges-chips': {
    title: 'Feedback · Badges, chips & stats',
    description: 'Badge, Chip, TagChip and StatCard for status, filters and compact KPI summaries.',
  },
  'feedback-progress': {
    title: 'Feedback · Progress & loading',
    description: 'Progress, CircularProgress, Countdown, Spinner, Skeleton and LoadingContainer.',
  },
  'feedback-alerts': {
    title: 'Feedback · Alerts, banners & toasts',
    description: 'Alert, Banner, ErrorMessage and Toast for inline, full-width and global status messages.',
  },
  'feedback-states': {
    title: 'Feedback · States & empty pages',
    description: 'ErrorFallback, EmptyState and AccessDenied for error, zero-data and permission-denied screens.',
  },
  'overlays-tooltips': {
    title: 'Overlays · Tooltip & Popover',
    description: 'Tooltip and Popover for contextual hints and click-triggered floating content around controls.',
  },
  'overlays-dialogs': {
    title: 'Overlays · Dialogs & confirm',
    description: 'Dialog, ConfirmDialog and ConfirmAction for modal workflows and confirmation flows.',
  },
  'overlays-drawers': {
    title: 'Overlays · Drawers & sheets',
    description: 'Drawer and Sheet for slide-in panels from any edge of the viewport.',
  },
  'overlays-context': {
    title: 'Overlays · Context menu',
    description: 'ContextMenu for right-click action menus.',
  },
  'overlays-lightbox': {
    title: 'Overlays · Lightbox & tours',
    description: 'Lightbox for fullscreen image viewer and Tour for step-by-step onboarding spotlights.',
  },
  'layout-shell': {
    title: 'Layout & Navigation · App shell',
    description: 'MainLayout, Navbar and Footer for composing the overall app shell structure.',
  },
  'layout-sidebar': {
    title: 'Layout & Navigation · Sidebar & utilities',
    description: 'Sidebar, ResizablePanel, Divider and AspectRatio for side navigation and split-pane layouts.',
  },
  'composites-lists': {
    title: 'Composites & Flows · Transfer & editable list',
    description: 'TransferList and EditableCollection for moving items between groups and managing dynamic lists.',
  },
  'composites-wizard-ai': {
    title: 'Composites & Flows · Wizard & AI panel',
    description: 'Wizard for guided multi-step flows and AiResultPanel for AI-style result and scoring layouts.',
  },
};

const AppContent = () => {
  const [activeSection, setActiveSection] = createSignal<SectionId>('overview');

  const meta = () => PAGE_TITLES[activeSection()];

  return (
    <div class="layout">
      <nav class="sidebar" aria-label="Component categories">
        <div class="sidebar-logo">
          <span class="sidebar-badge">VelvetUi library</span>
          <p class="sidebar-title">VelvetUI</p>
          <p class="sidebar-subtitle">Modern SolidJS component showcase</p>
        </div>

        <For each={NAV_GROUPS}>
          {(group) => (
            <div class="sidebar-group">
              <p class="sidebar-group-label">{group.label}</p>
              <For each={group.items}>
                {(item) => (
                  <button
                    type="button"
                    class={`sidebar-item${activeSection() === item.id ? ' sidebar-item-active' : ''}`}
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
        <div class="page-header">
          <p class="page-eyebrow">Component playground</p>
          <h1 class="page-title">{meta().title}</h1>
          <p class="page-description">{meta().description}</p>
        </div>

        <Switch>
          <Match when={activeSection() === 'overview'}>
            <OverviewSection />
          </Match>
          <Match when={activeSection() === 'developer'}>
            <DeveloperSection />
          </Match>
          <Match when={activeSection() === 'data-tables'}>
            <TablesSection />
          </Match>
          <Match when={activeSection().startsWith('inputs-')}>
            <InputsSection sectionId={activeSection()} />
          </Match>
          <Match when={activeSection().startsWith('data-')}>
            <DataDisplaySection sectionId={activeSection()} />
          </Match>
          <Match when={activeSection().startsWith('nav-')}>
            <NavigationSection sectionId={activeSection()} />
          </Match>
          <Match when={activeSection().startsWith('feedback-')}>
            <FeedbackSection sectionId={activeSection()} />
          </Match>
          <Match when={activeSection().startsWith('overlays-')}>
            <OverlaysSection sectionId={activeSection()} />
          </Match>
          <Match when={activeSection().startsWith('layout-')}>
            <LayoutSection sectionId={activeSection()} />
          </Match>
          <Match when={activeSection().startsWith('composites-')}>
            <CompositesSection sectionId={activeSection()} />
          </Match>
        </Switch>
      </main>

      <div class="theme-toggle-bar">
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
