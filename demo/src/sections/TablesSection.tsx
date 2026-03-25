import {
  CodeText,
  ColumnManager,
  type ColumnManagerColumn,
  DataGridPro,
  type DataGridProColumn,
  type DataGridProColumnPinning,
  type DataGridProSortState,
  DataTable,
  type DataTableColumn,
  QueryBuilder,
  type QueryBuilderField,
  type QueryBuilderRule,
  type QueryBuilderValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jankrajewskiit/ui';
import { createMemo, createSignal } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

interface PackageRow extends Record<string, unknown> {
  id: string;
  name: string;
  version: string;
  downloads: number;
  license: string;
  category: string;
}

const PACKAGE_DATA: PackageRow[] = [
  { id: 'solid-js', name: 'solid-js', version: '1.9.7', downloads: 45000, license: 'MIT', category: 'framework' },
  { id: 'vite', name: 'vite', version: '7.3.1', downloads: 120000, license: 'MIT', category: 'tooling' },
  {
    id: 'typescript',
    name: 'typescript',
    version: '5.9.3',
    downloads: 300000,
    license: 'Apache-2.0',
    category: 'language',
  },
  { id: 'vitest', name: 'vitest', version: '3.1.0', downloads: 68000, license: 'MIT', category: 'testing' },
  { id: 'eslint', name: 'eslint', version: '9.18.0', downloads: 210000, license: 'MIT', category: 'quality' },
  { id: 'prettier', name: 'prettier', version: '4.0.0', downloads: 175000, license: 'MIT', category: 'quality' },
  { id: 'postcss', name: 'postcss', version: '8.5.1', downloads: 95000, license: 'MIT', category: 'css' },
];

const DATA_GRID_ROWS: PackageRow[] = Array.from({ length: 2500 }, (_, index) => {
  const base = PACKAGE_DATA[index % PACKAGE_DATA.length] as PackageRow;
  return {
    ...base,
    id: `${base.id}-${index + 1}`,
    name: `${base.name}-${index + 1}`,
    downloads: base.downloads + index * 11,
  };
});

const PACKAGE_COLUMNS: DataTableColumn<PackageRow>[] = [
  { key: 'name', header: 'Package', sortable: true },
  { key: 'version', header: 'Version' },
  {
    key: 'downloads',
    header: 'Downloads',
    sortable: true,
    render: (val) => <span>{Number(val).toLocaleString()}</span>,
  },
  { key: 'license', header: 'License', sortable: true },
];

const DATA_GRID_COLUMNS: DataGridProColumn<PackageRow>[] = [
  { key: 'name', header: 'Package', pinned: 'left', width: 220, minWidth: 150, sortable: true },
  { key: 'version', header: 'Version', width: 120, minWidth: 90, sortable: true },
  {
    key: 'downloads',
    header: 'Downloads',
    width: 160,
    minWidth: 120,
    sortable: true,
    render: (value) => <span>{Number(value).toLocaleString()}</span>,
  },
  { key: 'license', header: 'License', width: 140, minWidth: 100, sortable: true },
  { key: 'category', header: 'Category', width: 160, minWidth: 120, sortable: true, pinned: 'right' },
];

const DATA_GRID_COLUMN_SETTINGS: ColumnManagerColumn[] = DATA_GRID_COLUMNS.map((column) => ({
  key: column.key,
  label: column.header,
  canHide: true,
  canPin: true,
}));

const DATA_GRID_DEFAULT_ORDER = DATA_GRID_COLUMNS.map((column) => column.key);

const DATA_GRID_DEFAULT_VISIBILITY = Object.fromEntries(
  DATA_GRID_COLUMNS.map((column) => [column.key, true])
) as Record<string, boolean>;

const DATA_GRID_DEFAULT_PINNING: DataGridProColumnPinning = Object.fromEntries(
  DATA_GRID_COLUMNS.map((column) => [column.key, column.pinned ?? null])
);

const QUERY_BUILDER_FIELDS: QueryBuilderField[] = [
  { key: 'name', label: 'Package', type: 'text' },
  { key: 'version', label: 'Version', type: 'text' },
  {
    key: 'license',
    label: 'License',
    type: 'select',
    options: [
      { value: 'MIT', label: 'MIT' },
      { value: 'Apache-2.0', label: 'Apache-2.0' },
    ],
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'framework', label: 'Framework' },
      { value: 'tooling', label: 'Tooling' },
      { value: 'language', label: 'Language' },
      { value: 'testing', label: 'Testing' },
      { value: 'quality', label: 'Quality' },
      { value: 'css', label: 'CSS' },
    ],
  },
  { key: 'downloads', label: 'Downloads', type: 'number' },
];

