import { createSignal, For } from 'solid-js';
import { Button, IconButton, LocaleSwitcher, Surface, Text } from '../../../src';
import {
  Footer,
  Grid,
  NavItem,
  NavSection,
  PageHeader,
  ScrollArea,
  SearchTrigger,
  Sidebar,
  SplitPane,
  Stack,
} from '../../../src/components/layout';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const TOPICS = [
  'Accessibility',
  'Analytics',
  'API',
  'Billing',
  'Branding',
  'Charts',
  'Checkout',
  'Components',
  'Dark mode',
  'Data grid',
  'Design tokens',
  'Forms',
  'i18n',
  'Icons',
  'Layout',
  'Motion',
  'Navigation',
  'Onboarding',
  'Performance',
  'Search',
  'Settings',
  'Typography',
];
const MESSAGES = [
  { from: 'Anna Kowalska', subject: 'Re: Component audit — done' },
  { from: 'Marek Nowak', subject: 'Dark mode notes' },
  { from: 'Julia Wiśniewska', subject: 'Rebrand files 2026' },
  { from: 'Tomasz Piątek', subject: 'Sprint 42 retro' },
];
const GAP_STEPS = [2, 4, 6];
const SIDEBAR_PROJECTS = ['active', 'archived', 'templates'];
const SPLIT_MIN_PERCENT = 22;
const SPLIT_MAX_PERCENT = 60;
const SPLIT_DEFAULT_PERCENT = 36;
const DEMO_PANE_HEIGHT = 250;

const Box = (props: { children: string }) => (
  <Surface variant="subtle" padding="md">
    {props.children}
  </Surface>
);

const SidebarDemo = () => {
  const [collapsed, setCollapsed] = createSignal(false);
  const [page, setPage] = createSignal('dashboard');
  const subItem = (id: string, label: string) => ({ id, label, active: page() === id, onClick: () => setPage(id) });
  return (
    <Stack direction="row" gap={6} align="flex-start" style={{ height: '470px' }}>
      <Sidebar collapsed={collapsed()} onCollapsedChange={setCollapsed} brand={<Text variant="title">Recron</Text>}>
        <NavSection>Overview</NavSection>
        <NavItem icon="home" label="Dashboard" active={page() === 'dashboard'} onClick={() => setPage('dashboard')} />
        <NavItem
          icon="bar-chart"
          label="Analytics"
          active={page() === 'analytics'}
          onClick={() => setPage('analytics')}
        />
        <NavSection>Work</NavSection>
        <NavItem
          icon="briefcase"
          label="Projects"
          count={8}
          active={SIDEBAR_PROJECTS.includes(page())}
          subItems={[subItem('active', 'Active'), subItem('archived', 'Archived'), subItem('templates', 'Templates')]}
          defaultOpen
        />
        <NavItem icon="users" label="Team" count={24} active={page() === 'team'} onClick={() => setPage('team')} />
        <NavSection>System</NavSection>
        <NavItem icon="settings" label="Settings" active={page() === 'settings'} onClick={() => setPage('settings')} />
      </Sidebar>
      <Text tone="tertiary">{page()} — use the toggle to collapse</Text>
    </Stack>
  );
};

const SplitPaneDemo = () => {
  const [selected, setSelected] = createSignal(0);
  const [size, setSize] = createSignal(SPLIT_DEFAULT_PERCENT);
  const message = () => MESSAGES[selected()];
  return (
    <Stack gap={2} style={{ width: '100%' }}>
      <Surface variant="raised" clip style={{ height: `${DEMO_PANE_HEIGHT}px` }}>
        <SplitPane size={size()} onSizeChange={setSize} min={SPLIT_MIN_PERCENT} max={SPLIT_MAX_PERCENT} collapsible>
          <Stack gap={1} style={{ padding: 'var(--space-2)' }}>
            <For each={MESSAGES}>
              {(item, index) => (
                <Button variant={index() === selected() ? 'soft' : 'ghost'} onClick={() => setSelected(index())}>
                  {item.from}
                </Button>
              )}
            </For>
          </Stack>
          <SplitPane direction="vertical" defaultSize={62} minPx={60}>
            <Stack gap={1} style={{ padding: 'var(--space-4)' }}>
              <Text variant="title">{message()?.subject}</Text>
              <Text variant="caption" tone="tertiary">
                {message()?.from} — drag either handle; drag the left one fully left to collapse.
              </Text>
            </Stack>
            <Surface variant="subtle" padding="md">
              <Text variant="caption">Activity log</Text>
            </Surface>
          </SplitPane>
        </SplitPane>
      </Surface>
      <Text variant="caption" tone="tertiary">
        List pane: {Math.round(size())}%
      </Text>
    </Stack>
  );
};

