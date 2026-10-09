import { For, type JSX } from 'solid-js';
import { Text } from '../../../src';
import { Example } from '../Example';
import { TokenName } from './foundations-a-parts';

const GRID_COLUMN_COUNT = 12;
const GRID_CELLS = Array.from({ length: GRID_COLUMN_COUNT }, (_, index) => index);
const SIDEBAR_BARS = [{ selected: true }, {}, {}, { width: '70%' }];
const FOOTER_TOKENS = ['--grid-columns', '--grid-gap', '--gutter', '--section-gap', '--content-gap', '--stack-gap'];

const dashedBorder = 'var(--border-width) dashed var(--border-strong)';

const Meta = (props: { children: string; style?: JSX.CSSProperties }) => (
  <Text variant="caption" mono tone="tertiary" style={props.style}>
    {props.children}
  </Text>
);

const Sidebar = () => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      'flex-direction': 'column',
      gap: 'var(--space-1-5)',
      padding: 'var(--space-3)',
      background: 'var(--bg-raised)',
      'border-right': dashedBorder,
    }}
  >
    <For each={SIDEBAR_BARS}>
      {(bar) => (
        <i
          style={{
            display: 'block',
            width: bar.width,
            height: 'var(--space-2-5)',
            'border-radius': 'var(--radius-xs)',
            background: bar.selected ? 'var(--bg-selected)' : 'var(--bg-sunken)',
          }}
        />
      )}
    </For>
    <Meta style={{ position: 'absolute', left: 'var(--space-3)', bottom: 'var(--space-2-5)' }}>--sidebar-width</Meta>
  </div>
);

const Container = () => (
  <div
    style={{
      position: 'relative',
      padding: 'var(--space-7) var(--space-3) var(--space-3)',
      border: 'var(--border-width) dashed var(--border-brand)',
      'border-radius': 'var(--radius-sm)',
      background: 'var(--bg-selected)',
    }}
  >
    <Meta style={{ position: 'absolute', top: 'var(--space-2)', left: 'var(--space-3)', color: 'var(--fg-brand)' }}>
      container · --container-xl · padding --gutter
    </Meta>
    <div
      style={{
        display: 'grid',
        'grid-template-columns': 'repeat(var(--grid-columns), minmax(0, 1fr))',
        gap: 'var(--space-2)',
        height: 'calc(var(--space-24) * 0.9)',
      }}
    >
      <For each={GRID_CELLS}>
        {() => <span style={{ 'border-radius': 'var(--radius-xs)', background: 'var(--action-soft)' }} />}
      </For>
    </div>
  </div>
);

export const ShellExample = () => (
  <Example title="App shell">
    <div
      style={{
        width: '100%',
        border: dashedBorder,
        'border-radius': 'var(--radius-md)',
        overflow: 'hidden',
        background: 'var(--bg-subtle)',
      }}
    >
      <div
        style={{
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'space-between',
          gap: 'var(--space-3)',
          height: 'calc(var(--topbar-height) * 0.8)',
          padding: '0 var(--space-4)',
          background: 'var(--bg-raised)',
          'border-bottom': 'var(--border-width) solid var(--border-default)',
        }}
      >
        <Text variant="label">Topbar</Text>
        <Meta>--topbar-height</Meta>
      </div>
      <div
        style={{
          display: 'grid',
          'grid-template-columns': 'calc(var(--sidebar-width) * 0.6) minmax(0, 1fr)',
          'min-height': 'calc(var(--space-24) * 2.5)',
        }}
      >
        <Sidebar />
        <div
          style={{
            display: 'flex',
            'flex-direction': 'column',
            gap: 'var(--space-3)',
            padding: 'var(--space-4) var(--gutter)',
          }}
        >
          <Container />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          'flex-wrap': 'wrap',
          gap: 'var(--space-2) var(--space-5)',
          padding: 'var(--space-2-5) var(--space-4)',
          'border-top': dashedBorder,
          background: 'var(--bg-raised)',
        }}
      >
        <For each={FOOTER_TOKENS}>{(token) => <TokenName>{token}</TokenName>}</For>
      </div>
    </div>
  </Example>
);
