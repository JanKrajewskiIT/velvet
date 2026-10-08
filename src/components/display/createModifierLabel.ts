import { type Accessor, createSignal, onMount } from 'solid-js';

const DEFAULT_LABEL = 'Ctrl+';
const MAC_LABEL = '\u2318';
const APPLE_PLATFORM = /Mac|iP/u;

/** Label of the shortcut modifier key (`⌘` on Apple platforms, otherwise `Ctrl+`). Resolved on mount so server and client markup agree. */
export const createModifierLabel = (): Accessor<string> => {
  const [label, setLabel] = createSignal(DEFAULT_LABEL);
  onMount(() => {
    if (APPLE_PLATFORM.test(navigator.platform)) setLabel(MAC_LABEL);
  });
  return label;
};
