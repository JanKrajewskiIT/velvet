import * as React from 'react';
export interface ColorLabel { id: string; name: string; color: string; /** Items using it — shown and mentioned on delete */ count?: number }
/** Compact dialog (sm) listing labels as dot + name with edit / delete icon buttons. Edit and "Add label" open a Name + Color form at the bottom (footer switches to Cancel / Save). Delete confirms inline under the row. Duplicate names are rejected. Colours default to the data-viz palette. */
export interface ColorLabelManagerProps { open: boolean; onClose?: () => void; labels: ColorLabel[]; /** May return a Promise — Save / Delete lock while pending; on reject the form stays open and the error shows inline. */ onChange?: (labels: ColorLabel[]) => void | Promise<void>; colors?: string[]; title?: string }
export declare function ColorLabelManager(props: ColorLabelManagerProps): JSX.Element;
export declare const LABEL_COLORS: string[];