const QUERY_FIELD_MAP = new Map(QUERY_BUILDER_FIELDS.map((field) => [field.key, field]));

const matchesRule = (row: PackageRow, rule: QueryBuilderRule): boolean => {
  const field = QUERY_FIELD_MAP.get(rule.fieldKey);
  if (!field) return true;

  const raw = row[rule.fieldKey as keyof PackageRow];
  const asString =
    typeof raw === 'string' ? raw.trim() : typeof raw === 'number' || typeof raw === 'boolean' ? String(raw) : '';
  const left = asString.toLowerCase();
  const right = rule.value.trim().toLowerCase();

  if (rule.operator === 'isEmpty') return left.length === 0;
  if (rule.operator === 'isNotEmpty') return left.length > 0;
  if (right.length === 0) return false;

  if (field.type === 'number') {
    const leftNumber = Number(raw);
    const rightNumber = Number(rule.value);
    if (Number.isNaN(leftNumber) || Number.isNaN(rightNumber)) return false;
    if (rule.operator === 'equals') return leftNumber === rightNumber;
    if (rule.operator === 'notEquals') return leftNumber !== rightNumber;
    if (rule.operator === 'gt') return leftNumber > rightNumber;
    if (rule.operator === 'gte') return leftNumber >= rightNumber;
    if (rule.operator === 'lt') return leftNumber < rightNumber;
    if (rule.operator === 'lte') return leftNumber <= rightNumber;
    return false;
  }

  if (rule.operator === 'equals') return left === right;
  if (rule.operator === 'notEquals') return left !== right;
  if (rule.operator === 'contains') return left.includes(right);
  if (rule.operator === 'startsWith') return left.startsWith(right);
  if (rule.operator === 'endsWith') return left.endsWith(right);
  return false;
};

const applyQueryBuilder = (rows: PackageRow[], query: QueryBuilderValue) => {
  if (query.rules.length === 0) return rows;
  if (query.combinator === 'or') {
    return rows.filter((row) => query.rules.some((rule) => matchesRule(row, rule)));
  }
  return rows.filter((row) => query.rules.every((rule) => matchesRule(row, rule)));
};

