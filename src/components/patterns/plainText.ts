/** Text of a node for the clipboard; rich nodes contribute nothing. */
export const plainText = (node: unknown): string =>
  typeof node === 'string' || typeof node === 'number' ? String(node) : '';
