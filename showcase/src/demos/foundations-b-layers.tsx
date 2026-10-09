import { For } from 'solid-js';
import { Example } from '../Example';
import { TokenName } from './foundations-a-parts';

const LAYERS = [
  { token: '--z-base', elevation: '--elevation-card' },
  { token: '--z-raised', elevation: '--elevation-card' },
  { token: '--z-dropdown', elevation: '--elevation-popover' },
  { token: '--z-sticky', elevation: '--elevation-popover' },
  { token: '--z-overlay', elevation: '--elevation-popover' },
  { token: '--z-modal', elevation: '--elevation-dialog' },
  { token: '--z-toast', elevation: '--elevation-dialog' },
  { token: '--z-tooltip', elevation: '--elevation-dialog' },
];

const OFFSET_STEP = 'var(--space-16)';
const ROW_STEP = 'var(--space-8)';

export const LayersExample = () => (
  <Example title="Layers">
    <div style={{ position: 'relative', width: '100%', height: 'calc(var(--space-24) * 3)' }}>
      <For each={LAYERS}>
        {(layer, index) => (
          <div
            style={{
              position: 'absolute',
              left: `calc(${OFFSET_STEP} * ${index()})`,
              top: `calc(${ROW_STEP} * ${index()})`,
              width: 'calc(var(--space-24) * 2)',
              padding: 'var(--space-3)',
              'border-radius': 'var(--radius-lg)',
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
              'box-shadow': `var(${layer.elevation})`,
              'z-index': `var(${layer.token})`,
            }}
          >
            <TokenName>{layer.token}</TokenName>
          </div>
        )}
      </For>
    </div>
  </Example>
);
