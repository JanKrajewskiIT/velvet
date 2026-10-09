import { For, type JSX, Show } from 'solid-js';
import { Button, Surface, Text } from '../../../src';
import { Example } from '../Example';
import { rowStyle, TokenName } from './foundations-a-parts';

type Row = [label: string, use: string, avoid: string];
type PreviewKind = 'color' | 'border' | 'radius' | 'shadow' | 'text';
interface Step {
  token: string;
  kind: PreviewKind;
}
interface LayerRow {
  steps: (Step | undefined)[];
  ui: () => JSX.Element;
}

const COMPOSITION_ROWS: Row[] = [
  ['Container — bg, border, radius, shadow', 'Surface · Card', 'own background + border + box-shadow'],
  ['Bordered input shell', 'Field + Control', 'custom input box, own focus ring'],
  ['Row in a menu, list or listbox', 'Option · ListItem', 'flex row with own hover / selected'],
  ['Group heading (uppercase)', 'SectionLabel · Weekday (date grids)', 'text-transform + letter-spacing literals'],
  ['Round step / event badge', 'Marker (+ Rail for the connector)', '28px circle with border + ::before line'],
  ['Glyph in a tinted box', 'IconTile', 'grid + width/height + tone background'],
  ['Person or series', 'Avatar (color= for series)', 'initials circle'],
  ['Status point · numeric pill', 'Dot · Count', '6px circle · min-width pill'],
  ['Status / category chip', 'Badge', 'tinted pill with own tones'],
  ['Filter / keyword / removable chip', 'Tag (soft · dashed · pill · tone)', 'inline-flex pill + ×'],
  ['One-of-N switch in a track', 'Segmented (OptionSwitcher, Tabs segmented)', 'sunken track + raised thumb'],
  ['Independent pressed toggles', 'ToggleButton · ToggleGroup', 'aria-pressed buttons'],
  ['Bar · task progress · ring', 'Meter · Progress · ProgressRing', 'track + fill span'],
  ['Check / radio glyph (non-native)', 'Checkmark', '::after tick'],
  ['× · key cap · search highlight', 'CloseButton · Kbd · Mark', 'icon button, bordered span, <b>'],
];
const TOKEN_ROWS: Row[] = [
  ['Colour', '--fg-* · --bg-* · --border-* · --action-* · --status-* · comp tokens', '--velvet-700 · #hex · rgba()'],
  ['Type', '--type-<role> · --type-<role>-size / -weight', '--font-size-* · --font-weight-* · 15px'],
  ['Motion', '--motion-fast · -move · -enter · -spring …', '--dur-* · --ease-* · 180ms'],
  ['Depth', '--elevation-card · -popover · -dialog …', '--shadow-* · raw box-shadow'],
  ['Space', '--space-* on the 4px grid · --track-pad', '3 · 5 · 7 · 9 · 18px'],
  ['Box size', '--control-height-* · -inner · --row-height-* · --hit-target-min', '28px · 36px · 52px'],
  ['Overlay', '--overlay-offset · --overlay-w-* · --overlay-max-h-*', 'min-width:220px · top:calc(100% + 8px)'],
  ['Rings', '--border-width(-medium/-thick/-accent) · --halo-*', '1.5px · 0 0 0 4px'],
  [
    'Markup',
    'Button · Control · Field · Glyph · Tag · Chip · ListItem · IconTile',
    'class="vui-btn" · <select> · <i class="vui-icon">',
  ],
  ['Keyframes', 'vui-fade-in · rise-in · sheet-in · spin · pulse · pop-in', 'redeclaring them per component'],
];
const COMPOSITION_NOTE =
  'Atoms own paint, size and state; hosts set only layout (gap, padding, position). Tune a family via its comp tokens (--segment-*, --marker-*, --rail-*, --tag-*) — never by overriding atom CSS.';
const COMPOSITION_COLUMNS = 'minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 1fr)';
const TOKEN_RULE_COLUMNS = 'var(--space-24) minmax(0, 1.3fr) minmax(0, 1fr)';
const LAYER_COLUMNS = 'repeat(4, minmax(0, 1fr))';
const LAYER_HEADS = ['ref', 'sys', 'comp', 'ui'];
const layerBox: JSX.CSSProperties = { width: 'var(--space-16)', height: 'var(--space-8)' };

