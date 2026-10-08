import * as React from 'react';
/**
 * Composer for AI chat. Auto-grows to maxRows; ↵ sends, ⇧↵ new line (IME-safe). While loading the Send button becomes Stop (Esc also stops).
 * Attachment chips above the text, optional suggestion chips when empty, a toolbar slot for model / mode pickers.
 */
export interface PromptAttachment { id?: string; name: string; size?: string; icon?: string }
export interface PromptInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with trimmed text + current attachments; the field clears itself */
  onSubmit?: (text: string, attachments: PromptAttachment[]) => void;
  /** Generating — shows Stop */
  loading?: boolean;
  onStop?: () => void;
  /** @default 'Ask anything…' */
  placeholder?: string;
  /** @default 8 */
  maxRows?: number;
  attachments?: PromptAttachment[];
  /** Shows the paperclip button */
  onAttach?: () => void;
  onRemoveAttachment?: (a: PromptAttachment) => void;
  /** Starter prompts shown while empty. Click fills the field (or calls onSuggestion). */
  suggestions?: string[];
  onSuggestion?: (s: string) => void;
  /** Extra controls left of the hint — model Select, toggles */
  toolbar?: React.ReactNode;
  /** Replaces the keyboard hint */
  hint?: React.ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Accessible name. @default 'Message' */
  label?: string;
  className?: string;
}
export declare function PromptInput(props: PromptInputProps): JSX.Element;
