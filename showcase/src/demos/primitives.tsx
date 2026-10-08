import { createSignal, For } from 'solid-js';
import {
  Button,
  Checkmark,
  Chevron,
  CloseButton,
  ColumnResize,
  Control,
  Count,
  Dot,
  EmptyText,
  Field,
  Glyph,
  Handle,
  highlightMatch,
  IconButton,
  IconTile,
  Indicator,
  Kbd,
  ListItem,
  LiveRegion,
  Mark,
  Marker,
  Meter,
  Option,
  Rail,
  RailItem,
  SectionLabel,
  Segmented,
  SegmentedItem,
  Separator,
  Surface,
  Swatch,
  TONES,
  Text,
  type TextVariant,
  VisuallyHidden,
  Weekday,
  weekdayNames,
} from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const TEXT_VARIANTS: TextVariant[] = [
  'display-sm',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'title',
  'kpi',
  'body-lg',
  'body',
  'body-sm',
  'label',
  'caption',
  'overline',
];
const SURFACE_VARIANTS = ['default', 'low', 'flat', 'raised', 'subtle', 'sunken', 'brand', 'inverse'] as const;
const SWATCH_COLORS = ['#8b0036', '#2563eb', '#0d9488', '#ca8a04', '#64748b'];
const MIN_COLUMN_WIDTH = 120;

