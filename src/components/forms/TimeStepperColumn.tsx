import { Glyph } from '../primitives/Glyph';
import styles from './TimeStepperColumn.module.css';

export interface TimeStepperColumnProps {
  /** Accessible name of the spinbutton, e.g. "Hours". */
  name: string;
  increaseLabel: string;
  decreaseLabel: string;
  text: string;
  value: number;
  max: number;
  disabled?: boolean;
  /** Called with +1/-1 for arrows and ArrowUp/Down, ±5 for PageUp/Down. */
  onStep: (direction: number) => void;
}

const PAGE_STEP = 5;

const KEY_STEPS: Readonly<Record<string, number>> = {
  ArrowUp: 1,
  ArrowDown: -1,
  PageUp: PAGE_STEP,
  PageDown: -PAGE_STEP,
};

/** One spinbutton column of the TimeStepper: increase arrow, value, decrease arrow. */
export const TimeStepperColumn = (props: TimeStepperColumnProps) => {
  const onKeyDown = (e: KeyboardEvent) => {
    const step = KEY_STEPS[e.key];
    if (step === undefined) return;
    e.preventDefault();
    props.onStep(step);
  };
  const onWheel = (e: WheelEvent) => {
    if (!props.disabled && document.activeElement === e.currentTarget) props.onStep(e.deltaY < 0 ? 1 : -1);
  };
  return (
    <div class={styles.tstepPartCol}>
      <button
        type="button"
        tabIndex={-1}
        class={styles.tstepPartArrow}
        aria-label={props.increaseLabel}
        disabled={props.disabled}
        onClick={() => props.onStep(1)}
      >
        <Glyph name="chevron-up" />
      </button>
      <div
        role="spinbutton"
        tabIndex={props.disabled ? -1 : 0}
        aria-label={props.name}
        aria-valuenow={props.value}
        aria-valuemin={0}
        aria-valuemax={props.max}
        aria-valuetext={props.text}
        class={styles.tstepPartVal}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
      >
        {props.text}
      </div>
      <button
        type="button"
        tabIndex={-1}
        class={styles.tstepPartArrow}
        aria-label={props.decreaseLabel}
        disabled={props.disabled}
        onClick={() => props.onStep(-1)}
      >
        <Glyph name="chevron-down" />
      </button>
    </div>
  );
};
