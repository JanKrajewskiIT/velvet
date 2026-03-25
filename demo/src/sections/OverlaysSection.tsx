import type { TourStep } from '@jankrajewskiit/ui';
import {
  Button,
  Chip,
  CodeText,
  ConfirmAction,
  ConfirmDialog,
  ContextMenu,
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
  Popover,
  Sheet,
  Text,
  Tooltip,
  Tour,
} from '@jankrajewskiit/ui';
import { IoCopy, IoPencil, IoTrash } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const TOUR_STEPS: TourStep[] = [
  { target: '.showcaseTitle', title: 'Welcome', content: 'This is the section title area.', placement: 'bottom' },
  {
    target: '.previewPanel',
    title: 'Preview',
    content: 'Each component is shown in a preview panel.',
    placement: 'bottom',
  },
  {
    target: '.themeToggleBar',
    title: 'Theme',
    content: 'Toggle between light and dark mode here.',
    placement: 'top',
  },
];

const OverlaysSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const [tourOpen, setTourOpen] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  const [sheetActionsOpen, setSheetActionsOpen] = createSignal(false);
  const [confirmRuns, setConfirmRuns] = createSignal(0);
  const [bottomSheetOpen, setBottomSheetOpen] = createSignal(false);
  const [leftSheetOpen, setLeftSheetOpen] = createSignal(false);
  const [rightSheetOpen, setRightSheetOpen] = createSignal(false);

  return (
    <div>
      <Show when={sectionId() === 'overlays-tooltips'}>
        <ShowcaseSection title="Tooltip" subtitle="Contextual hints around interactive elements">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <Tooltip content="Tooltip on top" position="top">
                  <Button variant="ghost">Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip on bottom" position="bottom">
                  <Button variant="ghost">Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip on left" position="left">
                  <Button variant="ghost">Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip on right" position="right">
                  <Button variant="ghost">Right</Button>
                </Tooltip>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Popover" subtitle="Click-triggered floating content">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <Popover
                  trigger={(triggerProps) => (
                    <Button variant="ghost" {...triggerProps}>
                      Top
                    </Button>
                  )}
                  content="Popover content for top"
                  position="top"
                />
                <Popover
                  trigger={(triggerProps) => (
                    <Button variant="ghost" {...triggerProps}>
                      Bottom
                    </Button>
                  )}
                  content="Popover content for bottom"
                  position="bottom"
                />
                <Popover
                  trigger={(triggerProps) => (
                    <Button variant="ghost" {...triggerProps}>
                      Left
                    </Button>
                  )}
                  content="Popover content for left"
                  position="left"
                />
                <Popover
                  trigger={(triggerProps) => (
                    <Button variant="ghost" {...triggerProps}>
                      Right
                    </Button>
                  )}
                  content="Popover content for right"
                  position="right"
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-dialogs'}>
        <ShowcaseSection title="Dialog" subtitle="Native dialog with smooth transitions">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Button variant="primary" onClick={() => setDialogOpen(true)}>
                Open dialog
              </Button>

              <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
                <DialogTitle label="Example dialog" />
                <DialogBody>
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    This modal is built on the{' '}
                    <CodeText as="span" class="codeInline">
                      &lt;dialog&gt;
                    </CodeText>{' '}
                    element and closes on Escape or backdrop click.
                  </Text>
                </DialogBody>
                <DialogActions>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setDialogOpen(false)}>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="ConfirmDialog" subtitle="Preconfigured danger confirmation flow">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                Delete item
              </Button>

              <ConfirmDialog
                open={confirmOpen()}
                label="Delete item?"
                message="This action cannot be undone. The item will be permanently removed."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={() => setConfirmOpen(false)}
                onClose={() => setConfirmOpen(false)}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="ConfirmAction" subtitle="Headless confirmation flow wrapped around your own trigger">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <ConfirmAction
                label="Run destructive action?"
                message="This demo increments a counter so you can verify the flow."
                confirmLabel="Run"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={() => {
                  setConfirmRuns((current) => current + 1);
                }}
              >
                {({ openConfirm, isConfirmOpen }) => (
                  <div class="row">
                    <Button variant="danger" onClick={openConfirm}>
                      Open confirmation
                    </Button>
                    <Chip variant="subtle" label={`Confirm opened: ${isConfirmOpen() ? 'yes' : 'no'}`} />
                  </div>
                )}
              </ConfirmAction>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Confirmed actions:{' '}
            <CodeText as="span" class="codeInline">
              {String(confirmRuns())}
            </CodeText>
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-sheets'}>
        <ShowcaseSection title="Sheet (right with actions)" subtitle="Slide-in side panel with optional footer actions">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Button variant="ghost" onClick={() => setSheetActionsOpen(true)}>
                Open right sheet
              </Button>

              <Sheet
                open={sheetActionsOpen()}
                onClose={() => setSheetActionsOpen(false)}
                label="Settings"
                subtitle="Adjust your preferences"
                closeLabel="Close settings panel"
                side="right"
                size="lg"
                actions={
                  <>
                    <Button variant="ghost" onClick={() => setSheetActionsOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setSheetActionsOpen(false)}>
                      Save changes
                    </Button>
                  </>
                }
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  Sheet content goes here. It works well for settings panels, side-by-side forms and detail views.
                </Text>
              </Sheet>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Sheets" subtitle="Panels from bottom, left and right edges">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <Button variant="ghost" onClick={() => setBottomSheetOpen(true)}>
                  Bottom sheet
                </Button>
                <Button variant="ghost" onClick={() => setLeftSheetOpen(true)}>
                  Left sheet
                </Button>
                <Button variant="ghost" onClick={() => setRightSheetOpen(true)}>
                  Right sheet
                </Button>
              </div>

              <Sheet
                open={bottomSheetOpen()}
                onClose={() => setBottomSheetOpen(false)}
                label="Bottom sheet"
                closeLabel="Close bottom sheet"
                side="bottom"
                size="md"
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  This sheet slides up from the bottom edge of the viewport.
                </Text>
              </Sheet>

              <Sheet
                open={leftSheetOpen()}
                onClose={() => setLeftSheetOpen(false)}
                label="Left sheet"
                closeLabel="Close left sheet"
                side="left"
                size="sm"
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  This sheet slides in from the left edge of the viewport.
                </Text>
              </Sheet>

              <Sheet
                open={rightSheetOpen()}
                onClose={() => setRightSheetOpen(false)}
                label="Right sheet"
                closeLabel="Close right sheet"
                side="right"
                size="lg"
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  This sheet slides in from the right edge of the viewport.
                </Text>
              </Sheet>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-context'}>
        <ShowcaseSection title="ContextMenu" subtitle="Right-click action menus">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <ContextMenu
                items={[
                  { label: 'Edit', icon: <IoPencil />, onClick: () => {} },
                  { label: 'Duplicate', icon: <IoCopy />, onClick: () => {} },
                  'separator',
                  { label: 'Delete', icon: <IoTrash />, onClick: () => {}, danger: true },
                ]}
              >
                <div class="contextMenuTarget">Right-click here</div>
              </ContextMenu>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>Try right-clicking the dashed area above.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-lightbox'}>
        <ShowcaseSection title="Tour" subtitle="Step-by-step onboarding spotlight">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Button variant="primary" onClick={() => setTourOpen(true)}>
                Start tour
              </Button>
              <Tour
                steps={TOUR_STEPS}
                open={tourOpen()}
                onClose={() => setTourOpen(false)}
                nextLabel="Next"
                prevLabel="Back"
                finishLabel="Done"
                skipLabel="Skip"
              />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Highlights DOM elements by CSS selector. Supports top, bottom, left and right placements.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default OverlaysSection;
