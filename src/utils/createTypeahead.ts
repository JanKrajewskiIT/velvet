const RESET_DELAY_MS = 600;
const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

/** Matches from the next item; repeated characters cycle instead of forming an unusable prefix. */
export const createTypeahead = () => {
  let text = '';
  let updatedAt = 0;
  return (key: string, labels: readonly string[], current: number): number => {
    const now = Date.now();
    if (now - updatedAt > RESET_DELAY_MS) text = '';
    text += key.toLocaleLowerCase();
    updatedAt = now;
    const characters = Array.from(graphemes.segment(text), ({ segment }) => segment);
    const first = characters[0] ?? '';
    const repeated = characters.every((character) => character === first);
    const prefix = repeated ? first : text;
    const start = repeated ? current + 1 : Math.max(0, current);
    for (let step = 0; step < labels.length; step += 1) {
      const index = (start + step) % labels.length;
      if (labels[index]?.trim().toLocaleLowerCase().startsWith(prefix)) return index;
    }
    return -1;
  };
};
