import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  on,
  onCleanup,
  Show,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { isTopLayer } from '../../hooks/createLayer';
import { createModal } from '../../hooks/createModal';
import { classSelector } from '../../utils/cssModule';
import styles from './Tour.module.css';
import { TourCard } from './TourCard';
import type { TourProps, TourStep } from './tourTypes';

export type { TourProps, TourStep } from './tourTypes';

const resolveTarget = (target: TourStep['target']): HTMLElement | undefined => {
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target) ?? undefined;
  return typeof target === 'function' ? target() : target;
};
/** Guided walkthrough: dims the page, spotlights one element, floats a step card beside it. ← → navigate, Esc skips. Keep it to 3–5 steps; the page behind is inert while open. */
export const Tour = (props: TourProps) => {
  const titleId = createUniqueId();
  const bodyId = createUniqueId();
  const [root, setRoot] = createSignal<HTMLDialogElement>();
  const p = mergeProps({ defaultStep: 0, padding: 6 } satisfies Partial<TourProps>, props);
  const [index, setIndex] = createSignal(p.defaultStep);
  const [rect, setRect] = createSignal<DOMRect>();
  const current = createMemo(() => {
    const step = p.steps[index()];
    return step && { index: index(), step };
  });
  createModal(() => p.open && !!current(), root, {
    onEscape: () => p.onClose?.(),
    initialFocus: classSelector(styles.tourPartCard),
  });

  createEffect(
    on(
      () => p.open,
      (open) => open && setIndex(p.defaultStep),
    ),
  );

  const next = () => {
    if (index() >= p.steps.length - 1) (p.onFinish ?? p.onClose)?.();
    else setIndex(index() + 1);
  };
  const back = () => setIndex(Math.max(0, index() - 1));

  createEffect(() => {
    if (!p.open) return;
    const measure = () => {
      const step = current()?.step;
      setRect(step ? resolveTarget(step.target)?.getBoundingClientRect() : undefined);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const dialog = root();
      if (!dialog || !isTopLayer(dialog) || e.defaultPrevented) return;
      const target = e.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.matches('input, textarea, select')))
        return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        back();
      }
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    window.addEventListener('keydown', onKeyDown);
    onCleanup(() => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('keydown', onKeyDown);
    });
  });

  const hole = (): JSX.CSSProperties | undefined => {
    const r = rect();
    return (
      r && {
        left: `${r.left - p.padding}px`,
        top: `${r.top - p.padding}px`,
        width: `${r.width + p.padding * 2}px`,
        height: `${r.height + p.padding * 2}px`,
      }
    );
  };

  return (
    <Show when={p.open && current()}>
      <Portal>
        <dialog
          ref={(element) => {
            setRoot(element);
            onCleanup(() => setRoot(undefined));
          }}
          class={styles.tour}
          data-vui-modal
          aria-labelledby={titleId}
          aria-describedby={current()?.step.body ? bodyId : undefined}
        >
          <Show when={hole()} fallback={<div class={styles.tourPartVeil} />}>
            {(style) => <div class={styles.tourPartHole} style={style()} />}
          </Show>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- pointer-only shield that keeps focus on the step card; keyboard control is on the window and createModal */}
          <div class={styles.tourPartBlock} onMouseDown={(e) => e.preventDefault()} />
          <Show when={current()} keyed>
            {(active) => (
              <TourCard
                titleId={titleId}
                bodyId={bodyId}
                tour={p}
                index={active.index}
                step={active.step}
                rect={rect()}
                onBack={back}
                onNext={next}
              />
            )}
          </Show>
        </dialog>
      </Portal>
    </Show>
  );
};
