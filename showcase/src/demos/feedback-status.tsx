import { createSignal, For } from 'solid-js';
import {
  Alert,
  Banner,
  Button,
  Countdown,
  EmptyState,
  ErrorState,
  Loader,
  LOADER_VARIANTS,
  type NotificationItem,
  NotificationCenter,
  NotificationList,
  PageLoader,
  Progress,
  ProgressRing,
  SetupChecklist,
  Skeleton,
  SkeletonText,
  StatusPage,
  type StatusPageCode,
  type StatusTone,
  TONES,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const ALERT_VARIANTS = ['soft', 'outline', 'solid'] as const;
const STATUS_CODES: StatusPageCode[] = [404, 403, 500, 'offline', 'success', 'warning', 'info'];
const PROGRESS_TONES = ['brand', 'success', 'warning', 'danger', 'neutral'] as const;
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Deploy finished',
    body: 'velvet-ui 3.1.3 is live in production.',
    time: '2m ago',
    unread: true,
    tone: 'success',
  },
  {
    id: 2,
    title: 'Storage almost full',
    body: 'You have used 92% of your quota.',
    time: '1h ago',
    unread: true,
    tone: 'warning',
  },
  { id: 3, title: 'New comment', body: 'Alex replied to your review.', time: 'Yesterday', icon: 'message-square' },
];
const DAY_MS = 864e5;
const HOUR_MS = 36e5;
const inDays = (days: number) => new Date(Date.now() + days * DAY_MS + 2 * HOUR_MS);

const NotificationsDemo = () => {
  const [items, setItems] = createSignal(INITIAL_NOTIFICATIONS);
  const markAllRead = () => setItems(items().map((item) => ({ ...item, unread: false })));
  return (
    <NotificationCenter
      items={items()}
      onMarkAllRead={markAllRead}
      onViewAll={() => undefined}
      onItemClick={(item) => setItems(items().map((i) => (i.id === item.id ? { ...i, unread: false } : i)))}
    />
  );
};

const ChecklistDemo = () => {
  const [done, setDone] = createSignal(new Set(['profile']));
  const complete = (id: string) => setDone(new Set([...done(), id]));
  const steps = () => [
    {
      id: 'profile',
      label: 'Complete your profile',
      description: 'Role and skills',
      icon: 'settings',
      done: done().has('profile'),
    },
    { id: 'cv', label: 'Build your CV', icon: 'file-text', done: done().has('cv'), onClick: () => complete('cv') },
    {
      id: 'offer',
      label: 'Add your first offer',
      icon: 'briefcase',
      done: done().has('offer'),
      onClick: () => complete('offer'),
    },
  ];
  return <SetupChecklist title="Set up your workspace" steps={steps()} hideWhenComplete={false} />;
};

const ProgressDemo = () => {
  const [value, setValue] = createSignal(40);
  return (
    <>
      <Progress value={value()} label="Uploading" showValue />
      <Button size="sm" variant="secondary" onClick={() => setValue((value() + 15) % 115)}>
        Advance
      </Button>
    </>
  );
};