const LAYER_ROWS: LayerRow[] = [
  {
    steps: [
      { token: '--velvet-700', kind: 'color' },
      { token: '--action-primary', kind: 'color' },
      { token: '--button-primary-bg', kind: 'color' },
    ],
    ui: () => (
      <Button variant="primary" size="sm">
        Save
      </Button>
    ),
  },
  {
    steps: [
      { token: '--neutral-900', kind: 'color' },
      { token: '--fg-primary', kind: 'color' },
      { token: '--field-label-fg', kind: 'color' },
    ],
    ui: () => (
      <Text variant="label" style={{ color: 'var(--field-label-fg)' }}>
        Email
      </Text>
    ),
  },
  {
    steps: [
      { token: '--tint', kind: 'color' },
      { token: '--border-subtle', kind: 'border' },
      { token: '--surface-border', kind: 'border' },
    ],
    ui: () => <Surface padding="sm" style={layerBox} />,
  },
  {
    steps: [{ token: '--radius-md', kind: 'radius' }, undefined, { token: '--control-radius', kind: 'radius' }],
    ui: () => (
      <div
        style={{
          ...layerBox,
          height: 'var(--control-height-sm)',
          border: '1px solid var(--control-border)',
          'border-radius': 'var(--control-radius)',
          background: 'var(--control-bg)',
          'box-shadow': 'var(--control-shadow)',
        }}
      />
    ),
  },
  {
    steps: [
      { token: '--shadow-sm', kind: 'shadow' },
      { token: '--elevation-card', kind: 'shadow' },
      { token: '--surface-shadow', kind: 'shadow' },
    ],
    ui: () => <Surface padding="sm" style={layerBox} />,
  },
  {
    steps: [
      { token: '--dur-fast · --ease-standard', kind: 'text' },
      { token: '--motion-fast', kind: 'text' },
      { token: '--transition-colors', kind: 'text' },
    ],
    ui: () => (
      <Button variant="secondary" size="sm">
        Hover me
      </Button>
    ),
  },
];

const previewStyle = (step: Step): JSX.CSSProperties => {
  const token = `var(${step.token})`;
  const base: JSX.CSSProperties = { height: 'var(--space-6)', 'border-radius': 'var(--radius-sm)' };
  const kinds: Record<PreviewKind, JSX.CSSProperties> = {
    color: { ...base, background: token, border: '1px solid var(--border-subtle)' },
    border: { ...base, border: `var(--border-width-thick) solid ${token}` },
    radius: { ...base, border: '1px solid var(--fg-tertiary)', 'border-radius': token },
    shadow: { ...base, background: 'var(--bg-raised)', 'box-shadow': token },
    text: {},
  };
  return kinds[step.kind];
};

const headRowStyle = (columns: string): JSX.CSSProperties => ({
  ...rowStyle,
  'grid-template-columns': columns,
  'border-bottom-color': 'var(--border-default)',
});

const RuleTable = (props: { heads: [string, string, string]; columns: string; rows: Row[]; useColor?: string }) => (
  <div style={{ width: '100%' }}>
    <div style={headRowStyle(props.columns)}>
      <Text variant="overline" tone="tertiary">
        {props.heads[0]}
      </Text>
      <Text variant="overline" style={{ color: 'var(--status-success-fg)' }}>
        {props.heads[1]}
      </Text>
      <Text variant="overline" style={{ color: 'var(--status-danger-fg)' }}>
        {props.heads[2]}
      </Text>
    </div>
    <For each={props.rows}>
      {(row) => (
        <div style={{ ...rowStyle, 'grid-template-columns': props.columns }}>
          <Text variant="label">{row[0]}</Text>
          <Text variant="caption" mono style={{ color: props.useColor }}>
            {row[1]}
          </Text>
          <Text
            variant="caption"
            mono
            tone="tertiary"
            style={{
              'text-decoration': 'line-through',
              'text-decoration-color': 'color-mix(in oklab, var(--status-danger-fg) 50%, transparent)',
            }}
          >
            {row[2]}
          </Text>
        </div>
      )}
    </For>
  </div>
);

const LayerStep = (props: { step: Step | undefined }) => (
  <div style={{ display: 'flex', 'align-items': 'center', gap: 'var(--space-2)', 'min-width': 0 }}>
    <Show when={props.step} fallback={<TokenName>—</TokenName>}>
      {(step) => (
        <div style={{ flex: 1, display: 'flex', 'flex-direction': 'column', gap: 'var(--space-1)', 'min-width': 0 }}>
          <div style={previewStyle(step())} />
          <TokenName>{step().token}</TokenName>
        </div>
      )}
    </Show>
    <Text variant="caption" tone="tertiary">
      →
    </Text>
  </div>
);

const TokenLayers = () => (
  <div style={{ width: '100%' }}>
    <div style={headRowStyle(LAYER_COLUMNS)}>
      <For each={LAYER_HEADS}>
        {(head) => (
          <Text variant="overline" tone="tertiary">
            {head}
          </Text>
        )}
      </For>
    </div>
    <For each={LAYER_ROWS}>
      {(row) => (
        <div style={{ ...rowStyle, 'grid-template-columns': LAYER_COLUMNS, 'align-items': 'center' }}>
          <For each={row.steps}>{(step) => <LayerStep step={step} />}</For>
          <div>{row.ui()}</div>
        </div>
      )}
    </For>
  </div>
);

export const OverviewPage = () => (
  <>
    <Example title="Composition rules" stack>
      <RuleTable
        heads={['need', 'compose', 'never re-declare']}
        columns={COMPOSITION_COLUMNS}
        rows={COMPOSITION_ROWS}
        useColor="var(--fg-brand)"
      />
      <Text variant="caption" tone="secondary">
        {COMPOSITION_NOTE}
      </Text>
    </Example>
    <Example title="Token layers">
      <TokenLayers />
    </Example>
    <Example title="Token rules" stack>
      <RuleTable heads={['layer', 'read', 'never']} columns={TOKEN_RULE_COLUMNS} rows={TOKEN_ROWS} />
    </Example>
  </>
);