const ColumnResizeDemo = () => {
  const [width, setWidth] = createSignal(220);
  return (
    <div
      style={{
        position: 'relative',
        width: `${width()}px`,
        padding: 'var(--space-3)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      Name ({width()}px)
      <ColumnResize
        label="Resize Name"
        width={width()}
        min={MIN_COLUMN_WIDTH}
        onResize={setWidth}
        onReset={() => setWidth(220)}
      />
    </div>
  );
};

const SwatchDemo = () => {
  const [selected, setSelected] = createSignal(SWATCH_COLORS[0]);
  return (
    <For each={SWATCH_COLORS}>
      {(color) => (
        <Swatch color={color} label={color} selected={selected() === color} onClick={() => setSelected(color)} />
      )}
    </For>
  );
};

const LiveRegionDemo = () => {
  const [message, setMessage] = createSignal<{ text: string; id: number }>();
  return (
    <>
      <Button variant="secondary" onClick={() => setMessage({ text: 'Saved', id: Date.now() })}>
        Announce saved
      </Button>
      <LiveRegion message={message()} visible />
    </>
  );
};

export const primitiveDemos: DemoEntry[] = [
  {
    id: 'surface',
    group: 'Primitives',
    title: 'Surface',
    description:
      'The one primitive that paints a container: background, border, radius, elevation, padding, tone and behaviour.',
    render: () => (
      <>
        <Example title="Variants" code={'<Surface variant="raised" padding="md">…</Surface>'}>
          <For each={SURFACE_VARIANTS}>
            {(variant) => (
              <Surface variant={variant} padding="md">
                {variant}
              </Surface>
            )}
          </For>
        </Example>
        <Example title="Behaviour and tone" code={'<Surface tonal tone="teal" accent padding="md">…</Surface>'}>
          <Surface hoverable padding="md">
            Hoverable
          </Surface>
          <Surface interactive padding="md">
            Interactive
          </Surface>
          <Surface tonal tone="teal" accent padding="md">
            Tonal + accent
          </Surface>
          <Surface selected padding="md">
            Selected
          </Surface>
        </Example>
      </>
    ),
  },
  {
    id: 'text',
    group: 'Primitives',
    title: 'Text',
    description: 'Applies one type role and an optional text colour. Use it instead of hand-combining font tokens.',
    render: () => (
      <>
        <Example title="Roles" stack code={'<Text variant="h2">Heading</Text>'}>
          <For each={TEXT_VARIANTS}>{(variant) => <Text variant={variant}>{variant}</Text>}</For>
        </Example>
        <Example title="Tone and modifiers" code={'<Text tone="brand" tabular mono>1,234.50</Text>'}>
          <Text tone="secondary">Secondary</Text>
          <Text tone="brand">Brand</Text>
          <Text tone="danger">Danger</Text>
          <Text tabular mono>
            1,234.50
          </Text>
        </Example>
      </>
    ),
  },
  {
    id: 'glyph',
    group: 'Primitives',
    title: 'Glyph',
    description: 'One Velvet icon rendered as a CSS mask. Decorative unless it has a label.',
    render: () => (
      <Example title="Sizes" code={'<Glyph name="search" size="lg" />'}>
        <For each={['xs', 'sm', 'md', 'lg', 'xl'] as const}>{(size) => <Glyph name="search" size={size} />}</For>
        <Glyph name="heart-filled" size={32} label="Liked" />
      </Example>
    ),
  },
  {
    id: 'control',
    group: 'Primitives',
    title: 'Control & Field',
    description: 'The bordered field shell and the label / hint / error stack that every form component composes.',
    render: () => (
      <>
        <Example
          title="Field with control"
          stack
          code={'<Field label="Email" hint="…">{(c) => <Control>…</Control>}</Field>'}
        >
          <Field label="Email" hint="We never share it.">
            {(control) => (
              <Control iconLeft="mail">
                <input
                  class="vui-control__input"
                  id={control.id}
                  aria-describedby={control.describedBy}
                  placeholder="you@example.com"
                />
              </Control>
            )}
          </Field>
          <Field label="Username" error="That username is taken." required>
            {(control) => (
              <Control invalid prefix="@">
                <input
                  class="vui-control__input"
                  id={control.id}
                  aria-invalid={control.invalid}
                  aria-describedby={control.describedBy}
                  value="velvet"
                />
              </Control>
            )}
          </Field>
          <Field label="Bio" optional count={12} maxCount={80}>
            {(control) => (
              <Control>
                <input
                  class="vui-control__input"
                  id={control.id}
                  aria-describedby={control.describedBy}
                  value="Hello there"
                />
              </Control>
            )}
          </Field>
        </Example>
        <Example title="Sizes and states" code={'<Control size="sm" disabled>…</Control>'}>
          <Control size="sm">
            <input class="vui-control__input" placeholder="Small" />
          </Control>
          <Control>
            <input class="vui-control__input" placeholder="Medium" />
          </Control>
          <Control size="lg">
            <input class="vui-control__input" placeholder="Large" />
          </Control>
          <Control disabled>
            <input class="vui-control__input" placeholder="Disabled" disabled />
          </Control>
        </Example>
      </>
    ),
  },
  {
    id: 'badges',
    group: 'Primitives',
    title: 'Dot, Count & Indicator',
    description: 'Status points, numeric pills and the indicator that anchors either to a host element.',
    render: () => (
      <>
        <Example title="Dot" code={'<Dot tone="success" pulse label="Online" />'}>
          <For each={TONES}>{(tone) => <Dot tone={tone} label={tone} />}</For>
          <Dot tone="success" pulse />
          <Dot tone="danger" size="lg" ring />
        </Example>
        <Example title="Count" code={'<Count value={120} max={99} />'}>
          <Count value={3} />
          <Count value={120} />
          <Count value={0} showZero />
          <Count value={7} tone="danger" />
          <Count value={7} tone="soft" />
          <Count value={7} tone="neutral" size="lg" />
        </Example>
        <Example title="Indicator" code={'<Indicator count={3} label="3 unread">…</Indicator>'}>
          <Indicator count={3} label="3 unread">
            <IconButton icon="bell" label="Notifications" />
          </Indicator>
          <Indicator dot tone="danger">
            <IconButton icon="mail" label="Mail" />
          </Indicator>
          <Indicator count={120} tone="danger" placement="bottom-end">
            <IconButton icon="inbox" label="Inbox" />
          </Indicator>
        </Example>
      </>
    ),
  },
  {
    id: 'icon-tile',
    group: 'Primitives',
    title: 'IconTile',
    description: 'A glyph in a tinted box — the leading visual of notification rows, sources and feature cards.',
    render: () => (
      <>
        <Example title="Tones" code={'<IconTile icon="bell" tone="info" />'}>
          <For each={TONES}>{(tone) => <IconTile icon="bell" tone={tone} />}</For>
        </Example>
        <Example title="Sizes, shape and halo" code={'<IconTile icon="check" tone="success" size="3xl" halo />'}>
          <IconTile icon="star" size="sm" />
          <IconTile icon="star" size="xl" shape="circle" tone="warning" />
          <IconTile icon="check" tone="success" size="3xl" halo shape="circle" />
          <IconTile icon="globe" outline color="#2563eb" />
        </Example>
      </>
    ),
  },
  {
    id: 'list-item',
    group: 'Primitives',
    title: 'ListItem & Option',
    description: 'One list row and one listbox/menu row. List, Menu, Select and pattern rows compose them.',
    render: () => (
      <>
        <Example title="ListItem" stack code={'<ListItem leading={…} title="…" description="…" trailing={…} />'}>
          <ListItem
            leading={<IconTile icon="file-text" />}
            title="Quarterly report"
            description="Updated 2 hours ago"
            trailing={<Count value={2} />}
          />
          <ListItem
            as="button"
            onClick={() => undefined}
            leading={<IconTile icon="folder" tone="info" />}
            title="Projects"
            description="Interactive row"
            selected
          />
          <ListItem leading={<IconTile icon="lock" tone="neutral" />} title="Disabled" disabled />
        </Example>
        <Example title="Option" stack code={'<Option icon="copy" label="Copy" shortcut="⌘C" />'}>
          <Option icon="copy" label="Copy" shortcut="⌘C" role="menuitem" />
          <Option label="Selected" showCheck selected />
          <Option label="Active" active description="Keyboard-highlighted" />
          <Option icon="trash-2" label="Delete" danger role="menuitem" />
          <Option label="Disabled" disabled />
        </Example>
      </>
    ),
  },
  {
    id: 'section-label',
    group: 'Primitives',
    title: 'SectionLabel, Separator & EmptyText',
    description: 'Group headings, inline separators and the one-line "nothing here" message.',
    render: () => (
      <>
        <Example title="SectionLabel" stack code={'<SectionLabel icon="clock" end="3">Recent</SectionLabel>'}>
          <SectionLabel>Recent</SectionLabel>
          <SectionLabel icon="clock" end={<Count value={3} size="sm" />}>
            With icon and end
          </SectionLabel>
          <SectionLabel tone="brand">Brand tone</SectionLabel>
        </Example>
        <Example title="Separator" code={'<Separator variant="text">/</Separator>'}>
          <span>Left</span>
          <Separator semantic />
          <span>Right</span>
          <span>12</span>
          <Separator variant="text">:</Separator>
          <span>30</span>
          <span>One</span>
          <Separator variant="dash" />
          <span>Two</span>
        </Example>
        <Example title="EmptyText" stack code={'<EmptyText icon="inbox" dashed>No messages</EmptyText>'}>
          <EmptyText icon="inbox">No matches</EmptyText>
          <EmptyText dashed>Drop cards here</EmptyText>
        </Example>
      </>
    ),
  },
  {
    id: 'segmented',
    group: 'Primitives',
    title: 'Segmented',
    description:
      'A sunken track of raised, mutually-exclusive items. It owns no state — you set the role and selection.',
    render: () => (
      <Example title="States" code={'<Segmented role="radiogroup">…</Segmented>'}>
        <Segmented role="radiogroup" aria-label="View">
          <SegmentedItem role="radio" selected>
            Day
          </SegmentedItem>
          <SegmentedItem role="radio" selected={false}>
            Week
          </SegmentedItem>
          <SegmentedItem role="radio" selected={false}>
            Month
          </SegmentedItem>
        </Segmented>
        <Segmented size="sm" round iconOnly aria-label="Layout">
          <SegmentedItem selected icon="layout-grid" aria-label="Grid" />
          <SegmentedItem selected={false} icon="list" aria-label="List" />
        </Segmented>
      </Example>
    ),
  },
  {
    id: 'meter',
    group: 'Primitives',
    title: 'Meter',
    description: 'Track and fill for a known quantity. Progress is the task-progress component; Meter is the bare bar.',
    render: () => (
      <Example title="Variants" stack code={'<Meter value={60} tone="success" label="Quota" />'}>
        <Meter value={60} label="Quota" />
        <Meter value={80} tone="success" size="lg" label="Success" />
        <Meter value={40} tone="warning" size="sm" label="Warning" />
        <Meter value={3} max={4} steps={4} label="Strength" />
        <Meter indeterminate label="Loading" />
        <Meter value={70} shimmer label="Syncing" />
      </Example>
    ),
  },
  {
    id: 'marker-rail',
    group: 'Primitives',
    title: 'Marker & Rail',
    description: 'Round step or event badge, and the vertical list that joins markers with a connector line.',
    render: () => (
      <>
        <Example title="Marker" code={'<Marker appearance="solid" tone="success"><Glyph name="check" /></Marker>'}>
          <Marker>1</Marker>
          <Marker appearance="outline">2</Marker>
          <Marker appearance="solid" tone="success">
            <Glyph name="check" />
          </Marker>
          <Marker appearance="solid" ring>
            3
          </Marker>
          <Marker dot tone="info" />
        </Example>
        <Example title="Rail" code={'<Rail><RailItem state="done">…</RailItem></Rail>'}>
          <Rail>
            <RailItem state="done">
              <Marker appearance="solid" tone="success" gap>
                <Glyph name="check" />
              </Marker>{' '}
              Ordered
            </RailItem>
            <RailItem state="active">
              <Marker appearance="solid" ring gap>
                2
              </Marker>{' '}
              Shipped
            </RailItem>
            <RailItem state="dashed">
              <Marker appearance="outline" gap>
                3
              </Marker>{' '}
              Delivered
            </RailItem>
          </Rail>
        </Example>
      </>
    ),
  },
  {
    id: 'checkmark',
    group: 'Primitives',
    title: 'Checkmark & Chevron',
    description: 'Glyph box for rows that are not native inputs, and the disclosure arrow for anything that opens.',
    render: () => (
      <>
        <Example title="Checkmark" code={'<Checkmark checked />'}>
          <Checkmark />
          <Checkmark checked />
          <Checkmark indeterminate />
          <Checkmark radio checked />
          <Checkmark round checked />
          <Checkmark size="sm" checked />
          <Checkmark checked disabled />
        </Example>
        <Example title="Chevron" code={'<Chevron open />'}>
          <Chevron />
          <Chevron open />
          <Chevron direction="right" />
          <Chevron direction="right" open />
        </Example>
      </>
    ),
  },
  {
    id: 'close-button',
    group: 'Primitives',
    title: 'CloseButton & Handle',
    description: 'The one × control, and the drag grip for reorderable rows.',
    render: () => (
      <>
        <Example title="CloseButton" code={'<CloseButton variant="tag" label="Remove Design" />'}>
          <CloseButton />
          <CloseButton size="xs" label="Dismiss" />
          <Control>
            <input class="vui-control__input" value="query" />
            <CloseButton variant="field" label="Clear search" />
          </Control>
        </Example>
        <Example title="Handle" code={'<Handle label="Reorder item 2 (↑↓)" />'}>
          <Handle />
          <Handle decorative />
          <Handle icon="lock" label="Locked" disabled />
        </Example>
      </>
    ),
  },
  {
    id: 'kbd',
    group: 'Primitives',
    title: 'Kbd & Mark',
    description: 'Keyboard keys that adapt to the platform, and highlighted runs inside text.',
    render: () => (
      <>
        <Example title="Kbd" code={'<Kbd keys="mod+k" />'}>
          <Kbd keys="mod+k" />
          <Kbd keys={['shift', 'enter']} size="sm" />
          <Kbd plain keys="mod+s" />
          <Kbd>F5</Kbd>
        </Example>
        <Example title="Mark" code={'{highlightMatch("Velvet design system", "des")}'}>
          <Mark>highlight</Mark>
          <Mark variant="text">text</Mark>
          <Mark variant="mention">@velvet</Mark>
          <span>{highlightMatch('Velvet design system', 'des')}</span>
          <span>{highlightMatch('Zażółć gęślą', 'zazolc')}</span>
        </Example>
      </>
    ),
  },
  {
    id: 'swatch',
    group: 'Primitives',
    title: 'Swatch',
    description: 'A colour chip for presets, label colours and picker triggers.',
    render: () => (
      <>
        <Example title="Selectable" code={'<Swatch color="#8b0036" selected onClick={…} />'}>
          <SwatchDemo />
        </Example>
        <Example title="Sizes and tones" code={'<Swatch tone="success" round size="lg" />'}>
          <Swatch tone="brand" size="sm" />
          <Swatch tone="success" />
          <Swatch tone="info" round size="lg" />
        </Example>
      </>
    ),
  },
  {
    id: 'weekday',
    group: 'Primitives',
    title: 'Weekday',
    description: 'Short weekday label for date grids. Pair with weekdayNames().',
    render: () => (
      <Example title="Header row" code={'<Weekday today>Mon</Weekday>'}>
        <For each={weekdayNames('en-US', 1, 2)}>{(name, i) => <Weekday today={i() === 2}>{name}</Weekday>}</For>
      </Example>
    ),
  },
  {
    id: 'column-resize',
    group: 'Primitives',
    title: 'ColumnResize',
    description: 'Column-width handle: drag, ←/→ for keyboard, double-click to reset.',
    render: () => (
      <Example title="Header cell" code={'<ColumnResize label="Resize Name" width={w()} onResize={setW} />'}>
        <ColumnResizeDemo />
      </Example>
    ),
  },
  {
    id: 'visually-hidden',
    group: 'Primitives',
    title: 'VisuallyHidden & LiveRegion',
    description: 'Screen-reader-only content, and a region that announces dynamic changes.',
    render: () => (
      <>
        <Example title="VisuallyHidden" code={'<VisuallyHidden>Delete project</VisuallyHidden>'}>
          <Button variant="ghost" iconLeft="trash-2">
            <VisuallyHidden>Delete project</VisuallyHidden>
          </Button>
          <VisuallyHidden focusable tabIndex={0}>
            Visible only while focused
          </VisuallyHidden>
        </Example>
        <Example title="LiveRegion" code={'<LiveRegion message={{ text: "Saved", id: Date.now() }} />'}>
          <LiveRegionDemo />
        </Example>
      </>
    ),
  },
];
