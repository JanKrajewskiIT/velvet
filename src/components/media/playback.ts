export interface PlaybackState {
  playing: boolean;
  time: number;
  duration: number;
}

export const readPlayback = (media: HTMLMediaElement): PlaybackState => ({
  playing: !media.paused && !media.ended,
  time: media.currentTime,
  duration: media.duration || 0,
});

/** Starts or pauses. A play request interrupted by a pause is an `AbortError` (cancellation, not failure); other rejections go to `onError`. */
export const togglePlayback = (media: HTMLMediaElement, onError?: (error: unknown) => void): void => {
  if (!media.paused && !media.ended) {
    media.pause();
    return;
  }
  media.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    onError?.(error);
  });
};

export const seekMedia = (media: HTMLMediaElement, seconds: number): void => {
  if (!media.duration) return;
  media.currentTime = Math.max(0, Math.min(media.duration, seconds));
};

/** The rate after `current` in `rates`, wrapping; the first rate when `current` is not listed. */
export const nextRate = (rates: readonly number[], current: number): number => {
  const next = rates[(rates.indexOf(current) + 1) % rates.length];
  return next ?? current;
};

export const rateLabel = (rate: number, locale: string): string => `${new Intl.NumberFormat(locale).format(rate)}×`;
