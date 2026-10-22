import * as React from 'react';
/** Lightweight editable code field: line numbers, Tab indents, syntax colouring for YAML-like DSLs and Python/JS (keys, keywords, functions, strings, numbers, comments). Uses the --code-* tokens like CodeSnippet. Not a full IDE. */
export interface CodeEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** Shown as a tag next to the label */
  language?: string;
  /** Visible lines when maxHeight is not set. @default 12 */
  rows?: number;
  maxHeight?: number | string;
  readOnly?: boolean;
  /** @default true */
  lineNumbers?: boolean;
  /** @default true */
  highlight?: boolean;
}
export declare function CodeEditor(props: CodeEditorProps): JSX.Element;
export declare function highlightCode(source: string): string;
