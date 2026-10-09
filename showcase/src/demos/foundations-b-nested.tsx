import { For, type JSX } from 'solid-js';
import { Text } from '../../../src';
import { Example } from '../Example';
import { columnStyle, evenColumns, gridStyle } from './foundations-a-parts';
import { GroupHeading, Specimen, TokenRow } from './foundations-b-parts';

const ROW_HEIGHTS = ['--row-height-sm', '--row-height', '--row-height-lg'];
const OVERLAY_WIDTHS = ['--overlay-min-w', '--overlay-w-sm', '--overlay-w'];
const HALOS = [
  { token: '--halo-sm', size: 'var(--space-5)' },
  { token: '--halo-md', size: 'var(--space-7)' },
  { token: '--halo-lg', size: 'var(--space-10)' },
];
const OVERLAY_MAX_HEIGHTS = '--overlay-max-h-sm · --overlay-max-h · --overlay-max-h-lg';

const sectionStyle: JSX.CSSProperties = { ...columnStyle, gap: 'var(--space-2-5)' };
const barStyle: JSX.CSSProperties = { 'border-radius': 'var(--radius-sm)', background: 'var(--action-soft)' };

const Note = (props: { children: string }) => (
  <Text variant="caption" tone="secondary">
    {props.children}
  </Text>
);

const InnerControl = () => (
  <div
    style={{
      display: 'flex',
      'align-items': 'center',
      gap: 'var(--space-1-5)',
      flex: 1,
      height: 'var(--control-height-md)',
      padding: '0 var(--space-1-5) 0 var(--space-3)',
      border: 'var(--border-width) solid var(--control-border)',
      'border-radius': 'var(--control-radius)',
      background: 'var(--control-bg)',
      font: 'var(--type-body-sm)',
      color: 'var(--fg-tertiary)',
    }}
  >
    <span style={{ flex: 1 }}>Search</span>
    <span
      style={{
        width: 'var(--control-height-inner)',
        height: 'var(--control-height-inner)',
        'border-radius': 'var(--radius-sm)',
        background: 'var(--bg-hover)',
      }}
    />
  </div>
);

const SegmentTrack = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-0-5)',
      padding: 'var(--track-pad)',
      'box-sizing': 'border-box',
      height: 'calc(var(--control-height-inner-lg) + 2 * var(--track-pad))',
      'border-radius': 'var(--radius-md)',
      background: 'var(--bg-sunken)',
    }}
  >
    <span
      style={{
        width: 'var(--space-16)',
        'border-radius': 'var(--radius-nested)',
        background: 'var(--bg-raised)',
        'box-shadow': 'var(--elevation-control)',
      }}
    />
    <span style={{ width: 'var(--space-16)' }} />
    <span style={{ width: 'var(--space-16)' }} />
  </div>
);

const NestedColumn = () => (
  <div style={sectionStyle}>
    <GroupHeading>nested controls · rows</GroupHeading>
    <TokenRow token="--control-height-inner">
      <InnerControl />
    </TokenRow>
    <TokenRow token="--control-height-inner-lg">
      <SegmentTrack />
    </TokenRow>
    <TokenRow token="--track-pad">
      <Note>track inset · nested radius</Note>
    </TokenRow>
    <For each={ROW_HEIGHTS}>
      {(token) => (
        <TokenRow token={token}>
          <div style={{ ...barStyle, width: '100%', height: `var(${token})` }} />
        </TokenRow>
      )}
    </For>
  </div>
);

const OverlayColumn = () => (
  <div style={sectionStyle}>
    <GroupHeading>overlays · bars at ½ scale</GroupHeading>
    <For each={OVERLAY_WIDTHS}>
      {(token) => (
        <TokenRow token={token}>
          <div
            style={{
              ...barStyle,
              width: `calc(var(${token}) / 2)`,
              'max-width': '100%',
              height: 'var(--space-3-5)',
            }}
          />
        </TokenRow>
      )}
    </For>
    <TokenRow token="--overlay-max-h-*">
      <Note>{OVERLAY_MAX_HEIGHTS}</Note>
    </TokenRow>
    <GroupHeading>halos · rings</GroupHeading>
    <div style={{ display: 'flex', 'flex-wrap': 'wrap', gap: 'var(--space-8)', padding: 'var(--space-3)' }}>
      <For each={HALOS}>
        {(halo) => (
          <Specimen name={halo.token}>
            <span
              style={{
                width: halo.size,
                height: halo.size,
                'border-radius': 'var(--radius-full)',
                background: 'var(--action-primary)',
                'box-shadow': `0 0 0 var(${halo.token}) var(--check-press-halo)`,
              }}
            />
          </Specimen>
        )}
      </For>
      <Specimen name="ring gap">
        <span
          style={{
            width: 'var(--space-7)',
            height: 'var(--space-7)',
            'border-radius': 'var(--radius-full)',
            background: 'var(--status-success-fg)',
            'box-shadow':
              '0 0 0 var(--border-width-thick) var(--bg-raised), 0 0 0 calc(var(--border-width-thick) + var(--border-width)) var(--border-subtle)',
          }}
        />
      </Specimen>
    </div>
  </div>
);

export const NestedOverlaysExample = () => (
  <Example title="Nested · rows · overlays · halos">
    <div style={{ ...gridStyle(evenColumns(2)), 'align-items': 'start' }}>
      <NestedColumn />
      <OverlayColumn />
    </div>
  </Example>
);
