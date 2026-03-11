import {
  AspectRatio,
  Button,
  Divider,
  Footer,
  MainLayout,
  Navbar,
  type NavItem,
  ResizablePanel,
  Sidebar,
  type SidebarItem,
  ThemeToggle,
} from '@jankrajewskiit/ui';
import { FaSolidQuestion } from 'solid-icons/fa';
import { IoCalendar, IoDocumentText, IoFolder, IoHome, IoPersonCircle, IoSettings } from 'solid-icons/io';
import { createSignal } from 'solid-js';

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

const LayoutSection = () => {
  const year = new Date().getFullYear();
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
  const [activeSidebarId, setActiveSidebarId] = createSignal('home');

  return (
    <div>
      <ShowcaseSection title="App Shell" subtitle="Navbar, MainLayout and Footer composition">
        <PreviewPanel class="layoutPreviewPanel">
          <div class="layoutPreviewShell">
            <MainLayout
              navbar={
                <Navbar
                  navItems={DEMO_NAV_ITEMS}
                  toggleMenuLabel="Toggle navigation"
                  navLabel="Main navigation"
                  logo={<strong class="layoutLogo">MyApp</strong>}
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
              <div class="recronHero">
                <h3 class="recronTitle">Dashboard</h3>
                <p class="mutedText">Example shell composition: top nav, central workspace and footer.</p>
              </div>
            </MainLayout>
          </div>
        </PreviewPanel>

        <ShowcaseMeta>
          Layout components use slots: <span class="codeInline">navbar</span> and <span class="codeInline">footer</span>{' '}
          in <span class="codeInline">MainLayout</span>.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="ThemeToggle" subtitle="Light and dark mode switch">
        <PreviewPanel>
          <div class="row">
            <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" />
          </div>
        </PreviewPanel>
        <ShowcaseMeta>
          Wraps <span class="codeInline">useTheme()</span> from ThemeProvider. Supports light, dark and system modes.
        </ShowcaseMeta>
      </ShowcaseSection>

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
          Pass a numeric <span class="codeInline">ratio</span> prop. Defaults to 16/9.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="ResizablePanel" subtitle="Split panel with draggable handle">
        <PreviewPanel>
          <div style={{ height: '200px' }}>
            <ResizablePanel direction="horizontal" initialSplit={40} minSize={20}>
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-surface)' }}>
                <strong>Left panel</strong>
                <p class="mutedText">Drag the handle to resize.</p>
              </div>
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-surface)' }}>
                <strong>Right panel</strong>
                <p class="mutedText">Content adjusts automatically.</p>
              </div>
            </ResizablePanel>
          </div>
        </PreviewPanel>
        <ShowcaseMeta>
          Supports <span class="codeInline">horizontal</span> and <span class="codeInline">vertical</span> directions
          with configurable min size.
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
              <p class="mutedText">
                Active: <strong>{activeSidebarId()}</strong>
              </p>
            </div>
          </div>
        </PreviewPanel>
        <ShowcaseMeta>Supports nested items, badges, icons and a collapsible toggle.</ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="Layout Composition Snippet" subtitle="Template for app structure">
        <PreviewPanel>
          <pre class="installBlock">
            <code>{`<MainLayout
  navbar={<Navbar navItems={navItems} toggleMenuLabel="Toggle menu" />}
  footer={
    <Footer
      copyrightText="(c) 2026 MyApp"
      privacyLabel="Privacy"
      privacyHref="/privacy"
      builtWithText="Built with VelvetUi"
    />
  }
>
  <Dashboard />
</MainLayout>`}</code>
          </pre>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default LayoutSection;
