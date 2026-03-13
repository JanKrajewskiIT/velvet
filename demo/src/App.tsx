import {
  Heading,
  SidebarNav,
  type SidebarNavGroup,
  Text,
  ThemeProvider,
  ThemeToggle,
  ToastProvider,
} from '@jankrajewskiit/ui';
import { createSignal, Match, Switch } from 'solid-js';

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
import TypographySection from './sections/TypographySection';

export type SectionId =
  | 'overview'
  | 'typography'
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
  | 'nav-bottom-nav'
  | 'nav-back-to-top'
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
  | 'layout-cards'
  | 'composites-lists'
  | 'composites-wizard-ai'
  | 'composites-scheduler';

const NAV_GROUPS: SidebarNavGroup[] = [
  {
    label: 'Start',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'typography', label: 'Typography' },
      { id: 'developer', label: 'Tooling' },
    ],
  },
  {
    label: 'Layout',
    items: [
      { id: 'layout-shell', label: 'Shell & Sidebar' },
      { id: 'layout-sidebar', label: 'Grid & Stack' },
      { id: 'layout-cards', label: 'Cards' },
      { id: 'nav-tabs-stepper', label: 'Breadcrumbs & Tabs & Stepper' },
      { id: 'nav-timeline', label: 'Timeline' },
      { id: 'nav-command-fab', label: 'Palette & FAB' },
      { id: 'nav-bottom-nav', label: 'Bottom nav' },
      { id: 'nav-back-to-top', label: 'Back to top' },
    ],
  },
  {
    label: 'Inputs',
    items: [
      { id: 'inputs-buttons', label: 'Buttons' },
      { id: 'inputs-fields', label: 'Fields' },
      { id: 'inputs-controls', label: 'Controls' },
      { id: 'inputs-dropdowns', label: 'Dropdowns' },
      { id: 'inputs-datetime', label: 'Date & Time' },
      { id: 'inputs-other', label: 'Upload' },
      { id: 'inputs-form-layout', label: 'Form Layout' },
    ],
  },
  {
    label: 'Data',
    items: [
      { id: 'data-content', label: 'Code & Markdown' },
      { id: 'data-lists', label: 'Lists' },
      { id: 'data-tree', label: 'Tree' },
      { id: 'data-cards', label: 'Accordion' },
      { id: 'data-media', label: 'Media' },
      { id: 'data-charts', label: 'Charts' },
      { id: 'data-tables', label: 'Tables' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { id: 'feedback-badges-chips', label: 'Badges & Chips & Stats' },
      { id: 'feedback-progress', label: 'Progress' },
      { id: 'feedback-alerts', label: 'Alerts & Banners & Toasts' },
      { id: 'feedback-states', label: 'Empty States' },
    ],
  },
  {
    label: 'Overlays',
    items: [
      { id: 'overlays-tooltips', label: 'Tooltip & Popover' },
      { id: 'overlays-dialogs', label: 'Dialogs' },
      { id: 'overlays-drawers', label: 'Drawers' },
      { id: 'overlays-context', label: 'Context Menu' },
      { id: 'overlays-lightbox', label: 'Lightbox & Tour' },
    ],
  },
  {
    label: 'Composites',
    items: [
      { id: 'composites-lists', label: 'Transfer & Kanban' },
      { id: 'composites-wizard-ai', label: 'Wizard & AI' },
      { id: 'composites-scheduler', label: 'Scheduler' },
    ],
  },
];

