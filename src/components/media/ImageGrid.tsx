import { createMemo, createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import styles from './ImageGrid.module.css';
import { Lightbox } from './Lightbox';
import { type LightboxImage, thumbUrl } from './lightboxImage';

const IMGGRID_CLASSES = {
  feature: styles.imggridVariantFeature,
  masonry: styles.imggridVariantMasonry,
} as const;

const FEATURE_TILES = 3;
const CLOSED = -1;

export interface ImageGridProps {
  images: readonly LightboxImage[];
  /** uniform = equal tiles (+ optional span), feature = 1 hero + 2 thumbs, masonry = columns of natural heights. @default 'uniform' */
  layout?: 'uniform' | 'feature' | 'masonry';
  /** uniform / masonry column count. @default 3 */
  columns?: number;
  /** px. @default 8 */
  gap?: number;
  /** uniform tile ratio. @default '4 / 3' */
  ratio?: string;
  /** feature container ratio. @default '16 / 9' */
  featureRatio?: string;
  /** Show at most N tiles; the last becomes "+rest". feature always shows 3. */
  max?: number;
  /** Open the Lightbox on click. @default true */
  lightbox?: boolean;
  class?: string;
}

/** Image grid that opens the Lightbox. */
export const ImageGrid = (props: ImageGridProps) => {
  const p = mergeProps(
    {
      layout: 'uniform',
      columns: 3,
      gap: 8,
      ratio: '4 / 3',
      featureRatio: '16 / 9',
      lightbox: true,
    } satisfies Partial<ImageGridProps>,
    props,
  );
  const [open, setOpen] = createSignal(CLOSED);
  const translate = useTranslate();
  const limit = () => (p.layout === 'feature' ? FEATURE_TILES : p.max);
  const shown = createMemo(() => (limit() ? p.images.slice(0, limit()) : p.images));
  const extra = () => p.images.length - shown().length;

  const tileLabel = (image: LightboxImage, index: number, isLast: boolean) => {
    if (isLast) return translate('velvet.media.imageGrid.openGallery', { count: extra() });
    return image.alt
      ? translate('velvet.media.imageGrid.openImage', { alt: image.alt })
      : translate('velvet.media.imageGrid.openUntitled', { index: index + 1 });
  };

  const gridStyle = (): JSX.CSSProperties => {
    if (p.layout === 'masonry')
      return { 'column-count': String(p.columns), 'column-gap': `${p.gap}px`, '--imggrid-gap': `${p.gap}px` };
    if (p.layout === 'feature') return { gap: `${p.gap}px`, 'aspect-ratio': p.featureRatio };
    return { 'grid-template-columns': `repeat(${p.columns}, minmax(0,1fr))`, gap: `${p.gap}px` };
  };
  const tileStyle = (image: LightboxImage): JSX.CSSProperties | undefined => {
    if (p.layout === 'uniform') {
      const span = image.span ? `span ${image.span}` : undefined;
      return { 'aspect-ratio': image.span ? undefined : p.ratio, 'grid-column': span, 'grid-row': span };
    }
    return p.layout === 'masonry' && image.ratio ? { 'aspect-ratio': image.ratio } : undefined;
  };

  return (
    <>
      <div class={cx(styles.imggrid, variantClass(IMGGRID_CLASSES, p.layout, 'uniform'), p.class)} style={gridStyle()}>
        <For each={shown()}>
          {(image, k) => {
            const isLast = () => extra() > 0 && k() === shown().length - 1;
            return (
              <button
                type="button"
                class={styles.imggridPartItem}
                style={tileStyle(image)}
                aria-label={tileLabel(image, k(), isLast())}
                onClick={() => p.lightbox && setOpen(k())}
              >
                <img src={thumbUrl(image)} alt={image.alt || ''} loading="lazy" />
                <Show when={image.badge}>
                  {(badge) => (
                    <Text as="span" variant="label-sm" tone="primary" class={styles.imggridPartBadge}>
                      {badge()}
                    </Text>
                  )}
                </Show>
                <Show
                  when={isLast()}
                  fallback={
                    <span class={styles.imggridPartZoom} aria-hidden="true">
                      <Glyph name="maximize" />
                    </span>
                  }
                >
                  <Text as="span" variant="title-lg" class={styles.imggridPartMore} aria-hidden="true">
                    +{extra()}
                  </Text>
                </Show>
              </button>
            );
          }}
        </For>
      </div>
      <Show when={p.lightbox}>
        <Lightbox images={p.images} index={open()} onIndexChange={setOpen} onClose={() => setOpen(CLOSED)} />
      </Show>
    </>
  );
};
