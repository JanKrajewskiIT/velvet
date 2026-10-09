import { createSignal, For, onMount } from 'solid-js';
import { Example } from '../Example';
import { gridStyle, TokenName } from './foundations-a-parts';
import {
  createLoop,
  DEFAULT_SPEED,
  parseMs,
  PlaybackBar,
  readToken,
  TokenValue,
  TrackDot,
} from './foundations-c-parts';

const DURATIONS = ['--dur-instant', '--dur-fast', '--dur-base', '--dur-slow', '--dur-slower'];

const LONGEST_DURATION = DURATIONS[DURATIONS.length - 1] ?? '';
const HOLD_MS = 1200;
const ROW_COLUMNS = 'calc(var(--space-24) * 1.5) minmax(0, 1fr) var(--space-20)';

export const DurationsExample = () => {
  const [speed, setSpeed] = createSignal(DEFAULT_SPEED);
  const [longest, setLongest] = createSignal(0);
  onMount(() => setLongest(parseMs(readToken(LONGEST_DURATION))));
  const { on, flip } = createLoop(() => longest() * speed() + HOLD_MS);

  return (
    <Example title="Durations" stack>
      <PlaybackBar speed={speed()} onSpeed={setSpeed} onReplay={flip} />
      <For each={DURATIONS}>
        {(token) => (
          <div style={{ ...gridStyle(ROW_COLUMNS), 'align-items': 'center' }}>
            <TokenName>{token}</TokenName>
            <TrackDot duration={token} easing="--ease-standard" speed={speed()} on={on()} />
            <TokenValue token={token} />
          </div>
        )}
      </For>
    </Example>
  );
};
