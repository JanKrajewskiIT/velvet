const MULTIPLIERS = [1, 2, 2.5, 5, 10] as const;

export const numericScale = (values: Iterable<number>, count = 4, includeZero = true) => {
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    if (Number.isFinite(value)) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  if (!Number.isFinite(min)) min = max = 0;
  if (includeZero) {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  const magnitude = Math.max(Math.abs(min), Math.abs(max)) || 1;
  const normalizedMin = min / magnitude;
  const normalizedMax = max / magnitude;
  const padding = includeZero ? 0 : (normalizedMax - normalizedMin) * 0.08 || Math.abs(normalizedMax) * 0.02 || 1;
  const lo = normalizedMin - padding;
  const hi = includeZero && max === min ? 1 : normalizedMax + padding;
  const raw = (hi - lo) / count;
  const unit = 10 ** Math.floor(Math.log10(raw));
  const step = MULTIPLIERS.map((value) => value * unit).find((value) => value >= raw) ?? unit * 10;
  const bottom = Math.floor(lo / step) * step;
  const top = Math.ceil(hi / step) * step;
  const ticks = Array.from({ length: Math.round((top - bottom) / step) + 1 }, (_, index) => {
    const normalized = bottom + index * step;
    const value = normalized * magnitude;
    return Number.isFinite(value) ? value : Math.sign(normalized) * Number.MAX_VALUE;
  });
  const position = (value: number) => (value / magnitude - bottom) / (top - bottom);
  return { ticks: [...new Set(ticks)], position };
};
