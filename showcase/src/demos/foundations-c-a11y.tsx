import { createSignal } from 'solid-js';
import { Button, Count, LiveRegion, SkipLink, Text, VisuallyHidden } from '../../../src';
import { Example } from '../Example';
import { columnStyle, evenColumns, gridStyle } from './foundations-a-parts';

const SKIP_TARGET_ID = 'a11y-skip-target';
const LIVE_REGION_CLEAR_MS = 3000;

type Announcement = { text: string; id: number };

export const A11yExample = () => {
  const [announcement, setAnnouncement] = createSignal<Announcement>();
  const [skipArea, setSkipArea] = createSignal<HTMLDivElement>();
  const announce = (text: string) => setAnnouncement({ text, id: Date.now() });
  const focusSkipLink = () => skipArea()?.querySelector<HTMLElement>('.vui-skiplink')?.focus();

  return (
    <Example title="VisuallyHidden · SkipLink · LiveRegion" stack>
      <div ref={setSkipArea}>
        <SkipLink href={`#${SKIP_TARGET_ID}`} />
      </div>
      <div style={gridStyle(evenColumns(3))}>
        <div style={columnStyle}>
          <Text variant="label">SkipLink — Tab into the card</Text>
          <div>
            <Button size="sm" variant="secondary" onClick={focusSkipLink}>
              Focus skip link
            </Button>
          </div>
          <Text variant="caption" tone="tertiary">
            appears top-left, jumps to the target
          </Text>
        </div>
        <div style={columnStyle}>
          <Text variant="label">VisuallyHidden</Text>
          <div style={{ display: 'flex', 'align-items': 'center', gap: 'var(--space-2)' }}>
            <Text variant="label">Inbox</Text>
            <Count value={3} />
            <VisuallyHidden>3 unread messages</VisuallyHidden>
          </div>
          <Text variant="caption" tone="tertiary">
            reads “Inbox 3 unread messages”
          </Text>
        </div>
        <div style={columnStyle} id={SKIP_TARGET_ID}>
          <Text variant="label">LiveRegion · visible</Text>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button size="sm" variant="secondary" onClick={() => announce('Changes saved')}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => announce('12 results')}>
              Search
            </Button>
          </div>
          <LiveRegion message={announcement()} visible clearAfter={LIVE_REGION_CLEAR_MS} />
        </div>
      </div>
    </Example>
  );
};
