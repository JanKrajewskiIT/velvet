import {
  ActionRow,
  addToast,
  AffixButton,
  AffixInput,
  Autocomplete,
  Badge,
  Button,
  Checkbox,
  CodeText,
  ColorPicker,
  CopyButton,
  DatePicker,
  type DateRange,
  DateRangePicker,
  DateTimePicker,
  DropdownButton,
  DropdownMenu,
  DropdownOption,
  FileDropZone,
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
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

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
  const [affixValue, setAffixValue] = createSignal('hello@velvetui.dev');
  const [range, setRange] = createSignal<DateRange>({ start: '', end: '' });
  const [dateTime, setDateTime] = createSignal('');
  const [richText, setRichText] = createSignal('<p><strong>Release notes</strong> for <em>VelvetUi</em>.</p>');
  const [droppedFile, setDroppedFile] = createSignal<string | null>(null);
  const [droppedFiles, setDroppedFiles] = createSignal<string[]>([]);
  const [locale, setLocale] = createSignal<'EN' | 'PL'>('EN');

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div>
      <Show when={sectionId() === 'inputs-buttons'}>
        <ShowcaseSection
          title="Button variants"
          subtitle="Primary, danger, ghost, dashed, outline and subtle action styles"
        >
          <PreviewPanel>
            <PreviewGroup title="Variants">
              <div class="row">
                <Button variant="primary">Primary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="dashed">Dashed</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="subtle">Subtle</Button>
              </div>
            </PreviewGroup>
            <PreviewGroup title="States">
              <div class="row">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" loading={loading()} onClick={simulateLoad}>
                  {loading() ? 'Saving...' : 'Click to load'}
                </Button>
              </div>
            </PreviewGroup>
            <PreviewGroup title="Sizes">
              <div class="row">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="AffixButton" subtitle="Buttons with prefix, suffix and badge content slots">
          <PreviewPanel>
            <PreviewGroup title="AffixButton">
              <div class="row">
                <AffixButton
                  variant="ghost"
                  text="Documents"
                  prefix={<IoDocument />}
                  suffix={
                    <Badge content={12}>
                      <span style={{ width: '10px' }} />
                    </Badge>
                  }
                />
                <AffixButton
                  variant="primary"
                  text="Export report"
                  prefix={<IoDownload />}
                  suffix={<IoEllipsisHorizontal />}
                />
                <AffixButton variant="dashed" text="Create tag" prefix={<IoAdd />} suffix={<IoClose />} />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            <CodeText as="span" class="codeInline">
              AffixButton
            </CodeText>{' '}
            supports prefix icon and suffix element or badge in one API.
          </ShowcaseMeta>
        </ShowcaseSection>
        <ShowcaseSection title="IconButton" subtitle="Compact controls for dense interfaces">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <IconButton icon={<IoPencil />} title="Edit" />
                <IconButton icon={<IoTrash />} title="Delete" />
                <IconButton icon={<IoAdd />} title="Add" size="sm" />
                <IconButton icon={<IoDownload />} title="Download" size="md" />
                <IconButton icon={<IoClose />} title="Close" disabled />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
        <ShowcaseSection title="CopyButton" subtitle="One-click clipboard copy with feedback">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <CopyButton text="npm install @jankrajewskiit/ui" label="Copy command" />
                <CopyButton text="Hello World" variant="outline" label="Outline" />
                <CopyButton text="Small copy" size="sm" />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="LocaleSwitcher" subtitle="Language toggle button">
          <PreviewPanel>
            <PreviewGroup title="On surface (variant)" subtitle="Ghost button for light page backgrounds">
              <div class="row">
                <LocaleSwitcher
                  text={locale()}
                  switchLabel="Switch locale"
                  variant="surface"
                  onSwitch={() => {
                    setLocale((current) => (current === 'EN' ? 'PL' : 'EN'));
                  }}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="ThemeToggle" subtitle="Light and dark mode switch">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <ThemeToggle lightLabel="Light mode" darkLabel="Dark mode" groupLabel="Theme" variant="light" />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Wraps{' '}
            <CodeText as="span" class="codeInline">
              useTheme()
            </CodeText>{' '}
            from ThemeProvider.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-dropdowns'}>
        <ShowcaseSection title="DropdownButton" subtitle="Action menu trigger with dropdown content">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <DropdownButton label="Actions" variant="primary">
                  <DropdownOption role="menuitem" label="Edit" onClick={() => {}} />
                  <DropdownOption role="menuitem" label="Duplicate" onClick={() => {}} />
                  <DropdownOption role="menuitem" label="Archive" onClick={() => {}} />
                </DropdownButton>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="DropdownMenu" subtitle="Icon trigger with keyboard navigation">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <DropdownMenu trigger={<IoEllipsisHorizontal />} label="More options">
                  <DropdownOption role="menuitem" prefix={<IoPencil />} label="Settings" onClick={() => {}} />
                  <DropdownOption role="menuitem" prefix={<IoDownload />} label="Export" onClick={() => {}} />
                  <DropdownOption role="menuitem" prefix={<IoTrash />} tone="error" label="Delete" onClick={() => {}} />
                </DropdownMenu>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Select" subtitle="Native select with custom styling">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Choose option" id="demo-select">
                <Select id="demo-select" value={selected()} onChange={(e) => setSelected(e.currentTarget.value)}>
                  <option value="">-- select --</option>
                  <option value="a">Option A</option>
                  <option value="b">Option B</option>
                  <option value="c">Option C</option>
                </Select>
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="MultiSelect" subtitle="Checkbox dropdown for selecting many options">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Frameworks" id="demo-multi-select">
                <MultiSelect
                  value={frameworks()}
                  options={FRAMEWORK_OPTIONS}
                  onChange={setFrameworks}
                  placeholder="Choose frameworks"
                  removeLabel="Remove"
                />
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Selected:{' '}
            <CodeText as="span" class="codeInline">
              {frameworks().join(', ') || 'none'}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Autocomplete" subtitle="Multi-value select with filtering">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Technologies" id="demo-auto">
                <Autocomplete
                  values={autoValues()}
                  options={['TypeScript', 'JavaScript', 'SolidJS', 'React', 'Vue', 'Svelte', 'Vite', 'Tailwind']}
                  onChange={setAutoValues}
                  placeholder="Type to search..."
                  removeLabel="Remove"
                />
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-fields'}>
        <ShowcaseSection title="Input" subtitle="Text and disabled field variants">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Input sizes" subtitle="Small, medium and large control height">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="inputSizesStack">
                <FormField label="Small" id="demo-input-sm">
                  <Input id="demo-input-sm" size="sm" placeholder="Small input" />
                </FormField>
                <FormField label="Medium" id="demo-input-md">
                  <Input id="demo-input-md" size="md" placeholder="Medium input" />
                </FormField>
                <FormField label="Large" id="demo-input-lg">
                  <Input id="demo-input-lg" size="lg" placeholder="Large input" />
                </FormField>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="AffixInput" subtitle="Input with optional prefix and suffix slots">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Email with actions" id="demo-affix-email">
                <AffixInput
                  id="demo-affix-email"
                  value={affixValue()}
                  onInput={(e) => setAffixValue(e.currentTarget.value)}
                  placeholder="name@example.com"
                  prefix={<IoDocument />}
                  suffix={
                    <IconButton
                      icon={<IoClose />}
                      title="Clear value"
                      onClick={() => setAffixValue('')}
                      size="sm"
                      variant="subtle"
                    />
                  }
                />
              </FormField>
              <FormField label="Search style" id="demo-affix-search">
                <AffixInput
                  id="demo-affix-search"
                  size="sm"
                  placeholder="Filter by keyword"
                  prefix={<IoAdd />}
                  suffix={<IoEllipsisHorizontal />}
                />
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="TextArea" subtitle="Long-form input control">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Description" id="demo-ta">
                <TextArea id="demo-ta" placeholder="Enter a longer description..." rows={4} />
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="NumberInput" subtitle="Numeric stepper with increment and decrement">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <NumberInput
                value={quantity()}
                onChange={setQuantity}
                label="Quantity"
                min={0}
                max={100}
                size="sm"
                decrementLabel="Decrease"
                incrementLabel="Increase"
              />
              <NumberInput
                value={1}
                onChange={() => {}}
                disabled
                size="sm"
                decrementLabel="Decrease"
                incrementLabel="Increase"
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="SearchInput" subtitle="Filtered input with clear and debounce">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <SearchInput value={search()} onInput={setSearch} placeholder="Search components..." />
              <SearchInput value="" onInput={() => {}} disabled placeholder="Disabled" />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Search value:{' '}
            <CodeText as="span" class="codeInline">
              {search()}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="PasswordInput" subtitle="Password field with visibility toggle">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Password" id="demo-pwd">
                <PasswordInput
                  id="demo-pwd"
                  placeholder="Enter password..."
                  visibilityLabel="Toggle password visibility"
                />
              </FormField>
              <FormField label="Disabled" id="demo-pwd-dis">
                <PasswordInput
                  id="demo-pwd-dis"
                  value="secret123"
                  disabled
                  visibilityLabel="Toggle password visibility"
                />
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="TagInput" subtitle="Quick keyboard-driven tagging">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Tags" id="demo-tags">
                <TagInput value={tags()} onChange={setTags} placeholder="Add a tag and press Enter" />
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="OtpInput" subtitle="One-time password entry">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <OtpInput value={otp()} onChange={setOtp} length={6} />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Entered value:{' '}
            <CodeText as="span" class="codeInline">
              {otp()}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="InlineEditableText" subtitle="Click-to-edit single line text">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <InlineEditableText value={editableTitle()} onChange={setEditableTitle} placeholder="Set a title" />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Current value:{' '}
            <CodeText as="span" class="codeInline">
              {editableTitle()}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="RichTextEditor" subtitle="WYSIWYG editor for formatted content">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <RichTextEditor
                label="Article body"
                value={richText()}
                onChange={setRichText}
                placeholder="Start writing..."
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            HTML length:{' '}
            <CodeText as="span" class="codeInline">
              {String(richText().length)}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-switchers'}>
        <ShowcaseSection title="SegmentedControl" subtitle="Mutually exclusive toggle group">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Checkbox" subtitle="Binary choice with optional label and description">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="RadioGroup" subtitle="Single choice from a set of options">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Switch" subtitle="Toggle control with optional label and description">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-pickers'}>
        <ShowcaseSection title="Slider" subtitle="Fine-grained value selection">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Slider label="Volume" value={sliderValue()} onChange={setSliderValue} showValue />
              <Slider label="Disabled" value={60} onChange={() => {}} disabled />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="RangeSlider" subtitle="Select minimum and maximum values">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <RangeSlider
                label="Price range"
                value={priceRange()}
                onChange={setPriceRange}
                min={0}
                max={100}
                showValue
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Rating" subtitle="Star-based scoring control">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <Rating value={rating()} onChange={setRating} />
                <Rating value={3.5} />
                <Rating value={4} size="sm" />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="ColorPicker" subtitle="Palette-driven accent selection">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Brand color" id="demo-color">
                <ColorPicker colors={PRESET_COLORS} value={color()} onChange={setColor} />
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Selected color:{' '}
            <CodeText as="span" class="codeInline">
              {color()}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-datetime'}>
        <ShowcaseSection title="DatePicker" subtitle="Calendar-driven date selection">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <DatePicker label="Start date" value={date()} onChange={setDate} />
              <DatePicker label="Disabled" value="" onChange={() => {}} disabled />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="DateRangePicker" subtitle="Calendar-driven date range selection">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <DateRangePicker value={range()} onChange={setRange} />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Range:{' '}
            <CodeText as="span" class="codeInline">
              {range().start || '–'} → {range().end || '–'}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="TimePicker" subtitle="Scrollable time slot picker">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <TimePicker label="Meeting time" value={time()} onChange={setTime} step={30} />
              <TimePicker label="Precise time" value={time15()} onChange={setTime15} step={15} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="DateTimePicker" subtitle="Combined date and time selection">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <DateTimePicker
                value={dateTime()}
                onChange={setDateTime}
                dateLabel="Publish date"
                timeLabel="Publish time"
                step={15}
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            DateTime:{' '}
            <CodeText as="span" class="codeInline">
              {dateTime() || 'not set'}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-other'}>
        <ShowcaseSection title="FileDropZone" subtitle="Drag-and-drop file input with preview">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="previewUploadFull">
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
              </div>
            </PreviewGroup>
          </PreviewPanel>
          {droppedFile() && (
            <ShowcaseMeta>
              Selected file: <strong>{droppedFile()}</strong>
            </ShowcaseMeta>
          )}
        </ShowcaseSection>

        <ShowcaseSection title="FileDropZone (multiple)" subtitle="Drag-and-drop upload for multiple files">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="previewUploadFull">
                <FileDropZone
                  accept="*"
                  multiple
                  label="Drop multiple files here or click to browse"
                  hint="You can select or drop multiple files at once"
                  icon={<IoDocument size={28} />}
                  onFiles={(files) => {
                    setDroppedFiles(files.map((file) => file.name));
                    addToast({ type: 'success', message: `Picked ${String(files.length)} file(s)` });
                  }}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          {droppedFiles().length > 0 && (
            <ShowcaseMeta>
              Selected files: <strong>{droppedFiles().join(', ')}</strong>
            </ShowcaseMeta>
          )}
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'inputs-form-layout'}>
        <ShowcaseSection title="FormField" subtitle="Label wrapper for form controls">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <FormField label="Full name" id="demo-ff-name">
                <Input id="demo-ff-name" type="text" placeholder="Jan Kowalski" />
              </FormField>
              <FormField label="Email address" id="demo-ff-email">
                <Input id="demo-ff-email" type="email" placeholder="jan@example.com" />
              </FormField>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="FormGrid" subtitle="Responsive multi-column form layout">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Complete form" subtitle="FormLayout + FormGrid + FormField + ActionRow">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Combine{' '}
            <CodeText as="span" class="codeInline">
              FormLayout
            </CodeText>
            ,{' '}
            <CodeText as="span" class="codeInline">
              FormGrid
            </CodeText>
            ,{' '}
            <CodeText as="span" class="codeInline">
              FormField
            </CodeText>{' '}
            and{' '}
            <CodeText as="span" class="codeInline">
              ActionRow
            </CodeText>{' '}
            for full-screen forms.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="ActionRow" subtitle="Horizontal row for action buttons with alignment">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <ActionRow align="start">
                <Button variant="primary">Save draft</Button>
                <Button variant="ghost">Cancel</Button>
              </ActionRow>
              <ActionRow align="end">
                <Button variant="dashed">Export</Button>
                <Button variant="primary">Submit</Button>
              </ActionRow>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Use{' '}
            <CodeText as="span" class="codeInline">
              align
            </CodeText>{' '}
            prop to control button positioning within the row.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default InputsSection;
