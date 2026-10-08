import * as React from 'react';
/** Compact language toggle (PL / EN by default) with a sliding thumb; ←→ switch. Each option announces its native name. For 4+ languages use Select. */
export interface LocaleSwitcherProps { locales?: Array<{ value: string; label: string; name: string }>; value?: string; defaultValue?: string; onChange?: (locale: string) => void; size?: 'sm' | 'md'; className?: string }
export declare function LocaleSwitcher(props: LocaleSwitcherProps): JSX.Element;
