import { type JSX } from '@solidjs/web';

export const columnName = (column: { readonly key: string; readonly label: JSX.Element }): string =>
  typeof column.label === 'string' ? column.label : column.key;
