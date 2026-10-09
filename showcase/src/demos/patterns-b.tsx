import { createSignal, Show } from 'solid-js';
import { Button, Text } from '../../../src';
import {
  type Billing,
  CommentThread,
  DualFilterBar,
  FilterBar,
  type FilterDef,
  type FilterValue,
  FlashcardSession,
  FlashcardSetup,
  FlashcardSummary,
  type FlashResult,
  type ImportSource,
  ImportSourcesDialog,
  type PricingTier,
  PricingTable,
  type PromptAttachment,
  PromptInput,
  QueryBuilder,
  type QueryField,
  type QueryGroup,
} from '../../../src/components/patterns';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const SIMULATED_DELAY_MS = 700;
const delay = () => new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

const COMMENTS = [
  {
    id: 1,
    author: 'Jan Dąbrowski',
    role: 'Recruiter',
    time: '3h',
    body: 'Strong portfolio. I would move her straight to the technical interview.',
    likes: 2,
    replies: [
      {
        id: 11,
        author: 'Ada Kowalska',
        time: '2h',
        body: '@Jan agreed — I can take it on Thursday.',
        likes: 1,
        liked: true,
      },
      { id: 12, author: 'Ola Nowak', time: '2h', body: 'Thursday works for the panel too.' },
      { id: 13, author: 'Jan Dąbrowski', time: '1h', body: 'Booked 14:00. Invite sent.' },
    ],
  },
  {
    id: 2,
    author: 'Ada Kowalska',
    time: '40m',
    body: 'Reminder: check the GraphQL gap before the call.\nThe take-home did not cover it.',
    edited: true,
  },
];

const DUAL_FILTERS = [
  { value: 'design', label: 'Design', count: 24 },
  { value: 'eng', label: 'Engineering', count: 41 },
  { value: 'research', label: 'Research', count: 8 },
];
const DUAL_SORTS = [
  { value: 'new', label: 'Newest' },
  { value: 'az', label: 'A–Z' },
  { value: 'pop', label: 'Popular' },
];
const ALL_RESULTS = 73;
const RESULTS_PER_FILTER = 11;

const DualFilterBarDemo = () => {
  const [filters, setFilters] = createSignal(['design']);
  const [query, setQuery] = createSignal('');
  return (
    <>
      <Example title='variant="simple"' stack code={'<DualFilterBar variant="simple" filters={…} sorts={…} />'}>
        <DualFilterBar variant="simple" filters={DUAL_FILTERS} defaultFilterValue={['design']} sorts={DUAL_SORTS} />
      </Example>
      <Example title='variant="full" — controlled, search and count' stack>
        <DualFilterBar
          filters={DUAL_FILTERS}
          filterValue={filters()}
          onFilterChange={setFilters}
          sorts={DUAL_SORTS}
          search={query()}
          onSearchChange={setQuery}
          count={filters().length ? filters().length * RESULTS_PER_FILTER : ALL_RESULTS}
        />
      </Example>
    </>
  );
};

const FACETS: FilterDef[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active', dot: 'success', count: 84 },
      { value: 'trial', label: 'Trial', dot: 'info', count: 31 },
      { value: 'paused', label: 'Paused', dot: 'warning', count: 9 },
      { value: 'churned', label: 'Churned', dot: 'danger', count: 4 },
    ],
  },
  {
    key: 'plan',
    label: 'Plan',
    icon: 'tag',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
      { value: 'team', label: 'Team' },
      { value: 'ent', label: 'Enterprise' },
    ],
  },
  {
    key: 'owner',
    label: 'Owner',
    icon: 'user',
    multiple: false,
    options: [
      { value: 'me', label: 'Me' },
      { value: 'anna', label: 'Anna K.' },
      { value: 'jan', label: 'Jan N.' },
    ],
  },
];
const TOTAL_CUSTOMERS = 128;
const PER_STATUS = 7;
const PER_PLAN = 11;

const FilterBarDemo = () => {
  const [value, setValue] = createSignal<FilterValue>({ status: ['active'], plan: ['pro', 'team'] });
  const matches = () =>
    Math.max(0, TOTAL_CUSTOMERS - (value().status?.length ?? 0) * PER_STATUS - (value().plan?.length ?? 0) * PER_PLAN);
  return (
    <Example
      title="Faceted filters"
      stack
      code={'<FilterBar filters={…} value={value()} onChange={setValue} resultCount={n} />'}
    >
      <FilterBar
        filters={FACETS}
        value={value()}
        onChange={setValue}
        searchPlaceholder="Search customers…"
        resultCount={matches()}
        resultLabel="customers"
        actions={
          <Button variant="secondary" size="sm" iconLeft="download">
            Export
          </Button>
        }
      />
    </Example>
  );
};

