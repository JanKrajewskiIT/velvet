export const TONES = ['neutral', 'brand', 'info', 'success', 'warning', 'danger'] as const;

export type StatusTone = (typeof TONES)[number];

export const CATEGORY_TONES = ['blue', 'indigo', 'violet', 'magenta', 'teal', 'cyan', 'olive', 'slate'] as const;

export type Tone = StatusTone | (typeof CATEGORY_TONES)[number];

export const TONE_ICON: Record<StatusTone, string> = {
  neutral: 'bell',
  brand: 'sparkles',
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-x',
};

export const toneIcon = (tone: StatusTone | undefined, fallback?: string): string =>
  (tone && TONE_ICON[tone]) || fallback || TONE_ICON.neutral;
