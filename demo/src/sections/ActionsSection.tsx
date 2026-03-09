import { Button, IconButton, Spinner, Tooltip } from '@jankrajewskiit/ui';
import { IoAdd, IoClose, IoDownload, IoPencil, IoTrash } from 'solid-icons/io';
import { createSignal } from 'solid-js';

const ActionsSection = () => {
  const [loading, setLoading] = createSignal(false);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div>
      <div class="section">
        <h2 class="sectionTitle">Button - variants</h2>
        <div class="previewBox">
          <div class="row">
            <Button variant="primary">Primary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="dashed">Dashed</Button>
          </div>
        </div>

        <h2 class="sectionTitle">Button - states</h2>
        <div class="previewBox">
          <div class="row">
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button
              variant="primary"
              loading={loading()}
              onClick={simulateLoad}
            >
              {loading() ? 'Saving...' : 'Click to load'}
            </Button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">IconButton</h2>
        <div class="previewBox">
          <div class="row">
            <IconButton icon={<IoPencil />} title="Edit" />
            <IconButton icon={<IoTrash />} title="Delete" />
            <IconButton icon={<IoAdd />} title="Add" size="sm" />
            <IconButton icon={<IoDownload />} title="Download" size="md" />
            <IconButton icon={<IoClose />} title="Close" disabled />
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Tooltip</h2>
        <div class="previewBox">
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
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Spinner</h2>
        <div class="previewBox">
          <div class="row">
            <Spinner size="sm" label="Small spinner" />
            <Spinner size="md" label="Medium spinner" />
            <Spinner size="lg" label="Large spinner" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsSection;
