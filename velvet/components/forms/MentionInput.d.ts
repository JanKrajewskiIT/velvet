import * as React from 'react';
/**
 * Multi-line field with @mention (and optional #tag) suggestions. Typing a trigger opens a listbox at the caret; ↑↓ move, ↵ / Tab insert, Esc closes.
 * Known mentions are highlighted in place (--mark-mention-bg). The value stays plain text ("@Anna Kowal"), so it round-trips through any backend.
 * CommentThread renders the same highlight when displaying the text.
 */
export interface MentionOption { id?: string; label: string; description?: string; /** Avatar image (@) */ src?: string; /** Icon name (# and custom triggers). @default 'tag' */ icon?: string }
export interface MentionInputProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Options for @ */
  users?: MentionOption[];
  /** Options for # */
  tags?: MentionOption[];
  /** Custom triggers — overrides users/tags, e.g. { '@': people, '/': commands } */
  sources?: Record<string, MentionOption[]>;
  /** @default 3 */
  rows?: number;
  /** @default 8 */
  maxRows?: number;
  placeholder?: string;
  /** @default 6 */
  maxResults?: number;
  onMention?: (option: MentionOption, trigger: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function MentionInput(props: MentionInputProps): JSX.Element;
