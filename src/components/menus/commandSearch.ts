export interface CommandItem {
  id?: string;
  label: string;
  /** Glyph name. */
  icon?: string;
  description?: string;
  shortcut?: string;
  /** Extra search terms. */
  keywords?: string[];
  onSelect?: () => void;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteLabels {
  /** Accessible name of the dialog. */
  dialog: string;
  navigate: string;
  open: string;
  close: string;
  resultOne: string;
  resultMany: string;
}

export interface CommandResult {
  item: CommandItem;
  /** Position among all visible results; matches the option id. */
  index: number;
}

export interface CommandResultGroup {
  label: string;
  results: CommandResult[];
}

const SCORE = { prefix: 3, wordStart: 2, substring: 1.5, subsequence: 1, none: 0 } as const;

const score = (item: CommandItem, query: string): number => {
  if (!query) return SCORE.subsequence;
  const haystack = `${item.label} ${(item.keywords ?? []).join(' ')}`.toLowerCase();
  const needle = query.toLowerCase();
  if (haystack.startsWith(needle)) return SCORE.prefix;
  if (haystack.includes(` ${needle}`)) return SCORE.wordStart;
  if (haystack.includes(needle)) return SCORE.substring;
  let matched = 0;
  for (const char of haystack) {
    if (char === needle[matched]) matched++;
    if (matched === needle.length) return SCORE.subsequence;
  }
  return SCORE.none;
};

/** Fuzzy-filters and ranks items per group, dropping empty groups and numbering the remaining results consecutively. */
export const filterCommandGroups = (groups: CommandGroup[], query: string): CommandResultGroup[] => {
  const ranked = groups
    .map((group) => ({
      label: group.label,
      items: group.items
        .map((item) => ({ item, score: score(item, query) }))
        .filter((entry) => entry.score > SCORE.none)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.item),
    }))
    .filter((group) => group.items.length > 0);

  let index = 0;
  return ranked.map((group) => ({
    label: group.label,
    results: group.items.map((item) => ({ item, index: index++ })),
  }));
};
