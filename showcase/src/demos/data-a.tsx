import { createSignal, For } from 'solid-js';
import { Button } from '../../../src/components/actions/Button';
import {
  Accordion,
  type AccordionItem,
  Avatar,
  AvatarGroup,
  CodeSnippet,
  DescriptionList,
  DiffViewer,
  Divider,
  EventCalendar,
  FeatureCard,
  FlipCard,
  List,
  type ListItemData,
  type LogLine,
  LogViewer,
  QuestionCard,
  ScoreCard,
  SkillBar,
  Stat,
  Timeline,
  type TimelineItem,
} from '../../../src/components/data';
import { Grid } from '../../../src/components/layout/Grid';
import { Text } from '../../../src/components/primitives/Text';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const FAQ: AccordionItem[] = [
  {
    value: 'billing',
    title: 'How is billing calculated?',
    subtitle: 'Per seat, monthly',
    icon: 'credit-card',
    content: 'You pay for active seats. Removing a member lowers the next invoice.',
  },
  {
    value: 'export',
    title: 'Can I export my data?',
    icon: 'download',
    meta: 'CSV · JSON',
    content: 'Yes. Open Settings, then Data, and choose a format.',
  },
  {
    value: 'sso',
    title: 'Do you support single sign-on?',
    icon: 'shield',
    content: 'SAML and OIDC are available on the Business plan.',
  },
  { value: 'legacy', title: 'Legacy imports', disabled: true, content: 'Unavailable.' },
];

const TONED_FAQ: AccordionItem[] = [
  { value: 'a', title: 'Deployment succeeded', tone: 'success', content: 'Build 482 is live in production.' },
  { value: 'b', title: 'Latency above target', tone: 'warning', content: 'p95 is 840 ms against a target of 600 ms.' },
  { value: 'c', title: 'Payment failed', tone: 'danger', content: 'The card on file was declined.' },
];

const PEOPLE: ListItemData[] = [
  {
    id: 1,
    title: 'Anna Kowalska',
    description: 'Senior designer',
    leading: <Avatar name="Anna Kowalska" color="auto" />,
    trailing: (
      <Text variant="caption" tone="tertiary">
        2 h ago
      </Text>
    ),
  },
  {
    id: 2,
    title: 'Marek Nowak',
    description: 'Engineering manager',
    leading: <Avatar name="Marek Nowak" color="auto" status="online" />,
  },
  {
    id: 3,
    title: 'Ewa Zielińska',
    description: 'On leave',
    leading: <Avatar name="Ewa Zielińska" color="auto" status="away" />,
    disabled: true,
  },
];

const CODE_JSX = `import { Button } from '@velvet/ui';

// Save the current draft
export const Save = ({ draft }) => (
  <Button onClick={() => save(draft, { silent: true })}>Save changes</Button>
);`;

const OLD_CONFIG = `{
  "name": "velvet",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "lint": "eslint ."
  },
  "license": "MIT"
}`;

const NEW_CONFIG = `{
  "name": "velvet-ui",
  "version": "1.1.0",
  "private": true,
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "test": "vitest",
    "lint": "eslint ."
  },
  "license": "MIT"
}`;

const SEED_LOG: Array<string | LogLine> = [
  { ts: Date.now() - 4000, source: 'api', level: 'info', message: 'Listening on :8080' },
  { ts: Date.now() - 3000, source: 'db', level: 'debug', message: 'Pool warmed with 10 connections' },
  { ts: Date.now() - 2000, source: 'api', level: 'warn', message: 'Slow request GET /reports took 1.8s' },
  'ERROR payment-service: card declined for order 4471',
  'INFO worker: 12 jobs processed',
];

const TIMELINE: TimelineItem[] = [
  {
    id: 'a',
    title: 'Application received',
    time: '3 Mar',
    datetime: '2026-03-03',
    icon: 'inbox',
    status: 'done',
    description: 'Submitted through the careers page.',
  },
  {
    id: 'b',
    title: 'Phone screen',
    time: '5 Mar',
    datetime: '2026-03-05',
    status: 'done',
    badge: { label: 'Passed', icon: 'check', tone: 'success' },
    meta: [
      { icon: 'clock', label: '30 min' },
      { icon: 'map-pin', label: 'Remote' },
    ],
  },
  {
    id: 'c',
    title: 'Technical interview',
    time: '12 Mar',
    datetime: '2026-03-12',
    status: 'current',
    description: 'Pair programming with the platform team.',
  },
  { id: 'd', title: 'Offer', status: 'upcoming' },
];

