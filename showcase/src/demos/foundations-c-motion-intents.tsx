import { For, type JSX, Show } from 'solid-js';
import { Button, Glyph } from '../../../src';
import { Example } from '../Example';
import { autoFillColumns, gridStyle, TokenName } from './foundations-a-parts';
import { createLoop, TokenValue } from './foundations-c-parts';

interface Intent {
  token: string;
  properties: string[];
  from: JSX.CSSProperties;
  to: JSX.CSSProperties;
  moving: JSX.CSSProperties;
  frame?: JSX.CSSProperties;
  label?: string;
  icon?: string;
}

const LOOP_MS = 1400;
const BOX_WIDTH = 'calc(var(--space-20) + var(--space-2))';
const CENTERED: JSX.CSSProperties = { display: 'grid', 'place-items': 'center' };
const BUTTON_BOX: JSX.CSSProperties = {
  ...CENTERED,
  width: BOX_WIDTH,
  height: 'var(--control-height-sm)',
  'border-radius': 'var(--button-radius)',
  color: 'var(--action-primary-fg)',
  font: 'var(--type-button-sm)',
};
const PANEL: JSX.CSSProperties = {
  width: BOX_WIDTH,
  height: 'var(--space-10)',
  'border-radius': 'var(--panel-radius)',
  background: 'var(--bg-overlay)',
  'box-shadow': 'var(--elevation-popover)',
};
const APPEAR = { opacity: 1, transform: 'none' };
const DISAPPEAR = { opacity: 0, transform: 'translateY(var(--motion-rise))' };
const BAR_FRAME: JSX.CSSProperties = {
  width: BOX_WIDTH,
  height: 'var(--size-track)',
  'border-radius': 'var(--radius-full)',
  background: 'var(--bg-sunken)',
  overflow: 'hidden',
};
const BAR_FILL: JSX.CSSProperties = {
  height: '100%',
  'border-radius': 'var(--radius-full)',
  background: 'var(--action-primary)',
};
const BAR_STATES = { from: { width: '25%' }, to: { width: '100%' } };
const TILE: JSX.CSSProperties = {
  ...CENTERED,
  width: 'var(--size-icon-tile-xs)',
  height: 'var(--size-icon-tile-xs)',
  'border-radius': 'var(--radius-full)',
  background: 'var(--action-soft)',
  color: 'var(--action-soft-fg)',
};

