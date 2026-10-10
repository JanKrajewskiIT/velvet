import type { I18nKey } from '@jankrajewskiit/i18n';
import type { JSX } from 'solid-js';

import { freezeRecords } from '../../utils/freezeRecords';
import { englishText, type StaticTranslate } from './englishText';

export const KIND_ICON = {
  cv: 'file-text',
  job: 'briefcase',
  notes: 'message-square',
  transcript: 'mic',
  profile: 'id-card',
  company: 'building',
  portfolio: 'layers',
  other: 'paperclip',
} as const;

export type AnalysisSourceKind = keyof typeof KIND_ICON;

export type AnalysisSourceStatus = 'ready' | 'missing' | 'loading' | 'error';

export interface AnalysisSource {
  id: string;
  label: string;
  /** Picks the icon: cv · job · notes · transcript · profile · company · portfolio · other */
  kind?: AnalysisSourceKind;
  icon?: string;
  /** e.g. "Anna_Kowalska_CV.pdf · 2 pages" */
  detail?: JSX.Element;
  /** @default 'ready' */
  status?: AnalysisSourceStatus;
  error?: string;
  /** Shows Add / Replace for missing / error sources */
  onAttach?: () => void;
}

export interface AnalysisType {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  /** Source ids that must be included for this type */
  requires?: string[];
}

export interface AnalysisDepth {
  id: string;
  label: string;
  hint?: string;
}

export interface AnalysisRunPayload {
  analysis: string;
  sources: string[];
  instructions: string;
  depth: string;
}

const DEPTH_PRESETS: ReadonlyArray<{ id: string; labelKey: I18nKey; hintKey: I18nKey }> = [
  {
    id: 'quick',
    labelKey: 'velvet.patterns.analysisRequest.depths.quick.label',
    hintKey: 'velvet.patterns.analysisRequest.depths.quick.hint',
  },
  {
    id: 'standard',
    labelKey: 'velvet.patterns.analysisRequest.depths.standard.label',
    hintKey: 'velvet.patterns.analysisRequest.depths.standard.hint',
  },
  {
    id: 'deep',
    labelKey: 'velvet.patterns.analysisRequest.depths.deep.label',
    hintKey: 'velvet.patterns.analysisRequest.depths.deep.hint',
  },
];

export const localizeAnalysisDepths = (translate: StaticTranslate): AnalysisDepth[] =>
  DEPTH_PRESETS.map((preset) => ({
    id: preset.id,
    label: translate(preset.labelKey),
    hint: translate(preset.hintKey),
  }));

/** English snapshot; `AnalysisRequest` localizes its own default. */
export const DEFAULT_ANALYSIS_DEPTHS: readonly Readonly<AnalysisDepth>[] = freezeRecords(
  localizeAnalysisDepths(englishText),
);

export const sourceStatus = (source: AnalysisSource): AnalysisSourceStatus => source.status ?? 'ready';
