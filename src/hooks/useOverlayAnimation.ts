import { type Accessor, createEffect, createSignal, on, onCleanup } from 'solid-js';

const useOverlayAnimation = (open: Accessor<boolean>): Accessor<boolean> => {
  const [entered, setEntered] = createSignal(false);

  createEffect(
    on(
      open,
      (isOpen) => {
        if (!isOpen) {
          setEntered(false);
          return;
        }

        if (typeof window === 'undefined') {
          setEntered(true);
          return;
        }

        setEntered(false);
        const rafId = requestAnimationFrame(() => setEntered(true));
        onCleanup(() => cancelAnimationFrame(rafId));
      },
      { defer: true },
    ),
  );

  createEffect(() => {
    if (open() && typeof window === 'undefined') {
      setEntered(true);
    }
  });

  return entered;
};

export default useOverlayAnimation;
