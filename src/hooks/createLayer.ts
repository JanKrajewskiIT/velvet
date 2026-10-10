import { type Accessor, createEffect, onCleanup } from 'solid-js';

export interface LayerOptions {
  root?: Accessor<HTMLElement | undefined>;
  onOutside?: (event: MouseEvent) => void;
  escape?: boolean;
}

interface Layer extends LayerOptions {
  readonly onEscape: () => void;
}

interface LayerStack {
  layers: Layer[];
  dispose: () => void;
}

const stacks = new WeakMap<Document, LayerStack>();
const pressedLayers = new WeakMap<Event, Layer>();

export const isTopLayer = (root: HTMLElement, event?: Event): boolean => {
  const layer = stacks.get(root.ownerDocument)?.layers.at(-1);
  if (event && pressedLayers.get(event) !== layer) return false;
  return layer?.root?.() === root;
};

/** Local Escape handlers may act only when the current layer contains their surface. */
export const ownsLayerEvent = (element: HTMLElement): boolean => {
  const root = stacks.get(element.ownerDocument)?.layers.at(-1)?.root?.();
  return !root || root.contains(element);
};

const createStack = (document: Document): LayerStack => {
  const layers: Layer[] = [];
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented || !layers.length) return;
    const layer = layers.at(-1);
    if (!layer || layer.escape === false) return;
    event.preventDefault();
    event.stopPropagation();
    layer.onEscape();
  };
  const onMouseDown = (event: MouseEvent) => {
    const layer = layers.at(-1);
    if (!layer) return;
    pressedLayers.set(event, layer);
    const root = layer.root?.();
    if (root && !event.composedPath().includes(root)) layer.onOutside?.(event);
  };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('mousedown', onMouseDown, true);
  return {
    layers,
    dispose: () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown, true);
      stacks.delete(document);
    },
  };
};

const registerLayer = (document: Document, layer: Layer): (() => void) => {
  const stack = stacks.get(document) ?? createStack(document);
  stacks.set(document, stack);
  const root = layer.root?.();
  const descendant = stack.layers.findIndex((existing) => {
    const child = existing.root?.();
    return root && child && root !== child && root.contains(child);
  });
  stack.layers.splice(descendant < 0 ? stack.layers.length : descendant, 0, layer);
  return () => {
    const index = stack.layers.indexOf(layer);
    if (index >= 0) stack.layers.splice(index, 1);
    if (!stack.layers.length) stack.dispose();
  };
};

/** One event is owned by the layer that was topmost when it began, even if dismissal exposes another layer. */
export const createLayer = (open: Accessor<boolean>, onEscape: () => void, options: LayerOptions = {}): void => {
  createEffect(() => {
    if (!open()) return;
    const root = options.root?.();
    if (options.root && !root) return;
    onCleanup(registerLayer(root?.ownerDocument ?? document, { ...options, onEscape }));
  });
};
