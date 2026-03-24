export type SpacingScale = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

const spacingTokenMap: Record<SpacingScale, string> = {
  '2xs': 'var(--spacing-2xs)',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  '3xl': 'var(--spacing-3xl)',
  '4xl': 'var(--spacing-4xl)',
};

const resolveSpacingToken = (gap: SpacingScale | undefined, fallback: SpacingScale = 'md'): string =>
  spacingTokenMap[gap ?? fallback];

export { resolveSpacingToken };
