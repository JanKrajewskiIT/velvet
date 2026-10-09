import { createSignal, For } from 'solid-js';
import { Text } from '../../../src';
import { Example } from '../Example';
import { gridStyle, TokenName } from './foundations-a-parts';

interface LayerRow {
  base: string;
  onColor?: boolean;
}

const STATES = [
  { name: 'rest', wash: undefined, onColor: undefined },
  { name: 'hover', wash: '--bg-hover', onColor: '--on-color-hover' },
  { name: 'pressed', wash: '--bg-pressed', onColor: '--on-color-pressed' },
  { name: 'selected', wash: '--bg-selected', onColor: '--on-color-subtle' },
  { name: 'selected-hover', wash: '--bg-selected-hover', onColor: undefined },
];
const ROWS: LayerRow[] = [
  { base: '--bg-raised' },
  { base: '--bg-subtle' },
  { base: '--bg-sunken' },
  { base: '--bg-brand', onColor: true },
];
const MATRIX_COLUMNS = 'calc(var(--space-24) * 1.5) repeat(5, minmax(0, 1fr))';

const cellStyle = (base: string, wash: string | undefined) => ({
  height: 'var(--space-10)',
  'border-radius': 'var(--radius-sm)',
  border: '1px solid var(--border-subtle)',
  background: wash ? `linear-gradient(var(${wash}), var(${wash})), var(${base})` : `var(${base})`,
});

const LiveWash = (props: { row: LayerRow }) => {
  const [selected, setSelected] = createSignal(false);
  return (
    <button
      type="button"
      class={props.row.onColor ? 'sc-wash sc-wash--on-color' : 'sc-wash'}
      style={{ '--sc-base': `var(${props.row.base})` }}
      aria-pressed={selected()}
      onClick={() => setSelected((value) => !value)}
    >
      {props.row.base}
    </button>
  );
};

export const StateLayersExample = () => (
  <Example title="State layers" stack>
    <div style={{ ...gridStyle(MATRIX_COLUMNS), 'align-items': 'center' }}>
      <span />
      <For each={STATES}>
        {(state) => (
          <Text variant="overline" tone="tertiary">
            {state.name}
          </Text>
        )}
      </For>
      <For each={ROWS}>
        {(row) => (
          <>
            <TokenName>{row.base}</TokenName>
            <For each={STATES}>
              {(state) => <div style={cellStyle(row.base, row.onColor ? state.onColor : state.wash)} />}
            </For>
          </>
        )}
      </For>
      <span />
      <span />
      <For each={STATES.slice(1)}>{(state) => <TokenName center>{state.wash ?? ''}</TokenName>}</For>
    </div>
    <TokenName>--bg-brand takes --on-color-hover · --on-color-pressed · --on-color-subtle</TokenName>
    <Text variant="overline" tone="tertiary">
      Live — hover, press, click to select
    </Text>
    <div style={gridStyle('repeat(auto-fit, minmax(calc(var(--space-24) * 1.5), 1fr))')}>
      <For each={ROWS}>{(row) => <LiveWash row={row} />}</For>
    </div>
  </Example>
);
