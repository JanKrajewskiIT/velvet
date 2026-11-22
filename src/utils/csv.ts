export type CsvCell = string | number;

const FORMULA_PREFIX = /^(?:\s*[=+\-@＝＋－＠]|[\t\r\n])/u;

/** Prefixes formula-like text with an apostrophe so spreadsheets read it as text. */
export const neutralizeSpreadsheetFormula = (value: string): string =>
  FORMULA_PREFIX.test(value) ? `'${value}` : value;

const csvCell = (cell: CsvCell): string =>
  typeof cell === 'number' ? String(cell) : `"${neutralizeSpreadsheetFormula(cell).replaceAll('"', '""')}"`;

const csvLine = (cells: readonly CsvCell[]): string => cells.map(csvCell).join(',');

/** RFC 4180 CSV with CRLF line breaks: strings are quoted and formula-neutralized, numbers stay untouched. */
export const toCsvText = (rows: readonly (readonly CsvCell[])[], headers?: readonly string[]): string =>
  (headers ? [headers, ...rows] : rows).map(csvLine).join('\r\n');

/** Triggers a browser download of `blob` as `filename`. */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
