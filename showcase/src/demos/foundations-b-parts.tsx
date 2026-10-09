import type { JSX } from 'solid-js';
import { Text } from '../../../src';
import { columnStyle, gridStyle, TokenName } from './foundations-a-parts';

const ROW_COLUMNS = 'calc(var(--space-24) * 2) minmax(0, 1fr)';

export const stageStyle: JSX.CSSProperties = {
  width: '100%',
  'box-sizing': 'border-box',
  padding: 'var(--space-5)',
  'border-radius': 'var(--radius-lg)',
  background: 'var(--bg-page)',
};

export const Specimen = (props: { name: string; children: JSX.Element }) => (
  <div style={{ ...columnStyle, 'align-items': 'center', gap: 'var(--space-2)' }}>
    {props.children}
    <TokenName center>{props.name}</TokenName>
  </div>
);

export const TokenRow = (props: { token: string; children: JSX.Element }) => (
  <div style={{ ...gridStyle(ROW_COLUMNS), 'align-items': 'center' }}>
    <TokenName>{props.token}</TokenName>
    <div style={{ display: 'flex', 'align-items': 'center', gap: 'var(--space-2)', 'min-width': 0 }}>
      {props.children}
    </div>
  </div>
);

export const GroupHeading = (props: { children: string }) => (
  <Text variant="overline" tone="tertiary">
    {props.children}
  </Text>
);
