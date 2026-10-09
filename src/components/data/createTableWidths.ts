import { type Accessor, createSignal } from 'solid-js';

const omitKey = (record: Record<string, number>, key: string): Record<string, number> =>
  Object.fromEntries(Object.entries(record).filter(([name]) => name !== key));

export interface TableWidths {
  widths: Accessor<Record<string, number>>;
  anyWidth: () => boolean;
  setWidth: (key: string, width: number) => void;
  resetWidth: (key: string) => void;
  resetWidths: () => void;
}

export const createTableWidths = (): TableWidths => {
  const [widths, setWidths] = createSignal<Record<string, number>>({});
  const anyWidth = () => Object.keys(widths()).length > 0;
  const setWidth = (key: string, width: number) => setWidths((x) => ({ ...x, [key]: width }));
  const resetWidth = (key: string) => setWidths((x) => omitKey(x, key));
  const resetWidths = () => setWidths({});
  return { widths, anyWidth, setWidth, resetWidth, resetWidths };
};
