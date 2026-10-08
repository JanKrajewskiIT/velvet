export interface Hsv {
  /** Hue, degrees 0–360. */
  h: number;
  /** Saturation, 0–1. */
  s: number;
  /** Brightness (value), 0–1. */
  v: number;
}

const HEX_6 = /^[0-9a-f]{6}$/iu;
const HUE_SECTORS = 6;
const DEGREES_PER_SECTOR = 60;
const FULL_TURN = 360;
const BYTE = 255;

/** `"#8b0036"` / `"#abc"` → HSV, or `null` when it is not a hex colour. */
export const hexToHsv = (hex: string): Hsv | null => {
  let digits = (hex || '').replace('#', '');
  if (digits.length === 3)
    digits = Array.from(digits)
      .map((c) => c + c)
      .join('');
  if (!HEX_6.test(digits)) return null;
  const channel = (from: number) => parseInt(digits.slice(from, from + 2), 16) / BYTE;
  const r = channel(0);
  const g = channel(2);
  const b = channel(4);
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  let sector = 0;
  if (delta) {
    if (max === r) sector = ((g - b) / delta) % HUE_SECTORS;
    else if (max === g) sector = (b - r) / delta + 2;
    else sector = (r - g) / delta + 4;
  }
  return { h: (sector * DEGREES_PER_SECTOR + FULL_TURN) % FULL_TURN, s: max ? delta / max : 0, v: max };
};

/** HSV → lowercase `"#rrggbb"`. */
export const hsvToHex = ({ h, s, v }: Hsv): string => {
  const channel = (n: number) => {
    const k = (n + h / DEGREES_PER_SECTOR) % HUE_SECTORS;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return `#${[channel(5), channel(3), channel(1)]
    .map((x) =>
      Math.round(x * BYTE)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