const PAGE_TITLES: Record<SectionId, { title: string; description: string }> = {
  overview: {
    title: 'VelvetUI Overview',
    description: 'Start here for installation, library goals and a quick snapshot of what is included.',
  },
  typography: {
    title: 'Typography',
    description:
      'Semantic heading, text and code primitives built on top of brand typography tokens for consistent UI copy.',
  },
  developer: {
    title: 'Tooling',
    description:
      'ESLint, Prettier, Stylelint, TypeScript, Vite, lint-staged and Husky presets plus usage snippets and design principles.',
  },
  'inputs-buttons': {
    title: 'Inputs & Buttons',
    description: 'Button, AffixButton, IconButton, ActionRow, CopyButton, LocaleSwitcher and ThemeToggle.',
  },
  'inputs-dropdowns': {
    title: 'Inputs & Dropdowns',
    description:
      'DropdownButton, DropdownMenu, Autocomplete, MultiSelect and Select for searchable menus and option selection.',
  },
  'inputs-fields': {
    title: 'Inputs & Fields',
    description:
      'Input, TextArea, NumberInput, SearchInput, PasswordInput, TagInput, OtpInput, InlineEditableText and RichTextEditor.',
  },
  'inputs-controls': {
    title: 'Inputs & Controls',
    description: 'Checkbox, Switch, RadioGroup, SegmentedControl, Slider, RangeSlider, Rating and ColorPicker.',
  },
  'inputs-datetime': {
    title: 'Inputs & Date & Time',
    description: 'DatePicker, DateRangePicker, TimePicker and DateTimePicker for date/time scheduling workflows.',
  },
  'inputs-other': {
    title: 'Inputs & Upload',
    description: 'FileDropZone and FileInput for drag-and-drop and multi-file upload flows.',
  },
  'inputs-form-layout': {
    title: 'Inputs & Form Layout',
    description: 'FormField, FormGrid, FormLayout and ActionRow for structured and responsive form pages.',
  },
  'data-content': {
    title: 'Data & Code & Markdown',
    description:
      'Kbd, CodeBlock, MarkdownRenderer and MarkdownEditDialog for documentation, code snippets and markdown editing.',
  },
  'data-cards': {
    title: 'Data & Accordion',
    description: 'Accordion, Collapsible and SectionCard for progressive disclosure and grouped content.',
  },
  'data-media': {
    title: 'Data & Media',
    description: 'Avatar, AvatarGroup, Carousel, ImageGrid and Marquee for people, galleries and ticker-style content.',
  },
  'data-charts': {
    title: 'Data & Charts',
    description: 'ScoreRing, RadarChart and TradingViewChart for data visualization.',
  },
  'data-tables': {
    title: 'Data & Tables',
    description:
      'Table primitives, DataTable v2, ColumnManager and DataGridPro v3 (virtualization, pinning, resizing, selection, visibility, reorder, JSON import/export).',
  },
  'data-lists': {
    title: 'Data & Lists',
    description: 'List and ListItem for structured rows with icons, secondary text and inline actions.',
  },
  'data-tree': {
    title: 'Data & Tree',
    description: 'TreeView v2 with lazy loading, checkbox selection and drag-and-drop tree navigation.',
  },
  'nav-tabs-stepper': {
    title: 'Layout & Breadcrumbs & Tabs & Stepper',
    description:
      'Tabs, Stepper and Breadcrumbs for switching views, visualizing progress and showing hierarchical paths.',
  },
  'nav-breadcrumbs': {
    title: 'Layout & Breadcrumbs',
    description: 'Breadcrumbs for displaying hierarchical location and quick parent navigation.',
  },
  'nav-timeline': {
    title: 'Layout & Timeline',
    description: 'Timeline for chronological list of events.',
  },
  'nav-command-fab': {
    title: 'Layout & Command Palette & FAB',
    description: 'CommandPalette for keyboard-driven navigation and SpeedDial for quick floating actions.',
  },
  'nav-bottom-nav': {
    title: 'Layout & Bottom nav',
    description:
      'BottomNav for mobile navigation bars; use placement container when the bar sits only above main content.',
  },
  'nav-back-to-top': {
    title: 'Layout & Back to top',
    description: 'BackToTop floating control for long-scrolling pages.',
  },
  'feedback-badges-chips': {
    title: 'Feedback & Badges & Chips & Stats',
    description: 'Badge, Chip, TagChip and StatCard for status, filters, tags and compact KPIs.',
  },
  'feedback-progress': {
    title: 'Feedback & Progress',
    description: 'Progress, CircularProgress, Countdown, Spinner, Skeleton and LoadingContainer.',
  },
  'feedback-alerts': {
    title: 'Feedback & Alerts & Banners & Toasts',
    description: 'Alert, Banner, ErrorMessage and Toast for inline, full-width and global status messages.',
  },
  'feedback-states': {
    title: 'Feedback & Empty States',
    description: 'ErrorFallback, EmptyState and AccessDenied for error, zero-data and permission-denied screens.',
  },
  'overlays-tooltips': {
    title: 'Overlays & Tooltip & Popover',
    description: 'Tooltip and Popover for contextual hints and click-triggered floating content around controls.',
  },
  'overlays-dialogs': {
    title: 'Overlays & Dialogs',
    description: 'Dialog, ConfirmDialog and ConfirmAction for modal workflows and confirmation flows.',
  },
  'overlays-drawers': {
    title: 'Overlays & Drawers',
    description: 'Drawer and Sheet for slide-in panels from any edge of the viewport.',
  },
  'overlays-context': {
    title: 'Overlays & Context Menu',
    description: 'ContextMenu for right-click action menus.',
  },
  'overlays-lightbox': {
    title: 'Overlays & Lightbox & Tour',
    description: 'Lightbox for fullscreen image viewer and Tour for step-by-step onboarding spotlights.',
  },
  'layout-shell': {
    title: 'Layout & Shell & Sidebar',
    description:
      'Navbar, MainLayout, Footer and Sidebar for page shells, side navigation and composition-friendly layouts.',
  },
  'layout-sidebar': {
    title: 'Layout & Grid & Stack',
    description: 'Grid, Stack, ResizablePanel and Divider for composition-friendly layouts.',
  },
  'layout-cards': {
    title: 'Layout & Cards',
    description: 'Card, DataCard and FlipCard for content containers and interactive layouts.',
  },
  'composites-lists': {
    title: 'Composites & Transfer & Kanban',
    description:
      'FilterBar, TransferList, EditableCollection and KanbanBoard for filter toolbars, moving items between groups and workflow columns.',
  },
  'composites-wizard-ai': {
    title: 'Composites & Wizard & AI',
    description: 'Wizard for guided multi-step flows and AiResultPanel for AI-style result and scoring layouts.',
  },
  'composites-scheduler': {
    title: 'Composites & Scheduler',
    description: 'Scheduler for month-based planning with multi-day events and drag-and-drop rescheduling.',
  },
};

const AppContent = () => {
  const [activeSection, setActiveSection] = createSignal<SectionId>('overview');

  const meta = () => PAGE_TITLES[activeSection()];

  return (
    <div class="layout">
      <SidebarNav
        groups={NAV_GROUPS}
        activeId={activeSection()}
        onSelect={(id) => setActiveSection(id as SectionId)}
        title="VelvetUI"
        subtitle="Modern SolidJS component showcase"
        navLabel="Component categories"
        actions={
          <div class="themeToggleBar">
            <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" variant="light" />
          </div>
        }
      />

      <main class="main">
        <div class="pageHeader">
          <Text as="p" variant="overline" tone="primary" class="pageEyebrow">
            Component playground
          </Text>
          <Heading level={1} variant="displayMd" class="pageTitle">
            {meta().title}
          </Heading>
          <Text as="p" variant="bodySm" tone="muted" class="pageDescription">
            {meta().description}
          </Text>
        </div>

        <Switch>
          <Match when={activeSection() === 'overview'}>
            <OverviewSection />
          </Match>
          <Match when={activeSection() === 'developer'}>
            <DeveloperSection />
          </Match>
          <Match when={activeSection() === 'typography'}>
            <TypographySection />
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
