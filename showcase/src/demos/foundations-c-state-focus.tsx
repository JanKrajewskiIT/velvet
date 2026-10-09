import { For, type JSX } from 'solid-js';
import { Button, Swatch, Text } from '../../../src';
import { Example } from '../Example';
import { evenColumns, gridStyle } from './foundations-a-parts';
import { Specimen } from './foundations-b-parts';

const FIELD_WIDTH = 'calc(var(--space-24) * 1.5)';
const ROW_STYLE: JSX.CSSProperties = {
  display: 'flex',
  'align-items': 'center',
  height: 'var(--control-height-xs)',
  padding: '0 var(--space-2-5)',
};
const STAGE_STYLE: JSX.CSSProperties = {
  display: 'grid',
  'place-items': 'center',
  height: 'var(--space-16)',
};

const FOCUS_TOKENS = ['--focus-ring', '--focus-ring-danger', '--focus-ring-inset', '--focus-outline'];

const specimenFor = (token: string): JSX.Element => {
  switch (token) {
    case '--focus-ring':
      return (
        <div
          style={{
            display: 'grid',
            'place-items': 'center',
            height: 'var(--control-height-sm)',
            padding: '0 var(--space-4)',
            'border-radius': 'var(--button-radius)',
            background: 'var(--action-primary)',
            color: 'var(--action-primary-fg)',
            font: 'var(--type-button-sm)',
            'box-shadow': 'var(--focus-ring)',
          }}
        >
          Save
        </div>
      );
    case '--focus-ring-danger':
      return (
        <div
          style={{
            width: FIELD_WIDTH,
            height: 'var(--control-height-sm)',
            border: '1px solid var(--control-border-invalid)',
            'border-radius': 'var(--control-radius)',
            background: 'var(--control-bg)',
            'box-shadow': 'var(--focus-ring-danger)',
          }}
        />
      );
    case '--focus-ring-inset':
      return (
        <div
          style={{
            width: FIELD_WIDTH,
            overflow: 'hidden',
            'border-radius': 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-raised)',
            font: 'var(--type-body-sm)',
            color: 'var(--fg-primary)',
          }}
        >
          <div style={{ ...ROW_STYLE, color: 'var(--fg-secondary)' }}>Inbox</div>
          <div style={{ ...ROW_STYLE, background: 'var(--bg-hover)', 'box-shadow': 'var(--focus-ring-inset)' }}>
            Archive
          </div>
        </div>
      );
    default:
      return (
        <Swatch
          color="var(--label-teal)"
          style={{ outline: 'var(--focus-outline)', 'outline-offset': 'var(--focus-ring-offset)' }}
        />
      );
  }
};

export const FocusExample = () => (
  <Example title="Focus" stack>
    <div style={gridStyle(evenColumns(FOCUS_TOKENS.length))}>
      <For each={FOCUS_TOKENS}>
        {(token) => (
          <Specimen name={token}>
            <div style={STAGE_STYLE}>{specimenFor(token)}</div>
          </Specimen>
        )}
      </For>
    </div>
    <Text variant="overline" tone="tertiary">
      Live — press Tab
    </Text>
    <div style={{ display: 'flex', 'flex-wrap': 'wrap', 'align-items': 'center', gap: 'var(--space-4)' }}>
      <Button size="sm">Save</Button>
      <Button size="sm" variant="secondary">
        Cancel
      </Button>
      <Swatch color="var(--label-teal)" label="Teal" onClick={() => undefined} />
    </div>
  </Example>
);
