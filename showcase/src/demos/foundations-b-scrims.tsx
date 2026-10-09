import { For } from 'solid-js';
import { Example } from '../Example';
import { evenColumns, gridStyle } from './foundations-a-parts';
import { Specimen } from './foundations-b-parts';

const SCRIMS = ['--scrim-backdrop', '--scrim-image', '--scrim-media'];
const BLURS = ['--blur-sm', '--blur-md', '--blur-lg'];
const TILE_COLORS = ['--bg-brand', '--dv-4', '--dv-2'];

const Backdrop = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'grid',
      'grid-template-columns': evenColumns(TILE_COLORS.length),
      gap: 'var(--space-1-5)',
      padding: 'var(--space-2)',
    }}
  >
    <For each={TILE_COLORS}>
      {(color) => <div style={{ background: `var(${color})`, 'border-radius': 'var(--radius-sm)' }} />}
    </For>
  </div>
);

const frameStyle = {
  position: 'relative',
  height: 'calc(var(--space-24) * 1)',
  'border-radius': 'var(--radius-md)',
  overflow: 'hidden',
  background: 'var(--bg-raised)',
  'box-shadow': 'var(--swatch-ring)',
} as const;

export const ScrimsExample = () => (
  <Example title="Scrims & blur">
    <div style={{ ...gridStyle(evenColumns(SCRIMS.length)), gap: 'var(--space-4)' }}>
      <For each={SCRIMS}>
        {(token) => (
          <Specimen name={token}>
            <div style={{ ...frameStyle, width: '100%' }}>
              <Backdrop />
              <div style={{ position: 'absolute', inset: 0, background: `var(${token})` }} />
            </div>
          </Specimen>
        )}
      </For>
      <For each={BLURS}>
        {(token) => (
          <Specimen name={token}>
            <div style={{ ...frameStyle, width: '100%' }}>
              <Backdrop />
              <div style={{ position: 'absolute', inset: 0, 'backdrop-filter': `blur(var(${token}))` }} />
            </div>
          </Specimen>
        )}
      </For>
    </div>
  </Example>
);
