import { type Accessor, createEffect, createSignal } from 'solid-js';

const useOverlayAnimation = (open: Accessor<boolean>): Accessor<boolean> => {
  const [entered, setEntered] = createSignal(false);

  createEffect(() => {
    if (!open()) {
      setEntered(false);
      return;
    }

    if (typeof window === 'undefined') {
      setEntered(true);
      return;
    }

    setEntered(false);
    requestAnimationFrame(() => setEntered(true));
  });

  return entered;
};

export default useOverlayAnimation;