const failAfterDelay = () => new Promise<void>((_, reject) => setTimeout(() => reject(new Error('Network down')), 800));

const ACTION_TIMELINE: TimelineItem[] = [
  {
    id: 'x',
    title: 'Interview scheduled',
    time: 'Today, 14:00',
    tone: 'brand',
    icon: 'calendar',
    actions: [
      { id: 'edit', label: 'Edit', icon: 'pencil' },
      {
        id: 'delete',
        label: 'Delete event',
        icon: 'trash-2',
        tone: 'danger',
        confirm: 'Delete this event?',
        confirmLabel: 'Delete',
        onClick: failAfterDelay,
      },
    ],
  },
  { id: 'y', title: 'Reminder sent', time: 'Yesterday', tone: 'neutral', icon: 'bell' },
];

const AccordionDemo = () => {
  const [open, setOpen] = createSignal<string[]>(['billing']);
  return <Accordion items={FAQ} multiple value={open()} onValueChange={setOpen} />;
};

const ListDemo = () => {
  const [selected, setSelected] = createSignal<string | number>(1);
  return <List items={PEOPLE} value={selected()} onValueChange={setSelected} label="Team" />;
};

const LogDemo = () => {
  const [lines, setLines] = createSignal<Array<string | LogLine>>(SEED_LOG);
  const append = () =>
    setLines((current) => [
      ...current,
      { ts: Date.now(), source: 'worker', message: `INFO job ${current.length} finished` },
    ]);
  return (
    <>
      <Button size="sm" variant="secondary" onClick={append}>
        Append line
      </Button>
      <LogViewer lines={lines()} height={220} />
    </>
  );
};

const VoteDemo = () => {
  const [voted, setVoted] = createSignal(false);
  const [starred, setStarred] = createSignal(false);
  return (
    <QuestionCard
      category="System design"
      level="Senior"
      question="How would you design a rate limiter?"
      difficulty={4}
      time="15 min"
      tags={['api', 'scale']}
      answer="Use a token bucket per client, stored in a shared cache, and return 429 with a Retry-After header."
      votes={voted() ? 13 : 12}
      voted={voted()}
      onVote={() => setVoted(!voted())}
      starred={starred()}
      onStar={() => setStarred(!starred())}
    />
  );
};

const EVENTS = [
  { id: 1, date: new Date(), time: '09:30', title: 'Stand-up', description: 'Platform team', tone: 'info' as const },
  { id: 2, date: new Date(), time: '14:00', title: 'Interview', tone: 'brand' as const },
  { id: 3, date: new Date(), title: 'Release freeze', tone: 'warning' as const },
];

