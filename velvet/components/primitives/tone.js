// Shared tone vocabulary — one icon per status tone. Alert, Toast, NotificationCenter and patterns read this instead of keeping their own maps.
export const TONES = ['neutral', 'brand', 'info', 'success', 'warning', 'danger'];
export const TONE_ICON = { neutral: 'bell', brand: 'sparkles', info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'circle-x' };
export const toneIcon = (tone, fallback) => TONE_ICON[tone] || fallback || TONE_ICON.neutral;
