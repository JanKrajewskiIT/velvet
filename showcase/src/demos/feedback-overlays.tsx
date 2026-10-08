import { type Accessor, type Component, createSignal, For, type Setter } from 'solid-js';
import {
  BottomSheet,
  Button,
  ConfirmAction,
  ConfirmDialog,
  Dialog,
  IconButton,
  Popover,
  type StatusTone,
  Text,
  TONES,
  Toast,
  ToastProvider,
  Tooltip,
  Tour,
  type TourStep,
  useToast,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const SIDES = ['top', 'bottom', 'left', 'right'] as const;
const SAVE_DELAY_MS = 1000;
const UNDO_DURATION_MS = 6000;
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const failAfterDelay = async () => {
  await delay(SAVE_DELAY_MS);
  throw new Error('Request failed');
};

interface DisclosureState {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
}

interface DisclosureProps {
  label: string;
  children: Component<DisclosureState>;
}

/** Button that owns the open state of the overlay it renders. */
const Disclosure = (props: DisclosureProps) => {
  const [open, setOpen] = createSignal(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {props.label}
      </Button>
      {props.children({ open, setOpen })}
    </>
  );
};

const TOUR_STEPS: TourStep[] = [
  { title: 'Welcome', body: 'A short tour of the toolbar. Use the arrow keys or the buttons.' },
  { target: '#tour-demo-search', title: 'Search', body: 'Find anything in your workspace.', placement: 'bottom' },
  { target: '#tour-demo-new', title: 'Create', body: 'Start a new project from here.', placement: 'bottom' },
  { target: '#tour-demo-missing', title: 'Missing target', body: 'The spotlight falls back to a centred card.' },
];

const TourDemo = () => {
  const [open, setOpen] = createSignal(false);
  return (
    <>
      <IconButton id="tour-demo-search" icon="search" label="Search" variant="secondary" />
      <Button id="tour-demo-new" iconLeft="plus">
        New project
      </Button>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Start tour
      </Button>
      <Tour steps={TOUR_STEPS} open={open()} onClose={() => setOpen(false)} />
    </>
  );
};

const ToastQueueDemo = () => {
  const toast = useToast();
  return (
    <>
      <Button
        variant="secondary"
        onClick={() =>
          toast.show({ tone: 'success', title: 'Invite sent', description: 'anna@velvet.io will get an email.' })
        }
      >
        Show success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.show({
            title: 'Item deleted',
            duration: UNDO_DURATION_MS,
            onUndo: () => toast.show({ tone: 'success', title: 'Restored' }),
          })
        }
      >
        Show with undo
      </Button>
      <Button variant="ghost" onClick={() => toast.clear()}>
        Clear all
      </Button>
    </>
  );
};

const TOAST_TONE_COPY: Record<StatusTone, string> = {
  neutral: 'Draft saved',
  brand: 'New feature',
  info: 'Sync scheduled',
  success: 'Invite sent',
  warning: 'Storage almost full',
  danger: 'Upload failed',
};

