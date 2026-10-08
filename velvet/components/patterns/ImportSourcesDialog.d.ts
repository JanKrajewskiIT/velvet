import * as React from 'react';
export interface ImportSource { id: string; name: string; description?: string; icon?: string; color?: string; status: 'connected' | 'available' | 'error'; /** Items available to import */ count?: number; error?: string; defaultSelected?: boolean }
/** Dialog checklist of import sources grouped Connected / Available. Connected rows are selectable; available/errored rows show Connect / Reconnect (async). Footer sums the selection. */
export interface ImportSourcesDialogProps { open: boolean; onClose?: () => void; sources: ImportSource[]; /** On reject: selection kept, error inline, dialog stays open. */ onImport?: (ids: string[]) => void | Promise<void>; onConnect?: (id: string) => void | Promise<void>; title?: string }
export declare function ImportSourcesDialog(props: ImportSourcesDialogProps): JSX.Element;
