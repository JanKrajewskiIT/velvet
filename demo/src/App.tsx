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
  | 'inputs-switchers'
  | 'inputs-dropdowns'
  | 'inputs-fields'
  | 'inputs-pickers'
  | 'inputs-datetime'
  | 'inputs-other'
  | 'inputs-form-layout'
  | 'data-content'
  | 'data-media'
  | 'data-charts'
  | 'data-tables'
  | 'data-lists'
  | 'data-filters'
  | 'data-timeline'
  | 'data-tree'
  | 'nav-navbar'
  | 'nav-sidebars'
  | 'nav-breadcrumbs'
  | 'nav-stepper'
  | 'nav-tabs'
  | 'nav-pagination'
  | 'nav-speed-dial'
  | 'nav-bottom-nav'
  | 'nav-back-to-top'
  | 'feedback-badges-chips'
  | 'feedback-progress'
  | 'feedback-alerts'
  | 'feedback-states'
  | 'overlays-tooltips'
  | 'overlays-dialogs'
  | 'overlays-sheets'
  | 'overlays-context'
  | 'overlays-lightbox'
  | 'surfaces-layouts'
  | 'surfaces-main-layout'
  | 'surfaces-collapsible'
  | 'surfaces-cards'
  | 'composites-transfer-list'
  | 'composites-editable-collection'
  | 'composites-kanban-board'
  | 'composites-command-palette'
  | 'composites-wizard'
  | 'composites-ai-result'
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
    label: 'Surfaces',
    items: [
      { id: 'surfaces-layouts', label: 'Layouts' },
      { id: 'surfaces-main-layout', label: 'MainLayout' },
      { id: 'surfaces-collapsible', label: 'Collapsible' },
      { id: 'surfaces-cards', label: 'Cards' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { id: 'nav-navbar', label: 'Navbar' },
      { id: 'nav-sidebars', label: 'Sidebar & SidebarNav' },
      { id: 'nav-breadcrumbs', label: 'Breadcrumbs' },
      { id: 'nav-stepper', label: 'Stepper' },
      { id: 'nav-tabs', label: 'Tabs' },
      { id: 'nav-pagination', label: 'Pagination' },
      { id: 'nav-speed-dial', label: 'Speed Dial (FAB)' },
      { id: 'nav-bottom-nav', label: 'Bottom nav' },
      { id: 'nav-back-to-top', label: 'Back to top' },
    ],
  },
  {
    label: 'Inputs',
    items: [
      { id: 'inputs-buttons', label: 'Buttons' },
      { id: 'inputs-switchers', label: 'Switchers' },
      { id: 'inputs-pickers', label: 'Pickers' },
      { id: 'inputs-dropdowns', label: 'Dropdowns' },
      { id: 'inputs-fields', label: 'Fields' },
      { id: 'inputs-datetime', label: 'Date & Time' },
      { id: 'inputs-other', label: 'Upload' },
      { id: 'inputs-form-layout', label: 'Form Layout' },
    ],
  },
  {
    label: 'Data',
    items: [
      { id: 'data-tables', label: 'Tables' },
      { id: 'data-lists', label: 'Lists' },
      { id: 'data-filters', label: 'Filters' },
      { id: 'data-tree', label: 'Tree' },
      { id: 'data-media', label: 'Media' },
      { id: 'data-charts', label: 'Charts' },
      { id: 'data-timeline', label: 'Timeline' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { id: 'feedback-badges-chips', label: 'Status & Notifications' },
      { id: 'feedback-progress', label: 'Progress' },
      { id: 'feedback-alerts', label: 'Alerts & Banners' },
      { id: 'feedback-states', label: 'Empty States' },
    ],
  },
  {
    label: 'Overlays',
    items: [
      { id: 'overlays-tooltips', label: 'Tooltip & Popover' },
      { id: 'overlays-dialogs', label: 'Dialogs' },
      { id: 'overlays-sheets', label: 'Sheets' },
      { id: 'overlays-context', label: 'Context Menu' },
      { id: 'overlays-lightbox', label: 'Tour' },
    ],
  },
  {
    label: 'Composites',
    items: [
      { id: 'data-content', label: 'Code & Markdown' },
      { id: 'composites-transfer-list', label: 'TransferList' },
      { id: 'composites-editable-collection', label: 'EditableCollection' },
      { id: 'composites-kanban-board', label: 'KanbanBoard' },
      { id: 'composites-command-palette', label: 'Command Palette' },
      { id: 'composites-wizard', label: 'Wizard' },
      { id: 'composites-ai-result', label: 'AI Result Panel' },
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
  'inputs-switchers': {
    title: 'Inputs & Switchers',
    description: 'SegmentedControl, Checkbox, RadioGroup and Switch for binary and exclusive selection patterns.',
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
  'inputs-pickers': {
    title: 'Inputs & Pickers',
    description: 'Slider, RangeSlider, Rating and ColorPicker for scalar, range and palette selection.',
  },
  'inputs-datetime': {
    title: 'Inputs & Date & Time',
    description: 'DatePicker, DateRangePicker, TimePicker and DateTimePicker for date/time scheduling workflows.',
  },
  'inputs-other': {
    title: 'Inputs & Upload',
    description: 'FileDropZone for drag-and-drop single and multi-file upload flows.',
  },
  'inputs-form-layout': {
    title: 'Inputs & Form Layout',
    description: 'FormField, FormGrid, FormLayout and ActionRow for structured and responsive form pages.',
  },
  'data-content': {
    title: 'Composites & Code & Markdown',
    description:
      'CodeBlock, MarkdownRenderer and MarkdownEditDialog for documentation, code snippets and markdown editing.',
  },
  'data-media': {
    title: 'Data & Media',
    description:
      'Avatar, AvatarGroup, Carousel, ImageGrid, Lightbox and Marquee for people, galleries and ticker-style content.',
  },
  'data-charts': {
    title: 'Data & Charts',
    description: 'ScoreRing, RadarChart and TradingViewChart for data visualization.',
  },
  'data-tables': {
    title: 'Data & Tables',
    description:
      'Table primitives, DataTable v2, QueryBuilder, ColumnManager and DataGridPro v3 (virtualization, pinning, resizing, selection, visibility, reorder, JSON import/export).',
  },
  'data-lists': {
    title: 'Data & Lists',
    description: 'List and ListItem for structured rows with icons, secondary text and inline actions.',
  },
  'data-filters': {
    title: 'Data & Filters',
    description: 'FilterBar for combining search queries, structured filters and removable active chips.',
  },
  'data-timeline': {
    title: 'Data & Timeline',
    description: 'Timeline for chronological lists of events, releases and activity history.',
  },
  'data-tree': {
    title: 'Data & Tree',
    description: 'TreeView v2 with lazy loading, checkbox selection and drag-and-drop tree navigation.',
  },
  'nav-navbar': {
    title: 'Navigation & Navbar',
    description: 'Navbar for top-level app navigation with brand, actions and responsive mobile menu.',
  },
  'nav-sidebars': {
    title: 'Navigation & Sidebar & SidebarNav',
    description: 'Sidebar and SidebarNav for nested app navigation and docs-like section menus.',
  },
  'nav-breadcrumbs': {
    title: 'Navigation & Breadcrumbs',
    description: 'Breadcrumbs for displaying hierarchical location and quick parent navigation.',
  },
  'nav-stepper': {
    title: 'Navigation & Stepper',
    description: 'Stepper for visualizing progress through ordered steps and multi-step flows.',
  },
  'nav-tabs': {
    title: 'Navigation & Tabs',
    description: 'Tabs for switching between related views with underline and pill variants.',
  },
  'nav-pagination': {
    title: 'Navigation & Pagination',
    description: 'Pagination for navigating between pages of content and large lists.',
  },
  'nav-speed-dial': {
    title: 'Navigation & Speed Dial (FAB)',
    description: 'SpeedDial for quick floating actions with direction variants and labels.',
  },
  'nav-bottom-nav': {
    title: 'Navigation & Bottom nav',
    description:
      'BottomNav for mobile navigation bars; use placement container when the bar sits only above main content.',
  },
  'nav-back-to-top': {
    title: 'Navigation & Back to top',
    description: 'BackToTop floating control for long-scrolling pages.',
  },
  'feedback-badges-chips': {
    title: 'Feedback & Status & Notifications',
    description: 'Badge, Chip, ClosableChip, Kbd, Toast and StatCard for compact status and notification patterns.',
  },
  'feedback-progress': {
    title: 'Feedback & Progress',
    description: 'Progress, CircularProgress, Countdown, Spinner, Skeleton and LoadingContainer.',
  },
  'feedback-alerts': {
    title: 'Feedback & Alerts & Banners',
    description: 'Alert, Banner, ErrorMessage and NotificationCenter for inline and full-width status messaging.',
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
  'overlays-sheets': {
    title: 'Overlays & Sheets',
    description: 'Sheet for slide-in panels from any edge, including right-side panels with action footer.',
  },
  'overlays-context': {
    title: 'Overlays & Context Menu',
    description: 'ContextMenu for right-click action menus.',
  },
  'overlays-lightbox': {
    title: 'Overlays & Tour',
    description: 'Tour for step-by-step onboarding spotlights and guided product walkthroughs.',
  },
  'surfaces-layouts': {
    title: 'Surfaces & Layouts',
    description: 'Grid, Stack, ResizablePanel and Divider for composition-friendly layouts.',
  },
  'surfaces-main-layout': {
    title: 'Surfaces & MainLayout',
    description: 'MainLayout full shell composition with Navbar and Footer, without navigation items.',
  },
  'surfaces-collapsible': {
    title: 'Surfaces & Collapsible',
    description: 'Accordion and SectionCard for progressive disclosure and grouped content.',
  },
  'surfaces-cards': {
    title: 'Surfaces & Cards',
    description: 'Card, DataCard and FlipCard for content containers and interactive layouts.',
  },
  'composites-transfer-list': {
    title: 'Composites & TransferList',
    description: 'TransferList for moving items between source and target groups with search support.',
  },
  'composites-editable-collection': {
    title: 'Composites & EditableCollection',
    description: 'EditableCollection for adding, removing and editing dynamic form-like item lists.',
  },
  'composites-kanban-board': {
    title: 'Composites & KanbanBoard',
    description: 'KanbanBoard for drag-and-drop workflow columns and status changes.',
  },
  'composites-command-palette': {
    title: 'Composites & Command Palette',
    description: 'CommandPalette for keyboard-first command launching, grouped results and quick actions.',
  },
  'composites-wizard': {
    title: 'Composites & Wizard',
    description: 'Wizard for guided multi-step flows with progress, validation and finish actions.',
  },
  'composites-ai-result': {
    title: 'Composites & AI Result Panel',
    description: 'AiResultPanel showcase with full score, summary, sections and contextual actions.',
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
          <Match when={activeSection().startsWith('surfaces-')}>
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
