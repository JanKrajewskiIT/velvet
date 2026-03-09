import {
  Autocomplete,
  Checkbox,
  ColorPicker,
  FormField,
  FormGrid,
  FormLayout,
  Input,
  RadioGroup,
  Select,
  Switch,
  TagInput,
  TextArea,
} from '@jankrajewskiit/ui';
import { createSignal } from 'solid-js';

import {
  PreviewPanel,
  ShowcaseMeta,
  ShowcaseSection,
} from '../components/ShowcaseSection';

const PRESET_COLORS = [
  '#1467ff',
  '#0c52cf',
  '#02a4ff',
  '#2e7d32',
  '#ed6c02',
  '#d32f2f',
  '#1b78ff',
  '#00838f',
];

type RoleValue = 'admin' | 'editor' | 'viewer';

const InputsSection = () => {
  const [text, setText] = createSignal('');
  const [selected, setSelected] = createSignal('');
  const [tags, setTags] = createSignal<string[]>(['solid-js', 'vite']);
  const [autoValues, setAutoValues] = createSignal<string[]>(['TypeScript']);
  const [color, setColor] = createSignal('#1467ff');
  const [newsletter, setNewsletter] = createSignal(true);
  const [notifications, setNotifications] = createSignal(false);
  const [role, setRole] = createSignal<RoleValue>('editor');

  return (
    <div>
      <ShowcaseSection
        title="Input"
        subtitle="Text, disabled and password fields"
      >
        <PreviewPanel class="col">
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
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Select"
        subtitle="Native select with custom styling"
      >
        <PreviewPanel>
          <FormField label="Choose option" id="demo-select">
            <Select
              id="demo-select"
              value={selected()}
              onChange={(e) => setSelected(e.currentTarget.value)}
            >
              <option value="">-- select --</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
            </Select>
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="TextArea" subtitle="Long-form input control">
        <PreviewPanel>
          <FormField label="Description" id="demo-ta">
            <TextArea
              id="demo-ta"
              placeholder="Enter a longer description..."
              rows={4}
            />
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Autocomplete"
        subtitle="Multi-value select with filtering"
      >
        <PreviewPanel>
          <FormField label="Technologies" id="demo-auto">
            <Autocomplete
              values={autoValues()}
              options={[
                'TypeScript',
                'JavaScript',
                'SolidJS',
                'React',
                'Vue',
                'Svelte',
                'Vite',
                'Tailwind',
              ]}
              onChange={setAutoValues}
              placeholder="Type to search..."
              removeLabel="Remove"
            />
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="TagInput"
        subtitle="Quick keyboard-driven tagging"
      >
        <PreviewPanel>
          <FormField label="Tags" id="demo-tags">
            <TagInput
              value={tags()}
              onChange={setTags}
              placeholder="Add a tag and press Enter"
            />
          </FormField>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="ColorPicker"
        subtitle="Palette-driven accent selection"
      >
        <PreviewPanel>
          <FormField label="Brand color" id="demo-color">
            <ColorPicker
              colors={PRESET_COLORS}
              value={color()}
              onChange={setColor}
            />
          </FormField>
        </PreviewPanel>
        <ShowcaseMeta>
          Selected color: <span class="codeInline">{color()}</span>
        </ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection
        title="Checkbox, Switch, RadioGroup"
        subtitle="Binary and single-choice controls"
      >
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

      <ShowcaseSection
        title="FormGrid"
        subtitle="Composable form layout for responsive forms"
      >
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
    </div>
  );
};

export default InputsSection;
