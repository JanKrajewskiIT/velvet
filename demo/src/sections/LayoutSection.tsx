import {
  Button,
  Card,
  DataCard,
  Divider,
  FlipCard,
  Footer,
  Grid,
  LocaleSwitcher,
  MainLayout,
  Navbar,
  type NavItem,
  ResizablePanel,
  Sidebar,
  type SidebarItem,
  SidebarNav,
  type SidebarNavGroup,
  Stack,
  ThemeToggle,
} from '@jankrajewskiit/ui';
import { BiLogosReact } from 'solid-icons/bi';
import { FaSolidQuestion } from 'solid-icons/fa';
import { IoCalendar, IoDocumentText, IoFolder, IoHome, IoPersonCircle, IoSettings } from 'solid-icons/io';
import { OcPerson2 } from 'solid-icons/oc';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const DEMO_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: IoHome },
  { label: 'Questions', href: '/questions', icon: FaSolidQuestion },
  { label: 'Organizer', href: '/organizer', icon: IoCalendar },
  { label: 'Portfolio', href: '/portfolio', icon: OcPerson2 },
  { label: 'Settings', href: '/settings', icon: IoSettings },
];

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: <IoHome /> },
  { id: 'docs', label: 'Documents', icon: <IoFolder />, badge: 3 },
  {
    id: 'settings',
    label: 'Settings',
    icon: <IoSettings />,
    children: [
      { id: 'general', label: 'General', icon: <IoDocumentText /> },
      { id: 'account', label: 'Account', icon: <IoPersonCircle /> },
    ],
  },
];

const DEMO_APP_NAV_GROUPS: SidebarNavGroup[] = [
  {
    label: 'Getting Started',
    items: [
      { id: 'overview-installation', label: 'Overview and Installation' },
      { id: 'developer-tooling', label: 'Developer and Tooling' },
    ],
  },
  {
    label: 'Layout & Navigation',
    items: [
      { id: 'navbar-layouts', label: 'Navbar & Layouts' },
      { id: 'layout-utilities', label: 'Layout utilities' },
      { id: 'cards', label: 'Cards' },
      { id: 'tabs-stepper', label: 'Tabs & Stepper' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'command-fab', label: 'Command palette & FAB' },
      { id: 'mobile-nav', label: 'Mobile nav & Back to top' },
    ],
  },
  {
    label: 'Inputs & Forms',
    items: [
      { id: 'buttons-toggles', label: 'Buttons & toggles' },
      { id: 'inputs', label: 'Inputs' },
      { id: 'selectors-pickers', label: 'Selectors & pickers' },
      { id: 'dropdowns-autocomplete', label: 'Dropdowns & autocomplete' },
      { id: 'date-time', label: 'Date & time' },
      { id: 'file-upload', label: 'File & upload' },
      { id: 'form-layout', label: 'Form layout' },
    ],
  },
];

const LayoutSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const year = new Date().getFullYear();
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
  const [activeSidebarId, setActiveSidebarId] = createSignal('home');
  const [activeDemoAppSidebarId, setActiveDemoAppSidebarId] = createSignal('overview-installation');
  const [navbarLocale, setNavbarLocale] = createSignal<'EN' | 'PL'>('EN');

  return (
    <div>
      <Show when={sectionId() === 'layout-shell'}>
        <ShowcaseSection title="Navbar & Layouts" subtitle="Navbar-only showcase and full page shell composition">
          <PreviewPanel>
            <PreviewGroup title="Navbar only" subtitle="Focused composition with navigation and top actions">
              <div class="layout-preview-shell layout-preview-shell-compact">
                <MainLayout
                  navbar={
                    <Navbar
                      navItems={DEMO_NAV_ITEMS}
                      toggleMenuLabel="Toggle navigation"
                      navLabel="Main navigation"
                      logo={<BiLogosReact class="layoutNavbarLogo" />}
                      actions={
                        <div class="layoutNavbarActions">
                          <LocaleSwitcher
                            label={navbarLocale()}
                            switchLabel="Switch locale"
                            onSwitch={() => setNavbarLocale((current) => (current === 'EN' ? 'PL' : 'EN'))}
                          />
                          <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" />
                        </div>
                      }
                    />
                  }
                >
                  <div class="layout-shell-content">
                    <div class="recron-hero">
                      <h3 class="recron-title">Navbar Preview</h3>
                      <p class="muted-text">
                        Showcase focused only on navbar composition: icon logo, navigation items and theme switch.
                      </p>
                    </div>
                  </div>
                </MainLayout>
              </div>
            </PreviewGroup>
            <PreviewGroup title="Full shell" subtitle="Header, content and footer inside one layout primitive">
              <div class="layout-preview-shell">
                <MainLayout
                  navbar={
                    <Navbar
                      navItems={DEMO_NAV_ITEMS}
                      toggleMenuLabel="Toggle navigation"
                      navLabel="Main navigation"
                      logo={<BiLogosReact class="layoutNavbarLogo" />}
                      actions={
                        <div class="layoutNavbarActions">
                          <LocaleSwitcher
                            label={navbarLocale()}
                            switchLabel="Switch locale"
                            onSwitch={() => setNavbarLocale((current) => (current === 'EN' ? 'PL' : 'EN'))}
                          />
                          <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" />
                        </div>
                      }
                    />
                  }
                  footer={
                    <Footer
                      copyrightText={`(c) ${String(year)} MyApp`}
                      privacyLabel="Privacy"
                      privacyHref="/privacy"
                      builtWithText="Built with VelvetUi"
                    />
                  }
                >
                  <div class="layout-shell-content">
                    <div class="recron-hero">
                      <h3 class="recron-title">Dashboard</h3>
                      <p class="muted-text">
                        Fixed-height card with scrollable page content and footer pinned to the bottom.
                      </p>
                    </div>
                  </div>
                </MainLayout>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Layout components use slots: <span class="code-inline">navbar</span> and{' '}
            <span class="code-inline">footer</span> in <span class="code-inline">MainLayout</span>.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Sidebar" subtitle="Collapsible navigation sidebar">
          <PreviewPanel>
            <PreviewGroup title="Interactive sample" subtitle="Nested links with collapsed mode toggle">
              <div class="sidebar-preview-shell">
                <Sidebar
                  items={SIDEBAR_ITEMS}
                  activeId={activeSidebarId()}
                  onSelect={setActiveSidebarId}
                  collapsed={sidebarCollapsed()}
                  collapsible
                  onToggle={() => setSidebarCollapsed((prev) => !prev)}
                  header={<strong class="sidebar-preview-header">MyApp</strong>}
                />
                <div class="sidebar-preview-body">
                  <p class="muted-text">
                    Active: <strong>{activeSidebarId()}</strong>
                  </p>
                </div>
              </div>
            </PreviewGroup>
            <PreviewGroup title="SidebarNav from app shell" subtitle="Category navigation with regular ghost buttons">
              <div class="sidebar-preview-shell">
                <SidebarNav
                  groups={DEMO_APP_NAV_GROUPS}
                  activeId={activeDemoAppSidebarId()}
                  onSelect={setActiveDemoAppSidebarId}
                  title="VelvetUI"
                  subtitle="Modern SolidJS component showcase"
                  navLabel="Component categories"
                  class="sidebar-nav-preview"
                  actions={
                    <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" variant="light" />
                  }
                />
                <div class="sidebar-preview-body">
                  <p class="muted-text">
                    Active: <strong>{activeDemoAppSidebarId()}</strong>
                  </p>
                </div>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>Supports nested items, badges, icons and a collapsible toggle.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'layout-sidebar'}>
        <ShowcaseSection title="Grid" subtitle="Responsive multi-column primitive">
          <PreviewPanel>
            <Grid columns={3} gap="sm">
              <div class="status-chip">Column 1</div>
              <div class="status-chip">Column 2</div>
              <div class="status-chip">Column 3</div>
              <div class="status-chip">Column 4</div>
              <div class="status-chip">Column 5</div>
            </Grid>
            <Grid minColumnWidth="180px" gap="md">
              <div class="status-chip">Auto-fit A</div>
              <div class="status-chip">Auto-fit B</div>
              <div class="status-chip">Auto-fit C</div>
              <div class="status-chip">Auto-fit D</div>
            </Grid>
          </PreviewPanel>
          <ShowcaseMeta>
            Set fixed columns via <span class="code-inline">columns</span> or use responsive auto-fit with{' '}
            <span class="code-inline">minColumnWidth</span>.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Stack" subtitle="Flexible vertical and horizontal spacing layout">
          <PreviewPanel>
            <Stack gap="sm">
              <div class="status-chip">First item</div>
              <div class="status-chip">Second item</div>
              <div class="status-chip">Third item</div>
            </Stack>
            <Stack direction="horizontal" gap="md" align="center" justify="between" wrap>
              <div class="status-chip">Horizontal</div>
              <div class="status-chip">Aligned center</div>
              <div class="status-chip">Wrap enabled</div>
            </Stack>
          </PreviewPanel>
          <ShowcaseMeta>
            Use <span class="code-inline">direction</span>, <span class="code-inline">gap</span>,{' '}
            <span class="code-inline">align</span>, <span class="code-inline">justify</span> and{' '}
            <span class="code-inline">wrap</span> to compose spacing layouts quickly.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="ResizablePanel" subtitle="Split panel with draggable handle">
          <PreviewPanel>
            <PreviewGroup title="Horizontal split" subtitle="Drag handle to adjust available width">
              <div class="resizable-demo-shell">
                <ResizablePanel direction="horizontal" initialSplit={40} minSize={20}>
                  <div class="resizable-demo-panel">
                    <strong>Left panel</strong>
                    <p class="muted-text">Drag the handle to resize.</p>
                  </div>
                  <div class="resizable-demo-panel">
                    <strong>Right panel</strong>
                    <p class="muted-text">Content adjusts automatically.</p>
                  </div>
                </ResizablePanel>
              </div>
            </PreviewGroup>
            <PreviewGroup title="Vertical split" subtitle="Same API, vertical direction">
              <div class="resizable-demo-shell">
                <ResizablePanel direction="vertical" initialSplit={50} minSize={20}>
                  <div class="resizable-demo-panel">
                    <strong>Top panel</strong>
                  </div>
                  <div class="resizable-demo-panel">
                    <strong>Bottom panel</strong>
                  </div>
                </ResizablePanel>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Supports <span class="code-inline">horizontal</span> and <span class="code-inline">vertical</span>{' '}
            directions with configurable min size.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Divider" subtitle="Visual separator with optional label">
          <PreviewPanel>
            <PreviewGroup title="Horizontal variants">
              <Divider />
              <Divider label="OR" />
              <Divider variant="dashed" />
              <Divider variant="dashed" label="Section" />
            </PreviewGroup>
            <PreviewGroup title="Vertical variant">
              <div class="row divider-vertical-demo">
                <span>Left</span>
                <Divider orientation="vertical" />
                <span>Right</span>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'layout-cards'}>
        <ShowcaseSection title="Card" subtitle="Basic bordered content container">
          <PreviewPanel>
            <PreviewGroup title="Base card">
              <Card>
                <p class="muted-text">Simple bordered container for arbitrary content.</p>
              </Card>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Use <span class="code-inline">Card</span> as a minimal wrapper for grouped content.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Outlined hoverable" subtitle="Outlined variant with hover interaction">
          <PreviewPanel>
            <PreviewGroup title="Interaction sample">
              <DataCard variant="outlined" hoverable>
                <p class="muted-text">Outlined, hoverable variant.</p>
              </DataCard>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Uses <span class="code-inline">variant=&quot;outlined&quot;</span> with{' '}
            <span class="code-inline">hoverable</span>.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="DataCard" subtitle="Header, body and footer slots">
          <PreviewPanel>
            <PreviewGroup title="Primary sample">
              <DataCard
                variant="elevated"
                header={<strong>Overview</strong>}
                footer={<Button variant="primary">View details</Button>}
              >
                <p class="muted-text">Header, body and footer slots.</p>
              </DataCard>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Slot-based composition with <span class="code-inline">header</span>, content and{' '}
            <span class="code-inline">footer</span>.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="FlipCard" subtitle="Interactive front/back card">
          <PreviewPanel>
            <PreviewGroup title="Click and hover samples">
              <div class="flip-card-grid">
                <FlipCard
                  width="220px"
                  height="140px"
                  front={
                    <div class="flip-card-face">
                      <strong class="flip-card-title">VelvetUI</strong>
                      <span class="flip-card-hint">Click to flip</span>
                    </div>
                  }
                  back={
                    <div class="flip-card-back">
                      <strong>SolidJS plus Vite</strong>
                      <span class="flip-card-hint">TypeScript and CSS Modules</span>
                    </div>
                  }
                />
                <FlipCard
                  width="220px"
                  height="140px"
                  front={<div class="flip-card-face">UI System</div>}
                  back={<div class="flip-card-simple">Dark and light theme</div>}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            <span class="code-inline">FlipCard</span> reveals back content on click or hover.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default LayoutSection;
