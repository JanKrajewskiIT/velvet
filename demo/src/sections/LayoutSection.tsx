import {
  AspectRatio,
  Button,
  Divider,
  Footer,
  Grid,
  MainLayout,
  Navbar,
  type NavItem,
  ResizablePanel,
  Sidebar,
  type SidebarItem,
  Stack,
} from '@jankrajewskiit/ui';
import { FaSolidQuestion } from 'solid-icons/fa';
import { IoCalendar, IoDocumentText, IoFolder, IoHome, IoPersonCircle, IoSettings } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const DEMO_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: IoHome },
  { label: 'Questions', href: '/questions', icon: FaSolidQuestion },
  { label: 'Organizer', href: '/organizer', icon: IoCalendar },
  { label: 'Portfolio', href: '/portfolio', icon: IoPersonCircle },
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

const LayoutSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const year = new Date().getFullYear();
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
  const [activeSidebarId, setActiveSidebarId] = createSignal('home');

  return (
    <div>
      <Show when={sectionId() === 'layout-shell'}>
        <ShowcaseSection title="App Shell" subtitle="Navbar, MainLayout and Footer composition">
          <PreviewPanel class="layout-preview-panel">
            <div class="layout-preview-shell">
              <MainLayout
                navbar={
                  <Navbar
                    navItems={DEMO_NAV_ITEMS}
                    toggleMenuLabel="Toggle navigation"
                    navLabel="Main navigation"
                    logo={<strong class="layout-logo">MyApp</strong>}
                    actions={<Button variant="ghost">Upgrade</Button>}
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
                <div class="recron-hero">
                  <h3 class="recron-title">Dashboard</h3>
                  <p class="muted-text">Example shell composition: top nav, central workspace and footer.</p>
                </div>
              </MainLayout>
            </div>
          </PreviewPanel>

          <ShowcaseMeta>
            Layout components use slots: <span class="code-inline">navbar</span> and{' '}
            <span class="code-inline">footer</span> in <span class="code-inline">MainLayout</span>.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'layout-sidebar'}>
        <ShowcaseSection title="Divider" subtitle="Visual separator with optional label">
          <PreviewPanel class="col">
            <Divider />
            <Divider label="OR" />
            <Divider variant="dashed" />
            <Divider variant="dashed" label="Section" />
            <div class="row" style={{ height: '60px' }}>
              <span>Left</span>
              <Divider orientation="vertical" />
              <span>Right</span>
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="AspectRatio" subtitle="Maintain content proportions">
          <PreviewPanel>
            <div class="row">
              <div style={{ width: '200px' }}>
                <AspectRatio ratio={16 / 9}>
                  <div
                    style={{
                      display: 'flex',
                      'align-items': 'center',
                      'justify-content': 'center',
                      height: '100%',
                      background: 'var(--color-surface)',
                      'border-radius': 'var(--radius-md)',
                    }}
                  >
                    16:9
                  </div>
                </AspectRatio>
              </div>
              <div style={{ width: '140px' }}>
                <AspectRatio ratio={1}>
                  <div
                    style={{
                      display: 'flex',
                      'align-items': 'center',
                      'justify-content': 'center',
                      height: '100%',
                      background: 'var(--color-surface)',
                      'border-radius': 'var(--radius-md)',
                    }}
                  >
                    1:1
                  </div>
                </AspectRatio>
              </div>
              <div style={{ width: '120px' }}>
                <AspectRatio ratio={4 / 3}>
                  <div
                    style={{
                      display: 'flex',
                      'align-items': 'center',
                      'justify-content': 'center',
                      height: '100%',
                      background: 'var(--color-surface)',
                      'border-radius': 'var(--radius-md)',
                    }}
                  >
                    4:3
                  </div>
                </AspectRatio>
              </div>
            </div>
          </PreviewPanel>
          <ShowcaseMeta>
            Pass a numeric <span class="code-inline">ratio</span> prop. Defaults to 16/9.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Stack" subtitle="Flexible vertical and horizontal spacing layout">
          <PreviewPanel class="col">
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

        <ShowcaseSection title="Grid" subtitle="Responsive multi-column primitive">
          <PreviewPanel class="col">
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

        <ShowcaseSection title="ResizablePanel" subtitle="Split panel with draggable handle">
          <PreviewPanel>
            <div style={{ height: '200px' }}>
              <ResizablePanel direction="horizontal" initialSplit={40} minSize={20}>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-surface)' }}>
                  <strong>Left panel</strong>
                  <p class="muted-text">Drag the handle to resize.</p>
                </div>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-surface)' }}>
                  <strong>Right panel</strong>
                  <p class="muted-text">Content adjusts automatically.</p>
                </div>
              </ResizablePanel>
            </div>
          </PreviewPanel>
          <ShowcaseMeta>
            Supports <span class="code-inline">horizontal</span> and <span class="code-inline">vertical</span>{' '}
            directions with configurable min size.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Sidebar" subtitle="Collapsible navigation sidebar">
          <PreviewPanel>
            <div
              style={{
                display: 'flex',
                height: '280px',
                border: '1px solid var(--color-border)',
                'border-radius': 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <Sidebar
                items={SIDEBAR_ITEMS}
                activeId={activeSidebarId()}
                onSelect={setActiveSidebarId}
                collapsed={sidebarCollapsed()}
                collapsible
                onToggle={() => setSidebarCollapsed((prev) => !prev)}
                header={<strong style={{ padding: 'var(--spacing-sm)' }}>MyApp</strong>}
              />
              <div style={{ flex: 1, padding: 'var(--spacing-md)' }}>
                <p class="muted-text">
                  Active: <strong>{activeSidebarId()}</strong>
                </p>
              </div>
            </div>
          </PreviewPanel>
          <ShowcaseMeta>Supports nested items, badges, icons and a collapsible toggle.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default LayoutSection;
