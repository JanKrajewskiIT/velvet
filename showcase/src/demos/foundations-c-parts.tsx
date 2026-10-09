import { type Accessor, createSignal, For, type JSX, onCleanup, onMount, type Setter } from 'solid-js';
import { Button, Segmented, SegmentedItem, Text } from '../../../src';

export const SPEEDS = [1, 4, 10] as const;
export const DEFAULT_SPEED = 4;

export const readToken = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

export const parseMs = (value: string): number => Number.parseFloat(value) || 0;

export const createTokenValue = (token: string): Accessor<string> => {
  const [value, setValue] = createSignal('');
  onMount(() => setValue(readToken(token)));
  return value;
};

export const TokenValue = (props: { token: string }) => {
  // eslint-disable-next-line solid/reactivity -- token names are static per specimen
  const value = createTokenValue(props.token);
  return (
    <Text variant="caption" tone="secondary" mono style={{ 'overflow-wrap': 'anywhere' }}>
      {value()}
    </Text>
  );
};

export const createLoop = (periodMs: Accessor<number>) => {
  const [on, setOn] = createSignal(false);
  let timer: number | undefined;
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      setOn((value) => !value);
      schedule();
    }, periodMs());
  };
  const flip = () => {
    setOn((value) => !value);
    schedule();
  };
  onMount(schedule);
  onCleanup(() => window.clearTimeout(timer));
  return { on, flip };
};

export interface PlaybackBarProps {
  speed: number;
  onSpeed: Setter<number>;
  onReplay: () => void;
}

export const PlaybackBar = (props: PlaybackBarProps) => (
  <div style={{ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', gap: 'var(--space-3)' }}>
    <Segmented size="sm" role="radiogroup" aria-label="Playback speed">
      <For each={SPEEDS}>
        {(speed) => (
          <SegmentedItem role="radio" selected={speed === props.speed} onClick={() => props.onSpeed(speed)}>
            {`×${speed}`}
          </SegmentedItem>
        )}
      </For>
    </Segmented>
    <Button size="sm" variant="secondary" iconLeft="play" onClick={props.onReplay}>
      Replay
    </Button>
  </div>
);

export const trackStyle: JSX.CSSProperties = {
  position: 'relative',
  height: 'var(--space-6)',
  'border-radius': 'var(--radius-full)',
  background: 'var(--bg-sunken)',
};

export const TrackDot = (props: { duration: string; easing: string; speed: number; on: boolean }) => (
  <div style={trackStyle}>
    <div
      style={{
        position: 'absolute',
        top: 'var(--space-1)',
        left: props.on ? 'calc(100% - var(--space-5))' : 'var(--space-1)',
        width: 'var(--space-4)',
        height: 'var(--space-4)',
        'border-radius': 'var(--radius-full)',
        background: 'var(--action-primary)',
        transition: `left calc(var(${props.duration}) * ${props.speed}) var(${props.easing})`,
      }}
    />
  </div>
);
