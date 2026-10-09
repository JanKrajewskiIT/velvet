import { For } from 'solid-js';
import { Example } from '../Example';
import { evenColumns, gridStyle } from './foundations-a-parts';
import { GroupHeading, TokenRow } from './foundations-b-parts';

const DENSITIES = ['comfortable', 'compact'] as const;
const CONTROL_HEIGHTS = ['--control-height-xs', '--control-height-sm', '--control-height-md', '--control-height-lg'];

const ControlPair = (props: { height: string }) => (
  <>
    <div
      style={{
        display: 'flex',
        'align-items': 'center',
        height: `var(${props.height})`,
        padding: '0 var(--control-pad-x)',
        'border-radius': 'var(--control-radius)',
        background: 'var(--button-primary-bg)',
        color: 'var(--button-primary-fg)',
        font: 'var(--type-button-sm)',
      }}
    >
      Save
    </div>
    <div
      style={{
        flex: 1,
        height: `var(${props.height})`,
        border: 'var(--border-width) solid var(--control-border)',
        'border-radius': 'var(--control-radius)',
        background: 'var(--control-bg)',
      }}
    />
  </>
);

export const ControlsExample = () => (
  <Example title="Control heights × density">
    <div style={{ ...gridStyle(evenColumns(DENSITIES.length)), 'align-items': 'start' }}>
      <For each={DENSITIES}>
        {(density) => (
          <div
            data-density={density}
            style={{ display: 'flex', 'flex-direction': 'column', gap: 'var(--space-2-5)', 'min-width': 0 }}
          >
            <GroupHeading>{density}</GroupHeading>
            <For each={CONTROL_HEIGHTS}>
              {(height) => (
                <TokenRow token={height}>
                  <ControlPair height={height} />
                </TokenRow>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  </Example>
);
