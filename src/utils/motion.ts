export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Browser-only: call from effects and event handlers. */
const prefersReducedMotion = (): boolean => window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** Browser-only: instant under `prefers-reduced-motion`. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');
