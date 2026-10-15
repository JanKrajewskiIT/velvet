import { mergeProps } from 'solid-js';

import type { StatusTone } from '../../utils/tone';
import { IconTile } from '../primitives/IconTile';
import styles from './StateTile.module.css';

export type StateTone = StatusTone;
export type StateSize = 'sm' | 'md' | 'lg';

const TILE_SIZE = { sm: 'lg', md: '2xl', lg: '3xl' } as const;
const TILE_HALO = { sm: undefined, md: 'md', lg: 'lg' } as const;

export interface StateTileProps {
  icon: string;
  size: StateSize;
  tone?: StateTone;
}

/** The tinted icon circle shared by EmptyState, ErrorState and StatusPage. */
export const StateTile = (props: StateTileProps) => {
  const p = mergeProps({ tone: 'neutral' } satisfies Partial<StateTileProps>, props);
  return (
    <IconTile
      icon={p.icon}
      size={TILE_SIZE[p.size]}
      shape="circle"
      tone={p.tone === 'neutral' ? undefined : p.tone}
      halo={TILE_HALO[p.size]}
      class={styles.emptyPartIcon}
    />
  );
};
