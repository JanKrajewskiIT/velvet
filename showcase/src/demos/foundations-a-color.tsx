import { For, type JSX } from 'solid-js';
import { CATEGORY_TONES, Dot, Text, type Tone } from '../../../src';
import { Example } from '../Example';
import { autoFillColumns, columnStyle, evenColumns, gridStyle, Ramp, TokenName } from './foundations-a-parts';

const BACKGROUNDS = [
  { token: '--bg-page', fg: '--fg-primary' },
  { token: '--bg-subtle', fg: '--fg-primary' },
  { token: '--bg-raised', fg: '--fg-primary' },
  { token: '--bg-sunken', fg: '--fg-primary' },
  { token: '--bg-overlay', fg: '--fg-primary' },
  { token: '--bg-field', fg: '--fg-primary' },
  { token: '--bg-selected', fg: '--fg-brand' },
  { token: '--bg-brand-subtle', fg: '--fg-brand' },
  { token: '--bg-brand', fg: '--on-color-fg' },
  { token: '--bg-inverse', fg: '--fg-inverse' },
  { token: '--bg-media', fg: '--on-color-fg' },
  { token: '--bg-glass', fg: '--fg-primary' },
];
const NEUTRAL_STEPS = [
  '0',
  '25',
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '850',
  '900',
  '925',
  '950',
  '1000',
] as const;
const ON_COLOR_PANELS = ['--bg-brand', '--bg-media'];
const ON_COLOR_CELLS = [
  { label: 'subtle', token: '--on-color-subtle', fill: true },
  { label: 'hover', token: '--on-color-hover', fill: true },
  { label: 'pressed', token: '--on-color-pressed', fill: true },
  { label: 'border', token: '--on-color-border', fill: false },
  { label: 'border-strong', token: '--on-color-border-strong', fill: false },
];
const DV_BARS = [
  { token: '--dv-1', height: '78%' },
  { token: '--dv-2', height: '54%' },
  { token: '--dv-3', height: '92%' },
  { token: '--dv-4', height: '40%' },
  { token: '--dv-5', height: '66%' },
  { token: '--dv-6', height: '30%' },
  { token: '--dv-7', height: '58%' },
  { token: '--dv-8', height: '46%' },
];
const DV_SEQUENTIAL = ['--dv-seq-1', '--dv-seq-2', '--dv-seq-3', '--dv-seq-4', '--dv-seq-5'];
const CAPTION_MONO: JSX.CSSProperties = { font: 'var(--type-caption)', 'font-family': 'var(--font-mono)' };

const toneTileStyle: JSX.CSSProperties = {
  display: 'grid',
  'place-items': 'center',
  height: 'var(--space-8)',
  font: 'var(--type-label-sm)',
  'border-radius': 'var(--radius-sm)',
};

interface CategoryRow {
  label: string;
  // eslint-disable-next-line no-unused-vars -- the parameter name documents the signature
  cell: (tone: Tone) => JSX.Element;
}

const CATEGORY_ROWS: CategoryRow[] = [
  {
    label: 'solid',
    cell: (tone) => (
      <div data-tone={tone} style={{ ...toneTileStyle, background: 'var(--tone)', color: 'var(--on-color-fg)' }}>
        Aa
      </div>
    ),
  },
  {
    label: 'subtle',
    cell: (tone) => (
      <div data-tone={tone} style={{ ...toneTileStyle, background: 'var(--tone-bg)', color: 'var(--tone-fg)' }}>
        Aa
      </div>
    ),
  },
  {
    label: 'dot',
    cell: (tone) => (
      <div style={toneTileStyle}>
        <Dot tone={tone} size="lg" />
      </div>
    ),
  },
];

