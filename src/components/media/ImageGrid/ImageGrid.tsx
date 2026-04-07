import { For, Show } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

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
  const isClickable = () => Boolean(props.onImageClick);

  const cellClass = (clickable: boolean) =>
    classNames(styles.cell, rounded() && styles.rounded, clickable && styles.clickable);

  const imageClass = () => classNames(styles.image, hoverable() && styles.hoverable);

  const handleImageClick = (index: number) => {
    props.onImageClick?.(index);
  };

  const renderCellContent = (item: ImageGridItem) => (
    <>
      <img class={imageClass()} src={item.src} alt={item.alt ?? ''} loading="lazy" />
      <Show when={item.caption}>
        <Text as="div" variant="caption" tone="inverse" class={styles.caption}>
          {item.caption}
        </Text>
      </Show>
    </>
  );

  return (
    <div class={classNames(styles.grid, props.class)} style={{ '--cols': columns(), '--gap': gap() }}>
      <For each={props.images}>
        {(item, index) => (
          <Show when={isClickable()} fallback={<div class={cellClass(false)}>{renderCellContent(item)}</div>}>
            <button
              type="button"
              class={cellClass(true)}
              onClick={() => handleImageClick(index())}
              aria-label={item.caption ?? item.alt ?? `Open image ${index() + 1}`}
            >
              {renderCellContent(item)}
            </button>
          </Show>
        )}
      </For>
    </div>
  );
};

export type { ImageGridItem };
export default ImageGrid;
