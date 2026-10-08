import { children, createMemo, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { renderIcon } from '../primitives/Glyph';
import { DEFAULT_QR_LEVEL, encodeQR, type QRLevel } from './encodeQR';

const LOGO_LEVEL: QRLevel = 'H';
const LOGO_SIZE_RATIO = 0.22;
const LOGO_GLYPH_RATIO = 0.55;

export interface QRCodeProps {
  /** Text or URL to encode. */
  value: string;
  /** px. @default 160 */
  size?: number;
  /** Error correction: L 7% · M 15% · Q 25% · H 30%. @default 'M' ('H' with a logo) */
  level?: QRLevel;
  /** Quiet zone in modules. Keep ≥ 4 for print. @default 4 */
  margin?: number;
  /** Icon name or node centred on a white tile. */
  logo?: JSX.Element;
  /** Accessible name. @default localized "QR code: " + value */
  label?: string;
  class?: string;
}

const modulesPath = (modules: readonly (readonly boolean[])[], margin: number): string => {
  let path = '';
  modules.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) path += `M${x + margin},${y + margin}h1v1h-1z`;
    }),
  );
  return path;
};

/**
 * Scannable QR code generated in the browser (byte mode, UTF-8, versions 1–40, auto mask).
 * Always dark modules on a white tile with a quiet zone, in both themes. A centre logo bumps error correction to H.
 * Pair with a visible link or code: the image alone is not accessible.
 */
export const QRCode = (props: QRCodeProps) => {
  const merged = mergeProps({ size: 160, margin: 4 } satisfies Partial<QRCodeProps>, props);
  const translate = useTranslate();
  const logo = children(() => merged.logo);
  const level = () => merged.level ?? (logo() ? LOGO_LEVEL : DEFAULT_QR_LEVEL);
  const modules = createMemo(() => encodeQR(merged.value, level()));
  const box = () => ({ width: `${merged.size}px`, height: `${merged.size}px` });
  const logoSize = () => Math.round(merged.size * LOGO_SIZE_RATIO);
  return (
    <Show
      when={modules()}
      fallback={
        <div
          class={cx('vui-qr', 'vui-qr--error', merged.class)}
          style={box()}
          role="img"
          aria-label={translate('velvet.display.qrCode.unavailable')}
        >
          {translate('velvet.display.qrCode.tooLong')}
        </div>
      }
    >
      {(matrix) => {
        const viewBox = () => matrix().length + merged.margin * 2;
        const path = createMemo(() => modulesPath(matrix(), merged.margin));
        return (
          <div
            class={cx('vui-qr', merged.class)}
            style={box()}
            role="img"
            aria-label={merged.label ?? translate('velvet.display.qrCode.label', { value: merged.value })}
          >
            <svg
              viewBox={`0 0 ${viewBox()} ${viewBox()}`}
              width={merged.size}
              height={merged.size}
              shape-rendering="crispEdges"
              aria-hidden="true"
            >
              <rect width={viewBox()} height={viewBox()} class="vui-qr__bg" />
              <path d={path()} class="vui-qr__fg" />
            </svg>
            <Show when={logo()}>
              <span
                class="vui-qr__logo"
                style={{
                  width: `${logoSize()}px`,
                  height: `${logoSize()}px`,
                  'font-size': `${Math.round(logoSize() * LOGO_GLYPH_RATIO)}px`,
                }}
              >
                {renderIcon(logo())}
              </span>
            </Show>
          </div>
        );
      }}
    </Show>
  );
};