const INTENTS: Intent[] = [
  {
    token: '--motion-fast',
    properties: ['background-color'],
    moving: BUTTON_BOX,
    from: { 'background-color': 'var(--action-primary)' },
    to: { 'background-color': 'var(--action-primary-hover)' },
  },
  {
    token: '--motion-base',
    properties: ['background-color', 'border-color'],
    moving: {
      width: BOX_WIDTH,
      height: 'var(--control-height-sm)',
      'border-radius': 'var(--radius-md)',
      border: '1px solid',
    },
    from: { 'background-color': 'var(--bg-raised)', 'border-color': 'var(--border-default)' },
    to: { 'background-color': 'var(--bg-selected)', 'border-color': 'var(--border-brand)' },
  },
  { token: '--motion-enter', properties: ['opacity', 'transform'], moving: PANEL, from: DISAPPEAR, to: APPEAR },
  { token: '--motion-exit', properties: ['opacity', 'transform'], moving: PANEL, from: APPEAR, to: DISAPPEAR },
  {
    token: '--motion-spring',
    properties: ['left'],
    frame: {
      position: 'relative',
      width: 'var(--switch-w)',
      height: 'var(--switch-h)',
      'border-radius': 'var(--radius-full)',
      background: 'var(--switch-track-on)',
    },
    moving: {
      position: 'absolute',
      top: 'var(--space-0-5)',
      width: 'calc(var(--switch-h) - var(--space-1))',
      height: 'calc(var(--switch-h) - var(--space-1))',
      'border-radius': 'var(--radius-full)',
      background: 'var(--switch-thumb)',
      'box-shadow': 'var(--thumb-shadow)',
    },
    from: { left: 'var(--space-0-5)' },
    to: { left: 'calc(100% - var(--switch-h) + var(--space-0-5))' },
  },
  {
    token: '--motion-pop',
    properties: ['transform', 'opacity'],
    label: '3',
    moving: {
      ...TILE,
      background: 'var(--action-primary)',
      color: 'var(--action-primary-fg)',
      font: 'var(--type-label)',
    },
    from: { transform: 'scale(.4)', opacity: 0 },
    to: { transform: 'none', opacity: 1 },
  },
  {
    token: '--motion-lift',
    properties: ['box-shadow', 'transform'],
    moving: {
      width: BOX_WIDTH,
      height: 'var(--size-icon-tile-xl)',
      'border-radius': 'var(--radius-lg)',
      background: 'var(--bg-raised)',
      border: '1px solid var(--border-subtle)',
    },
    from: { 'box-shadow': 'var(--elevation-card)', transform: 'none' },
    to: { 'box-shadow': 'var(--elevation-card-hover)', transform: 'translateY(var(--surface-lift))' },
  },
  {
    token: '--motion-slide',
    properties: ['transform'],
    frame: { width: BOX_WIDTH },
    moving: {
      width: 'var(--space-10)',
      height: 'var(--space-10)',
      'border-radius': 'var(--radius-md)',
      background: 'var(--bg-brand)',
    },
    from: { transform: 'none' },
    to: { transform: 'translateX(var(--space-12))' },
  },
  { token: '--motion-progress', properties: ['width'], frame: BAR_FRAME, moving: BAR_FILL, ...BAR_STATES },
  { token: '--motion-track', properties: ['width'], frame: BAR_FRAME, moving: BAR_FILL, ...BAR_STATES },
  {
    token: '--motion-move',
    properties: ['width'],
    moving: {
      height: 'var(--space-8)',
      'border-radius': 'var(--radius-md)',
      background: 'var(--bg-selected)',
      border: '1px solid var(--border-brand)',
    },
    from: { width: 'var(--space-10)' },
    to: { width: BOX_WIDTH },
  },
  {
    token: '--motion-reveal',
    properties: ['transform'],
    icon: 'chevron-down',
    moving: { ...CENTERED, width: 'var(--space-6)', height: 'var(--space-6)', color: 'var(--fg-secondary)' },
    from: { transform: 'none' },
    to: { transform: 'rotate(180deg)' },
  },
  {
    token: '--motion-bounce',
    properties: ['transform'],
    icon: 'plus',
    moving: TILE,
    from: { transform: 'scale(.85)' },
    to: { transform: 'none' },
  },
  {
    token: '--motion-instant',
    properties: ['background-color', 'transform'],
    label: 'Press',
    moving: BUTTON_BOX,
    from: { 'background-color': 'var(--action-primary)', transform: 'none' },
    to: { 'background-color': 'var(--action-primary-active)', transform: 'translateY(var(--motion-nudge))' },
  },
];

const IntentSpecimen = (props: { intent: Intent; on: boolean }) => (
  <div style={{ display: 'flex', 'flex-direction': 'column', gap: 'var(--space-2)', 'min-width': 0 }}>
    <div style={{ display: 'flex', 'align-items': 'center', height: 'var(--space-16)' }}>
      <div style={{ display: 'flex', 'align-items': 'center', ...props.intent.frame }}>
        <div
          style={{
            ...props.intent.moving,
            transition: props.intent.properties.map((property) => `${property} var(${props.intent.token})`).join(', '),
            ...(props.on ? props.intent.to : props.intent.from),
          }}
        >
          <Show when={props.intent.icon}>{(name) => <Glyph name={name()} />}</Show>
          {props.intent.label}
        </div>
      </div>
    </div>
    <TokenName>{props.intent.token}</TokenName>
    <TokenValue token={props.intent.token} />
  </div>
);

export const IntentsExample = () => {
  const { on, flip } = createLoop(() => LOOP_MS);
  return (
    <Example title="Motion intents" stack>
      <div style={{ display: 'flex', 'justify-content': 'flex-end' }}>
        <Button size="sm" variant="secondary" iconLeft="play" onClick={flip}>
          Replay
        </Button>
      </div>
      <div style={{ ...gridStyle(autoFillColumns), gap: 'var(--space-6) var(--space-4)' }}>
        <For each={INTENTS}>{(intent) => <IntentSpecimen intent={intent} on={on()} />}</For>
      </div>
    </Example>
  );
};