const FLASH_CARDS = [
  { front: 'la estantería', back: 'the bookshelf', example: 'Los libros están en la estantería.' },
  { front: 'el cajón', back: 'the drawer' },
  { front: 'la almohada', back: 'the pillow' },
  { front: 'el grifo', back: 'the tap' },
  { front: 'la bombilla', back: 'the light bulb' },
];
const FLASH_DECKS = [
  { id: 'es4', name: 'Spanish · Unit 4', total: 48, due: 5 },
  { id: 'es3', name: 'Spanish · Unit 3', total: 62 },
  { id: 'de1', name: 'German · Basics', total: 120, due: 18 },
];

type FlashStage = 'setup' | 'run' | 'done';

const FlashcardsDemo = () => {
  const [stage, setStage] = createSignal<FlashStage>('setup');
  const [results, setResults] = createSignal<FlashResult[]>([]);
  return (
    <Example title="Setup → session (Space · 1 · 2) → summary" stack>
      <Show when={stage() === 'setup'}>
        <FlashcardSetup decks={FLASH_DECKS} onStart={() => setStage('run')} />
      </Show>
      <Show when={stage() === 'run'}>
        <div style={{ width: '100%', 'max-width': '520px' }}>
          <FlashcardSession
            cards={FLASH_CARDS}
            onExit={() => setStage('setup')}
            onFinish={(finished) => {
              setResults(finished);
              setStage('done');
            }}
          />
        </div>
      </Show>
      <Show when={stage() === 'done'}>
        <FlashcardSummary
          results={results()}
          onRestart={() => setStage('run')}
          onReviewMissed={() => setStage('run')}
          onDone={() => setStage('setup')}
        />
      </Show>
    </Example>
  );
};

const INITIAL_SOURCES: ImportSource[] = [
  {
    id: 'csv',
    name: 'CSV upload',
    description: 'Spreadsheet export from any tool',
    icon: 'file',
    status: 'connected',
    count: 1240,
    defaultSelected: true,
  },
  {
    id: 'gd',
    name: 'Google Drive',
    description: 'anna@velvet.design',
    icon: 'folder',
    status: 'connected',
    count: 318,
    color: 'var(--dv-4)',
  },
  { id: 'nt', name: 'Notion', icon: 'file', status: 'error', error: 'Access expired — reconnect to continue' },
  {
    id: 'db',
    name: 'Postgres',
    description: 'Read-only connection string',
    icon: 'database',
    status: 'available',
    color: 'var(--dv-7)',
  },
  {
    id: 'mail',
    name: 'Mailbox',
    description: 'Import threads as tasks',
    icon: 'mail',
    status: 'available',
    color: 'var(--dv-2)',
  },
];
const CONNECTED_COUNT = 250;

const ImportDemo = () => {
  const [open, setOpen] = createSignal(false);
  const [sources, setSources] = createSignal(INITIAL_SOURCES);
  const connect = async (id: string) => {
    await delay();
    setSources(
      sources().map((source) =>
        source.id === id ? { ...source, status: 'connected', count: CONNECTED_COUNT, error: undefined } : source,
      ),
    );
  };
  const runImport = async () => {
    await delay();
    setOpen(false);
  };
  return (
    <Example title="Connected / Available groups with async Connect and Import">
      <Button variant="secondary" iconLeft="download" onClick={() => setOpen(true)}>
        Import from…
      </Button>
      <ImportSourcesDialog
        open={open()}
        onClose={() => setOpen(false)}
        sources={sources()}
        onConnect={connect}
        onImport={runImport}
      />
    </Example>
  );
};

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: '0 zł', yearly: '0 zł' },
    blurb: 'For one person trying things out.',
    features: [
      '1 workspace',
      '3 projects',
      'Community support',
      { label: 'SSO', included: false },
      { label: 'Audit log', included: false },
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: { monthly: '89 zł', yearly: '890 zł' },
    note: { monthly: 'per seat', yearly: 'per seat · 74 zł / month' },
    blurb: 'For teams shipping every week.',
    featured: true,
    includes: 'Everything in Starter, plus',
    features: ['Unlimited projects', 'SSO', 'Priority support', 'Custom labels'],
  },
  {
    id: 'atlas',
    name: 'Atlas',
    price: 'Talk to us',
    blurb: 'For organisations with compliance needs.',
    cta: 'Contact sales',
    includes: 'Everything in Studio, plus',
    features: ['Dedicated instance', 'Audit log', '99.95% uptime SLA'],
  },
];

const PricingDemo = () => {
  const [message, setMessage] = createSignal('');
  const select = (tier: PricingTier, billing: Billing) => setMessage(`Selected ${tier.name} · ${billing}`);
  return (
    <Example title="Three tiers, featured Studio, current plan, billing switch" stack>
      <PricingTable tiers={PRICING_TIERS} yearlyNote="2 months free" current="starter" onSelect={select} />
      <Show when={message()}>
        <Text variant="caption" tone="secondary">
          {message()}
        </Text>
      </Show>
    </Example>
  );
};

