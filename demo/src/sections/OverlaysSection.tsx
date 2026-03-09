import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
  Drawer,
} from '@jankrajewskiit/ui';
import { createSignal } from 'solid-js';

import {
  PreviewPanel,
  ShowcaseMeta,
  ShowcaseSection,
} from '../components/ShowcaseSection';

const OverlaysSection = () => {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  const [drawerOpen, setDrawerOpen] = createSignal(false);

  return (
    <div>
      <ShowcaseSection
        title="Dialog"
        subtitle="Native dialog with smooth transitions"
      >
        <PreviewPanel>
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
        </PreviewPanel>

        <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Example dialog</DialogTitle>
          <DialogBody>
            <p class="mutedText">
              This modal is built on the{' '}
              <span class="codeInline">&lt;dialog&gt;</span> element and closes
              on Escape or backdrop click.
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

      <ShowcaseSection
        title="ConfirmDialog"
        subtitle="Preconfigured danger confirmation flow"
      >
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

      <ShowcaseSection
        title="Drawer"
        subtitle="Slide-in side panel for secondary workflows"
      >
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
          <p class="mutedText">
            Drawer content goes here. It works well for settings panels,
            side-by-side forms and detail views.
          </p>
        </Drawer>

        <ShowcaseMeta>
          Dialogs and drawers reuse button styles, spacing tokens and transition
          curves for a consistent feel.
        </ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default OverlaysSection;
