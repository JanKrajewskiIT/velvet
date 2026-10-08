import * as React from 'react';
/** Copies text to the clipboard; icon morphs copy → check for 1.6s and the result is announced. */
export interface CopyButtonProps { value: string | (() => string); label?: string; copiedLabel?: string; iconOnly?: boolean; variant?: 'primary' | 'secondary' | 'soft' | 'ghost'; size?: 'sm' | 'md' | 'lg'; onCopy?: (value: string) => void; className?: string }
export declare function CopyButton(props: CopyButtonProps): JSX.Element;
/** Read-only value + copy button — API keys, invite links, IDs. Selects all on focus. */
export interface CopyFieldProps { value: string; label?: string; /** @default true */ mono?: boolean; className?: string }
export declare function CopyField(props: CopyFieldProps): JSX.Element;