const TablesSection = () => {
  const [query, setQuery] = createSignal('');
  const [gridFilterQuery, setGridFilterQuery] = createSignal('');
  const [gridSort, setGridSort] = createSignal<DataGridProSortState>({ key: 'downloads', direction: 'desc' });
  const [selectedRows, setSelectedRows] = createSignal<string[]>([]);
  const [gridColumnOrder, setGridColumnOrder] = createSignal(DATA_GRID_DEFAULT_ORDER);
  const [gridColumnVisibility, setGridColumnVisibility] = createSignal(DATA_GRID_DEFAULT_VISIBILITY);
  const [gridColumnPinning, setGridColumnPinning] = createSignal(DATA_GRID_DEFAULT_PINNING);
  const [advancedQuery, setAdvancedQuery] = createSignal<QueryBuilderValue>({
    combinator: 'and',
    rules: [
      {
        id: 'query-default-1',
        fieldKey: 'category',
        operator: 'notEquals',
        value: 'css',
      },
    ],
  });

  const serverRows = createMemo(() => {
    const filter = gridFilterQuery().trim().toLowerCase();
    let rows = DATA_GRID_ROWS;

    if (filter) {
      rows = rows.filter(
        (row) =>
          row.name.toLowerCase().includes(filter) ||
          row.version.toLowerCase().includes(filter) ||
          row.license.toLowerCase().includes(filter) ||
          row.category.toLowerCase().includes(filter)
      );
    }

    rows = applyQueryBuilder(rows, advancedQuery());

    const key = gridSort().key;
    if (!key) return rows;
    const direction = gridSort().direction;
    const sorted = [...rows].sort((a, b) => {
      const aVal = a[key as keyof PackageRow];
      const bVal = b[key as keyof PackageRow];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  });

  return (
    <div>
      <ShowcaseSection title="Table" subtitle="Composable table primitives for custom layouts">
        <PreviewPanel>
          <PreviewGroup title="Examples">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Version</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>solid-js</TableCell>
                  <TableCell>1.9.7</TableCell>
                  <TableCell>stable</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>vite</TableCell>
                  <TableCell>7.3.1</TableCell>
                  <TableCell>stable</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>typescript</TableCell>
                  <TableCell>5.9.3</TableCell>
                  <TableCell>stable</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>
          Use Table, TableHead, TableBody, TableRow, TableHeader and TableCell to build custom tables with full control.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="DataTable" subtitle="Sortable and paginated data grid">
        <PreviewPanel>
          <PreviewGroup title="Examples">
            <DataTable<PackageRow>
              data={PACKAGE_DATA}
              columns={PACKAGE_COLUMNS}
              pageSize={4}
              sortable
              filterable
              filterQuery={query()}
              onFilterQueryChange={setQuery}
              filterPlaceholder="Search package, version or license"
              striped
              hoverable
            />
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>
          Click column headers to sort and use built-in filtering API. Pagination with ellipsis appears when rows exceed{' '}
          <CodeText as="span" class="codeInline">
            pageSize
          </CodeText>
          . Supports custom cell render and column width.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="DataTable empty state" subtitle="Custom message when there is no data">
        <PreviewPanel>
          <PreviewGroup title="Examples">
            <DataTable<PackageRow>
              data={[]}
              columns={PACKAGE_COLUMNS}
              pageSize={4}
              emptyMessage="No packages match your filters."
            />
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="DataGridPro v3"
        subtitle="Virtualized rows, pinning, resizing, selection, toolbar actions, visibility and reorder"
      >
        <PreviewPanel>
          <PreviewGroup title="Examples">
            <QueryBuilder
              fields={QUERY_BUILDER_FIELDS}
              value={advancedQuery()}
              onChange={setAdvancedQuery}
              description="Compose advanced filters with AND/OR logic before rendering the grid."
              addRuleLabel="Add condition"
              clearLabel="Clear conditions"
            />
            <ColumnManager
              columns={DATA_GRID_COLUMN_SETTINGS}
              order={gridColumnOrder()}
              onOrderChange={setGridColumnOrder}
              visibility={gridColumnVisibility()}
              onVisibilityChange={setGridColumnVisibility}
              pinning={gridColumnPinning()}
              onPinningChange={setGridColumnPinning}
              defaultOrder={DATA_GRID_DEFAULT_ORDER}
              defaultVisibility={DATA_GRID_DEFAULT_VISIBILITY}
              defaultPinning={DATA_GRID_DEFAULT_PINNING}
              description="Configure order, visibility and pinning before rendering the grid."
              resetLabel="Reset settings"
            />
            <DataGridPro<PackageRow>
              data={serverRows()}
              columns={DATA_GRID_COLUMNS}
              persistenceKey="demo-packages-grid"
              resetPersistenceLabel="Reset saved grid"
              importSettingsLabel="Import layout JSON"
              exportSettingsLabel="Export layout JSON"
              persistedBadgeLabel="Persisted"
              defaultBadgeLabel="Default"
              height={420}
              rowHeight={40}
              headerHeight={44}
              overscan={8}
              sortable
              filterable
              filterQuery={gridFilterQuery()}
              onFilterQueryChange={setGridFilterQuery}
              filterPlaceholder="Server filter: package, version, license or category"
              sortKey={gridSort().key}
              sortDirection={gridSort().direction}
              onSortChange={setGridSort}
              manualFiltering
              manualSorting
              selectable
              selectedRowIds={selectedRows()}
              onSelectedRowIdsChange={setSelectedRows}
              columnOrder={gridColumnOrder()}
              onColumnOrderChange={setGridColumnOrder}
              columnVisibility={gridColumnVisibility()}
              onColumnVisibilityChange={setGridColumnVisibility}
              columnPinning={gridColumnPinning()}
              onColumnPinningChange={setGridColumnPinning}
              getRowId={(row) => row.id}
              striped
            />
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>
          QueryBuilder applies advanced AND/OR rules before DataGridPro sorting. Drag header separators to resize. Use
          ColumnManager to control order, visibility and pinning, then verify the same layout in DataGridPro. Sorting
          and filtering are in manual mode (server-style control), rows support checkbox selection, and the toolbar
          still provides JSON import/export plus persisted/default layout badge. Use "Reset saved grid" to clear
          persisted layout in localStorage. Selected: {selectedRows().length}.
        </ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default TablesSection;
