import { createSignal, For } from 'solid-js';
import {
  AuthButton,
  Button,
  ButtonGroup,
  type ButtonVariant,
  CalendarEventButton,
  CopyButton,
  CopyField,
  Fab,
  IconButton,
  LocaleSwitcher,
  ThemeToggle,
  ToggleButton,
  ToggleGroup,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'soft', 'ghost', 'danger', 'link', 'dashed'];
const IN_A_WEEK_MS = 7 * 864e5;
const nextWeek = () => new Date(Date.now() + IN_A_WEEK_MS);
const SIGN_IN_DELAY_MS = 800;

const AuthDemo = () => {
  const [signedIn, setSignedIn] = createSignal(false);
  const toggle = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        setSignedIn(!signedIn());
        resolve();
      }, SIGN_IN_DELAY_MS),
    );
  return <AuthButton signedIn={signedIn()} onSignIn={toggle} onSignOut={toggle} />;
};

export const actionDemos: DemoEntry[] = [
  {
    id: 'button',
    group: '15 Actions',
    title: 'Button',
    description: 'Primary action trigger. One primary per view; secondary or ghost for the rest.',
    render: () => (
      <>
        <Example title="Variants" code={'<Button variant="secondary">Cancel</Button>'}>
          <For each={VARIANTS}>{(variant) => <Button variant={variant}>{variant}</Button>}</For>
        </Example>
        <Example title="Sizes" code={'<Button size="sm">Small</Button>'}>
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Example>
        <Example title="States" code={'<Button loading>Saving…</Button>'}>
          <Button iconLeft="plus">New project</Button>
          <Button iconRight="arrow-right" variant="secondary">
            Continue
          </Button>
          <Button loading>Saving…</Button>
          <Button disabled>Disabled</Button>
        </Example>
        <Example title="Block" stack code={'<Button block variant="dashed" iconLeft="plus">Add row</Button>'}>
          <Button block variant="dashed" iconLeft="plus">
            Add row
          </Button>
        </Example>
      </>
    ),
  },
  {
    id: 'icon-button',
    group: '15 Actions',
    title: 'IconButton',
    description: 'Square icon-only button. Always carries an accessible label.',
    render: () => (
      <>
        <Example title="Variants" code={'<IconButton icon="trash-2" label="Delete" variant="danger" />'}>
          <IconButton icon="settings" label="Settings" />
          <IconButton icon="plus" label="Add" variant="primary" />
          <IconButton icon="pencil" label="Edit" variant="secondary" />
          <IconButton icon="star" label="Favourite" variant="soft" />
          <IconButton icon="trash-2" label="Delete" variant="danger" />
          <IconButton icon="chevron-right" label="Next" variant="raised" shape="circle" />
        </Example>
        <Example title="Sizes" code={'<IconButton size="xs" icon="x" label="Close" />'}>
          <IconButton size="xs" icon="x" label="Close" />
          <IconButton size="sm" icon="x" label="Close" />
          <IconButton size="md" icon="x" label="Close" />
          <IconButton size="lg" icon="x" label="Close" />
        </Example>
      </>
    ),
  },
  {
    id: 'button-group',
    group: '15 Actions',
    title: 'ButtonGroup',
    description: 'Groups related buttons into a segmented control, or spaces them as an action row.',
    render: () => (
      <>
        <Example title="Attached" code={'<ButtonGroup label="Text align" size="sm">…</ButtonGroup>'}>
          <ButtonGroup label="Text align" size="sm">
            <IconButton icon="align-left" label="Align left" variant="secondary" />
            <IconButton icon="align-center" label="Align center" variant="secondary" />
            <IconButton icon="align-right" label="Align right" variant="secondary" />
          </ButtonGroup>
        </Example>
        <Example title="Spaced" code={'<ButtonGroup attached={false}>…</ButtonGroup>'}>
          <ButtonGroup attached={false} label="Dialog actions">
            <Button variant="ghost">Cancel</Button>
            <Button>Save changes</Button>
          </ButtonGroup>
        </Example>
      </>
    ),
  },
  {
    id: 'toggle',
    group: '15 Actions',
    title: 'ToggleButton & ToggleGroup',
    description: 'An action that stays pressed (favourite, bold, mute). Not a setting — use Switch for those.',
    render: () => (
      <>
        <Example title="Toggle button" code={'<ToggleButton icon="star" label="Favourite" />'}>
          <ToggleButton icon="star" label="Favourite" />
          <ToggleButton icon="bell" defaultPressed>
            Following
          </ToggleButton>
        </Example>
        <Example title="Multiple" code={'<ToggleGroup label="Text style">…</ToggleGroup>'}>
          <ToggleGroup label="Text style">
            <ToggleButton value="bold" icon="bold" label="Bold" tone="neutral" />
            <ToggleButton value="italic" icon="italic" label="Italic" tone="neutral" />
            <ToggleButton value="underline" icon="underline" label="Underline" tone="neutral" />
          </ToggleGroup>
        </Example>
        <Example title="Single" code={'<ToggleGroup type="single" defaultValue="grid">…</ToggleGroup>'}>
          <ToggleGroup type="single" defaultValue="grid" label="View">
            <ToggleButton value="grid" icon="layout-grid" label="Grid" />
            <ToggleButton value="list" icon="list" label="List" />
          </ToggleGroup>
        </Example>
      </>
    ),
  },
  {
    id: 'copy',
    group: '15 Actions',
    title: 'CopyButton & CopyField',
    description: 'Copies text to the clipboard; the icon morphs and the result is announced.',
    render: () => (
      <>
        <Example title="Button" code={'<CopyButton value="npm i @jankrajewskiit/ui" />'}>
          <CopyButton value="npm i @jankrajewskiit/ui" />
          <CopyButton value="npm i @jankrajewskiit/ui" iconOnly variant="ghost" />
        </Example>
        <Example title="Field" stack code={'<CopyField label="Invite link" value="…" />'}>
          <CopyField label="Invite link" value="https://velvet.example/invite/8f3k2q" />
        </Example>
      </>
    ),
  },
  {
    id: 'auth-button',
    group: '15 Actions',
    title: 'AuthButton',
    description: 'Session toggle: sign in when signed out, sign out when signed in. Handlers may be async.',
    render: () => (
      <Example
        title="Async handlers"
        code={'<AuthButton signedIn={signedIn()} onSignIn={signIn} onSignOut={signOut} />'}
      >
        <AuthDemo />
      </Example>
    ),
  },
  {
    id: 'fab',
    group: '15 Actions',
    title: 'Fab',
    description: 'Floating action button for the single most important creation action on mobile.',
    render: () => (
      <Example title="Plain, extended and speed dial" code={'<Fab label="New" position="static" />'}>
        <Fab label="New item" position="static" />
        <Fab label="Compose" extended position="static" />
        <Fab
          label="Create"
          position="static"
          actions={[
            { label: 'Document', icon: 'file-text' },
            { label: 'Folder', icon: 'folder' },
          ]}
        />
      </Example>
    ),
  },
  {
    id: 'locale-switcher',
    group: '21 Menus',
    title: 'LocaleSwitcher',
    description: 'Compact language toggle with a sliding thumb. For four or more languages use Select.',
    render: () => (
      <Example title="Sizes" code={'<LocaleSwitcher size="md" />'}>
        <LocaleSwitcher />
        <LocaleSwitcher size="md" />
      </Example>
    ),
  },
  {
    id: 'theme-toggle',
    group: '15 Actions',
    title: 'ThemeToggle',
    description: 'Light/dark switch. Uncontrolled it drives html[data-theme] and persists the choice.',
    render: () => (
      <Example title="Appearances" code={'<ThemeToggle appearance="segmented" />'}>
        <ThemeToggle />
        <ThemeToggle appearance="segmented" />
        <ThemeToggle size="sm" />
      </Example>
    ),
  },
  {
    id: 'calendar-event-button',
    group: '15 Actions',
    title: 'CalendarEventButton',
    description: 'Add an interview, deadline or meeting to Google, Outlook or an .ics file.',
    render: () => (
      <Example title="Providers" code={'<CalendarEventButton event={{ title: "Interview", start }} />'}>
        <CalendarEventButton
          event={{ title: 'Interview', start: nextWeek(), durationMinutes: 45, location: 'Online' }}
        />
        <CalendarEventButton
          event={{ title: 'Deadline', start: nextWeek(), allDay: true }}
          providers={['ics']}
          label="Download .ics"
        />
        <CalendarEventButton event={{ title: 'Interview', start: nextWeek() }} iconOnly />
      </Example>
    ),
  },
];
