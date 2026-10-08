import { createSignal, Show } from 'solid-js';
import {
  ActionRow,
  Button,
  EditableCollection,
  type EditableItem,
  ErrorSummary,
  type ErrorSummaryItem,
  FormGrid,
  FormLayout,
  FormSection,
  FormSpan,
  InlineEdit,
  Input,
  Select,
  SignaturePad,
  Text,
  Textarea,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const SAVE_DELAY_MS = 600;
const SKILL_LEVELS = ['Basic', 'Intermediate', 'Advanced', 'Expert'];
const COUNTRIES = ['Poland', 'Germany', 'France', 'Spain'];

const SKILLS: EditableItem[] = [
  { id: 1, text: 'TypeScript', level: 'Advanced' },
  { id: 2, text: 'SolidJS', level: 'Intermediate' },
  { id: 3, text: 'Accessibility', level: 'Expert' },
];
const REQUIREMENTS: EditableItem[] = [
  { id: 1, text: '5+ years of frontend experience', weight: 5 },
  { id: 2, text: 'Design-system background', weight: 3 },
];

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, SAVE_DELAY_MS));

const ErrorSummaryDemo = () => {
  const [errors, setErrors] = createSignal<ErrorSummaryItem[]>([]);
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const submit = () => {
    const found: ErrorSummaryItem[] = [];
    if (!name().trim()) found.push({ id: 'es-name', message: 'Enter your full name' });
    if (!email().includes('@')) found.push({ id: 'es-email', message: 'Enter a valid email address' });
    setErrors(found);
  };
  const messageFor = (id: string) => errors().find((error) => error.id === id)?.message;
  return (
    <FormLayout width={420} onSubmit={submit}>
      <ErrorSummary errors={errors()} />
      <Input
        id="es-name"
        label="Full name"
        value={name()}
        onInput={(event) => setName(event.currentTarget.value)}
        error={messageFor('es-name')}
      />
      <Input
        id="es-email"
        label="Email"
        value={email()}
        onInput={(event) => setEmail(event.currentTarget.value)}
        error={messageFor('es-email')}
      />
      <ActionRow>
        <Button type="submit">Submit</Button>
      </ActionRow>
    </FormLayout>
  );
};

const InlineEditDemo = () => {
  const [saved, setSaved] = createSignal('Q3 roadmap');
  return (
    <>
      <InlineEdit
        label="Project title"
        size="lg"
        value={saved()}
        onSave={(value) => delay().then(() => void setSaved(value))}
        validate={(value) => (value ? undefined : 'A title is required')}
      />
      <InlineEdit label="Owner" defaultValue="Anna Kowalska" />
      <InlineEdit label="Nickname" size="sm" placeholder="Add nickname" />
    </>
  );
};

const SignatureDemo = () => {
  const [size, setSize] = createSignal<number>();
  return (
    <div class="sc-field--wide">
      <SignaturePad
        label="Sign below"
        hint="Drawing is not keyboard accessible — offer a typed name too"
        onValueChange={(dataUrl) => setSize(dataUrl?.length)}
      />
      <Show when={size()}>
        <Text variant="caption" tone="secondary">
          PNG data URL: {size()} chars
        </Text>
      </Show>
    </div>
  );
};

export const formsStructureDemos: DemoEntry[] = [
  {
    id: 'form-layout',
    group: 'Forms',
    title: 'FormLayout',
    description:
      'Form shell with FormSection, FormGrid, FormSpan and ActionRow — consistent rhythm between sections, grids and fields.',
    render: () => (
      <>
        <Example
          title="Stacked section, two-column grid, sticky actions"
          stack
          code={'<FormLayout><FormSection><FormGrid columns={2} /></FormSection></FormLayout>'}
        >
          <FormLayout width={640} onSubmit={() => undefined}>
            <FormSection title="Profile" description="Shown to teammates" divider>
              <FormGrid columns={2}>
                <Input label="First name" />
                <Input label="Last name" />
                <FormSpan>
                  <Textarea label="About" rows={3} />
                </FormSpan>
                <Select label="Country" options={COUNTRIES} />
              </FormGrid>
            </FormSection>
            <ActionRow
              divider
              start={
                <Text variant="caption" tone="secondary">
                  Saved 2 min ago
                </Text>
              }
            >
              <Button variant="secondary" type="reset">
                Discard
              </Button>
              <Button type="submit">Save changes</Button>
            </ActionRow>
          </FormLayout>
        </Example>
        <Example title='FormSection layout="aside"' stack>
          <FormLayout width={760} as="div">
            <FormSection layout="aside" title="Notifications" description="Choose what reaches your inbox.">
              <Input label="Digest email" placeholder="you@velvet.design" />
            </FormSection>
          </FormLayout>
        </Example>
      </>
    ),
  },
  {
    id: 'error-summary',
    group: 'Forms',
    title: 'ErrorSummary',
    description: 'Submit-time summary that takes focus and links to each failing field.',
    render: () => (
      <Example title="Submit an empty form" stack code={'<ErrorSummary errors={[{ id: "email", message: "…" }]} />'}>
        <ErrorSummaryDemo />
      </Example>
    ),
  },
  {
    id: 'inline-edit',
    group: 'Forms',
    title: 'InlineEdit',
    description: 'Click-to-edit value. Enter or blur saves, Esc cancels; async saves lock the field while pending.',
    render: () => (
      <Example title="Sizes, validation and async save" code={'<InlineEdit onSave={save} validate={required} />'}>
        <InlineEditDemo />
      </Example>
    ),
  },
  {
    id: 'editable-collection',
    group: 'Forms',
    title: 'EditableCollection',
    description:
      'Repeatable editable rows — skills with a level, requirements with importance. Drag, or use ↑↓ on the grip.',
    render: () => (
      <>
        <Example title="Levels and drag reorder" stack code={'<EditableCollection title="Skills" levels={LEVELS} />'}>
          <EditableCollection
            title="Skills"
            levels={SKILL_LEVELS}
            defaultItems={SKILLS}
            placeholder="Skill name"
            addLabel="Add skill"
          />
        </Example>
        <Example title="Weighted rows, button reorder, capped" stack>
          <EditableCollection
            title="Requirements"
            weighted
            reorder="buttons"
            maxItems={4}
            defaultItems={REQUIREMENTS}
            placeholder="Requirement"
            addLabel="Add requirement"
          />
        </Example>
        <Example title="Empty" stack>
          <EditableCollection />
        </Example>
      </>
    ),
  },
  {
    id: 'signature-pad',
    group: 'Forms',
    title: 'SignaturePad',
    description: 'Draw-to-sign field with smoothed strokes, pressure-aware width and undo.',
    render: () => (
      <Example title="Pad" stack>
        <SignatureDemo />
      </Example>
    ),
  },
];
