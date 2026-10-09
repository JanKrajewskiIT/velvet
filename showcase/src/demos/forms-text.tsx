import { createSignal, Show } from 'solid-js';
import {
  Input,
  MentionInput,
  NumberInput,
  OtpInput,
  PasswordInput,
  PhoneInput,
  RangeInput,
  RichTextEditor,
  SearchInput,
  TagInput,
  Text,
  Textarea,
  type RangeValue,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_LIMIT = 40;
const BIO_LIMIT = 160;

const SUGGESTIONS = [
  'Design systems',
  'Design tokens',
  'Developer experience',
  'Accessibility',
  'Animation',
  'Typography',
];
const PEOPLE = [
  { label: 'Anna Kowalska', description: 'Owner' },
  { label: 'Marek Nowak', description: 'Admin' },
  { label: 'Ewa Wiśniewska', description: 'Designer' },
];
const TAGS = [{ label: 'design' }, { label: 'release' }, { label: 'urgent' }];
const SALARY_LIMIT = 100_000;
const RICH_TEXT_SAMPLE =
  '<h2>Release notes</h2><p>Try <strong>bold</strong>, <em>italic</em>, <code>code</code> or type <code>- </code> for a list.</p><ul><li>Markdown shortcuts</li><li>Undo and redo</li></ul>';

const SearchDemo = () => {
  const [picked, setPicked] = createSignal('');
  return (
    <div class="sc-field">
      <SearchInput placeholder="Search topics…" suggestions={SUGGESTIONS} onSelect={(item) => setPicked(item.label)} />
      <Show when={picked()}>
        <Text variant="caption" tone="secondary">
          Picked: {picked()}
        </Text>
      </Show>
    </div>
  );
};

const OtpDemo = () => {
  const [code, setCode] = createSignal('');
  return (
    <div>
      <OtpInput label="Verification code" hint="Paste works too" onComplete={setCode} />
      <Show when={code()}>
        <Text variant="caption" tone="secondary">
          Entered: {code()}
        </Text>
      </Show>
    </div>
  );
};

const RangeDemo = () => {
  const [salary, setSalary] = createSignal<RangeValue>({ min: 10_000, max: 15_000 });
  return (
    <>
      <div class="sc-field--wide">
        <RangeInput
          label="Salary"
          locale="pl"
          value={salary()}
          onValueChange={setSalary}
          max={SALARY_LIMIT}
          unitOptions={['PLN', 'EUR', 'USD']}
          defaultUnit="PLN"
          periodOptions={['Hourly', 'Monthly', 'Yearly']}
          defaultPeriod="Monthly"
          hint="Leave a bound empty for an open range"
        />
      </div>
      <div class="sc-field">
        <RangeInput label="Area" suffix="m²" fromLabel="Min" toLabel="Max" defaultValue={{ min: 80, max: 40 }} />
      </div>
    </>
  );
};

const RichTextDemo = () => {
  const [output, setOutput] = createSignal(RICH_TEXT_SAMPLE);
  return (
    <>
      <div class="sc-field--wide">
        <RichTextEditor
          label="Description"
          defaultValue={RICH_TEXT_SAMPLE}
          maxLength={400}
          onValueChange={(html) => setOutput(html)}
          hint="Output is allow-listed HTML"
        />
      </div>
      <pre style={{ margin: 0, 'max-width': '100%', 'white-space': 'pre-wrap', font: 'var(--type-code)' }}>
        {output()}
      </pre>
    </>
  );
};

export const formsTextDemos: DemoEntry[] = [
  {
    id: 'input',
    group: '16 Inputs',
    title: 'Input',
    description:
      'Text field with label, hint, icons, prefix or suffix and validation. The message lane is fixed-height when validation is on.',
    render: () => (
      <>
        <Example title="Label, hint, optional" code={'<Input label="Full name" hint="As on your ID" />'}>
          <div class="sc-field">
            <Input label="Full name" hint="As on your ID" placeholder="Anna Kowalska" />
          </div>
          <div class="sc-field">
            <Input label="Company" optional placeholder="Velvet Studio" />
          </div>
        </Example>
        <Example title="Icons and affixes" code={'<Input iconLeft="search" prefix="https://" suffix=".com" />'}>
          <div class="sc-field">
            <Input label="Search" iconLeft="search" placeholder="Find anything" />
          </div>
          <div class="sc-field">
            <Input label="Website" prefix="https://" suffix=".com" placeholder="velvet" />
          </div>
          <div class="sc-field">
            <Input label="Budget" prefix="$" suffix="USD / mo" placeholder="0" />
          </div>
        </Example>
        <Example
          title="Validation on blur, then live"
          code={'<Input validate={(v) => !EMAIL.test(v) && "Enter a valid email"} />'}
        >
          <div class="sc-field">
            <Input
              label="Email"
              placeholder="you@velvet.design"
              validate={(value) => (EMAIL_PATTERN.test(value) ? undefined : 'Enter a valid email address')}
            />
          </div>
          <div class="sc-field">
            <Input label="Nickname" maxLength={NAME_LIMIT} showCount hint="Shown on your profile" />
          </div>
        </Example>
        <Example title="Sizes and states">
          <div class="sc-field">
            <Input size="sm" label="Small" placeholder="sm" />
          </div>
          <div class="sc-field">
            <Input size="lg" label="Large" placeholder="lg" />
          </div>
          <div class="sc-field">
            <Input label="Disabled" disabled value="Locked" />
          </div>
          <div class="sc-field">
            <Input label="Read only" readOnly value="Copy me" />
          </div>
          <div class="sc-field">
            <Input label="With error" error="This username is taken" defaultValue="anna" />
          </div>
        </Example>
      </>
    ),
  },
  {
    id: 'textarea',
    group: '16 Inputs',
    title: 'Textarea',
    description: 'Multi-line field that grows with its content between `rows` and `maxRows`.',
    render: () => (
      <Example
        title="Auto-resize and counter"
        code={'<Textarea autoResize rows={2} maxRows={6} maxLength={160} showCount />'}
      >
        <div class="sc-field">
          <Textarea
            label="Bio"
            autoResize
            rows={2}
            maxRows={6}
            maxLength={BIO_LIMIT}
            showCount
            placeholder="Tell us about yourself"
          />
        </div>
        <div class="sc-field">
          <Textarea label="Notes" rows={3} resize="none" hint="Fixed size" />
        </div>
        <div class="sc-field">
          <Textarea label="Disabled" disabled value="Not editable" />
        </div>
      </Example>
    ),
  },
  {
    id: 'password-input',
    group: '16 Inputs',
    title: 'PasswordInput',
    description: 'Password field with a show / hide toggle and an optional live strength meter.',
    render: () => (
      <Example title="Sign in vs. create password" code={'<PasswordInput showStrength />'}>
        <div class="sc-field">
          <PasswordInput />
        </div>
        <div class="sc-field">
          <PasswordInput label="New password" showStrength hint="Use 12+ characters" />
        </div>
      </Example>
    ),
  },
  {
    id: 'number-input',
    group: '16 Inputs',
    title: 'NumberInput',
    description: 'Stepper field: −/+ buttons, clamped bounds, ↑↓ to step (Shift ×10), Home and End jump to the bounds.',
    render: () => (
      <Example title="Bounds, step and unit" code={'<NumberInput min={1} max={20} step={1} suffix="seats" />'}>
        <NumberInput label="Seats" min={1} max={20} defaultValue={5} suffix="seats" />
        <NumberInput label="Weight" step={0.5} defaultValue={2.5} suffix="kg" />
        <NumberInput label="Small" size="sm" defaultValue={1} />
      </Example>
    ),
  },
  {
    id: 'search-input',
    group: '16 Inputs',
    title: 'SearchInput',
    description: 'Search field with a clear button and an optional suggestions dropdown.',
    render: () => (
      <Example title="Suggestions" code={'<SearchInput suggestions={[…]} onSelect={…} />'}>
        <SearchDemo />
        <div class="sc-field">
          <SearchInput loading defaultValue="design" />
        </div>
      </Example>
    ),
  },
  {
    id: 'phone-input',
    group: '16 Inputs',
    title: 'PhoneInput',
    description: 'Phone field with a country picker and as-you-type formatting. Emits E.164.',
    render: () => (
      <Example title="Country mask" code={'<PhoneInput defaultCountry="PL" />'}>
        <div class="sc-field">
          <PhoneInput label="Phone" defaultCountry="PL" />
        </div>
      </Example>
    ),
  },
  {
    id: 'otp-input',
    group: '16 Inputs',
    title: 'OtpInput',
    description: 'One-time-code boxes: auto-advance, Backspace steps back, paste fills from the focused box.',
    render: () => (
      <Example title="Six digits" code={'<OtpInput length={6} onComplete={verify} />'}>
        <OtpDemo />
      </Example>
    ),
  },
  {
    id: 'tag-input',
    group: '16 Inputs',
    title: 'TagInput',
    description: 'Free-text tags inside a field. Enter or comma adds, Backspace on empty removes the last.',
    render: () => (
      <Example title="Tags with a cap" code={'<TagInput max={5} defaultValue={["design"]} />'}>
        <div class="sc-field">
          <TagInput label="Skills" defaultValue={['design', 'solid']} max={5} hint="Up to 5" />
        </div>
      </Example>
    ),
  },
  {
    id: 'mention-input',
    group: '16 Inputs',
    title: 'MentionInput',
    description: 'Multi-line field with @mention and #tag suggestions at the caret. The value stays plain text.',
    render: () => (
      <Example title="@ and # triggers" code={'<MentionInput users={people} tags={tags} />'}>
        <div class="sc-field--wide">
          <MentionInput
            label="Comment"
            users={PEOPLE}
            tags={TAGS}
            defaultValue="Thanks @Anna Kowalska — filed under #release"
            placeholder="Type @ or #"
          />
        </div>
      </Example>
    ),
  },
  {
    id: 'range-input',
    group: '16 Inputs',
    title: 'RangeInput',
    description: 'From–to numeric field for budgets, salaries and filters. An inverted range flags itself.',
    render: () => (
      <Example title="Money range and fixed unit" stack>
        <RangeDemo />
      </Example>
    ),
  },
  {
    id: 'rich-text-editor',
    group: '16 Inputs',
    title: 'RichTextEditor',
    description: 'Dependency-free WYSIWYG with markdown shortcuts, links, undo and sanitized paste.',
    render: () => (
      <>
        <Example title="Full toolbar" stack>
          <RichTextDemo />
        </Example>
        <Example title="Minimal toolbar, read only" stack>
          <RichTextEditor toolbar="minimal" minHeight={80} placeholder="Short reply…" />
          <RichTextEditor readOnly defaultValue={RICH_TEXT_SAMPLE} />
        </Example>
      </>
    ),
  },
];
