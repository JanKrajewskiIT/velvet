import { createSignal, For } from 'solid-js';
import {
  Autocomplete,
  Cascader,
  Checkbox,
  Chip,
  ChipGroup,
  MultiSelect,
  OptionSwitcher,
  Radio,
  Rating,
  RatingSummary,
  Select,
  Slider,
  type SliderValue,
  Switch,
  Text,
  TransferList,
  TreeSelect,
  type SwitcherOption,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const LOAD_DELAY_MS = 400;

const COUNTRIES = ['Poland', 'Germany', 'France', 'Spain', 'Portugal', 'Italy', 'Netherlands', 'Sweden'];
const ROLE_OPTIONS = [
  { value: 'owner', label: 'Owner', description: 'Full access', icon: 'shield' },
  { value: 'admin', label: 'Admin', description: 'Manage members', icon: 'users' },
  { value: 'editor', label: 'Editor', description: 'Edit content', icon: 'pencil' },
  { value: 'viewer', label: 'Viewer', description: 'Read only', icon: 'eye', disabled: true },
];
const REGIONS = [
  {
    id: 'eu',
    label: 'Europe',
    children: [
      {
        id: 'pl',
        label: 'Poland',
        children: [
          { id: 'waw', label: 'Warsaw' },
          { id: 'krk', label: 'Kraków' },
        ],
      },
      {
        id: 'de',
        label: 'Germany',
        children: [
          { id: 'ber', label: 'Berlin' },
          { id: 'muc', label: 'Munich' },
        ],
      },
    ],
  },
  {
    id: 'na',
    label: 'North America',
    children: [{ id: 'us', label: 'United States', children: [{ id: 'nyc', label: 'New York' }] }],
  },
];
const TREE = [
  {
    id: 'design',
    label: 'Design',
    children: [
      { id: 'ui', label: 'UI' },
      { id: 'ux', label: 'UX' },
      { id: 'brand', label: 'Brand' },
    ],
  },
  {
    id: 'eng',
    label: 'Engineering',
    children: [
      { id: 'web', label: 'Web' },
      { id: 'api', label: 'API' },
    ],
  },
  { id: 'ops', label: 'Operations' },
];
const TEAM = [
  { value: 'anna', label: 'Anna Kowalska', meta: 'Design', group: 'Design' },
  { value: 'marek', label: 'Marek Nowak', meta: 'Design', group: 'Design' },
  { value: 'ewa', label: 'Ewa Wiśniewska', meta: 'Engineering', group: 'Engineering' },
  { value: 'jan', label: 'Jan Zieliński', meta: 'Engineering', group: 'Engineering' },
  { value: 'ola', label: 'Ola Mazur', meta: 'Operations', group: 'Operations' },
];
const VIEW_OPTIONS: SwitcherOption[] = [
  { value: 'list', label: 'List', icon: 'list' },
  { value: 'grid', label: 'Grid', icon: 'layout-grid' },
  { value: 'board', label: 'Board', icon: 'columns' },
];
const FILTER_OPTIONS = ['Design', 'Engineering', 'Product', 'Ops'];
const REVIEW_COUNTS = [2, 3, 9, 41, 88];
const SLIDER_MARKS = [0, 25, 50, 75, 100];
const SELECTION_CAP = 3;

const searchCountries = (query: string) =>
  new Promise<string[]>((resolve) =>
    setTimeout(
      () => resolve(COUNTRIES.filter((name) => name.toLowerCase().includes(query.toLowerCase()))),
      LOAD_DELAY_MS,
    ),
  );

const SwitcherDemo = () => {
  const [view, setView] = createSignal('list');
  return (
    <>
      <OptionSwitcher label="View" options={VIEW_OPTIONS} value={view()} onValueChange={setView} />
      <OptionSwitcher label="View icons" options={VIEW_OPTIONS} iconOnly defaultValue="grid" />
      <OptionSwitcher label="Plan" variant="chips" options={['Monthly', 'Yearly', 'Lifetime']} />
      <OptionSwitcher label="Layout" variant="tiles" options={VIEW_OPTIONS} defaultValue="board" />
      <Text variant="caption" tone="secondary">
        View: {view()}
      </Text>
    </>
  );
};

const SliderDemo = () => {
  const [range, setRange] = createSignal<SliderValue>([20, 60]);
  return (
    <>
      <div class="sc-field">
        <Slider label="Volume" defaultValue={40} showValue />
      </div>
      <div class="sc-field">
        <Slider label="Price range" value={range()} onValueChange={setRange} showValue showBounds />
      </div>
      <div class="sc-field">
        <Slider label="Snap to marks" marks={SLIDER_MARKS} snapToMarks defaultValue={50} />
      </div>
    </>
  );
};

const RatingSummaryDemo = () => {
  const [star, setStar] = createSignal<number | null>(null);
  return (
    <div class="sc-field">
      <RatingSummary counts={REVIEW_COUNTS} activeStar={star()} onFilter={setStar} />
    </div>
  );
};

export const formsChoiceDemos: DemoEntry[] = [
  {
    id: 'select',
    group: '17 Selection',
    title: 'Select',
    description: 'Custom listbox select. ↑ ↓ Home End Enter Esc and type-ahead; opens upward near the viewport bottom.',
    render: () => (
      <>
        <Example
          title="Plain, with descriptions and disabled option"
          code={'<Select options={[{ value, label, description, icon }]} />'}
        >
          <div class="sc-field">
            <Select label="Country" options={COUNTRIES} placeholder="Pick a country" />
          </div>
          <div class="sc-field">
            <Select label="Role" options={ROLE_OPTIONS} defaultValue="editor" hint="Viewer is unavailable" />
          </div>
        </Example>
        <Example title="Sizes and error">
          <div class="sc-field">
            <Select size="sm" label="Small" options={COUNTRIES} />
          </div>
          <div class="sc-field">
            <Select size="lg" label="Large" options={COUNTRIES} />
          </div>
          <div class="sc-field">
            <Select label="Required" options={COUNTRIES} error="Choose a country" />
          </div>
        </Example>
      </>
    ),
  },
  {
    id: 'autocomplete',
    group: '17 Selection',
    title: 'Autocomplete',
    description: 'Type-to-filter single select. Local options or async `loadOptions` with skeleton and retry.',
    render: () => (
      <Example title="Local, async and custom values" code={'<Autocomplete loadOptions={search} allowCustom />'}>
        <div class="sc-field">
          <Autocomplete label="Country" options={COUNTRIES} placeholder="Start typing…" />
        </div>
        <div class="sc-field">
          <Autocomplete label="Remote search" loadOptions={searchCountries} placeholder="Async (400 ms)" />
        </div>
        <div class="sc-field">
          <Autocomplete label="Allow custom" options={COUNTRIES} allowCustom />
        </div>
      </Example>
    ),
  },
  {
    id: 'multi-select',
    group: '17 Selection',
    title: 'MultiSelect',
    description:
      'Pick many from a searchable list. Selected values are removable tags; the footer shows count and Clear.',
    render: () => (
      <Example title="With a cap" code={'<MultiSelect options={…} max={3} />'}>
        <div class="sc-field">
          <MultiSelect label="Countries" options={COUNTRIES} defaultValue={['Poland']} />
        </div>
        <div class="sc-field">
          <MultiSelect label="Up to three" options={COUNTRIES} max={SELECTION_CAP} hint="Rows disable at the cap" />
        </div>
      </Example>
    ),
  },
  {
    id: 'cascader',
    group: '17 Selection',
    title: 'Cascader',
    description: 'Single-path hierarchical pick shown as side-by-side columns.',
    render: () => (
      <Example title="Columns and search" code={'<Cascader data={regions} searchable />'}>
        <div class="sc-field">
          <Cascader label="Location" data={REGIONS} placeholder="Region / country / city" />
        </div>
        <div class="sc-field">
          <Cascader label="Searchable, last label" data={REGIONS} searchable displayLast />
        </div>
      </Example>
    ),
  },
  {
    id: 'tree-select',
    group: '17 Selection',
    title: 'TreeSelect',
    description: 'Hierarchical select with search; single or multiple with tri-state parents.',
    render: () => (
      <Example title="Single and multiple" code={'<TreeSelect data={tree} multiple />'}>
        <div class="sc-field">
          <TreeSelect label="Team" data={TREE} />
        </div>
        <div class="sc-field">
          <TreeSelect label="Teams" data={TREE} multiple defaultExpanded={['design']} />
        </div>
      </Example>
    ),
  },
  {
    id: 'transfer-list',
    group: '17 Selection',
    title: 'TransferList',
    description: 'Two lists with search, grouping and reordering for assigning members or permissions.',
    render: () => (
      <Example
        title="Grouped, searchable, orderable"
        stack
        code={'<TransferList items={team} searchable orderable groupBy />'}
      >
        <TransferList
          items={TEAM}
          defaultValue={['anna']}
          searchable
          orderable
          groupBy
          titles={['Available', 'Assigned']}
        />
      </Example>
    ),
  },
  {
    id: 'checkbox',
    group: '17 Selection',
    title: 'Checkbox',
    description: 'Multi-select and consent. Supports an indeterminate state.',
    render: () => (
      <Example title="States" code={'<Checkbox label="I agree" description="Terms apply" />'}>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" checked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="With description" description="Secondary line under the label" />
        <Checkbox label="Small" size="sm" />
        <Checkbox label="Disabled" disabled />
      </Example>
    ),
  },
  {
    id: 'radio',
    group: '17 Selection',
    title: 'Radio',
    description: 'One of 2–5 visible options. Group with a shared `name`.',
    render: () => (
      <Example title="Group" code={'<Radio name="plan" label="Free" />'}>
        <Radio name="plan" label="Free" checked />
        <Radio name="plan" label="Pro" description="Billed monthly" />
        <Radio name="plan" label="Team" size="sm" />
        <Radio name="plan" label="Disabled" disabled />
      </Example>
    ),
  },
  {
    id: 'switch',
    group: '17 Selection',
    title: 'Switch',
    description: 'Instant on/off setting that needs no Save.',
    render: () => (
      <Example title="States" code={'<Switch label="Notifications" />'}>
        <Switch label="Notifications" checked />
        <Switch label="With description" description="Email me weekly digests" />
        <Switch label="Small" size="sm" />
        <Switch label="Disabled" disabled />
      </Example>
    ),
  },
  {
    id: 'option-switcher',
    group: '17 Selection',
    title: 'OptionSwitcher',
    description: 'Required single choice among 2–5 options. ←→ move and select.',
    render: () => (
      <Example title="track · icon-only · chips · tiles" code={'<OptionSwitcher variant="tiles" options={[…]} />'}>
        <SwitcherDemo />
      </Example>
    ),
  },
  {
    id: 'chip-group',
    group: '17 Selection',
    title: 'Chip & ChipGroup',
    description:
      'Toggle chips for tagging and filtering. Multi-select by default; `multiple={false}` is a deselectable single choice.',
    render: () => (
      <>
        <Example title="Multiple and single" code={'<ChipGroup options={[…]} multiple={false} />'}>
          <ChipGroup label="Departments" options={FILTER_OPTIONS} defaultValue={['Design']} />
          <ChipGroup label="One department" options={FILTER_OPTIONS} multiple={false} />
        </Example>
        <Example title="Standalone chip">
          <For each={['plain', 'selected']}>
            {(kind) => (
              <Chip selected={kind === 'selected' ? true : undefined} count={3}>
                {kind}
              </Chip>
            )}
          </For>
          <Chip dashed icon="plus">
            New label
          </Chip>
          <Chip color="var(--dv-3)" selected>
            Colour
          </Chip>
        </Example>
      </>
    ),
  },
  {
    id: 'slider',
    group: '17 Selection',
    title: 'Slider',
    description: 'Range control with a filled track. One value or [lo, hi]; thumbs never cross.',
    render: () => (
      <Example title="Single, range, marks" stack>
        <SliderDemo />
      </Example>
    ),
  },
  {
    id: 'rating',
    group: '17 Selection',
    title: 'Rating & RatingSummary',
    description:
      'Star rating (click the current star to clear) and a review summary with a distribution that can filter.',
    render: () => (
      <>
        <Example title="Rating" code={'<Rating defaultValue={3} showValue />'}>
          <Rating defaultValue={3} showValue />
          <Rating defaultValue={4} readOnly size="sm" />
          <Rating defaultValue={2} size="lg" max={10} />
        </Example>
        <Example title="RatingSummary" code={'<RatingSummary counts={[2, 3, 9, 41, 88]} onFilter={…} />'}>
          <RatingSummaryDemo />
        </Example>
      </>
    ),
  },
];
