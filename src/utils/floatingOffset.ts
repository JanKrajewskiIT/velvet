/** Resolve inherited CSS lengths, including rem and calc(), in the panel's font and token context. */
export const measureFloatingOffset = (panel: HTMLElement, offset: number | string): number => {
  if (typeof offset === 'number') return offset;
  const probe = panel.ownerDocument.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  Object.assign(probe.style, {
    all: 'initial',
    position: 'absolute',
    display: 'block',
    visibility: 'hidden',
    pointerEvents: 'none',
    font: 'inherit',
    width: '0',
    height: '0',
    top: offset,
  });
  panel.appendChild(probe);
  try {
    const pixels = Number.parseFloat(getComputedStyle(probe).top);
    return Number.isFinite(pixels) ? pixels : 0;
  } finally {
    probe.remove();
  }
};
