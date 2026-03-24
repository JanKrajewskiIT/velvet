import type {
  BottomNavItem,
  BreadcrumbItem,
  NavItem,
  SidebarItem,
  SidebarNavGroup,
  SpeedDialAction,
} from '@jankrajewskiit/ui';
import {
  BackToTop,
  BottomNav,
  Breadcrumbs,
  Button,
  CodeText,
  LocaleSwitcher,
  Navbar,
  Pagination,
  Sidebar,
  SidebarNav,
  SpeedDial,
  Stepper,
  Tabs,
  Text,
  ThemeToggle,
} from '@jankrajewskiit/ui';
import { BiLogosReact } from 'solid-icons/bi';
import { IoAdd, IoCalendar, IoHome, IoPencil, IoPerson, IoSearch, IoSettings, IoShareSocial } from 'solid-icons/io';
import { createSignal, For, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

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

const getSpeedDialActions = (): SpeedDialAction[] => [
  { icon: <IoAdd size={20} />, label: 'Add', onClick: () => {} },
  { icon: <IoPencil size={20} />, label: 'Edit', onClick: () => {} },
  { icon: <IoShareSocial size={20} />, label: 'Share', onClick: () => {} },
];

const SPEED_DIAL_DIRECTION_VARIANTS: Array<{
  title: string;
  direction: 'up' | 'down' | 'left' | 'right';
}> = [
  { title: 'Up', direction: 'up' },
  { title: 'Down', direction: 'down' },
  { title: 'Left', direction: 'left' },
  { title: 'Right', direction: 'right' },
];

const STEPPER_STEPS = [
  { value: 'info', label: 'Info' },
  { value: 'details', label: 'Details' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const getBottomNavItems = (): BottomNavItem[] => [
  { id: 'home', label: 'Home', icon: <IoHome size={20} /> },
  { id: 'search', label: 'Search', icon: <IoSearch size={20} /> },
  { id: 'calendar', label: 'Calendar', icon: <IoCalendar size={20} />, badge: 2 },
  { id: 'profile', label: 'Profile', icon: <IoPerson size={20} /> },
];

const NAVBAR_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: IoHome },
  { label: 'Search', href: '/search', icon: IoSearch },
  { label: 'Settings', href: '/settings', icon: IoSettings },
];

const getSidebarItems = (): SidebarItem[] => [
  { id: 'overview', label: 'Overview', icon: <IoHome size={16} /> },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: <IoCalendar size={16} />,
    children: [
      { id: 'reports', label: 'Reports', badge: 6 },
      { id: 'tasks', label: 'Tasks', badge: 3 },
      { id: 'archive', label: 'Archive' },
    ],
  },
  { id: 'profile', label: 'Profile', icon: <IoPerson size={16} /> },
];

const SIDEBAR_NAV_GROUPS: SidebarNavGroup[] = [
  {
    label: 'Navigation',
    items: [
      { id: 'nav-overview', label: 'Overview' },
      { id: 'nav-pages', label: 'Pages' },
      { id: 'nav-settings', label: 'Settings' },
    ],
  },
  {
    label: 'Management',
    items: [
      { id: 'nav-users', label: 'Users' },
      { id: 'nav-billing', label: 'Billing' },
    ],
  },
];

const NavigationSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const [locale, setLocale] = createSignal<'EN' | 'PL'>('EN');
  const [tab, setTab] = createSignal<TabValue>('preview');
  const [activeStep, setActiveStep] = createSignal('details');
  const [page, setPage] = createSignal(3);
  const [activeBottomNav, setActiveBottomNav] = createSignal('home');
  const [sidebarActive, setSidebarActive] = createSignal('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
  const [sidebarNavActive, setSidebarNavActive] = createSignal('nav-overview');

  const toggleLocale = () => {
    setLocale((current) => (current === 'EN' ? 'PL' : 'EN'));
  };

  return (
    <div>
      <Show when={sectionId() === 'nav-navbar'}>
        <ShowcaseSection title="Navbar" subtitle="Top navigation with logo, actions and responsive menu">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="layoutPreviewShell">
                <Navbar
                  navItems={NAVBAR_ITEMS}
                  logo={<BiLogosReact class="layoutNavbarLogo" />}
                  actions={
                    <div class="layoutNavbarActions">
                      <LocaleSwitcher
                        text={locale()}
                        switchLabel="Switch language"
                        onSwitch={toggleLocale}
                        variant="navbar"
                        size="sm"
                      />
                      <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" variant="navbar" />
                    </div>
                  }
                  toggleMenuLabel="Toggle navigation"
                  navLabel="Main navigation"
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'nav-sidebars'}>
        <ShowcaseSection title="Sidebar & SidebarNav" subtitle="Side navigation variants for app layout and docs menus">
          <PreviewPanel>
            <PreviewGroup title="Sidebar">
              <div class="sidebarPreviewShell">
                <Sidebar
                  class="sidebarNavPreview"
                  items={getSidebarItems()}
                  activeId={sidebarActive()}
                  onSelect={setSidebarActive}
                  collapsed={sidebarCollapsed()}
                  onToggle={() => setSidebarCollapsed((current) => !current)}
                  header="Workspace"
                />
                <div class="sidebarPreviewBody">
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Active sidebar item: <strong>{sidebarActive()}</strong>
                  </Text>
                </div>
              </div>
            </PreviewGroup>

            <PreviewGroup title="SidebarNav">
              <div class="sidebarPreviewShell">
                <SidebarNav
                  class="sidebarNavPreview"
                  groups={SIDEBAR_NAV_GROUPS}
                  activeId={sidebarNavActive()}
                  onSelect={setSidebarNavActive}
                  title="VelvetUI"
                  subtitle="Navigation preview"
                />
                <div class="sidebarPreviewBody">
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Active sidebar nav item: <strong>{sidebarNavActive()}</strong>
                  </Text>
                </div>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'nav-breadcrumbs'}>
        <ShowcaseSection title="Breadcrumbs" subtitle="Hierarchical path navigation with collapse">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Breadcrumbs items={BASIC_BREADCRUMBS} />
              <Breadcrumbs items={COLLAPSIBLE_BREADCRUMBS} maxItems={3} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'nav-stepper'}>
        <ShowcaseSection title="Stepper" subtitle="Visual progress through ordered steps">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Stepper steps={STEPPER_STEPS} activeStep={activeStep()} />
              <div class="stepButtons">
                <For each={STEPPER_STEPS}>
                  {(s) => (
                    <Button
                      variant={activeStep() === s.value ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveStep(s.value)}
                    >
                      {s.label}
                    </Button>
                  )}
                </For>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'nav-tabs'}>
        <ShowcaseSection title="Tabs" subtitle="Underline and pill variants">
          <PreviewPanel>
            <PreviewGroup title="Underline variant">
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
            </PreviewGroup>
            <PreviewGroup title="Pill variant">
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
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Active tab:{' '}
            <CodeText as="span" class="codeInline">
              {tab()}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'nav-pagination'}>
        <ShowcaseSection title="Pagination" subtitle="Navigate between list and content pages">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Pagination page={page()} totalPages={24} onChange={setPage} previousLabel="Previous" nextLabel="Next" />
              <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                Current page: <strong>{page()}</strong>
              </Text>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'nav-speed-dial'}>
        <ShowcaseSection title="Speed Dial (FAB)" subtitle="Quick actions with tooltip labels">
          <PreviewPanel>
            <PreviewGroup title="Direction variants">
              <div class="speedDialGrid">
                <For each={SPEED_DIAL_DIRECTION_VARIANTS}>
                  {(variant) => (
                    <div class="speedDialCard">
                      <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                        {variant.title}
                      </Text>
                      <div class="speedDialAnchor">
                        <SpeedDial actions={getSpeedDialActions()} position="inline" direction={variant.direction} />
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'nav-bottom-nav'}>
        <ShowcaseSection title="BottomNav" subtitle="Mobile bottom navigation bar">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="bottomNavPreview">
                <div class="bottomNavPreviewLabel">
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Active: <strong>{activeBottomNav()}</strong>
                  </Text>
                </div>
                <BottomNav
                  placement="container"
                  items={getBottomNavItems()}
                  activeId={activeBottomNav()}
                  onChange={setActiveBottomNav}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Supports badges. Use placement=&quot;viewport&quot; for full-width fixed bars; &quot;container&quot; keeps
            the bar inside a positioned region (e.g. main column next to a sidebar).
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'nav-back-to-top'}>
        <ShowcaseSection title="BackToTop" subtitle="Floating scroll-to-top button">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                Scroll the <CodeText as="span">main</CodeText> column (not the sidebar). After ~200px scroll, the fixed
                control appears bottom-right and returns this column to the top.
              </Text>
              <BackToTop threshold={200} scrollRoot={() => document.querySelector<HTMLElement>('main.main')} />
              <div class="backToTopScrollFiller" aria-label="Scroll preview — placeholder content">
                <For each={Array.from({ length: 16 }, (_, i) => i)}>
                  {() => (
                    <div class="backToTopScrollFillerCard">
                      <div class="backToTopScrollFillerBar backToTopScrollFillerBarNarrow" />
                      <div class="backToTopScrollFillerBar backToTopScrollFillerBarWide" />
                      <div class="backToTopScrollFillerBar backToTopScrollFillerBarMid" />
                    </div>
                  )}
                </For>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default NavigationSection;
