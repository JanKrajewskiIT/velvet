import { disablePresentationControl, presentationAttribute } from './presentationAttributes';

export const createMarqueeSnapshot = (prefix: string) => {
  const copies = new WeakMap<Node, Node>();
  const sync = (source: Node): Node => {
    let copy = copies.get(source);
    if (!copy) {
      copy = source.cloneNode(false);
      copies.set(source, copy);
    }
    if (source instanceof Element && copy instanceof Element) {
      for (const attribute of Array.from(copy.attributes)) {
        if (!source.hasAttribute(attribute.name)) copy.removeAttribute(attribute.name);
      }
      for (const attribute of source.attributes) {
        const value = presentationAttribute(prefix, attribute.name, attribute.value);
        if (value === undefined) {
          copy.removeAttribute(attribute.name);
          continue;
        }
        if (copy.getAttribute(attribute.name) !== value) copy.setAttribute(attribute.name, value);
      }
      disablePresentationControl(copy);
    } else if (copy.nodeValue !== source.nodeValue) copy.nodeValue = source.nodeValue;
    let at = copy.firstChild;
    for (const child of source.childNodes) {
      const next = sync(child);
      if (next !== at) copy.insertBefore(next, at);
      at = next.nextSibling;
    }
    while (at) {
      const next = at.nextSibling;
      copy.removeChild(at);
      at = next;
    }
    if (copy instanceof HTMLInputElement && source instanceof HTMLInputElement) {
      if (copy.type !== 'file') copy.value = source.value;
      copy.checked = source.checked;
    } else if (copy instanceof HTMLTextAreaElement && source instanceof HTMLTextAreaElement) copy.value = source.value;
    else if (copy instanceof HTMLSelectElement && source instanceof HTMLSelectElement) {
      Array.from(copy.options).forEach((option, index) => {
        option.selected = source.options[index]?.selected ?? false;
      });
    } else if (
      copy instanceof HTMLCanvasElement &&
      source instanceof HTMLCanvasElement &&
      source.width &&
      source.height
    ) {
      const context = copy.getContext('2d');
      context?.clearRect(0, 0, copy.width, copy.height);
      context?.drawImage(source, 0, 0);
    }
    return copy;
  };
  return (source: HTMLElement, target: HTMLElement) => {
    let at = target.firstChild;
    for (const child of source.childNodes) {
      const copy = sync(child);
      if (copy !== at) target.insertBefore(copy, at);
      at = copy.nextSibling;
    }
    while (at) {
      const next = at.nextSibling;
      target.removeChild(at);
      at = next;
    }
  };
};
