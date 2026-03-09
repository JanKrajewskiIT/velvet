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

const OverlaysSection = () => {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  const [drawerOpen, setDrawerOpen] = createSignal(false);

  return (
    <div>
      <div class="section">
        <h2 class="sectionTitle">Dialog</h2>
        <div class="previewBox">
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Open Dialog
          </Button>
        </div>

        <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Example Dialog</DialogTitle>
          <DialogBody>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
              This is a modal dialog built with the native{' '}
              <code style={{ 'font-size': 'var(--font-size-sm)' }}>
                &lt;dialog&gt;
              </code>{' '}
              element. It supports Escape and backdrop click to close.
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
      </div>

      <div class="section">
        <h2 class="sectionTitle">ConfirmDialog</h2>
        <div class="previewBox">
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Delete item
          </Button>
        </div>

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
      </div>

      <div class="section">
        <h2 class="sectionTitle">Drawer</h2>
        <div class="previewBox">
          <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
            Open Drawer
          </Button>
        </div>

        <Drawer
          open={drawerOpen()}
          onClose={() => setDrawerOpen(false)}
          title="Settings"
          subtitle="Adjust your preferences"
          closeLabel="Close settings drawer"
        >
          <p style={{ color: 'var(--color-text-muted)', 'line-height': '1.6' }}>
            Drawer content goes here. Useful for settings panels, detail views,
            or side forms.
          </p>
          <Button variant="primary" onClick={() => setDrawerOpen(false)}>
            Save changes
          </Button>
        </Drawer>
      </div>
    </div>
  );
};

export default OverlaysSection;
