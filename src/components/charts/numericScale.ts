const MULTIPLIERS = [1, 2, 2.5, 5, 10] as const;

export const numericScale = (values: Iterable<number>, count = 4) => {
  let min = 0;
  let max = 0;
  for (const value of values) {
    if (Number.isFinite(value)) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  const magnitude = Math.max(Math.abs(min), Math.abs(max)) || 1;
  const lo = min / magnitude;
  const hi = max === min ? 1 : max / magnitude;
  const raw = (hi - lo) / count;
  const unit = 10 ** Math.floor(Math.log10(raw));
  const step = MULTIPLIERS.map((value) => value * unit).find((value) => value >= raw) ?? unit * 10;
  const bottom = Math.floor(lo / step) * step;
  const top = Math.ceil(hi / step) * step;
  const ticks = Array.from({ length: Math.round((top - bottom) / step) + 1 }, (_, index) => {
    const normalized = +(bottom + index * step).toFixed(12);
    const value = normalized * magnitude;
    return Number.isFinite(value) ? value : Math.sign(normalized) * Number.MAX_VALUE;
  });
  const position = (value: number) => (value / magnitude - bottom) / (top - bottom);
  return { ticks: [...new Set(ticks)], position };
};
