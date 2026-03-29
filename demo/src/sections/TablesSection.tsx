import {
  Button,
  CodeText,
  ColumnManager,
  type ColumnManagerColumn,
  DataGridPro,
  type DataGridProColumn,
  type DataGridProColumnPinning,
  type DataGridProSortState,
  DataTable,
  type DataTableColumn,
  Heading,
  QueryBuilder,
  type QueryBuilderField,
  type QueryBuilderRule,
  type QueryBuilderValue,
  Table,
  TableAddRowAction,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  useI18n,
} from '@jankrajewskiit/ui';
import { createMemo, createSignal } from 'solid-js';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';
import { type DemoI18nMessageKey, getDemoMessages } from '../i18n/messages';
import { interpolateText, renderRichText } from '../i18n/renderRichText';

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

const DATA_GRID_COLUMNS: DataGridProColumn<PackageRow>[] = [
  { key: 'name', header: 'Package', pinned: 'left', width: 220, minWidth: 150, sortable: true },
  { key: 'version', header: 'Version', width: 120, minWidth: 90, sortable: true },
  {
    key: 'downloads',
    header: 'Downloads',
    width: 160,
    minWidth: 120,
    sortable: true,
    render: (value) => (
      <Text as="span" variant="bodySm">
        {Number(value).toLocaleString()}
      </Text>
    ),
  },
  { key: 'license', header: 'License', width: 140, minWidth: 100, sortable: true },
  { key: 'category', header: 'Category', width: 160, minWidth: 120, sortable: true, pinned: 'right' },
];

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

