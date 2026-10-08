import * as React from 'react';
/**
 * One turn in an AI / support conversation. user = right-aligned brand-tinted bubble · assistant = avatar + plain text with Copy / Regenerate / 👍👎 tools · system = centred note.
 * streaming shows a blinking caret (or TypingIndicator while the body is still empty); error renders an inline alert with Retry. Compose inside ChatThread, with PromptInput below.
 */
export interface ChatMessageProps {
  /** @default 'assistant' */
  role?: 'user' | 'assistant' | 'system';
  author?: React.ReactNode;
  /** Replaces the default sparkles avatar (assistant only) */
  avatar?: React.ReactNode;
  time?: React.ReactNode;
  /** Plain text — also what Copy puts on the clipboard. Use children for rich content (Markdown, code). */
  content?: string;
  children?: React.ReactNode;
  /** Still generating — caret, tools hidden */
  streaming?: boolean;
  /** true = default message, or your own text */
  error?: boolean | React.ReactNode;
  /** Shows Regenerate (and Retry on error) */
  onRetry?: () => void;
  onCopy?: (text: string) => void;
  feedback?: 'up' | 'down' | null;
  /** Shows 👍 / 👎 toggles */
  onFeedback?: (value: 'up' | 'down' | null) => void;
  /** Numbered citation chips under the answer */
  sources?: Array<{ title: string; href?: string }>;
  /** Extra tools after the built-in ones */
  actions?: React.ReactNode;
  className?: string;
}
export declare function ChatMessage(props: ChatMessageProps): JSX.Element;
/** Scrolling role="log" container. Sticks to the bottom while new messages arrive unless the user has scrolled up to read. */
export interface ChatThreadProps { children?: React.ReactNode; /** CSS height — the thread scrolls inside it */ height?: number | string; label?: string; className?: string; style?: React.CSSProperties }
export declare function ChatThread(props: ChatThreadProps): JSX.Element;
/** Three bouncing dots — "assistant is typing". */
export interface TypingIndicatorProps { label?: string; className?: string }
export declare function TypingIndicator(props: TypingIndicatorProps): JSX.Element;
