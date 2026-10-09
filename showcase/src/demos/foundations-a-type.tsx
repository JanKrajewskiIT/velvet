import { For, type JSX } from 'solid-js';
import { Example } from '../Example';
import { columnStyle, gridStyle, rowStyle, TokenName } from './foundations-a-parts';

const FAMILIES = [
  { token: '--font-display', name: 'Space Grotesk', tracking: '--tracking-tighter' },
  { token: '--font-sans', name: 'Hanken Grotesk', tracking: '--tracking-normal' },
  { token: '--font-mono', name: 'JetBrains Mono', tracking: '--tracking-normal' },
];
const WEIGHTS = ['light', 'regular', 'medium', 'semibold', 'bold', 'extrabold'];
const GLYPH_SAMPLE = 'ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż0123456789 → ⌘ …';

interface Role {
  role: string;
  sample: string;
  upper?: boolean;
}

const DISPLAY_ROLES: Role[] = [
  { role: 'display-lg', sample: 'Quietly confident' },
  { role: 'display-md', sample: 'Quietly confident' },
  { role: 'display-sm', sample: 'Quietly confident' },
  { role: 'h1', sample: 'The quick brown fox' },
  { role: 'h2', sample: 'The quick brown fox' },
  { role: 'h3', sample: 'The quick brown fox' },
  { role: 'h4', sample: 'The quick brown fox' },
  { role: 'h5', sample: 'The quick brown fox' },
  { role: 'title-lg', sample: 'The quick brown fox' },
  { role: 'title', sample: 'The quick brown fox' },
  { role: 'kpi', sample: '€ 48,210' },
];
const TEXT_ROLES: Role[] = [
  { role: 'body-lg', sample: 'The quick brown fox' },
  { role: 'body', sample: 'The quick brown fox' },
  { role: 'body-sm', sample: 'The quick brown fox' },
  { role: 'label', sample: 'The quick brown fox' },
  { role: 'label-sm', sample: 'The quick brown fox' },
  { role: 'caption', sample: 'The quick brown fox' },
  { role: 'overline', sample: 'The quick brown fox', upper: true },
  { role: 'button-lg', sample: 'Save changes' },
  { role: 'button', sample: 'Save changes' },
  { role: 'button-sm', sample: 'Save changes' },
  { role: 'code', sample: 'const theme = "dark";' },
  { role: 'kbd', sample: '⌘ K' },
  { role: 'section', sample: 'Recent searches', upper: true },
  { role: 'micro', sample: '12 · 3 / 10 · [1]' },
];
const SIZES = [
  { size: '2xs', family: 'sans', sample: 'Velvet interface' },
  { size: 'xs', family: 'sans', sample: 'Velvet interface' },
  { size: 'sm', family: 'sans', sample: 'Velvet interface' },
  { size: 'md', family: 'sans', sample: 'Velvet interface' },
  { size: 'base', family: 'sans', sample: 'Velvet interface' },
  { size: 'lg', family: 'sans', sample: 'Velvet interface' },
  { size: 'xl', family: 'sans', sample: 'Velvet interface' },
  { size: '2xl', family: 'sans', sample: 'Velvet interface' },
  { size: '3xl', family: 'display', sample: 'Velvet interface' },
  { size: '4xl', family: 'display', sample: 'Velvet interface' },
  { size: '5xl', family: 'display', sample: 'Velvet' },
  { size: '6xl', family: 'display', sample: 'Velvet' },
  { size: '7xl', family: 'display', sample: 'Velvet' },
];
const TRACKINGS = [
  { name: 'tighter', caps: false },
  { name: 'tight', caps: false },
  { name: 'snug', caps: false },
  { name: 'normal', caps: false },
  { name: 'wide', caps: false },
  { name: 'label', caps: true },
  { name: 'caps', caps: true },
];
const LEADINGS = ['none', 'display', 'tight', 'compact', 'snug', 'normal', 'code', 'relaxed'];
const LEADING_SAMPLE = 'Pchnąć w tę łódź jeża lub ośm skrzyń fig.';

