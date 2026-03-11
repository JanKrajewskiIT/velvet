import {
  Autocomplete,
  Button,
  Checkbox,
  ColorPicker,
  CopyButton,
  DatePicker,
  type DateRange,
  DateRangePicker,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  FileInput,
  FormField,
  IconButton,
  Input,
  NumberInput,
  OtpInput,
  PasswordInput,
  RadioGroup,
  Rating,
  SearchInput,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TagInput,
  TextArea,
  TimePicker,
} from '@jankrajewskiit/ui';
import { IoAdd, IoClose, IoDownload, IoEllipsisHorizontal, IoPencil, IoTrash } from 'solid-icons/io';
import { createSignal } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const PRESET_COLORS = ['#1467ff', '#0c52cf', '#02a4ff', '#2e7d32', '#ed6c02', '#d32f2f', '#1b78ff', '#00838f'];

type RoleValue = 'admin' | 'editor' | 'viewer';

const InputsSection = () => {
  const [loading, setLoading] = createSignal(false);
  const [text, setText] = createSignal('');
  const [selected, setSelected] = createSignal('');
  const [tags, setTags] = createSignal<string[]>(['solid-js', 'vite']);
  const [autoValues, setAutoValues] = createSignal<string[]>(['TypeScript']);
  const [color, setColor] = createSignal('#1467ff');
  const [newsletter, setNewsletter] = createSignal(true);
  const [notifications, setNotifications] = createSignal(false);
  const [role, setRole] = createSignal<RoleValue>('editor');
  const [sliderValue, setSliderValue] = createSignal(40);
  const [rating, setRating] = createSignal(3);
  const [segment, setSegment] = createSignal('list');
  const [billingCycle, setBillingCycle] = createSignal('monthly');
  const [otp, setOtp] = createSignal('');
  const [date, setDate] = createSignal('');
  const [time, setTime] = createSignal('');
  const [time15, setTime15] = createSignal('');
  const [quantity, setQuantity] = createSignal(5);
  const [search, setSearch] = createSignal('');
  const [range, setRange] = createSignal<DateRange>({ start: '', end: '' });

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div>
      <ShowcaseSection title="Button variants" subtitle="Primary actions, danger actions and low-emphasis controls">
        <PreviewPanel>
          <div class="row">
            <Button variant="primary">Primary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="dashed">Dashed</Button>
          </div>
        </PreviewPanel>
        <PreviewPanel>
          <div class="row">
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" loading={loading()} onClick={simulateLoad}>
              {loading() ? 'Saving...' : 'Click to load'}
            </Button>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="IconButton" subtitle="Compact controls for dense interfaces">
        <PreviewPanel>
          <div class="row">
            <IconButton icon={<IoPencil />} title="Edit" />
            <IconButton icon={<IoTrash />} title="Delete" />
            <IconButton icon={<IoAdd />} title="Add" size="sm" />
            <IconButton icon={<IoDownload />} title="Download" size="md" />
            <IconButton icon={<IoClose />} title="Close" disabled />
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="DropdownButton and DropdownMenu" subtitle="Action menus with keyboard navigation">
        <PreviewPanel>
          <div class="row">
            <DropdownButton label="Actions" variant="primary">
              <DropdownItem label="Edit" onClick={() => {}} />
              <DropdownItem label="Duplicate" onClick={() => {}} />
              <DropdownItem label="Archive" onClick={() => {}} />
            </DropdownButton>

            <DropdownMenu
              trigger={<IconButton icon={<IoEllipsisHorizontal />} title="More options" />}
              label="More options"
            >
              <DropdownItem label="Settings" onClick={() => {}} />
              <DropdownItem label="Export" onClick={() => {}} />
              <DropdownItem label="Delete" onClick={() => {}} variant="error" />
            </DropdownMenu>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="CopyButton" subtitle="One-click clipboard copy with feedback">
        <PreviewPanel>
          <div class="row">
            <CopyButton text="npm install @jankrajewskiit/ui" label="Copy command" />
            <CopyButton text="Hello World" variant="outline" label="Outline" />
            <CopyButton text="Small copy" size="sm" />
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Input" subtitle="Text, disabled and password fields">
        <PreviewPanel class="col">
          <form onSubmit={(e) => e.preventDefault()}>
            <FormField label="Text input" id="demo-text">
              <Input
                id="demo-text"
                type="text"
                placeholder="Enter text..."
                value={text()}
                onInput={(e) => setText(e.currentTarget.value)}
              />
            </FormField>
            <FormField label="Disabled input" id="demo-disabled">
              <Input id="demo-disabled" type="text" value="Disabled" disabled />
            </FormField>
            <FormField label="Password" id="demo-pass">
              <Input id="demo-pass" type="password" placeholder="********" />
            </FormField>
          </form>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="PasswordInput" subtitle="Password field with visibility toggle">
        <PreviewPanel class="col">
          <FormField label="Password" id="demo-pwd">
            <PasswordInput id="demo-pwd" placeholder="Enter password..." />
          </FormField>
          <FormField label="Disabled" id="demo-pwd-dis">
            <PasswordInput id="demo-pwd-dis" value="secret123" disabled />
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="TextArea" subtitle="Long-form input control">
        <PreviewPanel>
          <FormField label="Description" id="demo-ta">
            <TextArea id="demo-ta" placeholder="Enter a longer description..." rows={4} />
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="SearchInput" subtitle="Filtered input with clear and debounce">
        <PreviewPanel class="col">
          <SearchInput value={search()} onInput={setSearch} placeholder="Search components..." />
          <SearchInput value="" onInput={() => {}} disabled placeholder="Disabled" />
        </PreviewPanel>
        <ShowcaseMeta>
          Search value: <span class="codeInline">{search()}</span>
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="Autocomplete" subtitle="Multi-value select with filtering">
        <PreviewPanel>
          <FormField label="Technologies" id="demo-auto">
            <Autocomplete
              values={autoValues()}
              options={['TypeScript', 'JavaScript', 'SolidJS', 'React', 'Vue', 'Svelte', 'Vite', 'Tailwind']}
              onChange={setAutoValues}
              placeholder="Type to search..."
              removeLabel="Remove"
            />
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="TagInput" subtitle="Quick keyboard-driven tagging">
        <PreviewPanel>
          <FormField label="Tags" id="demo-tags">
            <TagInput value={tags()} onChange={setTags} placeholder="Add a tag and press Enter" />
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="OtpInput" subtitle="One-time password entry">
        <PreviewPanel>
          <OtpInput value={otp()} onChange={setOtp} length={6} />
        </PreviewPanel>
        <ShowcaseMeta>
          Entered value: <span class="codeInline">{otp()}</span>
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="Select" subtitle="Native select with custom styling">
        <PreviewPanel>
          <FormField label="Choose option" id="demo-select">
            <Select id="demo-select" value={selected()} onChange={(e) => setSelected(e.currentTarget.value)}>
              <option value="">-- select --</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
            </Select>
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Checkbox, Switch, RadioGroup" subtitle="Binary and single-choice controls">
        <PreviewPanel class="col">
          <Checkbox
            checked={newsletter()}
            onChange={(e) => setNewsletter(e.currentTarget.checked)}
            label="Subscribe to newsletter"
            description="Monthly product updates"
          />

          <Switch
            checked={notifications()}
            onChange={setNotifications}
            label="Enable push notifications"
            description="Receive alerts for important events"
            aria-label="Enable push notifications"
          />

          <RadioGroup<RoleValue>
            name="demo-role"
            value={role()}
            onChange={setRole}
            direction="column"
            options={[
              { value: 'admin', label: 'Admin', description: 'Full access' },
              {
                value: 'editor',
                label: 'Editor',
                description: 'Can edit resources',
              },
              {
                value: 'viewer',
                label: 'Viewer',
                description: 'Read-only access',
              },
            ]}
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="SegmentedControl" subtitle="Mutually exclusive toggle group">
        <PreviewPanel class="col">
          <SegmentedControl
            value={segment()}
            onChange={setSegment}
            options={[
              { value: 'list', label: 'List' },
              { value: 'grid', label: 'Grid' },
              { value: 'board', label: 'Board' },
            ]}
          />
          <SegmentedControl
            value={billingCycle()}
            onChange={setBillingCycle}
            size="sm"
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="NumberInput" subtitle="Numeric stepper with increment and decrement">
        <PreviewPanel>
          <NumberInput value={quantity()} onChange={setQuantity} label="Quantity" min={0} max={100} />
          <NumberInput value={1} onChange={() => {}} disabled size="sm" />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Slider" subtitle="Fine-grained value selection">
        <PreviewPanel class="col">
          <Slider label="Volume" value={sliderValue()} onChange={setSliderValue} showValue />
          <Slider label="Disabled" value={60} onChange={() => {}} disabled />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Rating" subtitle="Star-based scoring control">
        <PreviewPanel>
          <div class="row">
            <Rating value={rating()} onChange={setRating} />
            <Rating value={3.5} />
            <Rating value={4} size="sm" />
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="DatePicker" subtitle="Calendar-driven date selection">
        <PreviewPanel class="col">
          <DatePicker label="Start date" value={date()} onChange={setDate} />
          <DatePicker label="Disabled" value="" onChange={() => {}} disabled />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="DateRangePicker" subtitle="Calendar-driven date range selection">
        <PreviewPanel class="col">
          <DateRangePicker value={range()} onChange={setRange} />
        </PreviewPanel>
        <ShowcaseMeta>
          Range:{' '}
          <span class="codeInline">
            {range().start || '–'} → {range().end || '–'}
          </span>
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="TimePicker" subtitle="Scrollable time slot picker">
        <PreviewPanel class="col">
          <TimePicker label="Meeting time" value={time()} onChange={setTime} step={30} />
          <TimePicker label="Precise time" value={time15()} onChange={setTime15} step={15} />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="ColorPicker" subtitle="Palette-driven accent selection">
        <PreviewPanel>
          <FormField label="Brand color" id="demo-color">
            <ColorPicker colors={PRESET_COLORS} value={color()} onChange={setColor} />
          </FormField>
        </PreviewPanel>
        <ShowcaseMeta>
          Selected color: <span class="codeInline">{color()}</span>
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="FileInput" subtitle="Drag-and-drop file upload zone">
        <PreviewPanel class="col">
          <FileInput accept="image/*" onFiles={() => {}} />
          <FileInput accept="*" multiple onFiles={() => {}} label="Drop multiple files here or click to browse" />
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default InputsSection;
