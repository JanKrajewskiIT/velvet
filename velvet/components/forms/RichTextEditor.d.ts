import * as React from 'react';
/**
 * Dependency-free WYSIWYG for comments, descriptions and notes. Own editing engine (no deprecated execCommand):
 * - Marks: bold ⌘B · italic ⌘I · underline ⌘U · strike ⌘⇧X · inline code ⌘E — toggling with a collapsed caret affects the next typed text.
 * - Blocks: heading ⌘⌥2 · subheading ⌘⌥3 · bulleted ⌘⇧8 · numbered ⌘⇧7 · quote ⌘⇧9 · code block ⌘⌥C. Enter on an empty list item / quote / heading exits it; Shift+Enter = line break; Enter twice at the end of a code block exits.
 * - Markdown as you type: `# ` `## ` `- ` `1. ` `> ` ```` ``` ```` at line start; **bold**, *italic*, _italic_, ~~strike~~, `code` inline.
 * - Links: ⌘K opens an inline link popover (bare domains get https://, emails mailto:); ⌘-click opens a link.
 * - Own undo/redo stack (⌘Z / ⌘⇧Z / ⌘Y and toolbar), paste is sanitized to the allowed markup (Word/Docs/web keep bold, lists, links; styles dropped).
 * Output is allow-listed HTML: p h2 h3 blockquote pre ul ol li strong em u s code a[href] br. Still sanitize server-side.
 */
export interface RichTextEditorProps {
  label?: string;
  hint?: string;
  error?: string;
  /** Initial HTML (sanitized). Uncontrolled. */
  defaultValue?: string;
  /** Fires on content change with sanitized HTML ('' when empty) and plain text. */
  onChange?: (html: string, text: string) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (html: string, text: string) => void;
  placeholder?: string;
  /** px. @default 140 */
  minHeight?: number;
  /** px — scrolls beyond */
  maxHeight?: number;
  /** Soft limit on plain-text length (counter turns red) */
  maxLength?: number;
  /** full · minimal (bold, italic, lists, link) · false (shortcuts + markdown only). @default 'full' */
  toolbar?: 'full' | 'minimal' | false;
  disabled?: boolean;
  /** Renders content without toolbar or editing */
  readOnly?: boolean;
  className?: string;
}
export declare function RichTextEditor(props: RichTextEditorProps): JSX.Element;
/** The allow-list sanitizer the editor uses — reuse it when rendering stored content. */
export declare function sanitizeRichText(html: string): string;
