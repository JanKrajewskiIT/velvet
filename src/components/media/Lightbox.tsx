import { createMemo, createSignal, For, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { createModalRoot } from '../feedback/createModalRoot';
import { type LightboxImage, thumbUrl } from './lightboxImage';
import { safeMediaUrl } from './safeUrl';

export interface LightboxProps {
  images: readonly LightboxImage[];
  /** Index of the open image; `null` or −1 = closed. */
  index: number | null;
  onIndexChange?: (index: number) => void;
  onClose?: () => void;
}

interface LightboxPanelProps {
  lightbox: LightboxProps;
  index: number;
  ref: (element: HTMLElement) => void;
}

/** Mounted only while open, so zoom state starts fresh each time. */
const LightboxPanel = (props: LightboxPanelProps) => {
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
    <div
      ref={props.ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={translate('velvet.media.lightbox.label', { index: props.index + 1, count: count() })}
      class="vui-lightbox"
      style={{ outline: 'none' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(props.index + 1);
        else if (e.key === 'ArrowLeft') go(props.index - 1);
      }}
    >
      <div class="vui-lightbox__bar">
        <span class="vui-lightbox__count">
          {props.index + 1} / {count()}
        </span>
        <span class="vui-lightbox__cap">{image()?.caption || image()?.alt}</span>
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
        class={cx('vui-lightbox__stage', zoom() && 'vui-lightbox__stage--zoom')}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close();
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
          class="vui-lightbox__nav vui-lightbox__nav--prev"
          onClick={() => go(props.index - 1)}
        />
        <IconButton
          variant="overlay"
          shape="circle"
          size="lg"
          icon="chevron-right"
          label={translate('velvet.media.lightbox.next')}
          class="vui-lightbox__nav vui-lightbox__nav--next"
          onClick={() => go(props.index + 1)}
        />
        <div class="vui-lightbox__thumbs">
          <For each={props.lightbox.images}>
            {(thumb, k) => (
              <button
                type="button"
                aria-label={translate('velvet.media.lightbox.thumb', { index: k() + 1 })}
                aria-current={k() === props.index ? true : undefined}
                class={cx('vui-lightbox__thumb', k() === props.index && 'vui-lightbox__thumb--on')}
                onClick={() => go(k())}
              >
                <img src={thumbUrl(thumb)} alt="" />
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

/** Full-screen image viewer: ←→ / Esc, click to zoom, thumbnail strip, focus trapped and restored. Controlled by index (−1 / null = closed). */
export const Lightbox = (props: LightboxProps) => {
  const openIndex = () => {
    const index = props.index;
    return index !== null && index >= 0 && index < props.images.length ? index : undefined;
  };
  const isOpen = () => openIndex() !== undefined;
  const ref = createModalRoot(isOpen, { onEscape: () => props.onClose?.() });
  return (
    <Show when={isOpen()}>
      <Portal>
        <LightboxPanel lightbox={props} index={openIndex() ?? 0} ref={ref} />
      </Portal>
    </Show>
  );
};
