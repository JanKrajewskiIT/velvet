import { type Accessor, createEffect, createSignal, getOwner, onCleanup } from 'solid-js';

import type { QuoteStore } from './quoteStore';

export type QuoteSource<T> = T | Accessor<T>;
const resolve = <T>(source: QuoteSource<T>): T => (typeof source === 'function' ? (source as Accessor<T>)() : source);

/** Solid accessor; pass accessors when the store, symbol or fallback may change. */
export const useQuote = (
  store: QuoteSource<QuoteStore | undefined>,
  symbol: QuoteSource<string | undefined>,
  fallback?: QuoteSource<number | null | undefined>,
): Accessor<number | null | undefined> => {
  if (!getOwner()) throw new Error('useQuote requires a Solid owner.');
  const read = () => {
    const source = resolve(store);
    const key = resolve(symbol);
    return { source, key, value: source && key !== undefined ? source.get(key) : undefined };
  };
  const [snapshot, setSnapshot] = createSignal(read());
  createEffect(() => {
    const next = read();
    setSnapshot(next);
    if (!next.source || next.key === undefined) return;
    let active = true;
    const unsubscribe = next.source.subscribe(next.key, (value) => {
      if (active && resolve(store) === next.source && resolve(symbol) === next.key) setSnapshot({ ...next, value });
    });
    onCleanup(() => {
      active = false;
      unsubscribe();
    });
  });
  return () => {
    const previous = snapshot();
    const source = resolve(store);
    const key = resolve(symbol);
    const value =
      source === previous.source && key === previous.key
        ? previous.value
        : source && key !== undefined
          ? source.get(key)
          : undefined;
    return value ?? resolve(fallback);
  };
};
