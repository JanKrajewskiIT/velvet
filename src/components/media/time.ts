const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

/** `75` → `1:15`, `3725` → `1:02:05`. Non-finite or negative input reads as `0:00`. */
export const fmtTime = (seconds: number): string => {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const hours = Math.floor(total / SECONDS_PER_HOUR);
  const minutes = Math.floor((total % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const rest = String(total % SECONDS_PER_MINUTE).padStart(2, '0');
  return `${hours ? `${hours}:${String(minutes).padStart(2, '0')}` : minutes}:${rest}`;
};
