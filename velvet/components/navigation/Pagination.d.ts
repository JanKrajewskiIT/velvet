import * as React from 'react';
/** Page navigation with truncation (1 … 4 5 6 … 20). Optional "1–20 of 243" range and rows-per-page select. compact = "Page 3 of 12" (auto under 640px for full). */
export interface PaginationProps {
  page?: number;
  defaultPage?: number;
  /** Or pass total + pageSize */
  pageCount?: number;
  onPageChange?: (page: number) => void;
  /** Pages either side of current. @default 1 */
  siblingCount?: number;
  /** Total rows — shows the range label */
  total?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  /** @default 'full' */
  variant?: 'full' | 'compact';
  className?: string;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
export declare function pageRange(page: number, count: number, siblings?: number): Array<number | '…'>;
