import { type Merge, merge, type Omit as OmittedProps, omit } from 'solid-js';

/** Resolves defaults for missing props and for props explicitly set to undefined. */
export const withDefaults = <Defaults extends object, Props extends object>(
  defaults: Defaults,
  props: Props,
): Merge<[Defaults, Props]> => {
  const provided = omit(props, (key) => Object.hasOwn(defaults, key) && props[key] === undefined);
  return merge(defaults, provided as Props);
};

export const partitionProps = <Props extends object, Key extends keyof Props>(
  props: Props,
  keys: readonly Key[],
): [Pick<Props, Key>, OmittedProps<Props, Key[]>] => {
  const local = new Set<PropertyKey>(keys);
  const selected = omit(props, (key) => !local.has(key)) as Pick<Props, Key>;
  const remaining = omit(props, ...keys);
  return [selected, remaining];
};
