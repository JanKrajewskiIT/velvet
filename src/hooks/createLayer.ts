import { type Accessor, createEffect, onCleanup } from 'solid-js';

interface Layer {
  readonly onEscape: () => void;
}

/** Open layers, topmost last. Private to this module: consumers register through `createLayer`. */
const openLayers: Layer[] = [];

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  openLayers.at(-1)?.onEscape();
};

const registerLayer = (layer: Layer): (() => void) => {
  if (openLayers.length === 0) window.addEventListener('keydown', onKeyDown);
  openLayers.push(layer);
  return () => {
    const at = openLayers.indexOf(layer);
    if (at >= 0) openLayers.splice(at, 1);
    if (openLayers.length === 0) window.removeEventListener('keydown', onKeyDown);
  };
};

/**
 * Registers a layer in the shared stack while `open()` is true. Escape reaches only the topmost open layer,
 * so a popover inside a dialog closes before the dialog does.
 */
export const createLayer = (open: Accessor<boolean>, onEscape: () => void): void => {
  createEffect(() => {
    if (!open()) return;
    onCleanup(registerLayer({ onEscape }));
  });
};
