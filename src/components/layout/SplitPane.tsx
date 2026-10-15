import { children, createMemo, createSignal, type JSX, mergeProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import styles from './SplitPane.module.css';

const SPLIT_CLASSES = {
  collapsed: styles.splitVariantCollapsed,
  horizontal: styles.splitVariantHorizontal,
  vertical: styles.splitVariantVertical,
  drag: styles.splitVariantDrag,
} as const;

const KEY_STEP = 2;
const KEY_STEP_SHIFT = 10;
const FULL = 100;

export interface SplitPaneProps {
  /** Exactly two panes: the first is sized, the second takes the rest. */
  children: JSX.Element;
  /** @default 'horizontal' */
  direction?: 'horizontal' | 'vertical';
  /** First pane size in %. @default 50 */
  defaultSize?: number;
  size?: number;
  onSizeChange?: (percent: number) => void;
  /** % @default 15 */
  min?: number;
  /** % @default 85 */
  max?: number;
  /** Floor for both panes in px. @default 120 */
  minPx?: number;
  /** Drag past half of `min` (or Home / double-click) to collapse the first pane to 0; Enter restores. @default false */
  collapsible?: boolean;
  /** @default localized "Resize panels" */
  label?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

const KEY_DIRECTION = {
  horizontal: { ArrowLeft: -1, ArrowRight: 1 },
  vertical: { ArrowUp: -1, ArrowDown: 1 },
} as const satisfies Record<NonNullable<SplitPaneProps['direction']>, Record<string, number>>;

const arrowSign = (direction: keyof typeof KEY_DIRECTION, key: string): number | undefined => {
  const signs: Record<string, number> = KEY_DIRECTION[direction];
  return signs[key];
};

/** Two resizable panes. Drag the handle, or focus it and use arrows (Shift ×5), Home/End, Enter / double-click to reset. */
export const SplitPane = (props: SplitPaneProps) => {
  const p = mergeProps(
    {
      direction: 'horizontal',
      defaultSize: 50,
      min: 15,
      max: 85,
      minPx: 120,
      collapsible: false,
    } satisfies Partial<SplitPaneProps>,
    props,
  );
  const translate = useTranslate();
  let box!: HTMLDivElement;
  const [current, setCurrent] = createControllable({
    value: () => p.size,
    defaultValue: p.defaultSize,
    onChange: (percent) => p.onSizeChange?.(percent),
  });
  const [dragging, setDragging] = createSignal(false);
  let lastOpenSize = current() > 0 ? current() : p.defaultSize;

  const panes = children(() => p.children);
  const pair = createMemo(() => panes.toArray());
  const horizontal = () => p.direction === 'horizontal';
  const collapsed = () => current() <= 0;
  const boxLength = () => {
    const rect = box.getBoundingClientRect();
    return horizontal() ? rect.width : rect.height;
  };

  const constrain = (value: number): number => {
    const total = boxLength();
    const floorPercent = total ? (p.minPx / total) * FULL : 0;
    const lower = Math.max(p.min, floorPercent);
    const upper = Math.min(p.max, FULL - floorPercent);
    if (p.collapsible && value < lower / 2) return 0;
    return clamp(value, lower, upper);
  };

  const resize = (value: number) => {
    const next = constrain(value);
    if (next > 0) lastOpenSize = next;
    setCurrent(next);
  };

  const percentAt = (event: PointerEvent): number | undefined => {
    const rect = box.getBoundingClientRect();
    const length = horizontal() ? rect.width : rect.height;
    if (!length) return undefined;
    return horizontal() ? ((event.clientX - rect.left) / length) * FULL : ((event.clientY - rect.top) / length) * FULL;
  };

  const restoredSize = () => (collapsed() ? lastOpenSize : p.defaultSize);

  const onPointerDown = (event: PointerEvent & { currentTarget: HTMLElement }) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging()) return;
    const percent = percentAt(event);
    if (percent !== undefined) resize(percent);
  };

  const endDrag = () => setDragging(false);

  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? KEY_STEP_SHIFT : KEY_STEP;
    const sign = arrowSign(p.direction, event.key);
    if (sign !== undefined) {
      event.preventDefault();
      resize(Math.max(current(), 0) + sign * step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      resize(p.collapsible ? 0 : p.min);
    } else if (event.key === 'End') {
      event.preventDefault();
      resize(p.max);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      resize(restoredSize());
    }
  };

  const onDoubleClick = () => resize(p.collapsible && !collapsed() ? 0 : restoredSize());

  const template = () =>
    collapsed()
      ? '0px var(--split-handle) minmax(0,1fr)'
      : `minmax(0,${current()}fr) var(--split-handle) minmax(0,${FULL - current()}fr)`;
  const layout = (): JSX.CSSProperties =>
    horizontal() ? { 'grid-template-columns': template() } : { 'grid-template-rows': template() };

  return (
    <div
      ref={(element) => {
        box = element;
      }}
      class={cx(
        styles.split,
        variantClass(SPLIT_CLASSES, p.direction),
        dragging() && styles.splitVariantDrag,
        collapsed() && styles.splitVariantCollapsed,
        p.class,
      )}
      style={{ ...layout(), ...p.style }}
    >
      <div class={styles.splitPartPane}>{pair()[0]}</div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- focusable window-splitter separator handled with pointer and arrow keys */}
      <div
        role="separator"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a splitter separator with aria-valuenow is a focusable widget
        tabIndex={0}
        aria-label={p.label ?? translate('velvet.layout.splitPane.label')}
        aria-orientation={horizontal() ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(current())}
        aria-valuemin={p.collapsible ? 0 : p.min}
        aria-valuemax={p.max}
        class={styles.splitPartHandle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onDblClick={onDoubleClick}
        onKeyDown={onKeyDown}
      >
        <span class={styles.splitPartGrip} />
      </div>
      <div class={styles.splitPartPane}>{pair()[1]}</div>
    </div>
  );
};
