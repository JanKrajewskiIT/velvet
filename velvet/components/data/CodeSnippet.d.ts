import * as React from 'react';
/** Code block with lightweight highlighting (js/jsx/ts/html/css/bash), line numbers, copy button (announced), optional language tabs. Always dark, in both themes. */
export interface CodeSnippetProps {
  code?: string;
  /** @default 'jsx' */
  language?: string;
  title?: string;
  /** Multiple variants — npm / yarn / pnpm */
  tabs?: Array<{ label: string; code: string; language?: string }>;
  showLineNumbers?: boolean;
  /** px. @default 320 */
  maxHeight?: number;
  wrap?: boolean;
  className?: string;
}
export declare function CodeSnippet(props: CodeSnippetProps): JSX.Element;
