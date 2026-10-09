import { For } from 'solid-js';
import { Text } from '../../../src';
import { Example } from '../Example';
import { TokenName } from './foundations-a-parts';
import { GroupHeading, Specimen } from './foundations-b-parts';

const BREAKPOINTS = [
  { name: 'base', min: '0', width: 'var(--space-24)', ramp: '--velvet-100' },
  { name: 'sm', min: '--bp-sm', width: 'calc(var(--bp-sm) / 4)', ramp: '--velvet-200' },
  { name: 'md', min: '--bp-md', width: 'calc(var(--bp-md) / 4)', ramp: '--velvet-300' },
  { name: 'lg', min: '--bp-lg', width: 'calc(var(--bp-lg) / 4)', ramp: '--velvet-400' },
  { name: 'xl', min: '--bp-xl', width: 'calc(var(--bp-xl) / 4)', ramp: '--velvet-500' },
  { name: '2xl', min: '--bp-2xl', width: 'calc(var(--bp-2xl) / 4)', ramp: '--velvet-700' },
];
const CONTROL_HEIGHTS = ['--control-height-sm', '--control-height-md', '--control-height-lg'];

const ROW_COLUMNS = 'var(--space-16) minmax(0, 1fr) calc(var(--space-24) * 1.25)';

export const BreakpointsExample = () => (
  <Example title="Breakpoints & controls" stack>
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: 'var(--space-2)', width: '100%' }}>
      <GroupHeading>Mobile-first · bars at ¼ scale</GroupHeading>
      <For each={BREAKPOINTS}>
        {(breakpoint) => (
          <div
            style={{
              display: 'grid',
              'grid-template-columns': ROW_COLUMNS,
              'align-items': 'center',
              gap: 'var(--space-3)',
            }}
          >
            <TokenName>{breakpoint.name}</TokenName>
            <div
              style={{
                width: breakpoint.width,
                'max-width': '100%',
                height: 'var(--space-2-5)',
                'border-radius': 'var(--radius-full)',
                background: `var(${breakpoint.ramp})`,
              }}
            />
            <TokenName>{`≥ ${breakpoint.min}`}</TokenName>
          </div>
        )}
      </For>
    </div>
    <div style={{ display: 'flex', 'flex-wrap': 'wrap', 'align-items': 'flex-end', gap: 'var(--space-5)' }}>
      <For each={CONTROL_HEIGHTS}>
        {(height) => (
          <Specimen name={height}>
            <div
              style={{
                width: 'var(--space-20)',
                height: `var(${height})`,
                border: 'var(--border-width) solid var(--border-strong)',
                'border-radius': 'var(--radius-md)',
              }}
            />
          </Specimen>
        )}
      </For>
      <Text variant="caption" tone="tertiary" style={{ 'margin-left': 'auto' }}>
        Coarse pointers grow control heights automatically.
      </Text>
    </div>
  </Example>
);
