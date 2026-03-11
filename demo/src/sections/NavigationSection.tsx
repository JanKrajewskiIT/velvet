import type { BreadcrumbItem, CommandItem, SpeedDialAction } from '@jankrajewskiit/ui';
import { Breadcrumbs, CommandPalette, Pagination, SpeedDial, Stepper, Tabs, Timeline } from '@jankrajewskiit/ui';
import { IoAdd, IoDownload, IoHome, IoMoon, IoPencil, IoPerson, IoSettings, IoShareSocial } from 'solid-icons/io';
import { createSignal, For } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

type TabValue = 'preview' | 'code' | 'props';

const BASIC_BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Detail' },
];

const COLLAPSIBLE_BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Category', href: '#' },
  { label: 'Subcategory', href: '#' },
  { label: 'Products', href: '#' },
  { label: 'Item', href: '#' },
  { label: 'Detail' },
];

const SPEED_DIAL_ACTIONS: SpeedDialAction[] = [
  { icon: <IoAdd size={20} />, label: 'Add', onClick: () => {} },
  { icon: <IoPencil size={20} />, label: 'Edit', onClick: () => {} },
  { icon: <IoShareSocial size={20} />, label: 'Share', onClick: () => {} },
];

const STEPPER_STEPS = [
  { value: 'info', label: 'Info' },
  { value: 'details', label: 'Details' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const TIMELINE_ITEMS = [
  {
    key: '1',
    content: (
      <span>
        <strong>v0.3.3</strong> - Reorganized component categories
      </span>
    ),
  },
  {
    key: '2',
    content: (
      <span>
        <strong>v0.1.6</strong> - Added Wizard, Stepper and Timeline
      </span>
    ),
  },
  {
    key: '3',
    content: (
      <span>
        <strong>v0.1.0</strong> - Initial release
      </span>
    ),
  },
];

const NavigationSection = () => {
  const [tab, setTab] = createSignal<TabValue>('preview');
  const [activeStep, setActiveStep] = createSignal('details');
  const [page, setPage] = createSignal(5);
  const [commandOpen, setCommandOpen] = createSignal(false);

  const commandItems: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      description: 'Navigate to main dashboard',
      icon: <IoHome size={18} />,
      group: 'Navigation',
      onSelect: () => setCommandOpen(false),
    },
    {
      id: 'settings',
      label: 'Go to Settings',
      description: 'Open app settings',
      icon: <IoSettings size={18} />,
      group: 'Navigation',
      onSelect: () => setCommandOpen(false),
    },
    {
      id: 'profile',
      label: 'Go to Profile',
      icon: <IoPerson size={18} />,
      group: 'Navigation',
      onSelect: () => setCommandOpen(false),
    },
    {
      id: 'create',
      label: 'Create new item',
      description: 'Add a new entry',
      icon: <IoAdd size={18} />,
      group: 'Actions',
      onSelect: () => setCommandOpen(false),
    },
    {
      id: 'export',
      label: 'Export data',
      icon: <IoDownload size={18} />,
      group: 'Actions',
      onSelect: () => setCommandOpen(false),
    },
    {
      id: 'darkmode',
      label: 'Toggle dark mode',
      description: 'Switch theme appearance',
      icon: <IoMoon size={18} />,
      group: 'Actions',
      onSelect: () => setCommandOpen(false),
    },
  ];

  return (
    <div>
      <ShowcaseSection title="Tabs" subtitle="Underline and pill variants">
        <PreviewPanel>
          <Tabs<TabValue>
            tabs={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
              { value: 'props', label: 'Props' },
            ]}
            value={tab()}
            onChange={setTab}
            variant="underline"
          />
          <ShowcaseMeta>
            Active tab: <strong>{tab()}</strong>
          </ShowcaseMeta>
          <Tabs<TabValue>
            tabs={[
              { value: 'preview', label: 'Preview' },
              { value: 'code', label: 'Code' },
              { value: 'props', label: 'Props' },
            ]}
            value={tab()}
            onChange={setTab}
            variant="pill"
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Stepper" subtitle="Visual progress through ordered steps">
        <PreviewPanel>
          <Stepper steps={STEPPER_STEPS} activeStep={activeStep()} />
          <div class="stepButtons">
            <For each={STEPPER_STEPS}>
              {(s) => (
                <button
                  type="button"
                  class={`miniButton${activeStep() === s.value ? ' miniButtonActive' : ''}`}
                  onClick={() => setActiveStep(s.value)}
                >
                  {s.label}
                </button>
              )}
            </For>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Pagination" subtitle="Navigate large result sets">
        <PreviewPanel>
          <Pagination
            page={page()}
            totalPages={19}
            onChange={setPage}
            previousLabel="Previous"
            nextLabel="Next"
            ariaLabel="Table pages"
          />
          <ShowcaseMeta>
            Current page: <strong>{page()}</strong>
          </ShowcaseMeta>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Timeline" subtitle="Chronological list of events">
        <PreviewPanel>
          <Timeline items={TIMELINE_ITEMS} />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Breadcrumbs" subtitle="Hierarchical path navigation with collapse">
        <PreviewPanel class="col">
          <Breadcrumbs items={BASIC_BREADCRUMBS} />
          <Breadcrumbs items={COLLAPSIBLE_BREADCRUMBS} maxItems={3} />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="SpeedDial" subtitle="Floating action button with radial actions">
        <PreviewPanel>
          <div style={{ position: 'relative', height: '200px' }}>
            <SpeedDial actions={SPEED_DIAL_ACTIONS} />
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="CommandPalette" subtitle="Keyboard-driven command search overlay">
        <PreviewPanel>
          <button type="button" onClick={() => setCommandOpen(true)}>
            Open Command Palette (Ctrl+K)
          </button>
          <CommandPalette open={commandOpen()} onClose={() => setCommandOpen(false)} items={commandItems} />
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default NavigationSection;
