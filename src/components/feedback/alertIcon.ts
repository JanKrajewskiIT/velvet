import { type StatusTone, toneIcon } from '../../utils/tone';

/** Neutral messages read as plain information, so they use the info glyph rather than the notification bell. */
export const alertIcon = (tone: StatusTone): string => toneIcon(tone === 'neutral' ? 'info' : tone);

/** `undefined` selects the tone's glyph; `null` hides the icon. */
export const resolveAlertIcon = (icon: string | null | undefined, tone: StatusTone): string | null =>
  icon === undefined ? alertIcon(tone) : icon;
