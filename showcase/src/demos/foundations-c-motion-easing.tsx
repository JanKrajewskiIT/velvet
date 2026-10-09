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

const EASINGS = ['--ease-linear', '--ease-standard', '--ease-emphasized', '--ease-exit', '--ease-spring'];
const EASING_DURATION = '--dur-slow';
const HOLD_MS = 1200;
const ROW_COLUMNS = 'var(--space-10) calc(var(--space-24) * 1.5) minmax(0, 1fr) calc(var(--space-24) * 2)';
const CURVE_SIZE = 40;
const LINEAR_CURVE = { x1: 0, y1: 0, x2: 1, y2: 1 };

const parseCurve = (value: string) => {
  const body = /^cubic-bezier\((.+)\)$/.exec(value)?.[1];
  if (!body) return LINEAR_CURVE;
  const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = body.split(',').map(Number);
  return { x1, y1, x2, y2 };
};

const Curve = (props: { token: string }) => {
  const [curve, setCurve] = createSignal(LINEAR_CURVE);
  onMount(() => setCurve(parseCurve(readToken(props.token))));
  const point = (x: number, y: number) => `${x * CURVE_SIZE} ${CURVE_SIZE - y * CURVE_SIZE}`;
  return (
    <svg viewBox="-4 -24 48 72" width="40" height="52" style={{ overflow: 'visible' }} aria-hidden="true">
      <path
        d={`M0 ${CURVE_SIZE} L${CURVE_SIZE} ${CURVE_SIZE} M0 ${CURVE_SIZE} L0 0`}
        stroke="var(--border-default)"
        fill="none"
      />
      <path
        d={`M${point(0, 0)} C${point(curve().x1, curve().y1)} ${point(curve().x2, curve().y2)} ${point(1, 1)}`}
        stroke="var(--action-primary)"
        stroke-width="2"
        fill="none"
      />
    </svg>
  );
};

export const EasingExample = () => {
  const [speed, setSpeed] = createSignal(DEFAULT_SPEED);
  const [duration, setDuration] = createSignal(0);
  onMount(() => setDuration(parseMs(readToken(EASING_DURATION))));
  const { on, flip } = createLoop(() => duration() * speed() + HOLD_MS);

  return (
    <Example title="Easing" stack>
      <PlaybackBar speed={speed()} onSpeed={setSpeed} onReplay={flip} />
      <For each={EASINGS}>
        {(token) => (
          <div style={{ ...gridStyle(ROW_COLUMNS), 'align-items': 'center' }}>
            <Curve token={token} />
            <TokenName>{token}</TokenName>
            <TrackDot duration={EASING_DURATION} easing={token} speed={speed()} on={on()} />
            <TokenValue token={token} />
          </div>
        )}
      </For>
    </Example>
  );
};
