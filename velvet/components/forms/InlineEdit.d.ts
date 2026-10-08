import * as React from 'react';
/** Click-to-edit value — no separate form or modal. Enter/blur saves, Esc cancels, focus returns to the value. Brief ✓ confirms a save. */
export interface InlineEditProps {
  value?: string;
  defaultValue?: string;
  /** May return a Promise — the field stays open and locked while pending; on reject the draft is kept and the error shows inline. If disabled while editing, the draft is kept and only Cancel remains. */
  onSave?: (value: string) => void | Promise<void>;
  /** @default 'Click to add…' */
  placeholder?: string;
  /** Accessible name — e.g. "Project title" */
  label?: string;
  /** sm = table cell · md = body · lg = page title (display font) */
  size?: 'sm' | 'md' | 'lg';
  /** Return an error string to block the save */
  validate?: (value: string) => string | undefined | null | false;
  disabled?: boolean;
  className?: string;
}
export declare function InlineEdit(props: InlineEditProps): JSX.Element;
