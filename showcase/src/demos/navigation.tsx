import { createSignal, For } from 'solid-js';
import {
  Anchor,
  BackToTop,
  BottomNav,
  Breadcrumb,
  HierarchyNavigator,
  IconButton,
  Link,
  LoadMore,
  Navbar,
  NavbarLocale,
  NavbarUser,
  Pagination,
  Stepper,
  Tabs,
  type TreeNode,
  TreeView,
  Wizard,
  type HierarchyNode,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const SCROLL_DEMO_HEIGHT_PX = 220;
const LAZY_LOAD_DELAY_MS = 700;
const FINISH_DELAY_MS = 800;

const SECTIONS = ['Overview', 'Install', 'Usage', 'API'];
const ANCHOR_ITEMS = SECTIONS.map((label) => ({ id: `nav-demo-${label.toLowerCase()}`, label }));

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'offers', label: 'Offers', icon: 'folder' },
  { id: 'alerts', label: 'Alerts', icon: 'bell' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

const BOTTOM_ITEMS = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'search', label: 'Search', icon: 'search' },
  { value: 'alerts', label: 'Alerts', icon: 'bell', badge: 3 },
  { value: 'profile', label: 'Profile', icon: 'user', badge: true },
];

const TREE_DATA: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx', meta: '2 KB' },
          { id: 'tabs', label: 'Tabs.tsx', meta: '4 KB' },
        ],
      },
      { id: 'index', label: 'index.ts', meta: '1 KB' },
    ],
  },
  { id: 'docs', label: 'docs', children: [{ id: 'readme', label: 'README.md' }] },
  { id: 'remote', label: 'remote (lazy)', lazy: true },
];

const PERMISSIONS: TreeNode[] = [
  {
    id: 'reports',
    label: 'Reports',
    children: [
      { id: 'reports.read', label: 'Read' },
      { id: 'reports.export', label: 'Export' },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    children: [
      { id: 'users.read', label: 'Read' },
      { id: 'users.write', label: 'Write' },
    ],
  },
];

const TAXONOMY: HierarchyNode[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    icon: 'folder',
    children: [
      {
        id: 'phones',
        label: 'Phones',
        description: 'Smartphones and accessories',
        children: [
          { id: 'android', label: 'Android' },
          { id: 'ios', label: 'iOS' },
        ],
      },
      { id: 'laptops', label: 'Laptops' },
    ],
  },
  {
    id: 'books',
    label: 'Books',
    icon: 'bookmark',
    children: [
      { id: 'fiction', label: 'Fiction' },
      { id: 'science', label: 'Science' },
    ],
  },
];

const STEPS = [
  { label: 'Account', description: 'Your details' },
  { label: 'Company' },
  { label: 'Plan' },
  { label: 'Review' },
];

const LazyTree = () => {
  const [data, setData] = createSignal(TREE_DATA);
  const loadChildren = (node: TreeNode) =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        setData((nodes) =>
          nodes.map((n) => (n.id === node.id ? { ...n, children: [{ id: 'remote-1', label: 'loaded.json' }] } : n)),
        );
        resolve();
      }, LAZY_LOAD_DELAY_MS),
    );
  return <TreeView data={data()} label="Project files" defaultExpanded={['src']} onLoadChildren={loadChildren} />;
};

const NavbarDemo = () => {
  const [active, setActive] = createSignal('home');
  return (
    <>
      <Navbar
        brand="Velvet"
        items={NAV_ITEMS}
        active={active()}
        onNavigate={setActive}
        actions={<IconButton icon="search" label="Search" />}
      />
      <Navbar
        variant="menubar"
        logo="Velvet"
        items={NAV_ITEMS}
        active={active()}
        onNavigate={setActive}
        actions={
          <>
            <NavbarLocale value="EN" />
            <NavbarUser
              name="Anna Kowalska"
              items={[
                { label: 'Profile' },
                { label: 'Settings' },
                { divider: true },
                { label: 'Sign out', danger: true },
              ]}
            />
          </>
        }
      />
    </>
  );
};

const PagerDemo = () => {
  const [size, setSize] = createSignal(20);
  return (
    <Pagination
      defaultPage={6}
      pageCount={20}
      total={243}
      pageSize={size()}
      pageSizeOptions={[10, 20, 50]}
      onPageSizeChange={setSize}
    />
  );
};

const LoadMoreDemo = () => {
  const [shown, setShown] = createSignal(20);
  const [loading, setLoading] = createSignal(false);
  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setShown((n) => Math.min(120, n + 20));
      setLoading(false);
    }, LAZY_LOAD_DELAY_MS);
  };
  return <LoadMore shown={shown()} total={120} step={20} loading={loading()} onLoadMore={loadMore} />;
};

