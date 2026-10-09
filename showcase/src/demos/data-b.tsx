import { createSignal } from 'solid-js';
import { Button } from '../../../src/components/actions/Button';
import { Badge } from '../../../src/components/display/Badge';
import { Card } from '../../../src/components/display/Card';
import {
  ColumnManager,
  type ColumnState,
  DataGrid,
  type GridColumn,
  Kanban,
  type KanbanCard,
  type KanbanColumn,
  type RowKey,
  Scheduler,
  type SchedulerEvent,
  Table,
  type TableColumn,
  VirtualList,
  VirtualTable,
} from '../../../src/components/data';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

interface Person {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
  seats: number;
  email: string;
}

const STATUS_TONE = { Active: 'success', Invited: 'info', Suspended: 'danger' } as const;
const ROLES = ['Admin', 'Editor', 'Viewer'];
const STATUSES: Person['status'][] = ['Active', 'Invited', 'Suspended'];
const NAMES = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Linus Torvalds',
  'Margaret Hamilton',
  'Dennis Ritchie',
  'Barbara Liskov',
  'Ken Thompson',
];
const BIG_ROW_COUNT = 50_000;
const BIG_ITEM_COUNT = 20_000;

const makePeople = (count: number): Person[] =>
  Array.from({ length: count }, (_, i) => {
    const name = NAMES[i % NAMES.length] ?? 'Unknown';
    return {
      id: i + 1,
      name,
      role: ROLES[i % ROLES.length] ?? 'Viewer',
      status: STATUSES[i % STATUSES.length] ?? 'Active',
      seats: ((i * 7) % 23) + 1,
      email: `${name.split(' ')[0]?.toLowerCase() ?? 'user'}${i + 1}@example.com`,
    };
  });

const PEOPLE = makePeople(8);

const tableColumns: TableColumn<Person>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <Badge tone={STATUS_TONE[r.status]} dot>
        {r.status}
      </Badge>
    ),
  },
  { key: 'seats', label: 'Seats', align: 'right', sortable: true },
];

const pinnedColumns: TableColumn<Person>[] = [
  { key: 'name', label: 'Name', pin: 'left', width: 180 },
  { key: 'role', label: 'Role', width: 260 },
  { key: 'email', label: 'Email', width: 320 },
  { key: 'seats', label: 'Seats', align: 'right', width: 200 },
  { key: 'status', label: 'Status', pin: 'right', width: 140 },
];

const gridColumns: GridColumn<Person>[] = [
  { key: 'name', label: 'Name', editable: true, width: 180 },
  { key: 'role', label: 'Role', editable: true, options: ROLES, width: 140 },
  { key: 'seats', label: 'Seats', type: 'number', editable: true, width: 120 },
  { key: 'email', label: 'Email', width: 240 },
  { key: 'status', label: 'Status', width: 140 },
];

const kanbanColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To do', color: 'var(--dv-2)' },
  { id: 'doing', title: 'In progress', color: 'var(--dv-5)', limit: 2 },
  { id: 'done', title: 'Done', color: 'var(--dv-8)' },
];

const INITIAL_CARDS: KanbanCard[] = [
  { id: 1, column: 'todo', title: 'Write release notes', tag: 'Docs', tagTone: 'info', meta: 'Due Friday' },
  { id: 2, column: 'todo', title: 'Audit colour tokens', tag: 'Design', tagTone: 'brand' },
  { id: 3, column: 'doing', title: 'Port Table to Solid', tag: 'Dev', tagTone: 'success', meta: '3 comments' },
  { id: 4, column: 'doing', title: 'Fix focus ring in forced colors', tag: 'A11y', tagTone: 'warning' },
  { id: 5, column: 'doing', title: 'Review pull requests', tag: 'Dev', tagTone: 'success' },
  { id: 6, column: 'done', title: 'Set up CI pipeline', tag: 'Ops', tagTone: 'neutral' },
];

const todayAt = (hour: number, minutes = 0) => {
  const d = new Date();
  d.setHours(hour, minutes, 0, 0);
  return d;
};

const SCHEDULE: SchedulerEvent[] = [
  { id: 1, title: 'Stand-up', start: todayAt(9), end: todayAt(9, 30), meta: 'Room 2' },
  { id: 2, title: 'Design review', start: todayAt(10), end: todayAt(11, 30), tone: 'info', meta: 'Studio' },
  { id: 3, title: 'Pairing', start: todayAt(10, 30), end: todayAt(12), tone: 'success' },
  { id: 4, title: 'Planning', start: todayAt(14), end: todayAt(15), tone: 'warning' },
];

const BIG_ROWS = makePeople(BIG_ROW_COUNT);
const BIG_ITEMS = Array.from({ length: BIG_ITEM_COUNT }, (_, i) => `Item ${i + 1}`);

const TableDemo = () => {
  const [selected, setSelected] = createSignal<RowKey[]>([]);
  return (
    <Card padding="none">
      <Table
        title="Team"
        selectable
        resizable
        selected={selected()}
        onSelectedChange={setSelected}
        columns={tableColumns}
        rows={PEOPLE}
        bulkActions={
          <Button size="sm" variant="secondary">
            Invite again
          </Button>
        }
        renderExpanded={(r) => <span>{r.email}</span>}
      />
    </Card>
  );
};

