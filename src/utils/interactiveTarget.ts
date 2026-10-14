export const INTERACTIVE_SELECTOR =
  'a[href],button,input,textarea,select,summary,audio[controls],video[controls],[contenteditable]:not([contenteditable="false"]),[role="button"],[role="checkbox"],[role="radio"],[role="switch"],[role="slider"],[role="spinbutton"],[role="combobox"],[role="textbox"],[role="menuitem"],[role="tab"]';

export const isInteractiveTarget = (target: EventTarget | null, root?: HTMLElement): boolean => {
  if (!(target instanceof Element)) return false;
  const control = target.closest(INTERACTIVE_SELECTOR);
  return control !== null && control !== root && (!root || root.contains(control));
};
