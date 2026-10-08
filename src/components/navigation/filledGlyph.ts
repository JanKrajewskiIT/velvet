const FILLED_GLYPHS: ReadonlySet<string> = new Set([
  'home',
  'bell',
  'user',
  'folder',
  'bookmark',
  'heart',
  'message-square',
  'star',
]);

/** Active navigation icons switch to their `-filled` twin when one exists. */
export const glyphForState = (name: string, active: boolean): string =>
  active && FILLED_GLYPHS.has(name) ? `${name}-filled` : name;
