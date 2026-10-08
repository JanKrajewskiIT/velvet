/** Narrows a string coming from a control to a member of its source set. */
export const isOneOf = <T extends string>(values: readonly T[], candidate: string): candidate is T =>
  values.some((value) => value === candidate);
