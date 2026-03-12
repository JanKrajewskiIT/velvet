import {
  ActionRow,
  addToast,
  Autocomplete,
  Button,
  Checkbox,
  ColorPicker,
  CopyButton,
  DatePicker,
  type DateRange,
  DateRangePicker,
  DateTimePicker,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  FileDropZone,
  FileInput,
  FormField,
  FormGrid,
  FormLayout,
  IconButton,
  InlineEditableText,
  Input,
  LocaleSwitcher,
  MultiSelect,
  type MultiSelectOption,
  NumberInput,
  OtpInput,
  PasswordInput,
  RadioGroup,
  RangeSlider,
  Rating,
  RichTextEditor,
  SearchInput,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TagInput,
  TextArea,
  ThemeToggle,
  TimePicker,
} from '@jankrajewskiit/ui';
import { IoAdd, IoClose, IoDocument, IoDownload, IoEllipsisHorizontal, IoPencil, IoTrash } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const PRESET_COLORS = ['#1467ff', '#0c52cf', '#02a4ff', '#2e7d32', '#ed6c02', '#d32f2f', '#1b78ff', '#00838f'];
const FRAMEWORK_OPTIONS: MultiSelectOption[] = [
  { value: 'solid', label: 'SolidJS' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'qwik', label: 'Qwik' },
];

type RoleValue = 'admin' | 'editor' | 'viewer';

interface InputsSectionProps {
  sectionId: SectionId;
}

