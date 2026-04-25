import type { Accessor, JSX } from 'solid-js';
import { createEffect, createSignal, on, onCleanup } from 'solid-js';

import autoUpdate from '~/utils/floating/autoUpdate';
import { computePosition } from '~/utils/floating/computePosition';
import type { Middleware, MiddlewareData, Placement, ReferenceElement } from '~/utils/floating/types';

export interface UseFloatingOptions {
  reference: Accessor<ReferenceElement | undefined | null>;
  open: Accessor<boolean>;
  placement?: Accessor<Placement | undefined> | Placement;
  middleware?: Accessor<Middleware[] | undefined> | Middleware[];
  /**
   * If true, also subscribe to per-frame position checks (useful for transforms / virtual elements).
   */
  animationFrame?: boolean | Accessor<boolean | undefined>;
}

const resolveAnimationFrame = (value: UseFloatingOptions['animationFrame']): boolean => {
  if (typeof value === 'function') return Boolean(value());
  return Boolean(value);
};

export interface UseFloatingReturn {
  setFloating: (el: HTMLElement | undefined) => void;
  floating: Accessor<HTMLElement | undefined>;
  x: Accessor<number>;
  y: Accessor<number>;
  placement: Accessor<Placement>;
  middlewareData: Accessor<MiddlewareData>;
  /** Inline style ready to spread on the floating element. */
  floatingStyle: Accessor<JSX.CSSProperties>;
  update: () => void;
}

const resolvePlacement = (value: UseFloatingOptions['placement']): Placement => {
  if (typeof value === 'function') return value() ?? 'bottom-start';
  return value ?? 'bottom-start';
};

const resolveMiddleware = (value: UseFloatingOptions['middleware']): Middleware[] => {
  if (typeof value === 'function') return value() ?? [];
  return value ?? [];
};

const useFloating = (options: UseFloatingOptions): UseFloatingReturn => {
  const [floating, setFloating] = createSignal<HTMLElement | undefined>(undefined);
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [placement, setPlacement] = createSignal<Placement>(resolvePlacement(options.placement));
  const [middlewareData, setMiddlewareData] = createSignal<MiddlewareData>({});

  const update = (): void => {
    const ref = options.reference();
    const float = floating();
    if (!ref || !float) return;
    const result = computePosition(ref, float, {
      placement: resolvePlacement(options.placement),
      middleware: resolveMiddleware(options.middleware),
    });
    setX(result.x);
    setY(result.y);
    setPlacement(result.placement);
    setMiddlewareData(result.middlewareData);
  };

  // Recompute when placement/middleware reference changes.
  createEffect(
    on(
      () => [resolvePlacement(options.placement), resolveMiddleware(options.middleware)],
      () => {
        if (options.open()) update();
      },
      { defer: true },
    ),
  );

  // Bind autoUpdate when open + reference + floating present.
  createEffect(() => {
    if (!options.open()) return;
    const ref = options.reference();
    const float = floating();
    if (!ref || !float) return;
    update();
    const dispose = autoUpdate(ref, float, update, { animationFrame: resolveAnimationFrame(options.animationFrame) });
    onCleanup(dispose);
  });

  const floatingStyle = (): JSX.CSSProperties => ({
    position: 'fixed',
    top: '0',
    left: '0',
    transform: `translate3d(${Math.round(x())}px, ${Math.round(y())}px, 0)`,
    'will-change': 'transform',
  });

  return {
    setFloating,
    floating,
    x,
    y,
    placement,
    middlewareData,
    floatingStyle,
    update,
  };
};

export default useFloating;