const createDefaultAdvancedQuery = (): QueryBuilderValue => ({
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

const TablesSection = () => {
  const { locale } = useI18n();
  const dictionary = createMemo(() => getDemoMessages(locale()));
  const t = (key: DemoI18nMessageKey, params?: Record<string, string | number>): string =>
    interpolateText(dictionary()[key], params);
  const [query, setQuery] = createSignal('');
  const [gridFilterQuery, setGridFilterQuery] = createSignal('');
  const [gridSort, setGridSort] = createSignal<DataGridProSortState>({ key: 'downloads', direction: 'desc' });
  const [selectedRows, setSelectedRows] = createSignal<string[]>([]);
  const [gridColumnOrder, setGridColumnOrder] = createSignal(DATA_GRID_DEFAULT_ORDER);
  const [gridColumnVisibility, setGridColumnVisibility] = createSignal(DATA_GRID_DEFAULT_VISIBILITY);
  const [gridColumnPinning, setGridColumnPinning] = createSignal(DATA_GRID_DEFAULT_PINNING);
  const [advancedQuery, setAdvancedQuery] = createSignal<QueryBuilderValue>(createDefaultAdvancedQuery());

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

  const packageColumns = createMemo<DataTableColumn<PackageRow>[]>(() => [
    { key: 'name', header: t('demo.text.tables.columns.package'), sortable: true },
    { key: 'version', header: t('demo.text.tables.columns.version') },
    {
      key: 'downloads',
      header: t('demo.text.tables.columns.downloads'),
      sortable: true,
      render: (val) => (
        <Text as="span" variant="bodySm">
          {Number(val).toLocaleString()}
        </Text>
      ),
    },
    { key: 'license', header: t('demo.text.tables.columns.license'), sortable: true },
  ]);

  const dataGridColumns = createMemo<DataGridProColumn<PackageRow>[]>(() => [
    {
      key: 'name',
      header: t('demo.text.tables.columns.package'),
      pinned: 'left',
      width: 220,
      minWidth: 150,
      sortable: true,
    },
    { key: 'version', header: t('demo.text.tables.columns.version'), width: 120, minWidth: 90, sortable: true },
    {
      key: 'downloads',
      header: t('demo.text.tables.columns.downloads'),
      width: 160,
      minWidth: 120,
      sortable: true,
      render: (value) => (
        <Text as="span" variant="bodySm">
          {Number(value).toLocaleString()}
        </Text>
      ),
    },
    { key: 'license', header: t('demo.text.tables.columns.license'), width: 140, minWidth: 100, sortable: true },
    {
      key: 'category',
      header: t('demo.text.tables.columns.category'),
      width: 160,
      minWidth: 120,
      sortable: true,
      pinned: 'right',
    },
  ]);

  const dataGridColumnSettings = createMemo<ColumnManagerColumn[]>(() =>
    dataGridColumns().map((column) => ({
      key: column.key,
      label: column.header,
      canHide: true,
      canPin: true,
    }))
  );

  const queryBuilderFields = createMemo<QueryBuilderField[]>(() => [
    { key: 'name', label: t('demo.text.tables.columns.package'), type: 'text' },
    { key: 'version', label: t('demo.text.tables.columns.version'), type: 'text' },
    {
      key: 'license',
      label: t('demo.text.tables.columns.license'),
      type: 'select',
      options: [
        { value: 'MIT', label: 'MIT' },
        { value: 'Apache-2.0', label: 'Apache-2.0' },
      ],
    },
    {
      key: 'category',
      label: t('demo.text.tables.columns.category'),
      type: 'select',
      options: [
        { value: 'framework', label: t('demo.text.tables.category.framework') },
        { value: 'tooling', label: t('demo.text.tables.category.tooling') },
        { value: 'language', label: t('demo.text.tables.category.language') },
        { value: 'testing', label: t('demo.text.tables.category.testing') },
        { value: 'quality', label: t('demo.text.tables.category.quality') },
        { value: 'css', label: t('demo.text.tables.category.css') },
      ],
    },
    { key: 'downloads', label: t('demo.text.tables.columns.downloads'), type: 'number' },
  ]);

  const dataGridDefaultOrder = createMemo(() => dataGridColumns().map((column) => column.key));
  const dataGridDefaultVisibility = createMemo(
    () => Object.fromEntries(dataGridColumns().map((column) => [column.key, true])) as Record<string, boolean>
  );
  const dataGridDefaultPinning = createMemo<DataGridProColumnPinning>(() =>
    Object.fromEntries(dataGridColumns().map((column) => [column.key, column.pinned ?? null]))
  );
  const resetGridWorkspace = () => {
    setGridFilterQuery('');
    setGridSort({ key: 'downloads', direction: 'desc' });
    setSelectedRows([]);
    setAdvancedQuery(createDefaultAdvancedQuery());
    setGridColumnOrder(dataGridDefaultOrder());
    setGridColumnVisibility(dataGridDefaultVisibility());
    setGridColumnPinning(dataGridDefaultPinning());
  };

  return (
    <div>
      <ShowcaseSection
        title={t('demo.showcase.tables.table.title')}
        subtitle={t('demo.showcase.tables.table.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>{t('demo.text.tables.simple.name')}</TableHeader>
                  <TableHeader>{t('demo.text.tables.simple.version')}</TableHeader>
                  <TableHeader>{t('demo.text.tables.simple.status')}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>solid-js</TableCell>
                  <TableCell>1.9.7</TableCell>
                  <TableCell>{t('demo.text.tables.simple.stable')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>vite</TableCell>
                  <TableCell>7.3.1</TableCell>
                  <TableCell>{t('demo.text.tables.simple.stable')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>typescript</TableCell>
                  <TableCell>5.9.3</TableCell>
                  <TableCell>{t('demo.text.tables.simple.stable')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>{t('demo.text.tables.simple.meta')}</ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.tables.dataTable.title')}
        subtitle={t('demo.showcase.tables.dataTable.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <DataTable<PackageRow>
              data={PACKAGE_DATA}
              columns={packageColumns()}
              pageSize={4}
              sortable
              filterable
              filterQuery={query()}
              onFilterQueryChange={setQuery}
              filterPlaceholder={t('demo.text.tables.dataTable.searchPlaceholder')}
              striped
              hoverable
            />
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>
          {renderRichText(t('demo.text.tables.dataTable.meta'), {
            pageSize: (
              <CodeText as="span" class="codeInline">
                pageSize
              </CodeText>
            ),
          })}
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.tables.dataTableEmptyState.title')}
        subtitle={t('demo.showcase.tables.dataTableEmptyState.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <DataTable<PackageRow>
              data={[]}
              columns={packageColumns()}
              pageSize={4}
              emptyMessage={t('demo.text.tables.dataTable.emptyMessage')}
            />
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="TableAddRowAction" subtitle={t('demo.recron.showcase.tableAddRowAction.subtitle')}>
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>{t('demo.text.tables.columns.package')}</TableHeader>
                  <TableHeader>{t('demo.text.tables.columns.version')}</TableHeader>
                  <TableHeader>{t('demo.text.tables.columns.downloads')}</TableHeader>
                  <TableHeader>{t('demo.text.tables.columns.license')}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableAddRowAction
                  colSpan={4}
                  label={t('demo.recron.offer.tableAddRow.label')}
                  onClick={() => undefined}
                />
              </TableBody>
            </Table>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('demo.showcase.tables.dataGridProV3.title')}
        subtitle={t('demo.showcase.tables.dataGridProV3.subtitle')}
      >
        <PreviewPanel>
          <PreviewGroup title={t('demo.text.common.examples')}>
            <div class="scenarioShell">
              <div class="scenarioHeader">
                <div class="scenarioHeaderCopy">
                  <Text as="p" variant="overline" tone="primary">
                    {t('demo.page.dataTables.title')}
                  </Text>
                  <Heading level={3} variant="titleLg">
                    {t('demo.page.dataTables.description')}
                  </Heading>
                </div>
                <div class="scenarioMetricRow">
                  <div class="scenarioMetric">
                    <Text as="span" variant="overline" tone="tertiary">
                      {t('demo.text.tables.columns.package')}
                    </Text>
                    <Text as="span" variant="labelLg">
                      {serverRows().length}
                    </Text>
                  </div>
                  <div class="scenarioMetric">
                    <Text as="span" variant="overline" tone="tertiary">
                      {t('demo.text.tables.dataGrid.selectedRows')}
                    </Text>
                    <Text as="span" variant="labelLg">
                      {selectedRows().length}
                    </Text>
                  </div>
                  <div class="scenarioMetric">
                    <Text as="span" variant="overline" tone="tertiary">
                      {t('demo.text.tables.columns.category')}
                    </Text>
                    <Text as="span" variant="labelLg">
                      {advancedQuery().rules.length}
                    </Text>
                  </div>
                </div>
              </div>

              <div class="actionCluster">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdvancedQuery(createDefaultAdvancedQuery())}
                >
                  {t('demo.text.tables.queryBuilder.clearConditions')}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={resetGridWorkspace}>
                  {t('demo.text.tables.dataGrid.resetSavedGrid')}
                </Button>
              </div>

              <QueryBuilder
                fields={queryBuilderFields()}
                value={advancedQuery()}
                onChange={setAdvancedQuery}
                description={t('demo.text.tables.queryBuilder.description')}
                addRuleLabel={t('demo.text.tables.queryBuilder.addCondition')}
                clearLabel={t('demo.text.tables.queryBuilder.clearConditions')}
              />
              <ColumnManager
                columns={dataGridColumnSettings()}
                order={gridColumnOrder()}
                onOrderChange={setGridColumnOrder}
                visibility={gridColumnVisibility()}
                onVisibilityChange={setGridColumnVisibility}
                pinning={gridColumnPinning()}
                onPinningChange={setGridColumnPinning}
                defaultOrder={dataGridDefaultOrder()}
                defaultVisibility={dataGridDefaultVisibility()}
                defaultPinning={dataGridDefaultPinning()}
                description={t('demo.text.tables.columnManager.description')}
                resetLabel={t('demo.text.tables.columnManager.resetSettings')}
              />
              <DataGridPro<PackageRow>
                data={serverRows()}
                columns={dataGridColumns()}
                persistenceKey="demo-packages-grid"
                resetPersistenceLabel={t('demo.text.tables.dataGrid.resetSavedGrid')}
                importSettingsLabel={t('demo.text.tables.dataGrid.importLayoutJson')}
                exportSettingsLabel={t('demo.text.tables.dataGrid.exportLayoutJson')}
                persistedBadgeLabel={t('demo.text.tables.dataGrid.persisted')}
                defaultBadgeLabel={t('demo.text.tables.dataGrid.default')}
                height={420}
                rowHeight={40}
                headerHeight={44}
                overscan={8}
                sortable
                filterable
                filterQuery={gridFilterQuery()}
                onFilterQueryChange={setGridFilterQuery}
                filterPlaceholder={t('demo.text.tables.dataGrid.serverFilterPlaceholder')}
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
            </div>
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>{t('demo.text.tables.dataGrid.meta', { count: selectedRows().length })}</ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default TablesSection;