export const dataADemos: DemoEntry[] = [
  {
    id: 'accordion',
    group: '13 Display',
    title: 'Accordion',
    description: 'Collapsible sections with animated height. Arrow keys, Home and End move between headers.',
    render: () => (
      <>
        <Example
          title="Separated, multiple"
          stack
          code={'<Accordion multiple items={items} value={open()} onValueChange={setOpen} />'}
        >
          <AccordionDemo />
        </Example>
        <Example title="Flush" stack code={'<Accordion variant="flush" items={items} />'}>
          <Accordion variant="flush" items={FAQ} defaultValue={['export']} />
        </Example>
        <Example title="Elevated with tone" stack code={'<Accordion variant="elevated" gap="md" items={items} />'}>
          <Accordion variant="elevated" gap="md" items={TONED_FAQ} defaultValue={['b']} />
        </Example>
      </>
    ),
  },
  {
    id: 'avatar',
    group: '13 Display',
    title: 'Avatar',
    description: 'Initials or image avatar with presence dot, auto colour and grouping.',
    render: () => (
      <>
        <Example title="Sizes" code={'<Avatar name="Anna Kowalska" size="lg" />'}>
          <For each={['xs', 'sm', 'md', 'lg', 'xl'] as const}>
            {(size) => <Avatar name="Anna Kowalska" size={size} />}
          </For>
        </Example>
        <Example title="Tone and auto colour" code={'<Avatar name="Marek Nowak" color="auto" />'}>
          <Avatar name="Anna Kowalska" tone="neutral" />
          <Avatar name="Marek Nowak" color="auto" />
          <Avatar name="Ewa Zielińska" color="auto" />
          <Avatar name="Jan Kowalczyk" color="auto" />
          <Avatar initials="VU" color="var(--dv-3)" />
        </Example>
        <Example title="Status" code={'<Avatar name="Anna Kowalska" status="online" />'}>
          <For each={['online', 'away', 'busy', 'offline'] as const}>
            {(status) => <Avatar name="Anna Kowalska" status={status} />}
          </For>
        </Example>
        <Example title="Image with fallback" code={'<Avatar name="Broken Image" src="/missing.png" />'}>
          <Avatar name="Broken Image" src="/missing.png" />
        </Example>
        <Example title="Group" code={'<AvatarGroup><Avatar … /></AvatarGroup>'}>
          <AvatarGroup>
            <Avatar name="Anna Kowalska" color="auto" />
            <Avatar name="Marek Nowak" color="auto" />
            <Avatar name="Ewa Zielińska" color="auto" />
            <Avatar initials="+4" tone="neutral" />
          </AvatarGroup>
        </Example>
      </>
    ),
  },
  {
    id: 'code-snippet',
    group: '13 Display',
    title: 'CodeSnippet',
    description: 'Code block with lightweight highlighting, line numbers, copy and language tabs.',
    render: () => (
      <>
        <Example title="Single block" stack code={'<CodeSnippet title="Save.jsx" code={source} />'}>
          <CodeSnippet title="Save.jsx" code={CODE_JSX} />
        </Example>
        <Example
          title="Tabs"
          stack
          code={'<CodeSnippet tabs={[{ label: "npm", language: "bash", code: "$ npm i" }]} />'}
        >
          <CodeSnippet
            tabs={[
              { label: 'npm', language: 'bash', code: '$ npm install @velvet/ui' },
              { label: 'pnpm', language: 'bash', code: '$ pnpm add @velvet/ui' },
              { label: 'yarn', language: 'bash', code: '$ yarn add @velvet/ui' },
            ]}
          />
        </Example>
        <Example
          title="Wrapped, no line numbers"
          stack
          code={'<CodeSnippet wrap showLineNumbers={false} code={source} />'}
        >
          <CodeSnippet
            wrap
            showLineNumbers={false}
            language="html"
            code={
              '<Button variant="primary" onClick={save}>Save changes and continue to the next step of the checkout</Button>'
            }
          />
        </Example>
      </>
    ),
  },
  {
    id: 'description-list',
    group: '26 Data',
    title: 'DescriptionList',
    description: 'Key–value details. Missing values show an em dash.',
    render: () => (
      <>
        <Example
          title="Row"
          stack
          code={'<DescriptionList items={[{ term: "Invoice", description: "INV-2041", mono: true }]} />'}
        >
          <DescriptionList
            items={[
              { term: 'Invoice', description: 'INV-2041', mono: true },
              { term: 'Customer', description: 'Acme Sp. z o.o.', hint: 'Since 2022' },
              { term: 'VAT ID' },
            ]}
          />
        </Example>
        <Example title="Grid" stack code={'<DescriptionList layout="grid" columns={3} items={items} />'}>
          <DescriptionList
            layout="grid"
            columns={3}
            items={[
              { term: 'Plan', description: 'Business' },
              { term: 'Seats', description: '24' },
              { term: 'Renewal', description: '1 Jan 2027' },
              { term: 'Notes', description: 'Annual contract, invoiced upfront.', span: 3 },
            ]}
          />
        </Example>
      </>
    ),
  },
  {
    id: 'diff-viewer',
    group: '26 Data',
    title: 'DiffViewer',
    description: 'Line and word diff with unified or split view and folded unchanged runs.',
    render: () => (
      <>
        <Example
          title="Unified"
          stack
          code={'<DiffViewer filename="package.json" oldText={before} newText={after} context={1} />'}
        >
          <DiffViewer filename="package.json" oldText={OLD_CONFIG} newText={NEW_CONFIG} context={1} />
        </Example>
        <Example title="Split" stack code={'<DiffViewer defaultMode="split" … />'}>
          <DiffViewer
            filename="package.json"
            defaultMode="split"
            oldText={OLD_CONFIG}
            newText={NEW_CONFIG}
            context={1}
          />
        </Example>
      </>
    ),
  },
  {
    id: 'divider',
    group: '12 Layout',
    title: 'Divider',
    description: 'Hairline separator, optionally with a label.',
    render: () => (
      <>
        <Example title="Horizontal" stack code={'<Divider label="or" />'}>
          <Divider />
          <Divider label="or" />
        </Example>
        <Example title="Vertical" code={'<Divider orientation="vertical" />'}>
          <div style={{ display: 'flex', 'align-items': 'center', gap: 'var(--space-3)', height: '32px' }}>
            <Text>Left</Text>
            <Divider orientation="vertical" />
            <Text>Right</Text>
          </div>
        </Example>
      </>
    ),
  },
  {
    id: 'event-calendar',
    group: '27 Planning',
    title: 'EventCalendar',
    description: 'Month grid with dots on days that have events, plus the agenda of the selected day.',
    render: () => (
      <>
        <Example title="Stacked" code={'<EventCalendar events={events} />'}>
          <EventCalendar events={EVENTS} />
        </Example>
        <Example title="Split" code={'<EventCalendar layout="split" events={events} />'}>
          <EventCalendar layout="split" events={EVENTS} />
        </Example>
      </>
    ),
  },
  {
    id: 'feature-card',
    group: '23 Cards',
    title: 'FeatureCard',
    description: 'Feature tile built on Card: tone icon tile, title, copy and an optional action.',
    render: () => (
      <Example title="Variants" stack code={'<FeatureCard icon="zap" title="Fast" description="…" href="#" />'}>
        <Grid columns={3} gap={4}>
          <FeatureCard
            icon="zap"
            title="Fast by default"
            description="Tokens and CSS only, no runtime styling."
            href="#"
          />
          <FeatureCard
            icon="shield"
            tone="success"
            title="Accessible"
            description="Keyboard and screen reader parity."
            look="lift"
          />
          <FeatureCard
            icon="globe"
            tone="info"
            title="Whole card is a link"
            description="The card itself navigates."
            href="#"
            interactive
          />
          <FeatureCard
            icon="layers"
            tone="teal"
            title="Inline layout"
            layout="inline"
            description="Icon on the left."
            action={
              <Button variant="link" size="sm">
                Open
              </Button>
            }
          />
        </Grid>
      </Example>
    ),
  },
  {
    id: 'flip-card',
    group: '23 Cards',
    title: 'FlipCard',
    description: 'Two-sided card that flips on click, Enter or Space.',
    render: () => (
      <>
        <Example title="Centred" code={'<FlipCard front="Ephemeral" back="Lasting a very short time" />'}>
          <FlipCard
            width={240}
            front={<Text variant="h3">Ephemeral</Text>}
            back={<Text>Lasting a very short time.</Text>}
            label="Flip vocabulary card"
          />
        </Example>
        <Example title="Start-aligned, flip on hover" code={'<FlipCard align="start" flipOnHover … />'}>
          <FlipCard
            width={280}
            height={180}
            align="start"
            flipOnHover
            tone="info"
            accent
            front={<Text variant="h4">What is a closure?</Text>}
            back={<Text>A function together with the scope it was created in.</Text>}
          />
        </Example>
      </>
    ),
  },
  {
    id: 'list',
    group: '26 Data',
    title: 'List',
    description: 'Lightweight rows for people, files and settings.',
    render: () => (
      <>
        <Example title="Selectable" stack code={'<List items={items} value={id} onValueChange={setId} />'}>
          <ListDemo />
        </Example>
        <Example title="Small, undivided" stack code={'<List size="sm" divided={false} items={items} />'}>
          <List size="sm" divided={false} items={PEOPLE.slice(0, 2)} />
        </Example>
        <Example title="Empty" stack code={'<List items={[]} empty="No members yet." />'}>
          <List items={[]} empty="No members yet." />
        </Example>
      </>
    ),
  },
  {
    id: 'log-viewer',
    group: '26 Data',
    title: 'LogViewer',
    description: 'Log tail with level toggles, filter and follow mode.',
    render: () => (
      <Example title="Streaming" stack code={'<LogViewer lines={lines()} height={220} />'}>
        <LogDemo />
      </Example>
    ),
  },
  {
    id: 'question-card',
    group: '23 Cards',
    title: 'QuestionCard',
    description: 'Interview or quiz question with metadata, upvote, save and an expandable answer.',
    render: () => (
      <>
        <Example title="Interactive" stack code={'<QuestionCard question="…" answer="…" onVote={…} onStar={…} />'}>
          <VoteDemo />
        </Example>
        <Example title="Without answer" stack code={'<QuestionCard question="Explain event delegation." />'}>
          <QuestionCard
            category="JavaScript"
            categoryTone="info"
            question="Explain event delegation."
            difficulty={2}
            time="5 min"
          />
        </Example>
      </>
    ),
  },
  {
    id: 'score-card',
    group: '23 Cards',
    title: 'ScoreCard',
    description: 'Computed score with verdict and per-criterion bars. Tone follows the score.',
    render: () => (
      <Example
        title="Score bands"
        stack
        code={'<ScoreCard label="ATS match" score={82} verdict="Strong match" criteria={…} />'}
      >
        <Grid columns={3} gap={4}>
          <ScoreCard
            label="ATS match"
            score={82}
            verdict="Strong match"
            hint="Based on 14 keywords"
            criteria={[
              { label: 'Skills', value: 90 },
              { label: 'Experience', value: 74 },
            ]}
          />
          <ScoreCard
            label="Quiz result"
            score={58}
            verdict="Needs work"
            criteria={[
              { label: 'Accuracy', value: 61 },
              { label: 'Speed', value: 40 },
            ]}
          />
          <ScoreCard label="Health check" score={31} verdict="At risk" />
        </Grid>
      </Example>
    ),
  },
  {
    id: 'skill-bar',
    group: '25 Data viz',
    title: 'SkillBar',
    description: 'Competency meter that grows in once on mount.',
    render: () => (
      <>
        <Example title="Tones" stack code={'<SkillBar label="TypeScript" value={90} level="Expert" />'}>
          <SkillBar label="TypeScript" value={90} level="Expert" />
          <SkillBar label="SolidJS" value={70} level="Advanced" tone="success" />
          <SkillBar label="Rust" value={35} level="Beginner" tone="warning" />
        </Example>
        <Example title="Static" stack code={'<SkillBar animate={false} … />'}>
          <SkillBar label="Profile completeness" value={60} animate={false} tone="info" />
        </Example>
      </>
    ),
  },
  {
    id: 'stat',
    group: '25 Data viz',
    title: 'Stat',
    description: 'KPI card with delta badge, hint, accent strip and trend line.',
    render: () => (
      <Example
        title="Variants"
        stack
        code={'<Stat label="Revenue" value="€48,290" delta="+12.4%" hint="vs. last month" />'}
      >
        <Grid columns={3} gap={4}>
          <Stat label="Revenue" value="€48,290" delta="+12.4%" hint="vs. last month" />
          <Stat accent="teal" label="Time to hire" value="21 d" delta="-3 d" spark={[30, 28, 26, 24, 21]} />
          <Stat label="Churn" value="2.1%" delta="+0.4%" tone="danger" hint="Higher is worse" />
        </Grid>
      </Example>
    ),
  },
  {
    id: 'timeline',
    group: '26 Data',
    title: 'Timeline',
    description: 'Vertical activity feed. Pipeline statuses, badges, facts and inline-confirmed actions.',
    render: () => (
      <>
        <Example title="Pipeline" stack code={'<Timeline items={items} />'}>
          <Timeline items={TIMELINE} />
        </Example>
        <Example title="Compact, divided" stack code={'<Timeline variant="compact" divided items={items} />'}>
          <Timeline variant="compact" divided items={TIMELINE} />
        </Example>
        <Example
          title="Actions with confirmation and add row"
          stack
          code={'<Timeline items={items} onAdd={add} onAction={run} />'}
        >
          <Timeline items={ACTION_TIMELINE} onAdd={() => undefined} onAction={() => undefined} />
        </Example>
      </>
    ),
  },
];
