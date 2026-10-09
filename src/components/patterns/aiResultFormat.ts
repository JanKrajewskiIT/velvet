import type { JSX } from 'solid-js';

import { clamp } from '../../utils/math';
import type { AiScoreTone, AiSection } from './aiResultTypes';
import { plainText } from './plainText';

export const RING_SIZE = 64;
const SUCCESS_FRACTION = 0.75;
const WARNING_FRACTION = 0.5;

const defaultTone = (fraction: number): AiScoreTone =>
  fraction >= SUCCESS_FRACTION ? 'success' : fraction >= WARNING_FRACTION ? 'warning' : 'danger';

export const resolveScoreTone = (tone: AiScoreTone | undefined, score: number, max: number): AiScoreTone =>
  tone ?? defaultTone(clamp(score / max, 0, 1));

export interface AiPlainTextParts {
  headline?: JSX.Element;
  subline?: JSX.Element;
  summary?: JSX.Element;
  sections: AiSection[];
}

export const aiResultPlainText = (parts: AiPlainTextParts) =>
  [
    parts.headline,
    parts.subline,
    parts.summary,
    ...parts.sections.map(
      (section) => `${section.title}\n${section.items.map((item) => `• ${plainText(item)}`).join('\n')}`,
    ),
  ]
    .map(plainText)
    .filter(Boolean)
    .join('\n\n');
