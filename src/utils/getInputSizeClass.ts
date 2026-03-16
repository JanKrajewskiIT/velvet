type InputSize = 'sm' | 'md' | 'lg' | undefined;

const getInputSizeClass = (styles: Record<string, string>, size?: InputSize): string => {
  if (size === 'sm') return styles.sizeSm ?? '';
  if (size === 'lg') return styles.sizeLg ?? '';
  return styles.sizeMd ?? '';
};

export default getInputSizeClass;
