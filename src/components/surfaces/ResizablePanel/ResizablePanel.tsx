import {
  batch,
  children,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  onCleanup,
  type ParentProps,
  splitProps,
} from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ResizablePanel.module.css';

interface ResizablePanelProps {
  direction?: 'horizontal' | 'vertical';
  initialSplit?: number;
  minSize?: number;
  onResize?: (split: number) => void;
}

const ResizablePanel = (props: ParentProps<Props<ResizablePanelProps>>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['direction', 'initialSplit', 'minSize', 'onResize', 'class', 'children']);
  const direction = createMemo(() => local.direction ?? 'horizontal');
  const minSize = createMemo(() => local.minSize ?? 10);
  const resizeLabel = createMemo(() => ts('resizablePanel.resizePanels'));

  const [split, setSplit] = createSignal(local.initialSplit ?? 50);
  const [dragging, setDragging] = createSignal(false);

  let wrapperRef: HTMLDivElement | undefined;

  const resolved = children(() => local.children);
  const childArray = () => {
    const c = resolved();
    return Array.isArray(c) ? c : [c];
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  let moveRafId: number | undefined;
  let pendingClamped: number | null = null;

  const flushMove = () => {
    moveRafId = undefined;
    if (pendingClamped === null) return;
    const next = pendingClamped;
    pendingClamped = null;
    batch(() => {
      setSplit(next);
      local.onResize?.(next);
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging() || !wrapperRef) return;

    const rect = wrapperRef.getBoundingClientRect();
    const isHorizontal = direction() === 'horizontal';
    const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top;
    const total = isHorizontal ? rect.width : rect.height;
    const percentage = (position / total) * 100;
    pendingClamped = Math.min(Math.max(percentage, minSize()), 100 - minSize());

    if (moveRafId !== undefined) return;
    moveRafId = requestAnimationFrame(flushMove);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  createEffect(() => {
    if (typeof document === 'undefined') return;

    if (dragging()) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (moveRafId !== undefined) {
        cancelAnimationFrame(moveRafId);
        moveRafId = undefined;
      }
      pendingClamped = null;
    }

    onCleanup(() => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (moveRafId !== undefined) {
        cancelAnimationFrame(moveRafId);
        moveRafId = undefined;
      }
      pendingClamped = null;
    });
  });

  const isHorizontal = () => direction() === 'horizontal';

  const wrapperStyle = (): JSX.CSSProperties => ({
    '--resizable-split': `${split()}%`,
    '--resizable-split-remainder': `${100 - split()}%`,
  });

  return (
    <div
      {...rest}
      ref={wrapperRef}
      style={wrapperStyle()}
      class={classNames(
        styles.wrapper,
        isHorizontal() ? styles.horizontal : styles.vertical,
        dragging() && styles.dragging,
        local.class,
      )}
    >
      <div class={styles.panelFirst}>{childArray()[0]}</div>
      <button
        type="button"
        aria-label={resizeLabel()}
        class={classNames(styles.handle, isHorizontal() ? styles.handleHorizontal : styles.handleVertical)}
        onMouseDown={handleMouseDown}
      >
        <span class={classNames(styles.grip, isHorizontal() ? styles.gripHorizontal : styles.gripVertical)}>
          <span class={styles.gripDot} />
          <span class={styles.gripDot} />
          <span class={styles.gripDot} />
        </span>
      </button>
      <div class={styles.panelSecond}>{childArray()[1]}</div>
    </div>
  );
};

export default ResizablePanel;