const ellipsis: JSX.CSSProperties = { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis' };

const RoleList = (props: { roles: Role[] }) => (
  <div style={columnStyle}>
    <For each={props.roles}>
      {(item) => (
        <div style={{ ...rowStyle, 'grid-template-columns': 'minmax(0, 1fr) var(--space-24)' }}>
          <span
            style={{
              ...ellipsis,
              font: `var(--type-${item.role})`,
              'letter-spacing': `var(--type-${item.role}-tracking, normal)`,
              'text-transform': item.upper ? 'uppercase' : undefined,
            }}
          >
            {item.sample}
          </span>
          <TokenName>{`--type-${item.role}`}</TokenName>
        </div>
      )}
    </For>
  </div>
);

export const TypePage = () => (
  <>
    <Example title="Families & weights" stack>
      <div style={gridStyle('repeat(3, minmax(0, 1fr))')}>
        <For each={FAMILIES}>
          {(family) => (
            <div style={{ ...columnStyle, gap: 'var(--space-2)' }}>
              <span
                style={{
                  font: `var(--font-weight-semibold) var(--font-size-7xl)/var(--leading-none) var(${family.token})`,
                  'letter-spacing': `var(${family.tracking})`,
                }}
              >
                Aa
              </span>
              <span
                style={{
                  font: `var(--font-weight-medium) var(--font-size-md)/var(--leading-snug) var(${family.token})`,
                }}
              >
                {family.name}
              </span>
              <span
                style={{
                  font: `var(--font-weight-regular) var(--font-size-sm)/var(--leading-normal) var(${family.token})`,
                  color: 'var(--fg-secondary)',
                }}
              >
                {GLYPH_SAMPLE}
              </span>
              <TokenName>{family.token}</TokenName>
            </div>
          )}
        </For>
      </div>
      <div style={gridStyle('var(--space-24) repeat(6, minmax(0, 1fr))')}>
        <span />
        <For each={WEIGHTS}>{(weight) => <TokenName center>{`--font-weight-${weight}`}</TokenName>}</For>
        <For each={FAMILIES}>
          {(family) => (
            <>
              <TokenName>{family.token}</TokenName>
              <For each={WEIGHTS}>
                {(weight) => (
                  <span
                    style={{
                      'text-align': 'center',
                      font: `var(--font-weight-${weight}) var(--font-size-2xl)/var(--leading-compact) var(${family.token})`,
                    }}
                  >
                    Ag
                  </span>
                )}
              </For>
            </>
          )}
        </For>
      </div>
    </Example>
    <Example title="Roles · display & headings" stack>
      <RoleList roles={DISPLAY_ROLES} />
    </Example>
    <Example title="Roles · text & UI" stack>
      <RoleList roles={TEXT_ROLES} />
    </Example>
    <Example title="Size scale" stack>
      <div style={columnStyle}>
        <For each={SIZES}>
          {(item) => (
            <div style={{ ...rowStyle, 'grid-template-columns': 'var(--space-24) minmax(0, 1fr)' }}>
              <TokenName>{`--font-size-${item.size}`}</TokenName>
              <span
                style={{
                  ...ellipsis,
                  font: `var(--font-weight-medium) var(--font-size-${item.size})/var(--leading-display) var(--font-${item.family})`,
                  'letter-spacing': item.family === 'display' ? 'var(--tracking-tighter)' : undefined,
                }}
              >
                {item.sample}
              </span>
            </div>
          )}
        </For>
      </div>
    </Example>
    <Example title="Tracking & leading" stack>
      <div style={columnStyle}>
        <For each={TRACKINGS}>
          {(item) => (
            <div style={{ ...rowStyle, 'grid-template-columns': 'var(--space-24) minmax(0, 1fr)' }}>
              <TokenName>{`--tracking-${item.name}`}</TokenName>
              <span
                style={{
                  font: item.caps
                    ? 'var(--font-weight-semibold) var(--font-size-xs)/var(--leading-compact) var(--font-sans)'
                    : 'var(--font-weight-semibold) var(--font-size-xl)/var(--leading-compact) var(--font-display)',
                  'letter-spacing': `var(--tracking-${item.name})`,
                  'text-transform': item.caps ? 'uppercase' : undefined,
                }}
              >
                Velvet interface
              </span>
            </div>
          )}
        </For>
      </div>
      <div style={gridStyle('repeat(auto-fill, minmax(calc(var(--space-24) * 2), 1fr))')}>
        <For each={LEADINGS}>
          {(name) => (
            <div style={columnStyle}>
              <span
                style={{
                  font: `var(--font-weight-regular) var(--font-size-md)/var(--leading-${name}) var(--font-sans)`,
                  background: 'var(--bg-subtle)',
                }}
              >
                {LEADING_SAMPLE}
              </span>
              <TokenName>{`--leading-${name}`}</TokenName>
            </div>
          )}
        </For>
      </div>
    </Example>
  </>
);
