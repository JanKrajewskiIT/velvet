import * as React from 'react';
/** Mobile-first panel sliding up from the bottom. Drag the grabber down (or flick) to dismiss; Esc and backdrop tap also close. Respects safe-area insets. */
export interface BottomSheetProps { open: boolean; onClose?: () => void; title?: React.ReactNode; description?: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode; className?: string }
export declare function BottomSheet(props: BottomSheetProps): JSX.Element | null;
