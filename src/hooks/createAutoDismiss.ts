import { type Accessor, createEffect, on, onCleanup } from 'solid-js';

export const dismissDuration = (value: number | undefined): number =>
  Number.isFinite(value) && (value ?? 0) > 0 ? Math.min(value ?? 0, 2_147_483_647) : 0;

export const createAutoDismiss = (
  duration: Accessor<number | undefined>,
  paused: Accessor<boolean>,
  dismiss: () => void,
): void => {
  let remaining = 0;
  createEffect(
    on(
      () => [duration(), paused()] as const,
      ([value, stopped], previous) => {
        if (!previous || value !== previous[0]) remaining = dismissDuration(value);
        if (!remaining || stopped) return;
        const started = performance.now();
        const timer = setTimeout(() => {
          remaining = 0;
          dismiss();
        }, remaining);
        onCleanup(() => {
          clearTimeout(timer);
          remaining = Math.max(0, remaining - (performance.now() - started));
        });
      },
    ),
  );
};