const BackgroundTile = (props: { token: string; fg: string }) => (
  <div
    style={{
      ...columnStyle,
      gap: 'var(--space-2)',
      padding: 'var(--space-3)',
      background: `var(${props.token})`,
      color: `var(${props.fg})`,
      'backdrop-filter': props.token === '--bg-glass' ? 'blur(var(--blur-md))' : undefined,
      border: '1px solid var(--border-subtle)',
      'border-radius': 'var(--radius-md)',
    }}
  >
    <span style={{ font: 'var(--type-title)' }}>Aa</span>
    <span style={{ ...CAPTION_MONO, opacity: 0.8 }}>{props.token}</span>
  </div>
);

const OnColorPanel = (props: { background: string }) => (
  <div
    style={{
      ...columnStyle,
      gap: 'var(--space-3)',
      flex: 1,
      'min-width': 'calc(var(--space-24) * 3)',
      padding: 'var(--space-4)',
      'border-radius': 'var(--radius-lg)',
      background: `var(${props.background})`,
      color: 'var(--on-color-muted)',
    }}
  >
    <div style={{ display: 'flex', gap: 'var(--space-4)', font: 'var(--type-title-lg)' }}>
      <span style={{ color: 'var(--on-color-fg)' }}>Aa</span>
      <span>Aa</span>
    </div>
    <div style={gridStyle(evenColumns(ON_COLOR_CELLS.length))}>
      <For each={ON_COLOR_CELLS}>
        {(cell) => (
          <div style={{ ...columnStyle, gap: 'var(--space-1-5)' }}>
            <div
              style={{
                height: 'var(--space-8)',
                background: cell.fill ? `var(${cell.token})` : undefined,
                border: cell.fill ? undefined : `1px solid var(${cell.token})`,
              }}
            />
            <span style={CAPTION_MONO}>{cell.label}</span>
          </div>
        )}
      </For>
    </div>
    <span style={CAPTION_MONO}>{props.background}</span>
  </div>
);

export const ColorPalette = () => (
  <>
    <Example title="Backgrounds">
      <div style={gridStyle(autoFillColumns)}>
        <For each={BACKGROUNDS}>{(bg) => <BackgroundTile token={bg.token} fg={bg.fg} />}</For>
      </div>
    </Example>
    <Example title="Categorical" stack>
      <TokenName>Labels · data-tone</TokenName>
      <div style={gridStyle('var(--space-16) repeat(8, minmax(0, 1fr))')}>
        <span />
        <For each={CATEGORY_TONES}>{(tone) => <TokenName center>{tone}</TokenName>}</For>
        <For each={CATEGORY_ROWS}>
          {(row) => (
            <>
              <Text variant="caption" tone="secondary">
                {row.label}
              </Text>
              <For each={CATEGORY_TONES}>{(tone) => row.cell(tone)}</For>
            </>
          )}
        </For>
      </div>
      <TokenName>Data-viz · same hues, contrast order · sequential on Velvet</TokenName>
      <div style={gridStyle('3fr 2fr')}>
        <div style={columnStyle}>
          <div
            style={{
              ...gridStyle(evenColumns(DV_BARS.length)),
              height: 'var(--space-24)',
              'align-items': 'end',
              'border-bottom': '1px solid var(--dv-grid)',
            }}
          >
            <For each={DV_BARS}>
              {(bar) => (
                <div
                  style={{
                    height: bar.height,
                    background: `var(${bar.token})`,
                    'border-radius': 'var(--radius-xs) var(--radius-xs) 0 0',
                  }}
                />
              )}
            </For>
          </div>
          <TokenName>--dv-1 … --dv-8</TokenName>
        </div>
        <div style={columnStyle}>
          <div style={{ display: 'flex', height: 'var(--space-24)' }}>
            <For each={DV_SEQUENTIAL}>{(token) => <div style={{ flex: 1, background: `var(${token})` }} />}</For>
          </div>
          <TokenName>--dv-seq-1 … --dv-seq-5</TokenName>
        </div>
      </div>
    </Example>
    <Example title="Neutral" stack>
      <Ramp prefix="--neutral" steps={NEUTRAL_STEPS} />
    </Example>
    <Example title="On colour">
      <For each={ON_COLOR_PANELS}>{(background) => <OnColorPanel background={background} />}</For>
    </Example>
  </>
);