const PromptInputDemo = () => {
  const [files, setFiles] = createSignal<PromptAttachment[]>([
    { id: '1', name: 'Q3-hiring-plan.pdf', size: '240 KB' },
    { id: '2', name: 'open-roles.csv', icon: 'file', size: '12 KB' },
  ]);
  const [sent, setSent] = createSignal('');
  return (
    <>
      <Example title="Attachments · toolbar slot · auto-grow" stack>
        <PromptInput
          attachments={files()}
          onRemoveAttachment={(removed) => setFiles(files().filter((file) => file.id !== removed.id))}
          onAttach={() => undefined}
          onSubmit={(text) => setSent(text)}
          defaultValue="Compare these against last quarter and flag roles that are behind plan."
          toolbar={
            <Button variant="ghost" size="sm" iconLeft="sparkles">
              Deep analysis
            </Button>
          }
        />
        <Show when={sent()}>
          <Text variant="caption" tone="secondary">
            Submitted: {sent()}
          </Text>
        </Show>
      </Example>
      <Example title="Suggestions while empty" stack>
        <PromptInput suggestions={['Summarise this week', 'Draft a job post', 'Find overdue tasks']} />
      </Example>
      <Example title="loading → Stop · Esc" stack>
        <PromptInput loading onStop={() => undefined} placeholder="Ask a follow-up…" />
      </Example>
      <Example title="disabled" stack>
        <PromptInput disabled />
      </Example>
    </>
  );
};

const QUERY_FIELDS: QueryField[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'trial', label: 'Trial' },
      { value: 'churned', label: 'Churned' },
    ],
  },
  {
    key: 'plan',
    label: 'Plan',
    type: 'select',
    options: [
      { value: 'pro', label: 'Pro' },
      { value: 'team', label: 'Team' },
    ],
  },
  { key: 'seats', label: 'Seats', type: 'number' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'signup', label: 'Signed up', type: 'date' },
];
const QUERY: QueryGroup = {
  id: 'root',
  combinator: 'and',
  rules: [
    { id: 'r1', field: 'status', op: 'eq', value: 'active' },
    {
      id: 'g1',
      combinator: 'or',
      rules: [
        { id: 'r2', field: 'plan', op: 'eq', value: 'team' },
        { id: 'r3', field: 'seats', op: 'gt', value: '10' },
      ],
    },
  ],
};

export const patternsBDemos: DemoEntry[] = [
  {
    id: 'comment-thread',
    group: '28 Patterns',
    title: 'CommentThread',
    description:
      'Discussion on one object: like, reply, edit and delete own comments with inline confirmation. One nesting level, long threads collapse.',
    render: () => (
      <Example
        title="Thread as Ada Kowalska"
        stack
        code={'<CommentThread currentUser="Ada Kowalska" comments={comments} onChange={save} />'}
      >
        <CommentThread currentUser="Ada Kowalska" comments={COMMENTS} />
      </Example>
    ),
  },
  {
    id: 'dual-filter-bar',
    group: '28 Patterns',
    title: 'DualFilterBar',
    description: 'One toolbar, two independent chip groups: multi-select filters with Clear and single-choice sort.',
    render: () => <DualFilterBarDemo />,
  },
  {
    id: 'filter-bar',
    group: '28 Patterns',
    title: 'FilterBar',
    description: 'Search plus faceted filter chips. A chip with one pick reads "Status: Active", several show a count.',
    render: () => <FilterBarDemo />,
  },
  {
    id: 'flashcards',
    group: '28 Patterns',
    title: 'FlashcardSession',
    description: 'Study flow: FlashcardSetup, one-card-at-a-time FlashcardSession and the FlashcardSummary result.',
    render: () => <FlashcardsDemo />,
  },
  {
    id: 'import-sources-dialog',
    group: '28 Patterns',
    title: 'ImportSourcesDialog',
    description:
      'Dialog checklist of import sources. Connected rows are selectable; available or errored rows connect asynchronously.',
    render: () => <ImportDemo />,
  },
  {
    id: 'pricing-table',
    group: '28 Patterns',
    title: 'PricingTable',
    description: 'Plan comparison with one featured tier, per-period prices and a Monthly / Yearly switch.',
    render: () => <PricingDemo />,
  },
  {
    id: 'prompt-input',
    group: '28 Patterns',
    title: 'PromptInput',
    description:
      'AI chat composer: auto-grow, attachments, suggestions, toolbar slot, Send turns into Stop while loading.',
    render: () => <PromptInputDemo />,
  },
  {
    id: 'query-builder',
    group: '28 Patterns',
    title: 'QueryBuilder',
    description: 'Visual condition builder with typed operators, nested groups and a readable summary.',
    render: () => (
      <Example
        title="Nested group with summary"
        stack
        code={'<QueryBuilder fields={fields} defaultValue={query} showSummary />'}
      >
        <QueryBuilder fields={QUERY_FIELDS} defaultValue={QUERY} showSummary />
      </Example>
    ),
  },
];
