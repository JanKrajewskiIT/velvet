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

  const cellClass = (clickable: boolean) =>
    `${styles.cell} ${rounded() ? styles.rounded : ''} ${clickable ? styles.clickable : ''}`;

  const imageClass = () => `${styles.image} ${hoverable() ? styles.hoverableImage : ''}`;
  const isClickable = () => Boolean(props.onImageClick);

  const handleImageClick = (index: number) => {
    props.onImageClick?.(index);
  };

  const handleImageKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      props.onImageClick?.(index);
    }
  };

  return (
    <div class={`${styles.grid} ${props.class ?? ''}`} style={{ '--cols': columns(), '--gap': gap() }}>
      <For each={props.images}>
        {(item, index) => (
          <Show
            when={isClickable()}
            fallback={
              <div class={cellClass(false)}>
                <img class={imageClass()} src={item.src} alt={item.alt ?? ''} loading="lazy" />
                <Show when={item.caption}>
                  <div class={styles.caption}>{item.caption}</div>
                </Show>
              </div>
            }
          >
            <button
              type="button"
              class={cellClass(true)}
              onClick={() => handleImageClick(index())}
              onKeyDown={(e) => handleImageKeyDown(e, index())}
              aria-label={item.caption ?? item.alt ?? `Open image ${index() + 1}`}
            >
              <img class={imageClass()} src={item.src} alt={item.alt ?? ''} loading="lazy" />
              <Show when={item.caption}>
                <div class={styles.caption}>{item.caption}</div>
              </Show>
            </button>
          </Show>
        )}
      </For>
    </div>
  );
};

export type { ImageGridItem };
export default ImageGrid;
