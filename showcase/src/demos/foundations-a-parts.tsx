import { For, type JSX } from 'solid-js';
import { Text } from '../../../src';

const TILE_MIN = 'var(--space-24)';

export const RAMP_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

export const columnStyle: JSX.CSSProperties = {
  display: 'flex',
  'flex-direction': 'column',
  gap: 'var(--space-1)',
  'min-width': 0,
};

export const gridStyle = (columns: string): JSX.CSSProperties => ({
  display: 'grid',
  'grid-template-columns': columns,
  gap: 'var(--space-3)',
  width: '100%',
});

export const evenColumns = (count: number) => `repeat(${count}, minmax(0, 1fr))`;
export const autoFillColumns = `repeat(auto-fill, minmax(${TILE_MIN}, 1fr))`;

export const TokenName = (props: { children: string; center?: boolean }) => (
  <Text
    variant="caption"
    tone="tertiary"
    mono
    style={{ 'overflow-wrap': 'anywhere', 'text-align': props.center ? 'center' : undefined }}
  >
    {props.children}
  </Text>
);

export interface ColorChipProps {
  token: string;
  label?: string;
  selected?: boolean;
}

export const ColorChip = (props: ColorChipProps) => (
  <div style={columnStyle}>
    <div
      style={{
        height: 'var(--space-10)',
        background: `var(${props.token})`,
        'border-radius': 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        outline: props.selected ? 'var(--border-width-thick) solid var(--border-focus)' : undefined,
        'outline-offset': props.selected ? 'var(--space-0-5)' : undefined,
      }}
    />
    <TokenName center>{props.label ?? props.token}</TokenName>
  </div>
);

export interface RampProps {
  prefix: string;
  steps: readonly string[];
  selected?: string;
}

export const Ramp = (props: RampProps) => (
  <div style={{ ...gridStyle(evenColumns(props.steps.length)), gap: 'var(--space-1-5)' }}>
    <For each={props.steps}>
      {(step) => <ColorChip token={`${props.prefix}-${step}`} label={step} selected={step === props.selected} />}
    </For>
  </div>
);

export const rowStyle: JSX.CSSProperties = {
  display: 'grid',
  'align-items': 'baseline',
  gap: 'var(--space-4)',
  padding: 'var(--space-2) 0',
  'border-bottom': '1px solid var(--border-subtle)',
};
