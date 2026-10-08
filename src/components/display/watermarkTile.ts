const ESCAPES: Readonly<Record<string, string>> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const AVERAGE_GLYPH_WIDTH_EM = 0.62;
const LINE_HEIGHT_EM = 1.4;
const BASELINE_EM = 0.72;

const escapeXml = (text: string): string => text.replace(/[&<>"]/gu, (char) => ESCAPES[char] ?? char);

export interface WatermarkTileOptions {
  lines: readonly string[];
  rotate: number;
  gap: readonly [number, number];
  fontSize: number;
  fontWeight: number;
}

export interface WatermarkTile {
  /** CSS `url("data:image/svg+xml,…")` value of one repeating stamp. */
  image: string;
  /** CSS size of one tile, e.g. `"214px 106px"`. */
  size: string;
}

/** One repeating, rotated text stamp as an SVG data URL. Text is XML-escaped; numbers come from typed props. */
export const buildWatermarkTile = (options: WatermarkTileOptions): WatermarkTile => {
  const { lines, rotate, gap, fontSize, fontWeight } = options;
  const textWidth = Math.max(0, ...lines.map((line) => line.length)) * fontSize * AVERAGE_GLYPH_WIDTH_EM;
  const lineHeight = fontSize * LINE_HEIGHT_EM;
  const textHeight = lines.length * lineHeight;
  const width = Math.ceil(textWidth + gap[0]);
  const height = Math.ceil(textHeight + gap[1]);
  const texts = lines
    .map(
      (line, index) =>
        `<text x="${width / 2}" y="${height / 2 - textHeight / 2 + lineHeight * (index + BASELINE_EM)}">${escapeXml(line)}</text>`,
    )
    .join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<g transform="rotate(${rotate} ${width / 2} ${height / 2})" font-family="Hanken Grotesk, system-ui, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="middle">` +
    `${texts}</g></svg>`;
  return { image: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, size: `${width}px ${height}px` };
};
