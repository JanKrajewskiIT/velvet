import { batch } from 'solid-js';

import { reportAsyncError } from '../../utils/reportAsyncError';

export interface QuoteStore {
  get: (symbol: string) => number | undefined;
  set: (symbol: string, value: number) => void;
  setMany: (values: Readonly<Record<string, number>>) => void;
  subscribe: (symbol: string, listener: (value: number) => void) => () => void;
}

const checkQuote = (symbol: string, value: number): void => {
  if (typeof symbol !== 'string' || !Number.isFinite(value))
    throw new TypeError('Quotes require string symbols and finite numeric values.');
};

export const createQuoteStore = (initial: Readonly<Record<string, number>> = {}): QuoteStore => {
  const values = new Map<string, number>();
  const listeners = new Map<string, Set<(value: number) => void>>();
  const update = (entries: ReadonlyArray<readonly [string, number]>) => {
    entries.forEach(([symbol, value]) => checkQuote(symbol, value));
    const changed = entries.filter(([symbol, value]) => !Object.is(values.get(symbol), value));
    batch(() => {
      for (const [symbol, value] of changed) values.set(symbol, value);
      for (const [symbol, value] of changed) {
        const group = listeners.get(symbol);
        if (!group) continue;
        for (const listener of [...group]) {
          if (!Object.is(values.get(symbol), value)) break;
          if (!group.has(listener)) continue;
          try {
            listener(value);
          } catch (error) {
            reportAsyncError(error);
          }
        }
      }
    });
  };
  const setMany = (next: Readonly<Record<string, number>>) => update(Object.entries(next));
  setMany(initial);
  return {
    get: (symbol) => values.get(symbol),
    set: (symbol, value) => update([[symbol, value]]),
    setMany,
    subscribe: (symbol, listener) => {
      const group = listeners.get(symbol) ?? new Set();
      const subscription = (value: number) => listener(value);
      group.add(subscription);
      listeners.set(symbol, group);
      return () => {
        group.delete(subscription);
        if (!group.size && listeners.get(symbol) === group) listeners.delete(symbol);
      };
    },
  };
};
