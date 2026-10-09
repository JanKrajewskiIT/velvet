import { For, type JSX, Show } from 'solid-js';
import { CATEGORY_TONES, Glyph, Text, type Tone, TONES } from '../../../src';
import { Example } from '../Example';
import { columnStyle, gridStyle, RAMP_STEPS, Ramp, TokenName } from './foundations-a-parts';

const STATUSES = [
  { id: 'success', icon: 'circle-check' },
  { id: 'warning', icon: 'triangle-alert' },
  { id: 'danger', icon: 'circle-x' },
  { id: 'info', icon: 'info' },
];
const STATUS_ROLES = ['fg', 'bg', 'border', 'solid'] as const;
const TEXT_BACKGROUNDS = ['page', 'subtle', 'raised', 'sunken', 'overlay', 'selected', 'brand-subtle'];
const TEXT_COLOURS = ['--fg-primary', '--fg-secondary', '--fg-tertiary', '--fg-disabled', '--fg-brand', '--fg-link'];
const ALL_TONES: Tone[] = [...TONES, ...CATEGORY_TONES];

type StatusRole = (typeof STATUS_ROLES)[number];

const statusPaint = (status: string, role: StatusRole): JSX.CSSProperties => {
  const fg = `var(--status-${status}-fg)`;
  const bg = `var(--status-${status}-bg)`;
  const paints: Record<StatusRole, JSX.CSSProperties> = {
    fg: { color: fg },
    bg: { background: bg, color: fg },
    border: { background: bg, border: `1px solid var(--status-${status}-border)`, color: fg },
    solid: { background: `var(--status-${status}-solid)`, color: 'var(--on-color-fg)' },
  };
  return paints[role];
};

const StatusRoleCell = (props: { status: string; icon: string; role: StatusRole }) => (
  <div
    style={{
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      gap: 'var(--space-1-5)',
      height: 'var(--space-10)',
      font: 'var(--type-label)',
      'border-radius': 'var(--radius-sm)',
      ...statusPaint(props.status, props.role),
    }}
  >
    <Show when={props.role === 'fg'}>
      <Glyph name={props.icon} />
    </Show>
    Saved
  </div>
);

const ToneContrastTile = (props: { tone: Tone }) => (
  <div style={columnStyle} data-tone={props.tone}>
    <TokenName>{props.tone}</TokenName>
    <div
      style={{
        padding: 'var(--space-2) var(--space-3)',
        'border-radius': 'var(--radius-sm)',
        background: 'var(--tone-bg)',
        font: 'var(--type-label)',
        color: 'var(--tone-fg, var(--tone))',
      }}
    >
      Aa tone-fg
    </div>
    <div style={{ padding: '0 var(--space-3)', font: 'var(--type-label)', color: 'var(--tone-fg, var(--tone))' }}>
      on raised
    </div>
  </div>
);

export const ColorRoles = () => (
  <>
    <Example title="Status ramps" stack>
      <For each={STATUSES}>
        {(status) => (
          <div style={gridStyle('var(--space-20) minmax(0, 1fr)')}>
            <Text variant="label">{status.id}</Text>
            <Ramp prefix={`--${status.id}`} steps={RAMP_STEPS} />
          </div>
        )}
      </For>
    </Example>
    <Example title="Status roles" stack>
      <div style={gridStyle('var(--space-20) repeat(4, minmax(0, 1fr))')}>
        <span />
        <For each={STATUS_ROLES}>{(role) => <TokenName center>{role}</TokenName>}</For>
        <For each={STATUSES}>
          {(status) => (
            <>
              <Text variant="label">{status.id}</Text>
              <For each={STATUS_ROLES}>
                {(role) => <StatusRoleCell status={status.id} icon={status.icon} role={role} />}
              </For>
            </>
          )}
        </For>
      </div>
    </Example>
    <Example title="Text on backgrounds" stack>
      <div style={gridStyle('var(--space-24) repeat(7, minmax(0, 1fr))')}>
        <span />
        <For each={TEXT_BACKGROUNDS}>{(name) => <TokenName center>{name}</TokenName>}</For>
        <For each={TEXT_COLOURS}>
          {(fg) => (
            <>
              <TokenName>{fg}</TokenName>
              <For each={TEXT_BACKGROUNDS}>
                {(name) => (
                  <div
                    style={{
                      display: 'grid',
                      'place-items': 'center',
                      height: 'var(--space-12)',
                      background: `var(--bg-${name})`,
                      color: `var(${fg})`,
                      font: 'var(--font-weight-semibold) var(--font-size-base)/var(--leading-none) var(--font-sans)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    Aa
                  </div>
                )}
              </For>
            </>
          )}
        </For>
      </div>
    </Example>
    <Example title="Tone contrast">
      <div style={gridStyle('repeat(auto-fill, minmax(calc(var(--space-24) * 1.5), 1fr))')}>
        <For each={ALL_TONES}>{(tone) => <ToneContrastTile tone={tone} />}</For>
      </div>
    </Example>
  </>
);
