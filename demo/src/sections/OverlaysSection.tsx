import type { LightboxImage, TourStep } from '@jankrajewskiit/ui';
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
  Drawer,
  Lightbox,
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

const SAMPLE_IMAGES: LightboxImage[] = [
  { src: 'https://picsum.photos/id/10/800/600', alt: 'Forest', caption: 'Misty forest trail' },
  { src: 'https://picsum.photos/id/15/800/600', alt: 'Mountains', caption: 'Mountain sunrise' },
  { src: 'https://picsum.photos/id/29/800/600', alt: 'Coast', caption: 'Rocky coastline' },
];

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
  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [confirmRuns, setConfirmRuns] = createSignal(0);
  const [bottomSheetOpen, setBottomSheetOpen] = createSignal(false);
  const [leftSheetOpen, setLeftSheetOpen] = createSignal(false);
  const [rightSheetOpen, setRightSheetOpen] = createSignal(false);
  const [lightboxOpen, setLightboxOpen] = createSignal(false);

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
                  trigger={<Button variant="ghost">Top</Button>}
                  content={
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Popover content for top
                    </Text>
                  }
                  position="top"
                />
                <Popover
                  trigger={<Button variant="ghost">Bottom</Button>}
                  content={
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Popover content for bottom
                    </Text>
                  }
                  position="bottom"
                />
                <Popover
                  trigger={<Button variant="ghost">Left</Button>}
                  content={
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Popover content for left
                    </Text>
                  }
                  position="left"
                />
                <Popover
                  trigger={<Button variant="ghost">Right</Button>}
                  content={
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Popover content for right
                    </Text>
                  }
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
                <DialogTitle>Example dialog</DialogTitle>
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
                title="Delete item?"
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
                title="Run destructive action?"
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
                    <Chip variant="subtle">Confirm opened: {isConfirmOpen() ? 'yes' : 'no'}</Chip>
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

      <Show when={sectionId() === 'overlays-drawers'}>
        <ShowcaseSection title="Drawer" subtitle="Slide-in side panel for secondary workflows">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
                Open drawer
              </Button>

              <Drawer
                open={drawerOpen()}
                onClose={() => setDrawerOpen(false)}
                title="Settings"
                subtitle="Adjust your preferences"
                closeLabel="Close settings drawer"
                actions={
                  <>
                    <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setDrawerOpen(false)}>
                      Save changes
                    </Button>
                  </>
                }
              >
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  Drawer content goes here. It works well for settings panels, side-by-side forms and detail views.
                </Text>
              </Drawer>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Sheet" subtitle="Modal panel from any edge">
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
                title="Bottom sheet"
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
                title="Left sheet"
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
                title="Right sheet"
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
        <ShowcaseSection title="Lightbox" subtitle="Fullscreen image viewer with navigation">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Button variant="ghost" onClick={() => setLightboxOpen(true)}>
                Open lightbox
              </Button>
              <Lightbox images={SAMPLE_IMAGES} open={lightboxOpen()} onClose={() => setLightboxOpen(false)} />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

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
