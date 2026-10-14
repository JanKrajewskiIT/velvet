const OMITTED_ATTRIBUTES = new Set(['autofocus', 'name', 'required', 'autoplay']);
const ID_REFERENCES = new Set(['for', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns']);

export const presentationAttribute = (prefix: string, name: string, value: string): string | undefined => {
  if (OMITTED_ATTRIBUTES.has(name)) return undefined;
  const id = (key: string) =>
    key.startsWith(`${prefix}-`)
      ? key
      : `${prefix}-${Array.from(key, (character) => character.codePointAt(0)?.toString(16)).join('-')}`;
  if (name === 'id') return id(value);
  if (ID_REFERENCES.has(name)) return value.split(/\s+/u).map(id).join(' ');
  if ((name === 'href' || name === 'xlink:href') && value.startsWith('#')) return `#${id(value.slice(1))}`;
  return value.replace(
    /url\(\s*(['"]?)#([^)'"\s]+)\1\s*\)/gu,
    (_, quote: string, key: string) => `url(${quote}#${id(key)}${quote})`,
  );
};

export const disablePresentationControl = (element: Element): void => {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLButtonElement
  ) {
    if (!element.disabled) element.disabled = true;
  }
  if (element instanceof HTMLMediaElement) {
    if (element.autoplay) element.autoplay = false;
    if (element.preload !== 'none') element.preload = 'none';
    if (!element.paused) element.pause();
  }
};
