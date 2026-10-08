import { type Accessor, createSignal, onCleanup } from 'solid-js';

import { createModal, type ModalOptions } from '../../hooks/createModal';

/**
 * `createModal` for a layer that is mounted only while open. Returns the `ref` callback for the modal root;
 * the root is forgotten when the layer unmounts so a reopened layer never binds to a detached element.
 */
export const createModalRoot = (open: Accessor<boolean>, options: ModalOptions): ((element: HTMLElement) => void) => {
  const [root, setRoot] = createSignal<HTMLElement>();
  createModal(open, root, options);
  return (element) => {
    setRoot(element);
    onCleanup(() => setRoot(undefined));
  };
};
