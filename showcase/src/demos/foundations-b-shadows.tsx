import { For } from 'solid-js';
import { Example } from '../Example';
import { evenColumns, gridStyle } from './foundations-a-parts';
import { Specimen, stageStyle } from './foundations-b-parts';

const SHADOWS = ['--shadow-xs', '--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl'];

export const ShadowsExample = () => (
  <Example title="Shadow ladder">
    <div style={{ ...stageStyle, ...gridStyle(evenColumns(SHADOWS.length)), gap: 'var(--space-5)' }}>
      <For each={SHADOWS}>
        {(token) => (
          <Specimen name={token}>
            <div
              style={{
                width: '100%',
                height: 'calc(var(--space-20) * 0.95)',
                'border-radius': 'var(--radius-lg)',
                background: 'var(--bg-raised)',
                'box-shadow': `var(${token})`,
              }}
            />
          </Specimen>
        )}
      </For>
    </div>
  </Example>
);