const DataGridDemo = () => {
  const [rows, setRows] = createSignal(PEOPLE);
  return (
    <DataGrid
      columns={gridColumns}
      rows={rows()}
      onRowsChange={(next) => setRows(next)}
      searchable
      selectable
      columnManager
      onExport={null}
      footer
      filterFields={[
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role', type: 'select', options: ROLES.map((r) => ({ value: r, label: r })) },
        { key: 'seats', label: 'Seats', type: 'number' },
      ]}
    />
  );
};

const ColumnManagerDemo = () => {
  const [state, setState] = createSignal<ColumnState[]>([]);
  return (
    <div style={{ width: '320px' }}>
      <ColumnManager
        pinRight
        maxPinned={3}
        columns={[
          { key: 'name', label: 'Name', locked: true, pin: 'left' },
          { key: 'role', label: 'Role' },
          { key: 'email', label: 'Email' },
          { key: 'seats', label: 'Seats' },
          { key: 'status', label: 'Status', visible: false },
        ]}
        onValueChange={setState}
      />
      <p>
        {state().length
          ? `${state().filter((c) => c.visible).length} columns visible`
          : 'Change a setting to see the state.'}
      </p>
    </div>
  );
};

const KanbanDemo = () => {
  const [cards, setCards] = createSignal(INITIAL_CARDS);
  return <Kanban columns={kanbanColumns} cards={cards()} onCardsChange={setCards} onAddCard={() => undefined} />;
};

const VirtualListDemo = () => {
  const [selected, setSelected] = createSignal<RowKey>(1);
  return (
    <VirtualList
      items={BIG_ITEMS}
      label="Items"
      height={280}
      divided
      selectable
      getKey={(_, i) => i + 1}
      selected={selected()}
      onSelect={(key) => setSelected(key)}
    />
  );
};

export const dataBDemos: DemoEntry[] = [
  {
    id: 'table',
    group: '26 Data',
    title: 'Table',
    description:
      'Sortable, selectable, resizable table with bulk actions, expandable rows, pinned columns and loading / empty states.',
    render: () => (
      <>
        <Example
          title="Selectable, sortable, resizable"
          stack
          code={'<Table selectable resizable columns={columns} rows={rows} />'}
        >
          <TableDemo />
        </Example>
        <Example
          title="Pinned columns with max height"
          stack
          code={'<Table columns={columns} rows={rows} maxHeight={240} />'}
        >
          <div style={{ 'max-width': '480px' }}>
            <Table columns={pinnedColumns} rows={PEOPLE} maxHeight={240} />
          </div>
        </Example>
        <Example title="Loading and empty" stack code={'<Table loading columns={columns} rows={[]} />'}>
          <Table loading columns={tableColumns} rows={[]} />
          <Table columns={tableColumns} rows={[]} empty="No members match your filters." />
        </Example>
      </>
    ),
  },
  {
    id: 'data-grid',
    group: '26 Data',
    title: 'DataGrid',
    description:
      'Editing grid: single active cell, keyboard editing, search, query filters, column manager, export and bulk selection.',
    render: () => (
      <Example
        title="Editable grid"
        stack
        code={'<DataGrid columns={columns} rows={rows} onRowsChange={setRows} searchable selectable columnManager />'}
      >
        <DataGridDemo />
      </Example>
    ),
  },
  {
    id: 'column-manager',
    group: '26 Data',
    title: 'ColumnManager',
    description: 'Show, hide, reorder and freeze table columns; feed Table with ApplyColumns.',
    render: () => (
      <Example
        title="With pin limit and right section"
        code={'<ColumnManager columns={columns} pinRight maxPinned={3} />'}
      >
        <ColumnManagerDemo />
      </Example>
    ),
  },
  {
    id: 'kanban',
    group: '27 Planning',
    title: 'Kanban',
    description: 'Column task board with drag and drop and a keyboard move model (Ctrl/⌘/Alt + arrows).',
    render: () => (
      <Example
        title="Board with WIP limit"
        stack
        code={'<Kanban columns={columns} cards={cards} onCardsChange={setCards} />'}
      >
        <KanbanDemo />
      </Example>
    ),
  },
  {
    id: 'scheduler',
    group: '27 Planning',
    title: 'Scheduler',
    description: 'Day and week time grid with overlap lanes, a now-line and slot clicks.',
    render: () => (
      <Example
        title="Week view"
        stack
        code={'<Scheduler events={events} onSlotClick={(start, end) => open(start, end)} />'}
      >
        <Scheduler events={SCHEDULE} onSlotClick={() => undefined} onEventClick={() => undefined} maxHeight={420} />
      </Example>
    ),
  },
  {
    id: 'virtual-list',
    group: '26 Data',
    title: 'VirtualList',
    description: 'Windowed list for thousands of rows with listbox selection and keyboard navigation.',
    render: () => (
      <Example
        title="20,000 items"
        stack
        code={'<VirtualList items={items} selectable selected={selected} onSelect={setSelected} />'}
      >
        <VirtualListDemo />
      </Example>
    ),
  },
  {
    id: 'virtual-table',
    group: '26 Data',
    title: 'VirtualTable',
    description: 'Windowed table for tens of thousands of rows.',
    render: () => (
      <Example title="50,000 rows" stack code={'<VirtualTable columns={columns} rows={rows} height={320} />'}>
        <VirtualTable
          columns={[
            { key: 'id', label: 'ID', width: 80 },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email', flex: 2 },
            { key: 'seats', label: 'Seats', width: 100, align: 'right' },
          ]}
          rows={BIG_ROWS}
          height={320}
        />
      </Example>
    ),
  },
];
