/**
 * Resolves the preferred `onValueChange` and its `onChange` alias into one callback.
 * The alias exists because the design system keeps both prop names; `onValueChange` wins when both are set.
 */
export const callbackAlias =
  <Args extends unknown[]>(
    preferred: () => ((...args: Args) => void) | undefined,
    alias: () => ((...args: Args) => void) | undefined,
  ) =>
  (...args: Args): void => {
    (preferred() ?? alias())?.(...args);
  };
