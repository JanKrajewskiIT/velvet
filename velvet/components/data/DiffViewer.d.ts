import * as React from 'react';
/**
 * Line diff of two texts on the code surface (same bar and palette as CodeSnippet). Unified or split view, old / new line numbers,
 * word-level highlights inside changed lines, unchanged runs folded to `context` lines with "Show N unchanged lines".
 * For config changes, document revisions, AI edit suggestions, audit trails. Fine up to a few thousand lines.
 */
export interface DiffViewerProps {
  oldText: string;
  newText: string;
  /** Shown in the bar */
  filename?: string;
  mode?: 'unified' | 'split';
  /** @default 'unified' */
  defaultMode?: 'unified' | 'split';
  onModeChange?: (mode: 'unified' | 'split') => void;
  /** Unchanged lines kept around each change. @default 3 */
  context?: number;
  className?: string;
}
export declare function DiffViewer(props: DiffViewerProps): JSX.Element;
export interface DiffRow { t: 'eq' | 'add' | 'del'; o?: number; n?: number; text: string; parts?: Array<[string, boolean]> }
/** The line + word diff DiffViewer renders — reuse for your own summaries. */
export declare function diffLines(oldText: string, newText: string): DiffRow[];
