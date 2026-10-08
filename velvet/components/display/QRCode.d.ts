import * as React from 'react';
/**
 * Scannable QR code generated in the browser (byte mode, UTF-8, versions 1–40, auto mask) — share links, 2FA setup, event tickets, payment requests.
 * Always dark modules on a white tile with a 4-module quiet zone, in both themes, so every scanner reads it. A centre logo bumps error correction to H.
 * Pair with a visible link or code: the image alone is not accessible.
 */
export interface QRCodeProps {
  /** Text or URL to encode */
  value: string;
  /** px. @default 160 */
  size?: number;
  /** Error correction: L 7% · M 15% · Q 25% · H 30%. @default 'M' ('H' with a logo) */
  level?: 'L' | 'M' | 'Q' | 'H';
  /** Quiet zone in modules. Keep ≥ 4 for print. @default 4 */
  margin?: number;
  /** Icon name or node centred on a white tile */
  logo?: string | React.ReactNode;
  /** Accessible name. @default 'QR code: ' + value */
  label?: string;
  className?: string;
}
export declare function QRCode(props: QRCodeProps): JSX.Element;
/** Encoder used by QRCode — returns the module matrix (true = dark) or null if the text is too long. */
export declare function encodeQR(text: string, level?: 'L' | 'M' | 'Q' | 'H'): boolean[][] | null;