const WizardDemo = () => (
  <Wizard
    steps={[
      { label: 'Account', content: <p>Pick a username.</p> },
      { label: 'Plan', content: <p>Choose a plan.</p>, validate: () => 'Select a plan to continue' },
      { label: 'Review', content: <p>Everything looks good.</p> },
    ]}
    onCancel={() => undefined}
    onFinish={() => new Promise<void>((resolve) => setTimeout(resolve, FINISH_DELAY_MS))}
  />
);

const StepperDemo = () => {
  const [current, setCurrent] = createSignal(1);
  return (
    <>
      <Stepper steps={STEPS} current={current()} onStepClick={setCurrent} linear={false} />
      <Stepper steps={STEPS.slice(0, 3)} current={2} errorAt={2} orientation="vertical" />
    </>
  );
};

export const navigationDemos: DemoEntry[] = [
  {
    id: 'link',
    group: '22 Navigation',
    title: 'Link',
    description: 'Text link inline in prose or standalone as a call to action.',
    render: () => (
      <>
        <Example title="Variants" code={'<Link href="#" variant="quiet">Quiet</Link>'}>
          <Link href="#">Default</Link>
          <Link href="#" variant="plain">
            Plain
          </Link>
          <Link href="#" variant="quiet">
            Quiet
          </Link>
        </Example>
        <Example title="Standalone, external, disabled" code={'<Link href="#" standalone>View all</Link>'}>
          <Link href="#" standalone>
            View all
          </Link>
          <Link href="https://example.com" external>
            External
          </Link>
          <Link href="#" disabled>
            Disabled
          </Link>
        </Example>
      </>
    ),
  },
  {
    id: 'breadcrumb',
    group: '22 Navigation',
    title: 'Breadcrumb',
    description: 'Location trail; beyond maxItems the middle collapses into a menu.',
    render: () => (
      <>
        <Example
          title="Short"
          stack
          code={'<Breadcrumb items={[{ label: "Home", href: "#" }, { label: "Offers" }]} />'}
        >
          <Breadcrumb
            items={[{ label: 'Home', href: '#', icon: 'home' }, { label: 'Offers', href: '#' }, { label: 'Warsaw' }]}
          />
        </Example>
        <Example title="Collapsed" stack code={'<Breadcrumb maxItems={4} items={…} />'}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Offers', href: '#' },
              { label: 'Engineering', href: '#' },
              { label: 'Frontend', href: '#' },
              { label: 'Senior developer' },
            ]}
          />
        </Example>
      </>
    ),
  },
  {
    id: 'tabs',
    group: '22 Navigation',
    title: 'Tabs',
    description: 'Peer views with a sliding indicator; arrows, Home and End move and select.',
    render: () => (
      <>
        <Example title="Underline" stack code={'<Tabs items={[{ value: "all", label: "All", count: 24 }]} />'}>
          <Tabs
            items={[
              { value: 'all', label: 'All', count: 24 },
              { value: 'active', label: 'Active', count: 8 },
              { value: 'archived', label: 'Archived' },
              { value: 'off', label: 'Disabled', disabled: true },
            ]}
          />
        </Example>
        <Example title="Segmented" code={'<Tabs variant="segmented" items={…} />'}>
          <Tabs
            variant="segmented"
            items={[
              { value: 'grid', label: 'Grid', icon: 'layout-grid' },
              { value: 'list', label: 'List', icon: 'list' },
            ]}
          />
          <Tabs
            variant="segmented"
            defaultValue="w"
            items={[
              { value: 'd', label: 'Day' },
              { value: 'w', label: 'Week' },
              { value: 'm', label: 'Month' },
            ]}
          />
        </Example>
        <Example title="Vertical" code={'<Tabs orientation="vertical" items={…} />'}>
          <Tabs
            orientation="vertical"
            items={[
              { value: 'profile', label: 'Profile' },
              { value: 'security', label: 'Security' },
              { value: 'billing', label: 'Billing' },
            ]}
          />
        </Example>
      </>
    ),
  },
  {
    id: 'pagination',
    group: '22 Navigation',
    title: 'Pagination',
    description: 'Page navigation with truncation, a range label and rows per page.',
    render: () => (
      <>
        <Example title="Full" stack code={'<Pagination pageCount={20} defaultPage={6} />'}>
          <Pagination pageCount={20} defaultPage={6} />
          <PagerDemo />
        </Example>
        <Example title="Compact" code={'<Pagination variant="compact" pageCount={12} />'}>
          <Pagination variant="compact" pageCount={12} defaultPage={3} />
        </Example>
      </>
    ),
  },
  {
    id: 'stepper',
    group: '22 Navigation',
    title: 'Stepper',
    description: 'Progress through ordered steps: done, current, upcoming, error.',
    render: () => (
      <Example
        title="Horizontal and vertical"
        stack
        code={'<Stepper steps={steps} current={1} onStepClick={setCurrent} />'}
      >
        <StepperDemo />
      </Example>
    ),
  },
  {
    id: 'wizard',
    group: '19 Forms',
    title: 'Wizard',
    description: 'Multi-step flow with validation, Back / Next and an awaited Finish.',
    render: () => (
      <Example title="Validation blocks Next" stack code={'<Wizard steps={steps} onFinish={save} />'}>
        <WizardDemo />
      </Example>
    ),
  },
  {
    id: 'tree-view',
    group: '22 Navigation',
    title: 'TreeView',
    description: 'WAI-ARIA tree with tri-state checkboxes and lazy children.',
    render: () => (
      <>
        <Example title="Selectable with lazy node" stack code={'<TreeView data={data} onLoadChildren={load} />'}>
          <LazyTree />
        </Example>
        <Example
          title="Checkable"
          stack
          code={'<TreeView checkable data={permissions} defaultExpanded={["reports"]} />'}
        >
          <TreeView checkable data={PERMISSIONS} defaultExpanded={['reports']} label="Permissions" />
        </Example>
      </>
    ),
  },
  {
    id: 'hierarchy-navigator',
    group: '22 Navigation',
    title: 'HierarchyNavigator',
    description: 'Drill-down picker for deep taxonomies, one level at a time.',
    render: () => (
      <Example title="Category picker" code={'<HierarchyNavigator data={taxonomy} onSelect={…} />'}>
        <HierarchyNavigator data={TAXONOMY} />
      </Example>
    ),
  },
  {
    id: 'navbar',
    group: '22 Navigation',
    title: 'Navbar',
    description: 'Top app bar: text links, or the brand-filled icon menubar.',
    render: () => (
      <Example title="Links and menubar" stack code={'<Navbar variant="menubar" items={items} active="home" />'}>
        <NavbarDemo />
      </Example>
    ),
  },
  {
    id: 'bottom-nav',
    group: '22 Navigation',
    title: 'BottomNav',
    description: 'Mobile tab bar with badges and an optional centre action.',
    render: () => (
      <>
        <Example title="Badges" stack code={'<BottomNav fixed={false} items={items} />'}>
          <BottomNav fixed={false} items={BOTTOM_ITEMS} />
        </Example>
        <Example
          title="Centre action"
          stack
          code={'<BottomNav fixed={false} action={{ label: "Create" }} items={items} />'}
        >
          <BottomNav fixed={false} items={BOTTOM_ITEMS} action={{ label: 'Create' }} />
        </Example>
      </>
    ),
  },
  {
    id: 'load-more',
    group: '22 Navigation',
    title: 'LoadMore',
    description: 'Incremental "Show more" footer with a quiet progress bar.',
    render: () => (
      <>
        <Example title="Interactive" stack code={'<LoadMore shown={20} total={120} step={20} onLoadMore={more} />'}>
          <LoadMoreDemo />
        </Example>
        <Example title="Complete" stack code={'<LoadMore shown={120} total={120} />'}>
          <LoadMore shown={120} total={120} />
        </Example>
      </>
    ),
  },
  {
    id: 'anchor',
    group: '22 Navigation',
    title: 'Anchor',
    description: 'On-this-page table of contents that follows the section in view.',
    render: () => (
      <Example title="Scroll container" code={'<Anchor items={items} container="#scroller" />'}>
        <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
          <div
            id="nav-demo-scroller"
            style={{ height: `${SCROLL_DEMO_HEIGHT_PX}px`, 'overflow-y': 'auto', flex: 1, position: 'relative' }}
          >
            <For each={ANCHOR_ITEMS}>
              {(item) => (
                <section id={item.id} style={{ 'min-height': `${SCROLL_DEMO_HEIGHT_PX}px` }}>
                  <h4>{item.label}</h4>
                  <p>Section content for {item.label}.</p>
                </section>
              )}
            </For>
          </div>
          <Anchor items={ANCHOR_ITEMS} container="#nav-demo-scroller" />
        </div>
      </Example>
    ),
  },
  {
    id: 'back-to-top',
    group: '22 Navigation',
    title: 'BackToTop',
    description: 'Scroll-to-top button with a progress ring; appears after a threshold.',
    render: () => (
      <Example
        title="Static, scroll container"
        code={'<BackToTop position="static" target="#scroller" threshold={80} />'}
      >
        <div style={{ display: 'flex', gap: '16px', 'align-items': 'flex-start' }}>
          <div
            id="nav-demo-top-scroller"
            style={{ height: `${SCROLL_DEMO_HEIGHT_PX / 2}px`, 'overflow-y': 'auto', width: '260px' }}
          >
            <div style={{ height: `${SCROLL_DEMO_HEIGHT_PX * 3}px` }}>Scroll down in this box.</div>
          </div>
          <BackToTop position="static" target="#nav-demo-top-scroller" threshold={80} />
        </div>
      </Example>
    ),
  },
];
