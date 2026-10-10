import { type Accessor, createMemo, createSignal } from 'solid-js';

import {
  createMentionPattern,
  createQueryDetector,
  filterMentions,
  type MentionOption,
  type MentionQuery,
  type MentionSources,
} from './mentionModel';

export interface MentionSearchOptions {
  users: ReadonlyArray<MentionOption>;
  tags: ReadonlyArray<MentionOption>;
  sources?: MentionSources;
  maxResults: number;
  disabled?: boolean;
}

/** Open trigger query at the caret, its filtered suggestions and the active suggestion. */
export const createMentionSearch = (options: MentionSearchOptions, value: Accessor<string>) => {
  const sources = createMemo<MentionSources>(
    () => options.sources ?? (options.tags.length ? { '@': options.users, '#': options.tags } : { '@': options.users }),
  );
  const detectQuery = createMemo(() => createQueryDetector(Object.keys(sources())));
  const mentionPattern = createMemo(() => createMentionPattern(sources()));
  const [query, setQuery] = createSignal<MentionQuery>();
  const [highlighted, setActiveIndex] = createSignal(0);

  const suggestions = createMemo(() => {
    const current = query();
    return current ? filterMentions(sources()[current.trigger] ?? [], current.text, options.maxResults) : [];
  });
  const open = () => !!query() && suggestions().length > 0 && !options.disabled;
  const activeIndex = () =>
    suggestions().length ? Math.min(Math.max(0, highlighted()), suggestions().length - 1) : -1;
  const textBeforeTrigger = () => {
    const current = query();
    return current ? value().slice(0, current.start) : '';
  };
  const parts = () => {
    const pattern = mentionPattern();
    return pattern ? value().split(pattern) : [value()];
  };

  const refresh = (field: HTMLTextAreaElement) => {
    setQuery(detectQuery()(field.value, field.selectionStart));
    setActiveIndex(0);
  };
  const close = () => setQuery(undefined);

  const onKeyDown = (event: KeyboardEvent, pick: (option: MentionOption) => void) => {
    if (!open() || event.isComposing) return;
    const count = suggestions().length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((activeIndex() + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const option = suggestions()[activeIndex()];
      if (option) pick(option);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  return { query, activeIndex, setActiveIndex, suggestions, open, textBeforeTrigger, parts, refresh, close, onKeyDown };
};
