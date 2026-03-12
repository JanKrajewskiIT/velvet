import {
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
import { createSignal } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

interface PackageRow extends Record<string, unknown> {
  name: string;
  version: string;
  downloads: number;
  license: string;
}

const PACKAGE_DATA: PackageRow[] = [
  { name: 'solid-js', version: '1.9.7', downloads: 45000, license: 'MIT' },
  { name: 'vite', version: '7.3.1', downloads: 120000, license: 'MIT' },
  { name: 'typescript', version: '5.9.3', downloads: 300000, license: 'Apache-2.0' },
  { name: 'vitest', version: '3.1.0', downloads: 68000, license: 'MIT' },
  { name: 'eslint', version: '9.18.0', downloads: 210000, license: 'MIT' },
  { name: 'prettier', version: '4.0.0', downloads: 175000, license: 'MIT' },
  { name: 'postcss', version: '8.5.1', downloads: 95000, license: 'MIT' },
];

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

const TablesSection = () => {
  const [page, setPage] = createSignal(5);
  const [query, setQuery] = createSignal('');

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
