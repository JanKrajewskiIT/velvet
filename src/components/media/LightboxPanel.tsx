import { createMemo, createSignal, For, Show } from 'solid-js';

import { isTopLayer } from '../../hooks/createLayer';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { Text } from '../primitives/Text';
import { thumbUrl } from './lightboxImage';
import styles from './LightboxPanel.module.css';
import type { LightboxProps } from './lightboxTypes';
import { safeMediaUrl } from './safeUrl';

interface LightboxPanelProps {
  class?: string;
  lightbox: LightboxProps;
  index: number;
  ref: (element: HTMLDialogElement) => void;
}

/** Mounted only while open, so zoom state starts fresh each time. */
export const LightboxPanel = (props: LightboxPanelProps) => {
  const [zoom, setZoom] = createSignal(false);
  const translate = useTranslate();
  const count = () => props.lightbox.images.length;
  const image = createMemo(() => props.lightbox.images[props.index]);
  const close = () => props.lightbox.onClose?.();
  const go = (target: number) => {
    setZoom(false);
    props.lightbox.onIndexChange?.((target + count()) % count());
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- modal backdrop click dismisses; Escape and the close button cover the keyboard, arrows navigate images
    <dialog
      ref={props.ref}
      data-vui-modal
      aria-label={translate('velvet.media.lightbox.label', { index: props.index + 1, count: count() })}
      class={cx(styles.modal, styles.lightbox, props.class)}
      style={{ outline: 'none' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && isTopLayer(e.currentTarget, e)) close();
      }}
      onKeyDown={(e) => {
        if (e.defaultPrevented || !isTopLayer(e.currentTarget)) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') e.preventDefault();
        if (e.key === 'ArrowRight') go(props.index + 1);
        else if (e.key === 'ArrowLeft') go(props.index - 1);
      }}
    >
      <div class={styles.lightboxPartBar}>
        <Text as="span" variant="code" tone="inherit" class={styles.lightboxPartCount}>
          {props.index + 1} / {count()}
        </Text>
        <Text as="span" variant="body-sm" class={styles.lightboxPartCap}>
          {image()?.caption || image()?.alt}
        </Text>
        <IconButton
          variant="overlay"
          shape="circle"
          icon="zoom-in"
          label={zoom() ? translate('velvet.media.lightbox.zoomOut') : translate('velvet.media.lightbox.zoomIn')}
          aria-pressed={zoom()}
          onClick={() => setZoom(!zoom())}
        />
        <IconButton
          variant="overlay"
          shape="circle"
          icon="x"
          label={translate('velvet.common.close')}
          onClick={close}
        />
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- stage backdrop click dismisses; Escape and the close button cover the keyboard */}
      <figure
        class={cx(styles.lightboxPartStage, zoom() && styles.lightboxPartStageVariantZoom)}
        onMouseDown={(e) => {
          const dialog = e.currentTarget.closest('dialog');
          if (e.target === e.currentTarget && dialog && isTopLayer(dialog, e)) close();
        }}
      >
        <Show when={safeMediaUrl(image()?.src)}>
          {(src) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- click-to-zoom is a pointer shortcut; the zoom button in the toolbar is the keyboard path
            <img src={src()} alt={image()?.alt ?? ''} onClick={() => setZoom(!zoom())} />
          )}
        </Show>
      </figure>
      <Show when={count() > 1}>
        <IconButton
          variant="overlay"
          shape="circle"
          size="lg"
          icon="chevron-left"
          label={translate('velvet.media.lightbox.previous')}
          class={cx(styles.lightboxPartNav, styles.lightboxPartNavVariantPrev)}
          onClick={() => go(props.index - 1)}
        />
        <IconButton
          variant="overlay"
          shape="circle"
          size="lg"
          icon="chevron-right"
          label={translate('velvet.media.lightbox.next')}
          class={cx(styles.lightboxPartNav, styles.lightboxPartNavVariantNext)}
          onClick={() => go(props.index + 1)}
        />
        <div class={styles.lightboxPartThumbs}>
          <For each={props.lightbox.images}>
            {(thumb, k) => (
              <button
                type="button"
                aria-label={translate('velvet.media.lightbox.thumb', { index: k() + 1 })}
                aria-current={k() === props.index ? true : undefined}
                class={cx(styles.lightboxPartThumb, k() === props.index && styles.lightboxPartThumbVariantOn)}
                onClick={() => go(k())}
              >
                <img src={thumbUrl(thumb)} alt="" />
              </button>
            )}
          </For>
        </div>
      </Show>
    </dialog>
  );
};
