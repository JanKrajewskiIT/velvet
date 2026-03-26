import type { ComponentSize } from '~/models/Props';

const getInputSizeClass = (styles: Record<string, string>, size?: ComponentSize): string => {
  if (size === 'sm') return styles.sizeSm ?? '';
  if (size === 'lg') return styles.sizeLg ?? '';
  return styles.sizeMd ?? '';
};

export default getInputSizeClass;