export const feedbackStatusDemos: DemoEntry[] = [
  {
    id: 'alert',
    group: 'Feedback',
    title: 'Alert & Banner',
    description: 'Inline Alert for contextual messages; Banner for one full-width system notice at the top of the app.',
    render: () => (
      <>
        <Example title="Alert tones × variants" stack code={'<Alert tone="warning" title="Plan limit">…</Alert>'}>
          <For each={ALERT_VARIANTS}>
            {(variant) => (
              <For each={TONES}>
                {(tone) => (
                  <Alert tone={tone} variant={variant} title={`${tone} · ${variant}`} onClose={() => undefined}>
                    Message text for this alert.
                  </Alert>
                )}
              </For>
            )}
          </For>
        </Example>
        <Example title="With action" stack code={'<Alert action={<Button size="sm">Upgrade</Button>}>…</Alert>'}>
          <Alert
            tone="info"
            title="Trial ends soon"
            action={
              <Button size="sm" variant="secondary">
                Upgrade
              </Button>
            }
          >
            Your trial ends in 3 days.
          </Alert>
        </Example>
        <Example title="Banner" stack code={'<Banner tone="brand" onClose={dismiss}>…</Banner>'}>
          <For each={['brand', 'info', 'warning', 'danger'] satisfies StatusTone[]}>
            {(tone) => (
              <Banner
                tone={tone}
                action={
                  <Button size="sm" variant="ghost">
                    Details
                  </Button>
                }
                onClose={() => undefined}
              >
                Scheduled maintenance on Sunday, 02:00–04:00 UTC.
              </Banner>
            )}
          </For>
        </Example>
      </>
    ),
  },
  {
    id: 'progress',
    group: 'Feedback',
    title: 'Progress',
    description: 'Linear and circular progress for determinate tasks; indeterminate when the amount is unknown.',
    render: () => (
      <>
        <Example title="Tones" stack code={'<Progress value={60} tone="warning" label="Storage" showValue />'}>
          <For each={PROGRESS_TONES}>{(tone) => <Progress value={60} tone={tone} label={tone} showValue />}</For>
        </Example>
        <Example title="Sizes and indeterminate" stack code={'<Progress indeterminate label="Syncing" />'}>
          <Progress value={30} size="sm" />
          <Progress value={50} size="md" />
          <Progress value={70} size="lg" />
          <Progress indeterminate label="Syncing" />
          <Progress value={12} max={50} label="Quota" showValue format={(v, max) => `${v} of ${max} GB`} />
        </Example>
        <Example title="Interactive" stack code={'<Progress value={value()} showValue />'}>
          <ProgressDemo />
        </Example>
        <Example title="ProgressRing" code={'<ProgressRing value={72} tone="success" />'}>
          <For each={PROGRESS_TONES}>
            {(tone) => <ProgressRing value={72} tone={tone} label={`${tone} progress`} />}
          </For>
          <ProgressRing value={82} size={72} label="Score 82 of 100" role="meter">
            82/100
          </ProgressRing>
        </Example>
      </>
    ),
  },
  {
    id: 'skeleton',
    group: 'Feedback',
    title: 'Skeleton',
    description: 'Shimmering placeholder in the shape of content that is loading. Wrap the region in aria-busy.',
    render: () => (
      <>
        <Example title="Shapes" code={'<Skeleton circle height={40} />'}>
          <Skeleton circle height={40} />
          <Skeleton width={160} height={16} />
          <Skeleton width={96} height={32} radius={8} />
        </Example>
        <Example title="Paragraph" stack code={'<SkeletonText lines={4} />'}>
          <div aria-busy="true" style={{ width: '100%', 'max-width': '360px' }}>
            <SkeletonText lines={4} />
          </div>
        </Example>
      </>
    ),
  },
  {
    id: 'loader',
    group: 'Feedback',
    title: 'Loader',
    description: 'Decorative brand loaders for page and hero waits. Use Spinner for inline and button waits.',
    render: () => (
      <>
        <Example title="Variants" code={'<Loader variant="honeycomb" />'}>
          <For each={LOADER_VARIANTS}>
            {(variant) => (
              <div style={{ display: 'grid', 'justify-items': 'center', gap: 'var(--space-2)', 'min-width': '140px' }}>
                <Loader variant={variant} scale={0.6} label={variant} />
                <code>{variant}</code>
              </div>
            )}
          </For>
        </Example>
        <Example title="Shapes and current colour" code={'<Loader variant="shape-trail" shape="triangle" />'}>
          <Loader variant="shape-trail" shape="circle" />
          <Loader variant="shape-trail" shape="triangle" />
          <Loader variant="shape-trail" shape="square" />
          <Loader variant="ripple-dots" tone="current" />
        </Example>
        <Example title="PageLoader (contained)" code={'<PageLoader fullScreen={false} />'}>
          <div style={{ position: 'relative', width: '100%', height: '160px' }}>
            <PageLoader fullScreen={false} />
          </div>
        </Example>
      </>
    ),
  },
  {
    id: 'countdown',
    group: 'Feedback',
    title: 'Countdown',
    description: 'Live countdown to a date. Screen readers get one summary label, not per-second updates.',
    render: () => (
      <>
        <Example title="Boxes" code={'<Countdown to={launchDate} />'}>
          <Countdown to={inDays(3)} />
          <Countdown to={inDays(1)} size="sm" units={['hours', 'minutes', 'seconds']} />
        </Example>
        <Example title="Inline" code={"<Countdown variant=\"inline\" units={['hours', 'minutes', 'seconds']} />"}>
          <Countdown to={inDays(0)} variant="inline" units={['hours', 'minutes', 'seconds']} size="lg" />
        </Example>
      </>
    ),
  },
  {
    id: 'empty-state',
    group: 'Feedback',
    title: 'EmptyState & ErrorState',
    description: 'EmptyState for "nothing here yet"; ErrorState for a section that failed to load.',
    render: () => (
      <>
        <Example title="Sizes" code={'<EmptyState size="sm" title="No results" />'}>
          <EmptyState size="sm" title="No results" description="Try a different filter." />
          <EmptyState
            title="No projects yet"
            description="Create your first project to get started."
            actions={
              <Button size="sm" iconLeft="plus">
                New project
              </Button>
            }
          />
          <EmptyState size="lg" icon="search" tone="info" title="Nothing found" description="Adjust your search." />
        </Example>
        <Example title="ErrorState" code={'<ErrorState onRetry={reload} details={error.message} />'}>
          <ErrorState onRetry={() => undefined} details="TypeError: Failed to fetch" />
          <ErrorState size="sm" title="Couldn’t load activity" />
        </Example>
      </>
    ),
  },
  {
    id: 'status-page',
    group: 'Feedback',
    title: 'StatusPage',
    description:
      'End of a page or flow — error codes and outcomes. lg shows a code watermark; md and sm sit inside sections.',
    render: () => (
      <>
        <Example title="Full page (404)" stack code={'<StatusPage code={404} actions={<Button>Go home</Button>} />'}>
          <StatusPage code={404} actions={<Button>Go home</Button>} />
        </Example>
        <Example title="All statuses (md)" stack code={'<StatusPage status="success" size="md" />'}>
          <For each={STATUS_CODES}>{(code) => <StatusPage status={code} size="md" />}</For>
        </Example>
        <Example
          title="Compact with details"
          stack
          code={'<StatusPage status="success" size="sm">Receipt #1042</StatusPage>'}
        >
          <StatusPage status="success" size="sm" title="Payment received">
            Receipt #1042
          </StatusPage>
        </Example>
      </>
    ),
  },
  {
    id: 'notification-center',
    group: 'Feedback',
    title: 'NotificationCenter',
    description: 'Bell with unread count and a popover list. NotificationList is the bare list for activity pages.',
    render: () => (
      <>
        <Example title="Bell and popover" code={'<NotificationCenter items={items} onMarkAllRead={markAll} />'}>
          <div style={{ 'min-height': '420px', width: '100%', display: 'flex', 'justify-content': 'flex-end' }}>
            <NotificationsDemo />
          </div>
        </Example>
        <Example title="NotificationList" stack code={'<NotificationList items={items} />'}>
          <NotificationList items={INITIAL_NOTIFICATIONS} />
          <NotificationList items={[]} />
        </Example>
      </>
    ),
  },
  {
    id: 'setup-checklist',
    group: 'Feedback',
    title: 'SetupChecklist',
    description: 'First-run setup card. Steps are independent; the first open one is highlighted.',
    render: () => (
      <>
        <Example title="List (click steps to complete)" stack code={'<SetupChecklist steps={steps} />'}>
          <ChecklistDemo />
        </Example>
        <Example
          title="Grid with dismiss"
          stack
          code={'<SetupChecklist layout="grid" onDismiss={hide} steps={steps} />'}
        >
          <SetupChecklist
            layout="grid"
            title="Set up your workspace"
            description="Three quick steps."
            onDismiss={() => undefined}
            steps={[
              { id: 'a', label: 'Complete your profile', icon: 'settings', done: true },
              { id: 'b', label: 'Build your CV', icon: 'file-text', href: '#' },
              { id: 'c', label: 'Add your first offer', icon: 'briefcase', href: '#' },
            ]}
          />
        </Example>
      </>
    ),
  },
];
