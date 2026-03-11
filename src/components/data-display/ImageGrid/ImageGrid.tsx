import { For, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './ImageGrid.module.css';

interface ImageGridItem {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageGridProps {
  images: ImageGridItem[];
  columns?: number;
  gap?: string;
  rounded?: boolean;
  hoverable?: boolean;
  onImageClick?: (index: number) => void;
}

const ImageGrid = (props: Props<ImageGridProps>) => {
  const columns = () => props.columns ?? 3;
  const gap = () => props.gap ?? 'var(--spacing-sm)';
  const rounded = () => props.rounded ?? true;
  const hoverable = () => props.hoverable ?? true;

  const cellClass = () => `${styles.cell} ${rounded() ? styles.rounded : ''}`;

  const imageClass = () => `${styles.image} ${hoverable() ? styles.hoverableImage : ''}`;

  return (
    <div class={`${styles.grid} ${props.class ?? ''}`} style={{ '--cols': String(columns()), '--gap': gap() }}>
      <For each={props.images}>
        {(item, index) => (
          <div
            class={cellClass()}
            role="button"
            tabIndex={0}
            onClick={() => props.onImageClick?.(index())}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') props.onImageClick?.(index());
            }}
          >
            <img class={imageClass()} src={item.src} alt={item.alt ?? ''} loading="lazy" />
            <Show when={item.caption}>
              <div class={styles.caption}>{item.caption}</div>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};

export type { ImageGridItem };
export default ImageGrid;