export const feedbackOverlayDemos: DemoEntry[] = [
  {
    id: 'dialog',
    group: 'Feedback',
    title: 'Dialog',
    description:
      'Modal dialog or side drawer. The page behind is inert, focus returns to the trigger on close, Esc and backdrop click dismiss.',
    render: () => (
      <>
        <Example title="Sizes" code={'<Dialog open={open()} onClose={close} title="Rename project" footer={…} />'}>
          <For each={['sm', 'md', 'lg'] as const}>
            {(size) => (
              <Disclosure label={`Open ${size}`}>
                {(state) => (
                  <Dialog
                    open={state.open()}
                    onClose={() => state.setOpen(false)}
                    size={size}
                    title="Rename project"
                    description="Everyone in the workspace sees the new name."
                    footer={<Button onClick={() => state.setOpen(false)}>Save</Button>}
                  >
                    <Text>Dialog content goes here.</Text>
                  </Dialog>
                )}
              </Disclosure>
            )}
          </For>
        </Example>
        <Example title="Drawer" code={'<Dialog placement="right" … />'}>
          <For each={['right', 'left'] as const}>
            {(placement) => (
              <Disclosure label={`Drawer ${placement}`}>
                {(state) => (
                  <Dialog
                    open={state.open()}
                    onClose={() => state.setOpen(false)}
                    placement={placement}
                    title="Filters"
                    footer={<Button onClick={() => state.setOpen(false)}>Apply</Button>}
                  >
                    <Text>Drawer content goes here.</Text>
                  </Dialog>
                )}
              </Disclosure>
            )}
          </For>
        </Example>
        <Example title="Not dismissible" code={'<Dialog dismissible={false} … />'}>
          <Disclosure label="Open">
            {(state) => (
              <Dialog
                open={state.open()}
                onClose={() => state.setOpen(false)}
                dismissible={false}
                title="Accept the terms"
                footer={<Button onClick={() => state.setOpen(false)}>Accept</Button>}
              >
                <Text>Only the button closes this dialog.</Text>
              </Dialog>
            )}
          </Disclosure>
        </Example>
      </>
    ),
  },
  {
    id: 'confirm-dialog',
    group: 'Feedback',
    title: 'ConfirmDialog',
    description:
      'Second-thought dialog. Danger tone starts focus on Cancel; requireText gates irreversible actions; async onConfirm locks the dialog and shows failures inline.',
    render: () => (
      <>
        <Example
          title="Tones"
          code={'<ConfirmDialog tone="danger" open={open()} onConfirm={remove} onCancel={close} />'}
        >
          <For each={['primary', 'danger'] as const}>
            {(tone) => (
              <Disclosure label={tone === 'danger' ? 'Delete…' : 'Publish…'}>
                {(state) => (
                  <ConfirmDialog
                    open={state.open()}
                    tone={tone}
                    title={tone === 'danger' ? 'Delete this project?' : 'Publish changes?'}
                    description={tone === 'danger' ? 'This cannot be undone.' : 'Everyone will see the update.'}
                    confirmLabel={tone === 'danger' ? 'Delete' : 'Publish'}
                    onCancel={() => state.setOpen(false)}
                    onConfirm={() => {
                      state.setOpen(false);
                    }}
                  />
                )}
              </Disclosure>
            )}
          </For>
        </Example>
        <Example title="Type to confirm" code={'<ConfirmDialog requireText="Velvet" … />'}>
          <Disclosure label="Delete workspace…">
            {(state) => (
              <ConfirmDialog
                open={state.open()}
                tone="danger"
                requireText="Velvet"
                title="Delete workspace?"
                description="All projects and members are removed."
                confirmLabel="Delete workspace"
                onCancel={() => state.setOpen(false)}
                onConfirm={() => {
                  state.setOpen(false);
                }}
              />
            )}
          </Disclosure>
        </Example>
        <Example title="Async failure" code={'<ConfirmDialog onConfirm={async () => { throw … }} />'}>
          <Disclosure label="Save (fails)">
            {(state) => (
              <ConfirmDialog
                open={state.open()}
                title="Save changes?"
                onCancel={() => state.setOpen(false)}
                onConfirm={failAfterDelay}
              />
            )}
          </Disclosure>
        </Example>
        <Example title="ConfirmAction" code={'<ConfirmAction trigger="Remove" tone="danger" onConfirm={remove} />'}>
          <ConfirmAction
            trigger="Remove member"
            tone="danger"
            title="Remove Anna?"
            confirmLabel="Remove"
            onConfirm={() => delay(SAVE_DELAY_MS)}
          />
        </Example>
      </>
    ),
  },
  {
    id: 'bottom-sheet',
    group: 'Feedback',
    title: 'BottomSheet',
    description:
      'Mobile-first panel sliding up from the bottom. Drag the grabber down or flick to dismiss; Esc and backdrop tap also close.',
    render: () => (
      <Example title="Sheet" code={'<BottomSheet open={open()} onClose={close} title="Share" footer={…} />'}>
        <Disclosure label="Open sheet">
          {(state) => (
            <BottomSheet
              open={state.open()}
              onClose={() => state.setOpen(false)}
              title="Share project"
              description="Anyone with the link can view."
              footer={
                <Button block onClick={() => state.setOpen(false)}>
                  Copy link
                </Button>
              }
            >
              <Text>Sheet content goes here.</Text>
            </BottomSheet>
          )}
        </Disclosure>
      </Example>
    ),
  },
  {
    id: 'popover',
    group: 'Feedback',
    title: 'Popover',
    description:
      'Floating panel for rich content. openOn="hover" makes it a hover card. Closes on outside click and Esc. Use Tooltip for plain-text hints.',
    render: () => (
      <>
        <Example
          title="Click"
          code={
            '<Popover title="Quick settings" trigger={(trigger) => <Button {...trigger}>Settings</Button>}>…</Popover>'
          }
        >
          <Popover
            title="Quick settings"
            trigger={(trigger) => (
              <Button variant="secondary" {...trigger}>
                Settings
              </Button>
            )}
          >
            <Text>Notification and density options.</Text>
          </Popover>
          <Popover
            title="Aligned end, above"
            side="top"
            align="end"
            trigger={(trigger) => (
              <Button variant="secondary" {...trigger}>
                Top, end
              </Button>
            )}
          >
            <Text>Opens above and aligns to the end edge of the trigger.</Text>
          </Popover>
        </Example>
        <Example title="Hover card" code={'<Popover openOn="hover" trigger={…}>…</Popover>'}>
          <Popover
            openOn="hover"
            title="Anna Kowalska"
            trigger={(trigger) => (
              <Button variant="link" {...trigger}>
                @anna
              </Button>
            )}
          >
            <Text>Product designer · Warsaw</Text>
          </Popover>
        </Example>
      </>
    ),
  },
  {
    id: 'tooltip',
    group: 'Feedback',
    title: 'Tooltip',
    description:
      'Short hint on hover and focus, linked to its trigger with aria-describedby. Stays visible while hovered and dismisses with Esc.',
    render: () => (
      <>
        <Example
          title="Sides"
          code={'<Tooltip content="Search" side="bottom"><IconButton icon="search" label="Search" /></Tooltip>'}
        >
          <For each={SIDES}>
            {(side) => (
              <Tooltip content={`Tooltip ${side}`} side={side}>
                <Button variant="secondary">{side}</Button>
              </Tooltip>
            )}
          </For>
        </Example>
        <Example title="With shortcut" code={'<Tooltip content="Search" shortcut="⌘K">…</Tooltip>'}>
          <Tooltip content="Search" shortcut="⌘K">
            <IconButton icon="search" label="Search" variant="secondary" />
          </Tooltip>
        </Example>
        <Example title="Forced open" code={'<Tooltip open content="Always visible">…</Tooltip>'}>
          <div style={{ 'padding-top': 'var(--space-10)' }}>
            <Tooltip open content="Always visible">
              <Button variant="secondary">Anchor</Button>
            </Tooltip>
          </div>
        </Example>
      </>
    ),
  },
  {
    id: 'tour',
    group: 'Feedback',
    title: 'Tour',
    description:
      'Guided walkthrough that spotlights one element per step. Arrow keys navigate, Esc skips; the page behind is inert.',
    render: () => (
      <Example
        title="Walkthrough"
        code={'<Tour steps={[{ target: "#search", title: "Search" }]} open={open()} onClose={close} />'}
      >
        <TourDemo />
      </Example>
    ),
  },
  {
    id: 'toast',
    group: 'Feedback',
    title: 'Toast',
    description:
      'Transient status message. ToastProvider owns the queue and the live region; useToast().show() queues a toast. Toast and ToastRegion remain available for custom stacks.',
    render: () => (
      <>
        <Example
          title="Tones"
          stack
          code={'<Toast tone="success" title="Invite sent" description="…" onClose={dismiss} />'}
        >
          <For each={TONES}>
            {(tone) => (
              <Toast
                tone={tone}
                title={TOAST_TONE_COPY[tone]}
                description="Details about what just happened."
                onClose={() => undefined}
              />
            )}
          </For>
        </Example>
        <Example title="Undo" stack code={'<Toast title="Item deleted" onUndo={restore} onClose={dismiss} />'}>
          <Toast title="Item deleted" onUndo={() => undefined} onClose={() => undefined} />
        </Example>
        <Example
          title="Provider and hook"
          code={'const toast = useToast();\ntoast.show({ tone: "success", title: "Saved" });'}
        >
          <ToastProvider>
            <ToastQueueDemo />
          </ToastProvider>
        </Example>
      </>
    ),
  },
];
