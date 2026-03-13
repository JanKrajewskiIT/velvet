import {
  Button,
  Card,
  CodeText,
  DataCard,
  Divider,
  FlipCard,
  Footer,
  Grid,
  Heading,
  MainLayout,
  Navbar,
  type NavItem,
  ResizablePanel,
  Sidebar,
  type SidebarItem,
  SidebarNav,
  type SidebarNavGroup,
  Stack,
  Text,
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
    label: 'Start',
    items: [
      { id: 'overview-installation', label: 'Overview' },
      { id: 'developer-tooling', label: 'Tooling' },
    ],
  },
  {
    label: 'Layout',
    items: [
      { id: 'navbar-layouts', label: 'Shell & Sidebar' },
      { id: 'layout-utilities', label: 'Grid & Stack' },
      { id: 'cards', label: 'Cards' },
      { id: 'tabs-stepper', label: 'Breadcrumbs & Tabs & Stepper' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'command-fab', label: 'Palette & FAB' },
      { id: 'bottom-nav', label: 'Bottom nav' },
      { id: 'back-to-top', label: 'Back to top' },
    ],
  },
  {
    label: 'Inputs',
    items: [
      { id: 'buttons-toggles', label: 'Buttons' },
      { id: 'inputs', label: 'Fields' },
      { id: 'selectors-pickers', label: 'Controls' },
      { id: 'dropdowns-autocomplete', label: 'Dropdowns' },
      { id: 'date-time', label: 'Date & Time' },
      { id: 'file-upload', label: 'Upload' },
      { id: 'form-layout', label: 'Form Layout' },
    ],
  },
];

const LayoutSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const year = new Date().getFullYear();
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
  const [activeSidebarId, setActiveSidebarId] = createSignal('home');
  const [activeDemoAppSidebarId, setActiveDemoAppSidebarId] = createSignal('overview-installation');

  return (
    <div>
      <Show when={sectionId() === 'layout-shell'}>
        <ShowcaseSection title="Navbar & Layouts" subtitle="Navbar-only showcase and full page shell composition">
          <PreviewPanel>
            <PreviewGroup title="Navbar only" subtitle="Focused composition with navigation and top actions">
              <div class="layoutPreviewShell layoutPreviewShellCompact">
                <MainLayout
                  navbar={
                    <Navbar
                      navItems={DEMO_NAV_ITEMS}
                      toggleMenuLabel="Toggle navigation"
                      navLabel="Main navigation"
                      logo={<BiLogosReact class="layoutNavbarLogo" />}
                      actions={
                        <div class="layoutNavbarActions">
                          <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" />
                        </div>
                      }
                    />
                  }
                >
                  <div class="layoutShellContent">
                    <div class="recronHero">
                      <Heading as="h3" level={3} variant="titleLg" class="recronTitle">
                        Navbar Preview
                      </Heading>
                      <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                        Showcase focused only on navbar composition: icon logo, navigation items and theme switch.
                      </Text>
                    </div>
                  </div>
                </MainLayout>
              </div>
            </PreviewGroup>
            <PreviewGroup title="Full shell" subtitle="Header, content and footer inside one layout primitive">
              <div class="layoutPreviewShell">
                <MainLayout
                  navbar={
                    <Navbar
                      navItems={DEMO_NAV_ITEMS}
                      toggleMenuLabel="Toggle navigation"
                      navLabel="Main navigation"
                      logo={<BiLogosReact class="layoutNavbarLogo" />}
                      actions={
                        <div class="layoutNavbarActions">
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
                  <div class="layoutShellContent">
                    <div class="recronHero">
                      <Heading as="h3" level={3} variant="titleLg" class="recronTitle">
                        Dashboard
                      </Heading>
                      <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                        Fixed-height card with scrollable page content and footer pinned to the bottom.
                      </Text>
                    </div>
                  </div>
                </MainLayout>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Layout components use slots:{' '}
            <CodeText as="span" class="codeInline">
              navbar
            </CodeText>{' '}
            and{' '}
            <CodeText as="span" class="codeInline">
              footer
            </CodeText>{' '}
            in{' '}
            <CodeText as="span" class="codeInline">
              MainLayout
            </CodeText>
            .
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Sidebar" subtitle="Collapsible navigation sidebar">
          <PreviewPanel>
            <PreviewGroup title="Interactive sample" subtitle="Nested links with collapsed mode toggle">
              <div class="sidebarPreviewShell">
                <Sidebar
                  items={SIDEBAR_ITEMS}
                  activeId={activeSidebarId()}
                  onSelect={setActiveSidebarId}
                  collapsed={sidebarCollapsed()}
                  collapsible
                  onToggle={() => setSidebarCollapsed((prev) => !prev)}
                  header={<strong class="sidebarPreviewHeader">MyApp</strong>}
                />
                <div class="sidebarPreviewBody">
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Active: <strong>{activeSidebarId()}</strong>
                  </Text>
                </div>
              </div>
            </PreviewGroup>
            <PreviewGroup title="SidebarNav from app shell" subtitle="Category navigation with regular ghost buttons">
              <div class="sidebarPreviewShell">
                <SidebarNav
                  groups={DEMO_APP_NAV_GROUPS}
                  activeId={activeDemoAppSidebarId()}
                  onSelect={setActiveDemoAppSidebarId}
                  title="VelvetUI"
                  subtitle="Modern SolidJS component showcase"
                  navLabel="Component categories"
                  class="sidebarNavPreview"
                  actions={
                    <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" variant="light" />
                  }
                />
                <div class="sidebarPreviewBody">
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Active: <strong>{activeDemoAppSidebarId()}</strong>
                  </Text>
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
              <div class="statusChip">Column 1</div>
              <div class="statusChip">Column 2</div>
              <div class="statusChip">Column 3</div>
              <div class="statusChip">Column 4</div>
              <div class="statusChip">Column 5</div>
            </Grid>
            <Grid minColumnWidth="180px" gap="md">
              <div class="statusChip">Auto-fit A</div>
              <div class="statusChip">Auto-fit B</div>
              <div class="statusChip">Auto-fit C</div>
              <div class="statusChip">Auto-fit D</div>
            </Grid>
          </PreviewPanel>
          <ShowcaseMeta>
            Set fixed columns via{' '}
            <CodeText as="span" class="codeInline">
              columns
            </CodeText>{' '}
            or use responsive auto-fit with{' '}
            <CodeText as="span" class="codeInline">
              minColumnWidth
            </CodeText>
            .
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Stack" subtitle="Flexible vertical and horizontal spacing layout">
          <PreviewPanel>
            <Stack gap="sm">
              <div class="statusChip">First item</div>
              <div class="statusChip">Second item</div>
              <div class="statusChip">Third item</div>
            </Stack>
            <Stack direction="horizontal" gap="md" align="center" justify="between" wrap>
              <div class="statusChip">Horizontal</div>
              <div class="statusChip">Aligned center</div>
              <div class="statusChip">Wrap enabled</div>
            </Stack>
          </PreviewPanel>
          <ShowcaseMeta>
            Use{' '}
            <CodeText as="span" class="codeInline">
              direction
            </CodeText>
            ,{' '}
            <CodeText as="span" class="codeInline">
              gap
            </CodeText>
            ,{' '}
            <CodeText as="span" class="codeInline">
              align
            </CodeText>
            ,{' '}
            <CodeText as="span" class="codeInline">
              justify
            </CodeText>{' '}
            and{' '}
            <CodeText as="span" class="codeInline">
              wrap
            </CodeText>{' '}
            to compose spacing layouts quickly.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="ResizablePanel" subtitle="Split panel with draggable handle">
          <PreviewPanel>
            <PreviewGroup title="Horizontal split" subtitle="Drag handle to adjust available width">
              <div class="resizableDemoShell">
                <ResizablePanel direction="horizontal" initialSplit={40} minSize={20}>
                  <div class="resizableDemoPanel">
                    <strong>Left panel</strong>
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Drag the handle to resize.
                    </Text>
                  </div>
                  <div class="resizableDemoPanel">
                    <strong>Right panel</strong>
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Content adjusts automatically.
                    </Text>
                  </div>
                </ResizablePanel>
              </div>
            </PreviewGroup>
            <PreviewGroup title="Vertical split" subtitle="Same API, vertical direction">
              <div class="resizableDemoShell">
                <ResizablePanel direction="vertical" initialSplit={50} minSize={20}>
                  <div class="resizableDemoPanel">
                    <strong>Top panel</strong>
                  </div>
                  <div class="resizableDemoPanel">
                    <strong>Bottom panel</strong>
                  </div>
                </ResizablePanel>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Supports{' '}
            <CodeText as="span" class="codeInline">
              horizontal
            </CodeText>{' '}
            and{' '}
            <CodeText as="span" class="codeInline">
              vertical
            </CodeText>{' '}
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
              <div class="row dividerVerticalDemo">
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
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  Simple bordered container for arbitrary content.
                </Text>
              </Card>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Use{' '}
            <CodeText as="span" class="codeInline">
              Card
            </CodeText>{' '}
            as a minimal wrapper for grouped content.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="DataCard variants" subtitle="Material-inspired filled, elevated and outlined styles">
          <PreviewPanel>
            <PreviewGroup title="Filled, elevated and outlined">
              <div class="gridCards">
                <DataCard
                  variant="filled"
                  hoverable
                  header={<strong>Filled card</strong>}
                  footer={<Button variant="primary">Continue</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Tonal variant inspired by modern Material surfaces.
                  </Text>
                </DataCard>
                <DataCard
                  variant="elevated"
                  hoverable
                  header={<strong>Elevated card</strong>}
                  footer={<Button variant="primary">Open</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Balanced default with soft depth and strong readability.
                  </Text>
                </DataCard>
                <DataCard
                  variant="outlined"
                  hoverable
                  header={<strong>Outlined card</strong>}
                  footer={<Button variant="ghost">Details</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Clean and neutral variant for dense enterprise layouts.
                  </Text>
                </DataCard>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            All variants support{' '}
            <CodeText as="span" class="codeInline">
              header
            </CodeText>
            , content,{' '}
            <CodeText as="span" class="codeInline">
              footer
            </CodeText>{' '}
            and optional{' '}
            <CodeText as="span" class="codeInline">
              hoverable
            </CodeText>
            .
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="FlipCard" subtitle="Interactive front/back card">
          <PreviewPanel>
            <PreviewGroup title="Click and hover samples">
              <div class="flipCardGrid">
                <FlipCard
                  width="220px"
                  height="140px"
                  front={
                    <div class="flipCardFace">
                      <Heading as="strong" level={4} variant="titleLg" tone="primary" class="flipCardTitle">
                        VelvetUI
                      </Heading>
                      <Text as="span" variant="bodySm" tone="muted" class="flipCardHint">
                        Click to flip
                      </Text>
                    </div>
                  }
                  back={
                    <div class="flipCardBack">
                      <strong>SolidJS plus Vite</strong>
                      <Text as="span" variant="bodySm" tone="muted" class="flipCardHint">
                        TypeScript and CSS Modules
                      </Text>
                    </div>
                  }
                />
                <FlipCard
                  width="220px"
                  height="140px"
                  front={<div class="flipCardFace">UI System</div>}
                  back={<div class="flipCardSimple">Dark and light theme</div>}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            <CodeText as="span" class="codeInline">
              FlipCard
            </CodeText>{' '}
            reveals back content on click or hover.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default LayoutSection;
