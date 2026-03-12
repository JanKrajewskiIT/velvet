import type { LightboxImage, TourStep } from '@jankrajewskiit/ui';
import {
  Button,
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
  Tooltip,
  Tour,
} from '@jankrajewskiit/ui';
import { IoCopy, IoPencil, IoTrash } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const SAMPLE_IMAGES: LightboxImage[] = [
  { src: 'https://picsum.photos/id/10/800/600', alt: 'Forest', caption: 'Misty forest trail' },
  { src: 'https://picsum.photos/id/15/800/600', alt: 'Mountains', caption: 'Mountain sunrise' },
  { src: 'https://picsum.photos/id/29/800/600', alt: 'Coast', caption: 'Rocky coastline' },
];

const TOUR_STEPS: TourStep[] = [
  { target: '.showcase-title', title: 'Welcome', content: 'This is the section title area.', placement: 'bottom' },
  {
    target: '.preview-panel',
    title: 'Preview',
    content: 'Each component is shown in a preview panel.',
    placement: 'bottom',
  },
  {
    target: '.theme-toggle-bar',
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
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Popover" subtitle="Click-triggered floating content">
          <PreviewPanel>
            <div class="row">
              <Popover
                trigger={<Button variant="ghost">Top</Button>}
                content={<p class="muted-text">Popover content for top</p>}
                position="top"
              />
              <Popover
                trigger={<Button variant="ghost">Bottom</Button>}
                content={<p class="muted-text">Popover content for bottom</p>}
                position="bottom"
              />
              <Popover
                trigger={<Button variant="ghost">Left</Button>}
                content={<p class="muted-text">Popover content for left</p>}
                position="left"
              />
              <Popover
                trigger={<Button variant="ghost">Right</Button>}
                content={<p class="muted-text">Popover content for right</p>}
                position="right"
              />
            </div>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-dialogs'}>
        <ShowcaseSection title="Dialog" subtitle="Native dialog with smooth transitions">
          <PreviewPanel>
            <Button variant="primary" onClick={() => setDialogOpen(true)}>
              Open dialog
            </Button>
          </PreviewPanel>

          <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Example dialog</DialogTitle>
            <DialogBody>
              <p class="muted-text">
                This modal is built on the <span class="code-inline">&lt;dialog&gt;</span> element and closes on Escape
                or backdrop click.
              </p>
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
        </ShowcaseSection>

        <ShowcaseSection title="ConfirmDialog" subtitle="Preconfigured danger confirmation flow">
          <PreviewPanel>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete item
            </Button>
          </PreviewPanel>

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
        </ShowcaseSection>

        <ShowcaseSection title="ConfirmAction" subtitle="Headless confirmation flow wrapped around your own trigger">
          <PreviewPanel class="col">
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
                  <span class="status-chip">Confirm opened: {isConfirmOpen() ? 'yes' : 'no'}</span>
                </div>
              )}
            </ConfirmAction>
            <ShowcaseMeta>
              Confirmed actions: <span class="code-inline">{String(confirmRuns())}</span>
            </ShowcaseMeta>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-drawers'}>
        <ShowcaseSection title="Drawer" subtitle="Slide-in side panel for secondary workflows">
          <PreviewPanel>
            <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
          </PreviewPanel>

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
            <p class="muted-text">
              Drawer content goes here. It works well for settings panels, side-by-side forms and detail views.
            </p>
          </Drawer>
        </ShowcaseSection>

        <ShowcaseSection title="Sheet" subtitle="Modal panel from any edge">
          <PreviewPanel>
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
          </PreviewPanel>

          <Sheet
            open={bottomSheetOpen()}
            onClose={() => setBottomSheetOpen(false)}
            title="Bottom sheet"
            closeLabel="Close bottom sheet"
            side="bottom"
            size="md"
          >
            <p class="muted-text">This sheet slides up from the bottom edge of the viewport.</p>
          </Sheet>

          <Sheet
            open={leftSheetOpen()}
            onClose={() => setLeftSheetOpen(false)}
            title="Left sheet"
            closeLabel="Close left sheet"
            side="left"
            size="sm"
          >
            <p class="muted-text">This sheet slides in from the left edge of the viewport.</p>
          </Sheet>

          <Sheet
            open={rightSheetOpen()}
            onClose={() => setRightSheetOpen(false)}
            title="Right sheet"
            closeLabel="Close right sheet"
            side="right"
            size="lg"
          >
            <p class="muted-text">This sheet slides in from the right edge of the viewport.</p>
          </Sheet>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-context'}>
        <ShowcaseSection title="ContextMenu" subtitle="Right-click action menus">
          <PreviewPanel>
            <ContextMenu
              items={[
                { label: 'Edit', icon: <IoPencil />, onClick: () => {} },
                { label: 'Duplicate', icon: <IoCopy />, onClick: () => {} },
                'separator',
                { label: 'Delete', icon: <IoTrash />, onClick: () => {}, danger: true },
              ]}
            >
              <div
                style={{
                  'min-height': '120px',
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center',
                  border: '2px dashed var(--color-border)',
                  'border-radius': 'var(--radius-md)',
                }}
              >
                Right-click here
              </div>
            </ContextMenu>
          </PreviewPanel>
          <ShowcaseMeta>Try right-clicking the dashed area above.</ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'overlays-lightbox'}>
        <ShowcaseSection title="Lightbox" subtitle="Fullscreen image viewer with navigation">
          <PreviewPanel>
            <Button variant="ghost" onClick={() => setLightboxOpen(true)}>
              Open lightbox
            </Button>
          </PreviewPanel>
          <Lightbox images={SAMPLE_IMAGES} open={lightboxOpen()} onClose={() => setLightboxOpen(false)} />
        </ShowcaseSection>

        <ShowcaseSection title="Tour" subtitle="Step-by-step onboarding spotlight">
          <PreviewPanel>
            <Button variant="primary" onClick={() => setTourOpen(true)}>
              Start tour
            </Button>
          </PreviewPanel>
          <Tour
            steps={TOUR_STEPS}
            open={tourOpen()}
            onClose={() => setTourOpen(false)}
            nextLabel="Next"
            prevLabel="Back"
            finishLabel="Done"
            skipLabel="Skip"
          />
          <ShowcaseMeta>
            Highlights DOM elements by CSS selector. Supports top, bottom, left and right placements.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default OverlaysSection;
