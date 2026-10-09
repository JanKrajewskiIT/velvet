import { For } from 'solid-js';
import { Text } from '../../../src';
import { Example } from '../Example';
import { autoFillColumns, evenColumns, gridStyle, TokenName } from './foundations-a-parts';
import { Specimen } from './foundations-b-parts';

const BORDER_WIDTHS = [
  { token: '--border-width', lineStyle: 'solid' },
  { token: '--border-width-medium', lineStyle: 'dashed' },
  { token: '--border-width-thick', lineStyle: 'solid' },
  { token: '--border-width-accent', lineStyle: 'solid' },
];
const BORDER_SURFACES = [
  { name: 'raised', token: '--bg-raised' },
  { name: 'subtle', token: '--bg-subtle' },
  { name: 'sunken', token: '--bg-sunken' },
  { name: 'page', token: '--bg-page' },
];
const BORDER_COLORS = ['--border-subtle', '--border-default', '--border-strong', '--border-focus', '--border-brand'];
const RADII = [
  '--radius-none',
  '--radius-2xs',
  '--radius-xs',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--radius-xl',
  '--radius-2xl',
  '--radius-full',
];

const BORDER_MATRIX_COLUMNS = 'calc(var(--space-24) * 1.5) repeat(4, minmax(0, 1fr))';

const BorderCell = (props: { surface: string; border: string }) => (
  <div
    style={{
      height: 'var(--space-10)',
      padding: 'var(--space-2)',
      'box-sizing': 'border-box',
      'border-radius': 'var(--radius-sm)',
      background: `var(${props.surface})`,
    }}
  >
    <div
      style={{
        height: '100%',
        'border-radius': 'var(--radius-xs)',
        border: `var(--border-width) solid var(${props.border})`,
      }}
    />
  </div>
);

const BorderExample = () => (
  <Example title="Border" stack>
    <div style={gridStyle(evenColumns(BORDER_WIDTHS.length))}>
      <For each={BORDER_WIDTHS}>
        {(width) => (
          <Specimen name={width.token}>
            <div
              style={{
                width: '100%',
                height: 0,
                'border-top': `var(${width.token}) ${width.lineStyle} var(--fg-primary)`,
              }}
            />
          </Specimen>
        )}
      </For>
    </div>
    <div style={{ ...gridStyle(BORDER_MATRIX_COLUMNS), 'align-items': 'center' }}>
      <span />
      <For each={BORDER_SURFACES}>
        {(surface) => (
          <Text variant="caption" tone="tertiary">
            {surface.name}
          </Text>
        )}
      </For>
      <For each={BORDER_COLORS}>
        {(border) => (
          <>
            <TokenName>{border}</TokenName>
            <For each={BORDER_SURFACES}>{(surface) => <BorderCell surface={surface.token} border={border} />}</For>
          </>
        )}
      </For>
    </div>
  </Example>
);

const RadiusExample = () => (
  <Example title="Radius">
    <div style={{ ...gridStyle(autoFillColumns), 'align-items': 'end' }}>
      <For each={RADII}>
        {(radius) => (
          <Specimen name={radius}>
            <div
              style={{
                width: '100%',
                height: 'var(--space-16)',
                'border-radius': `var(${radius})`,
                background: 'var(--bg-brand-subtle)',
                'box-shadow': 'inset 0 0 0 var(--border-width-medium) var(--border-brand)',
              }}
            />
          </Specimen>
        )}
      </For>
    </div>
  </Example>
);

export const ShapePage = () => (
  <>
    <BorderExample />
    <RadiusExample />
  </>
);
