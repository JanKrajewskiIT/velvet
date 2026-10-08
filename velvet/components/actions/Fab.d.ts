import * as React from 'react';
/** Floating action button — the single most important creation action on mobile screens. extended adds the label. With actions it becomes a speed dial (icon rotates to ×, labelled mini-buttons stagger in; Esc closes). */
export interface FabProps { icon?: string; /** Required — aria-label or visible text */ label: string; extended?: boolean; onClick?: () => void; actions?: Array<{ label: string; icon: string; onClick?: () => void }>; /** fixed = bottom-right of viewport · static. @default 'fixed' */ position?: 'fixed' | 'static'; className?: string }
export declare function Fab(props: FabProps): JSX.Element;
