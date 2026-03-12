import {
  DataGridPro,
  type DataGridProColumn,
  type DataGridProSortState,
  DataTable,
  type DataTableColumn,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jankrajewskiit/ui';
import { createMemo, createSignal } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

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
  const base = PACKAGE_DATA[index % PACKAGE_DATA.length];
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

const TablesSection = () => {
  const [page, setPage] = createSignal(5);
  const [query, setQuery] = createSignal('');
  const [gridFilterQuery, setGridFilterQuery] = createSignal('');
  const [gridSort, setGridSort] = createSignal<DataGridProSortState>({ key: 'downloads', direction: 'desc' });
  const [selectedRows, setSelectedRows] = createSignal<string[]>([]);

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
        </PreviewPanel>
        <ShowcaseMeta>
          Use Table, TableHead, TableBody, TableRow, TableHeader and TableCell to build custom tables with full control.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="DataTable" subtitle="Sortable and paginated data grid">
        <PreviewPanel>
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
        </PreviewPanel>
        <ShowcaseMeta>
          Click column headers to sort and use built-in filtering API. Pagination with ellipsis appears when rows exceed{' '}
          <span class="code-inline">pageSize</span>. Supports custom cell render and column width.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="DataTable empty state" subtitle="Custom message when there is no data">
        <PreviewPanel>
          <DataTable<PackageRow>
            data={[]}
            columns={PACKAGE_COLUMNS}
            pageSize={4}
            emptyMessage="No packages match your filters."
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="DataGridPro v3"
        subtitle="Virtualized rows, pinning, resizing, selection, toolbar actions, visibility and reorder"
      >
        <PreviewPanel>
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
            getRowId={(row) => row.id}
            striped
          />
        </PreviewPanel>
        <ShowcaseMeta>
          Drag header separators to resize. Left and right pinned columns are enabled. Sorting and filtering are in
          manual mode (server-style control), rows support checkbox selection, and the toolbar allows column visibility
          toggles, drag-and-drop reorder, JSON import/export of settings, plus persisted/default layout badge. Use
          "Reset saved grid" to clear persisted layout in localStorage. Selected: {selectedRows().length}.
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="Pagination" subtitle="Navigate large result sets">
        <PreviewPanel>
          <Pagination
            page={page()}
            totalPages={19}
            onChange={setPage}
            previousLabel="Previous"
            nextLabel="Next"
            ariaLabel="Table pages"
          />
        </PreviewPanel>
        <ShowcaseMeta>
          Current page: <strong>{page()}</strong>. Use with custom lists or tables when you need page navigation without
          DataTable.
        </ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default TablesSection;
