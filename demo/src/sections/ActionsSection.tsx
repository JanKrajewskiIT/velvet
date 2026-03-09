import {
  ActionRow,
  Button,
  IconButton,
  LocaleSwitcher,
  Spinner,
  Tooltip,
} from '@jankrajewskiit/ui';
import { IoAdd, IoClose, IoDownload, IoPencil, IoTrash } from 'solid-icons/io';
import { createSignal } from 'solid-js';

import {
  PreviewPanel,
  ShowcaseMeta,
  ShowcaseSection,
} from '../components/ShowcaseSection';

const ActionsSection = () => {
  const [loading, setLoading] = createSignal(false);
  const [locale, setLocale] = createSignal<'EN' | 'PL'>('EN');

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div>
      <ShowcaseSection
        title="Button variants"
        subtitle="Primary actions, danger actions and low-emphasis controls"
      >
        <PreviewPanel>
          <div class="row">
            <Button variant="primary">Primary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="dashed">Dashed</Button>
          </div>
        </PreviewPanel>
        <PreviewPanel>
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
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="IconButton"
        subtitle="Compact controls for dense interfaces"
      >
        <PreviewPanel>
          <div class="row">
            <IconButton icon={<IoPencil />} title="Edit" />
            <IconButton icon={<IoTrash />} title="Delete" />
            <IconButton icon={<IoAdd />} title="Add" size="sm" />
            <IconButton icon={<IoDownload />} title="Download" size="md" />
            <IconButton icon={<IoClose />} title="Close" disabled />
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Tooltip"
        subtitle="Contextual hints around interactive elements"
      >
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

      <ShowcaseSection
        title="ActionRow and LocaleSwitcher"
        subtitle="Reusable helper components for action bars"
      >
        <PreviewPanel class="col">
          <ActionRow align="start">
            <Button variant="primary">Create</Button>
            <Button variant="ghost">Preview</Button>
            <Button variant="dashed">Duplicate</Button>
          </ActionRow>

          <ActionRow align="end">
            <LocaleSwitcher
              label={locale()}
              switchLabel="Switch locale"
              onSwitch={() =>
                setLocale((current) => (current === 'EN' ? 'PL' : 'EN'))
              }
            />
          </ActionRow>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="Spinner"
        subtitle="Progress indicators in multiple sizes"
      >
        <PreviewPanel>
          <div class="row">
            <Spinner size="sm" label="Small spinner" />
            <Spinner size="md" label="Medium spinner" />
            <Spinner size="lg" label="Large spinner" />
          </div>
        </PreviewPanel>
        <ShowcaseMeta>
          Spinners inherit brand colors and support reduced-motion preferences.
        </ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default ActionsSection;