const SearchTriggerDemo = () => {
  const [opened, setOpened] = createSignal(0);
  return (
    <>
      <SearchTrigger placeholder="Search projects, people…" onOpen={() => setOpened(opened() + 1)} />
      <Text variant="caption" tone="tertiary" mono>
        opened ×{opened()}
      </Text>
    </>
  );
};

export const layoutDemos: DemoEntry[] = [
  {
    id: 'stack-grid',
    group: '12 Layout',
    title: 'Stack and Grid',
    description: 'Flex stack and CSS grid with space-scale gaps. Grid is fixed columns or auto-fill by minimum width.',
    render: () => (
      <>
        <Example title="Stack — row" code={'<Stack direction="row" gap={2} align="center">…</Stack>'}>
          <Stack direction="row" gap={2} align="center">
            <Box>gap 2</Box>
            <Box>row</Box>
            <Box>stack</Box>
          </Stack>
        </Example>
        <Example title="Stack — gap steps and divider" code={'<Stack divider gap={4}>…</Stack>'} stack>
          <For each={GAP_STEPS}>
            {(gap) => (
              <Stack direction="row" gap={gap} wrap>
                <Box>{`gap ${gap}`}</Box>
                <Box>token step</Box>
              </Stack>
            )}
          </For>
          <Stack divider gap={3}>
            <Text>First</Text>
            <Text>Second</Text>
            <Text>Third</Text>
          </Stack>
        </Example>
        <Example title="Grid — auto-fill" code={'<Grid min={140} gap={3}>…</Grid>'}>
          <Grid min={140} gap={3} style={{ width: '100%' }}>
            <For each={[1, 2, 3, 4, 5, 6]}>{() => <Box>auto-fill ≥140px</Box>}</For>
          </Grid>
        </Example>
        <Example title="Grid — fixed columns" code={'<Grid columns={3}>…</Grid>'}>
          <Grid columns={3} style={{ width: '100%' }}>
            <For each={[1, 2, 3]}>{(index) => <Box>{`column ${index}`}</Box>}</For>
          </Grid>
        </Example>
      </>
    ),
  },
  {
    id: 'scroll-area',
    group: '12 Layout',
    title: 'ScrollArea',
    description:
      'Thin themed scrollbar with edge fades only where content continues; focusable for keyboard scrolling.',
    render: () => (
      <>
        <Example title="Vertical" code={'<ScrollArea maxHeight={180} label="Topics">…</ScrollArea>'}>
          <ScrollArea
            maxHeight={180}
            label="Topics"
            style={{ border: '1px solid var(--border-subtle)', 'border-radius': '12px', width: '240px' }}
          >
            <Stack gap={1} style={{ padding: 'var(--space-2)' }}>
              <For each={TOPICS}>{(topic) => <Text>{topic}</Text>}</For>
            </Stack>
          </ScrollArea>
        </Example>
        <Example
          title="Horizontal — chip row"
          code={'<ScrollArea orientation="horizontal" label="Filters">…</ScrollArea>'}
        >
          <ScrollArea orientation="horizontal" label="Filters" maxWidth={420}>
            <For each={TOPICS}>
              {(topic) => (
                <Button variant="secondary" size="sm">
                  {topic}
                </Button>
              )}
            </For>
          </ScrollArea>
        </Example>
      </>
    ),
  },
  {
    id: 'search-trigger',
    group: '22 Navigation',
    title: 'SearchTrigger',
    description: 'Search field look-alike that opens a command palette. Press ⌘K or Ctrl+K anywhere on the page.',
    render: () => (
      <Example title="Default" code={'<SearchTrigger onOpen={openPalette} />'}>
        <SearchTriggerDemo />
      </Example>
    ),
  },
  {
    id: 'sidebar',
    group: '22 Navigation',
    title: 'Sidebar',
    description:
      'App navigation spine: floating card or docked panel, section labels, counts, accordion children, 64px icon rail.',
    render: () => (
      <Example
        title="Floating, collapsible"
        code={'<Sidebar brand={…} collapsed={c()} onCollapsedChange={setC}>…</Sidebar>'}
      >
        <SidebarDemo />
      </Example>
    ),
  },
  {
    id: 'split-pane',
    group: '12 Layout',
    title: 'SplitPane',
    description: 'Two resizable panes. Drag the handle or use arrows (Shift ×5), Home/End, Enter and double-click.',
    render: () => (
      <Example
        title="Nested, collapsible"
        code={'<SplitPane size={size()} onSizeChange={setSize} collapsible>…</SplitPane>'}
      >
        <SplitPaneDemo />
      </Example>
    ),
  },
  {
    id: 'page-header',
    group: '22 Navigation',
    title: 'PageHeader',
    description:
      'View masthead: breadcrumb, back, title and status, meta facts, actions and section tabs. Every region is optional.',
    render: () => (
      <Example
        title="Full and minimal"
        stack
        code={'<PageHeader title="Projects" actions={<Button>New project</Button>} />'}
      >
        <PageHeader
          breadcrumb={[{ label: 'Projects', href: '#' }, { label: 'Migrations', href: '#' }, { label: 'Q3 migration' }]}
          onBack={() => undefined}
          title="Q3 migration"
          status={{ label: 'Active', tone: 'success' }}
          meta={[
            { icon: 'user', label: 'Anna Kowalska' },
            { icon: 'calendar', label: 'Due 30 Jun 2026' },
            { icon: 'users', label: '6 members' },
          ]}
          actions={
            <>
              <IconButton icon="share" label="Share" variant="secondary" />
              <Button variant="secondary" iconLeft="settings">
                Settings
              </Button>
              <Button iconLeft="plus">New task</Button>
            </>
          }
          tabs={[
            { value: 'overview', label: 'Overview' },
            { value: 'tasks', label: 'Tasks', count: 24 },
            { value: 'files', label: 'Files', count: 8 },
            { value: 'activity', label: 'Activity' },
          ]}
        />
        <PageHeader
          eyebrow="Workspace / Velvet"
          title="Projects"
          description="Everything your team is working on."
          actions={<Button iconLeft="plus">New project</Button>}
        />
      </Example>
    ),
  },
  {
    id: 'footer',
    group: '22 Navigation',
    title: 'Footer',
    description: 'Product footer: full marketing layout with columns and legal bar, or a compact in-app row.',
    render: () => (
      <>
        <Example title="Full" stack code={'<Footer brand="Velvet" columns={columns} legal={legal} status="ok" />'}>
          <Footer
            brand="Velvet"
            description="Design system for calm, confident product UI — tokens, atoms and 150+ components."
            social={[
              { icon: 'globe', label: 'Website' },
              { icon: 'code', label: 'GitHub' },
              { icon: 'mail', label: 'Email' },
            ]}
            columns={[
              {
                title: 'Product',
                links: [
                  { label: 'Components' },
                  { label: 'Tokens' },
                  { label: 'Templates', badge: 'New' },
                  { label: 'Changelog' },
                ],
              },
              {
                title: 'Resources',
                links: [{ label: 'Documentation' }, { label: 'Figma kit', external: true }, { label: 'Accessibility' }],
              },
              {
                title: 'Company',
                links: [{ label: 'About' }, { label: 'Careers', badge: 'Hiring' }, { label: 'Contact' }],
              },
            ]}
            copyright="© 2026 Velvet Labs"
            legal={[{ label: 'Privacy' }, { label: 'Terms' }, { label: 'Cookies' }]}
            status="ok"
            end={<LocaleSwitcher defaultValue="en" />}
          />
        </Example>
        <Example
          title="Compact"
          stack
          code={'<Footer variant="compact" brand="Velvet" meta="v2.4.0" status={{ state: "degraded" }} />'}
        >
          <Footer
            variant="compact"
            brand="Velvet"
            copyright="© 2026"
            meta="v2.4.0"
            status={{ state: 'degraded', label: 'Search is slow' }}
            legal={[{ label: 'Privacy' }, { label: 'Terms' }, { label: 'Help' }]}
          />
        </Example>
      </>
    ),
  },
];
