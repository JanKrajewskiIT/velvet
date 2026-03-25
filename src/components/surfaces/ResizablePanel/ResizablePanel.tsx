import { children, createEffect, createSignal, onCleanup, type ParentProps } from 'solid-js';

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
  const { t } = useI18n();
  const direction = () => props.direction ?? 'horizontal';
  const minSize = () => props.minSize ?? 10;

  const [split, setSplit] = createSignal(props.initialSplit ?? 50);
  const [dragging, setDragging] = createSignal(false);

  let wrapperRef: HTMLDivElement | undefined;

  const resolved = children(() => props.children);
  const childArray = () => {
    const c = resolved();
    return Array.isArray(c) ? c : [c];
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging() || !wrapperRef) return;

    const rect = wrapperRef.getBoundingClientRect();
    const isHorizontal = direction() === 'horizontal';
    const position = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top;
    const total = isHorizontal ? rect.width : rect.height;
    const percentage = (position / total) * 100;
    const clamped = Math.min(Math.max(percentage, minSize()), 100 - minSize());

    setSplit(clamped);
    props.onResize?.(clamped);
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
    }

    onCleanup(() => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    });
  });

  const isHorizontal = () => direction() === 'horizontal';

  const firstStyle = () =>
    isHorizontal() ? { width: `${split()}%`, height: '100%' } : { height: `${split()}%`, width: '100%' };

  const secondStyle = () =>
    isHorizontal() ? { width: `${100 - split()}%`, height: '100%' } : { height: `${100 - split()}%`, width: '100%' };

  return (
    <div
      ref={wrapperRef}
      class={classNames(
        styles.wrapper,
        isHorizontal() ? styles.horizontal : styles.vertical,
        dragging() && styles.dragging,
        props.class
      )}
    >
      <div class={styles.panelFirst} style={firstStyle()}>
        {childArray()[0]}
      </div>
      <button
        type="button"
        aria-label={t('common.resize')}
        class={classNames(styles.handle, isHorizontal() ? styles.handleHorizontal : styles.handleVertical)}
        onMouseDown={handleMouseDown}
      >
        <span class={classNames(styles.grip, isHorizontal() ? styles.gripHorizontal : styles.gripVertical)}>
          <span class={styles.gripDot} />
          <span class={styles.gripDot} />
          <span class={styles.gripDot} />
        </span>
      </button>
      <div class={styles.panelSecond} style={secondStyle()}>
        {childArray()[1]}
      </div>
    </div>
  );
};

export default ResizablePanel;
