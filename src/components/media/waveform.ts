const FNV_OFFSET = 2166136261;
const FNV_PRIME = 16777619;
const UINT32 = 4294967296;
const MIN_BAR_PEAK = 0.16;

/** Stable decorative amplitudes (0–1) derived from `seed`, shaped to swell in the middle. */
export const decorativeWaveform = (seed: string, count: number): number[] => {
  let hash = FNV_OFFSET;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), FNV_PRIME);
  const random = () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return (hash >>> 0) / UINT32;
  };
  let smoothed = 0.5;
  return Array.from({ length: count }, (_, i) => {
    smoothed = smoothed * 0.5 + random() * 0.5;
    return Math.min(1, MIN_BAR_PEAK + smoothed * (0.55 + 0.6 * Math.sin((i / count) * Math.PI)));
  });
};

/** `peaks` resampled to `count` bars. */
export const resamplePeaks = (peaks: readonly number[], count: number): number[] =>
  Array.from({ length: count }, (_, i) => peaks[Math.floor((i * peaks.length) / count)] ?? 0);