const InputsSection = (props: InputsSectionProps) => {
  const sectionId = () => props.sectionId;
  const [loading, setLoading] = createSignal(false);
  const [text, setText] = createSignal('');
  const [editableTitle, setEditableTitle] = createSignal('Release notes');
  const [selected, setSelected] = createSignal('');
  const [frameworks, setFrameworks] = createSignal<string[]>(['solid', 'vue']);
  const [tags, setTags] = createSignal<string[]>(['solid-js', 'vite']);
  const [autoValues, setAutoValues] = createSignal<string[]>(['TypeScript']);
  const [color, setColor] = createSignal('#1467ff');
  const [newsletter, setNewsletter] = createSignal(true);
  const [notifications, setNotifications] = createSignal(false);
  const [termsAccepted, setTermsAccepted] = createSignal(false);
  const [marketingEmails, setMarketingEmails] = createSignal(true);
  const [focusMode, setFocusMode] = createSignal(false);
  const [role, setRole] = createSignal<RoleValue>('editor');
  const [viewMode, setViewMode] = createSignal('list');
  const [sliderValue, setSliderValue] = createSignal(40);
  const [priceRange, setPriceRange] = createSignal({ min: 20, max: 80 });
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
  const [dateTime, setDateTime] = createSignal('');
  const [richText, setRichText] = createSignal('<p><strong>Release notes</strong> for <em>VelvetUi</em>.</p>');
  const [droppedFile, setDroppedFile] = createSignal<string | null>(null);
  const [locale, setLocale] = createSignal<'EN' | 'PL'>('EN');

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div>
      <Show when={sectionId() === 'inputs-buttons'}>
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
        <ShowcaseSection title="ActionRow" subtitle="Horizontal row for action buttons with alignment">
          <PreviewPanel class="col">
            <ActionRow align="start">
              <Button variant="primary">Save</Button>
              <Button variant="ghost">Cancel</Button>
            </ActionRow>
            <ActionRow align="end">
              <Button variant="dashed">Export</Button>
              <Button variant="primary">Submit</Button>
            </ActionRow>
          </PreviewPanel>
          <ShowcaseMeta>
            Use <span class="code-inline">align</span> prop to control button positioning within the row.
          </ShowcaseMeta>
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

        <ShowcaseSection title="LocaleSwitcher" subtitle="Language toggle button">
          <PreviewPanel>
            <div class="row">
              <LocaleSwitcher
                label={locale()}
                switchLabel="Switch locale"
                variant="surface"
                onSwitch={() => {
                  setLocale((current) => (current === 'EN' ? 'PL' : 'EN'));
                }}
              />
            </div>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="ThemeToggle" subtitle="Light and dark mode switch">
          <PreviewPanel>
            <div class="row">
              <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" variant="light" />
            </div>
          </PreviewPanel>
          <ShowcaseMeta>
            Wraps <span class="code-inline">useTheme()</span> from ThemeProvider.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-dropdowns'}>
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

        <ShowcaseSection title="MultiSelect" subtitle="Checkbox dropdown for selecting many options">
          <PreviewPanel>
            <FormField label="Frameworks" id="demo-multi-select">
              <MultiSelect
                value={frameworks()}
                options={FRAMEWORK_OPTIONS}
                onChange={setFrameworks}
                placeholder="Choose frameworks"
                removeLabel="Remove"
              />
            </FormField>
          </PreviewPanel>
          <ShowcaseMeta>
            Selected: <span class="code-inline">{frameworks().join(', ') || 'none'}</span>
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
      </Show>

      <Show when={sectionId() === 'inputs-fields'}>
        <ShowcaseSection title="Input" subtitle="Text and disabled field variants">
          <PreviewPanel class="col">
            <form class="inputFieldStack" onSubmit={(e) => e.preventDefault()}>
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
            </form>
          </PreviewPanel>
          <PreviewPanel class="col">
            <FormField label="Input sizes" id="demo-input-sizes">
              <div class="col">
                <Input id="demo-input-sm" size="sm" placeholder="Small input" />
                <Input id="demo-input-md" size="md" placeholder="Medium input" />
                <Input id="demo-input-lg" size="lg" placeholder="Large input" />
              </div>
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

        <ShowcaseSection title="NumberInput" subtitle="Numeric stepper with increment and decrement">
          <PreviewPanel class="col numberInputStack">
            <NumberInput value={quantity()} onChange={setQuantity} label="Quantity" min={0} max={100} size="sm" />
            <NumberInput value={1} onChange={() => {}} disabled size="sm" />
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="SearchInput" subtitle="Filtered input with clear and debounce">
          <PreviewPanel class="col">
            <SearchInput value={search()} onInput={setSearch} placeholder="Search components..." />
            <SearchInput value="" onInput={() => {}} disabled placeholder="Disabled" />
          </PreviewPanel>
          <ShowcaseMeta>
            Search value: <span class="code-inline">{search()}</span>
          </ShowcaseMeta>
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
            Entered value: <span class="code-inline">{otp()}</span>
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="InlineEditableText" subtitle="Click-to-edit single line text">
          <PreviewPanel class="col">
            <InlineEditableText value={editableTitle()} onChange={setEditableTitle} placeholder="Set a title" />
          </PreviewPanel>
          <ShowcaseMeta>
            Current value: <span class="code-inline">{editableTitle()}</span>
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="RichTextEditor" subtitle="WYSIWYG editor for formatted content">
          <PreviewPanel class="col">
            <RichTextEditor
              label="Article body"
              value={richText()}
              onChange={setRichText}
              placeholder="Start writing..."
            />
          </PreviewPanel>
          <ShowcaseMeta>
            HTML length: <span class="code-inline">{richText().length}</span>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-controls'}>
        <ShowcaseSection title="Checkbox" subtitle="Binary choice with optional label and description">
          <PreviewPanel class="col">
            <Checkbox
              checked={newsletter()}
              onChange={(e) => setNewsletter(e.currentTarget.checked)}
              label="Subscribe to newsletter"
              description="Monthly product updates"
            />
            <Checkbox
              checked={termsAccepted()}
              onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
              label="I accept the terms and conditions"
            />
            <Checkbox
              checked={marketingEmails()}
              onChange={(e) => setMarketingEmails(e.currentTarget.checked)}
              label="Send me product news and offers"
              description="You can unsubscribe at any time"
            />
            <Checkbox checked={false} onChange={() => {}} label="Unchecked by default" />
            <Checkbox checked disabled onChange={() => {}} label="Checked and disabled" />
            <Checkbox checked={false} disabled onChange={() => {}} label="Unchecked and disabled" />
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Switch" subtitle="Toggle control with optional label and description">
          <PreviewPanel class="col">
            <Switch
              checked={notifications()}
              onChange={setNotifications}
              label="Enable push notifications"
              description="Receive alerts for important events"
              aria-label="Enable push notifications"
            />
            <Switch
              checked={focusMode()}
              onChange={setFocusMode}
              label="Focus mode"
              description="Hide sidebar and reduce distractions"
              aria-label="Focus mode"
            />
            <Switch checked={true} onChange={() => {}} label="On (controlled elsewhere)" aria-label="On" />
            <Switch checked={false} onChange={() => {}} label="Off" aria-label="Off" />
            <Switch checked disabled onChange={() => {}} label="Disabled on" aria-label="Disabled on" />
            <Switch checked={false} disabled onChange={() => {}} label="Disabled off" aria-label="Disabled off" />
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="RadioGroup" subtitle="Single choice from a set of options">
          <PreviewPanel class="col">
            <RadioGroup<RoleValue>
              name="demo-role"
              value={role()}
              onChange={setRole}
              direction="column"
              options={[
                { value: 'admin', label: 'Admin', description: 'Full access' },
                { value: 'editor', label: 'Editor', description: 'Can edit resources' },
                { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
              ]}
            />
            <RadioGroup
              name="demo-horizontal"
              value={viewMode()}
              onChange={setViewMode}
              direction="row"
              options={[
                { value: 'list', label: 'List' },
                { value: 'grid', label: 'Grid' },
                { value: 'board', label: 'Board' },
              ]}
            />
            <RadioGroup
              name="demo-disabled"
              value={billingCycle()}
              onChange={setBillingCycle}
              direction="column"
              options={[
                { value: 'monthly', label: 'Monthly billing' },
                { value: 'yearly', label: 'Yearly billing', description: 'Save 20%' },
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

        <ShowcaseSection title="Slider" subtitle="Fine-grained value selection">
          <PreviewPanel class="col">
            <Slider label="Volume" value={sliderValue()} onChange={setSliderValue} showValue />
            <Slider label="Disabled" value={60} onChange={() => {}} disabled />
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="RangeSlider" subtitle="Select minimum and maximum values">
          <PreviewPanel class="col">
            <RangeSlider
              label="Price range"
              value={priceRange()}
              onChange={setPriceRange}
              min={0}
              max={100}
              showValue
            />
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

        <ShowcaseSection title="ColorPicker" subtitle="Palette-driven accent selection">
          <PreviewPanel>
            <FormField label="Brand color" id="demo-color">
              <ColorPicker colors={PRESET_COLORS} value={color()} onChange={setColor} />
            </FormField>
          </PreviewPanel>
          <ShowcaseMeta>
            Selected color: <span class="code-inline">{color()}</span>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-datetime'}>
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
            <span class="code-inline">
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

        <ShowcaseSection title="DateTimePicker" subtitle="Combined date and time selection">
          <PreviewPanel class="col">
            <DateTimePicker
              value={dateTime()}
              onChange={setDateTime}
              dateLabel="Publish date"
              timeLabel="Publish time"
              step={15}
            />
          </PreviewPanel>
          <ShowcaseMeta>
            DateTime: <span class="code-inline">{dateTime() || 'not set'}</span>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-other'}>
        <ShowcaseSection title="FileDropZone" subtitle="Drag-and-drop file input with preview">
          <PreviewPanel class="col">
            <FileDropZone
              label="Drop a file here or click to browse"
              hint="Supports: .pdf, .jpg, .png"
              accept=".pdf,.jpg,.png,image/*"
              icon={<IoDocument size={28} />}
              onFile={(f) => {
                setDroppedFile(f.name);
                addToast({ type: 'success', message: `Picked: ${f.name}` });
              }}
            />
          </PreviewPanel>
          {droppedFile() && (
            <ShowcaseMeta>
              Selected file: <strong>{droppedFile()}</strong>
            </ShowcaseMeta>
          )}
        </ShowcaseSection>

        <ShowcaseSection title="FileInput" subtitle="Drag-and-drop file upload zone">
          <PreviewPanel class="col">
            <FileInput accept="image/*" onFiles={() => {}} />
            <FileInput accept="*" multiple onFiles={() => {}} label="Drop multiple files here or click to browse" />
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-form-layout'}>
        <ShowcaseSection title="FormField" subtitle="Label wrapper for form controls">
          <PreviewPanel class="col">
            <FormField label="Full name" id="demo-ff-name">
              <Input id="demo-ff-name" type="text" placeholder="Jan Kowalski" />
            </FormField>
            <FormField label="Email address" id="demo-ff-email">
              <Input id="demo-ff-email" type="email" placeholder="jan@example.com" />
            </FormField>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="FormGrid" subtitle="Responsive multi-column form layout">
          <PreviewPanel>
            <FormLayout>
              <FormGrid>
                <FormField label="First name" id="fn">
                  <Input id="fn" type="text" placeholder="Jan" />
                </FormField>
                <FormField label="Last name" id="ln">
                  <Input id="ln" type="text" placeholder="Kowalski" />
                </FormField>
                <FormField label="Email" id="email">
                  <Input id="email" type="email" placeholder="jan@example.com" />
                </FormField>
                <FormField label="Role" id="role">
                  <Select id="role">
                    <option value="">-- select role --</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </Select>
                </FormField>
              </FormGrid>
            </FormLayout>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Complete form" subtitle="FormLayout + FormGrid + FormField + ActionRow">
          <PreviewPanel class="col">
            <FormLayout>
              <FormGrid>
                <FormField label="First name" id="cf-fn">
                  <Input id="cf-fn" type="text" placeholder="Jan" />
                </FormField>
                <FormField label="Last name" id="cf-ln">
                  <Input id="cf-ln" type="text" placeholder="Kowalski" />
                </FormField>
                <FormField label="Email" id="cf-em">
                  <Input id="cf-em" type="email" placeholder="jan@example.com" />
                </FormField>
                <FormField label="Bio" id="cf-bio">
                  <TextArea id="cf-bio" placeholder="Short bio..." rows={3} />
                </FormField>
              </FormGrid>
              <ActionRow align="end">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Save</Button>
              </ActionRow>
            </FormLayout>
          </PreviewPanel>
          <ShowcaseMeta>
            Combine <span class="code-inline">FormLayout</span>, <span class="code-inline">FormGrid</span>,{' '}
            <span class="code-inline">FormField</span> and <span class="code-inline">ActionRow</span> for full-screen
            forms.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default InputsSection;
