import type { I18nKey } from '@jankrajewskiit/i18n';
import type { JSX } from 'solid-js';

import { freezeRecords } from '../../utils/freezeRecords';
import { clamp } from '../../utils/math';
import { englishText, type StaticTranslate } from './englishText';

export const SEVERITY_ORDER = ['critical', 'warning', 'suggestion'] as const;

export type AtsSeverity = (typeof SEVERITY_ORDER)[number];

export interface AtsCategory {
  label: string;
  /** 0–100; non-finite → 0 */
  score: number;
  /** Shown as ×weight */
  weight?: number;
  note?: JSX.Element;
}

export interface AtsRecommendation {
  severity: AtsSeverity;
  title: JSX.Element;
  message?: JSX.Element;
  /** Quote from the source that supports the finding */
  evidence?: { quote: string; source?: string };
}

export interface AtsResult {
  /** Overall 0–100 */
  score: number;
  /** One-line headline, e.g. "Strong on systems work, light on people leadership" */
  verdict?: JSX.Element;
  summary?: JSX.Element;
  categories?: AtsCategory[];
  keywords?: { matched?: string[]; partial?: string[]; missing?: string[] };
  strengths?: JSX.Element[];
  gaps?: JSX.Element[];
  recommendations?: AtsRecommendation[];
}

export interface ScoreBand {
  min: number;
  label: string;
  short: string;
  tone: 'success' | 'brand' | 'warning' | 'danger';
}

interface ScoreBandPreset {
  min: number;
  labelKey: I18nKey;
  shortKey: I18nKey;
  tone: ScoreBand['tone'];
}

const WEAK_PRESET: ScoreBandPreset = {
  min: 0,
  labelKey: 'velvet.patterns.atsAnalysis.bands.weak.label',
  shortKey: 'velvet.patterns.atsAnalysis.bands.weak.short',
  tone: 'danger',
};

const BAND_PRESETS: readonly ScoreBandPreset[] = [
  {
    min: 86,
    labelKey: 'velvet.patterns.atsAnalysis.bands.excellent.label',
    shortKey: 'velvet.patterns.atsAnalysis.bands.excellent.short',
    tone: 'success',
  },
  {
    min: 71,
    labelKey: 'velvet.patterns.atsAnalysis.bands.strong.label',
    shortKey: 'velvet.patterns.atsAnalysis.bands.strong.short',
    tone: 'brand',
  },
  {
    min: 51,
    labelKey: 'velvet.patterns.atsAnalysis.bands.partial.label',
    shortKey: 'velvet.patterns.atsAnalysis.bands.partial.short',
    tone: 'warning',
  },
  WEAK_PRESET,
];

const bandFrom = (translate: StaticTranslate, preset: ScoreBandPreset): ScoreBand => ({
  min: preset.min,
  label: translate(preset.labelKey),
  short: translate(preset.shortKey),
  tone: preset.tone,
});

const LOWEST_BAND: Readonly<ScoreBand> = Object.freeze(bandFrom(englishText, WEAK_PRESET));

export const localizeScoreBands = (translate: StaticTranslate): ScoreBand[] =>
  BAND_PRESETS.map((preset) => bandFrom(translate, preset));

/** English snapshot; `AtsAnalysisPanel` localizes its own default. */
export const SCORE_BANDS: readonly Readonly<ScoreBand>[] = freezeRecords(localizeScoreBands(englishText));

export const MAX_SCORE = 100;

export const clampScore = (score: number): number => (Number.isFinite(score) ? clamp(score, 0, MAX_SCORE) : 0);

export const scoreBand = (score: number, bands: readonly ScoreBand[] = SCORE_BANDS): Readonly<ScoreBand> =>
  bands.find((band) => clampScore(score) >= band.min) ?? bands[bands.length - 1] ?? LOWEST_BAND;

export const SEVERITY: Record<
  AtsSeverity,
  { labelKey: I18nKey; tallyKey: I18nKey; icon: string; tone: 'danger' | 'warning' | 'info' }
> = {
  critical: {
    labelKey: 'velvet.patterns.atsAnalysis.severity.critical.label',
    tallyKey: 'velvet.patterns.atsAnalysis.severity.critical.tally',
    icon: 'alert-circle',
    tone: 'danger',
  },
  warning: {
    labelKey: 'velvet.patterns.atsAnalysis.severity.warning.label',
    tallyKey: 'velvet.patterns.atsAnalysis.severity.warning.tally',
    icon: 'triangle-alert',
    tone: 'warning',
  },
  suggestion: {
    labelKey: 'velvet.patterns.atsAnalysis.severity.suggestion.label',
    tallyKey: 'velvet.patterns.atsAnalysis.severity.suggestion.tally',
    icon: 'sparkles',
    tone: 'info',
  },
};

export const VISIBLE_RECOMMENDATIONS = 4;
