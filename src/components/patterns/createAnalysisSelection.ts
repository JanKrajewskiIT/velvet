import { type Accessor, createMemo, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { type AnalysisSource, type AnalysisType, sourceStatus } from './analysisSources';

export interface AnalysisSelectionInput {
  sources: AnalysisSource[];
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  analyses?: AnalysisType[];
  analysis?: string;
  defaultAnalysis?: string;
  onAnalysisChange?: (id: string) => void;
}

export interface AnalysisSelection {
  analyses: Accessor<AnalysisType[]>;
  analysis: Accessor<string | undefined>;
  setAnalysis: (id: string | undefined) => void;
  required: Accessor<string[]>;
  isIncluded: (id: string) => boolean;
  included: Accessor<AnalysisSource[]>;
  missing: Accessor<string[]>;
  blocked: Accessor<boolean>;
  toggle: (source: AnalysisSource) => void;
}

export const createAnalysisSelection = (input: AnalysisSelectionInput): AnalysisSelection => {
  const analyses = () => input.analyses ?? [];
  const [selected, setSelected] = createControllable<string[]>({
    value: () => input.selected,
    defaultValue: untrack(
      () =>
        input.defaultSelected ??
        input.sources.filter((source) => sourceStatus(source) !== 'missing').map((source) => source.id),
    ),
    onChange: (ids) => input.onSelectedChange?.(ids),
  });
  const [analysis, setAnalysis] = createControllable<string | undefined>({
    value: () => input.analysis,
    defaultValue: input.defaultAnalysis ?? analyses()[0]?.id,
    onChange: (id) => id !== undefined && input.onAnalysisChange?.(id),
  });

  const required = () => analyses().find((a) => a.id === analysis())?.requires ?? [];
  const isIncluded = (id: string) => {
    const source = input.sources.find((s) => s.id === id);
    return !!source && sourceStatus(source) === 'ready' && selected().includes(id);
  };
  const included = createMemo(() => input.sources.filter((source) => isIncluded(source.id)));
  const missing = createMemo(() =>
    required()
      .filter((id) => !isIncluded(id))
      .map((id) => input.sources.find((s) => s.id === id)?.label ?? id),
  );
  const blocked = () => missing().length > 0 || included().length === 0;

  const toggle = (source: AnalysisSource) => {
    if (sourceStatus(source) !== 'ready') return;
    setSelected(
      selected().includes(source.id) ? selected().filter((id) => id !== source.id) : [...selected(), source.id],
    );
  };

  return { analyses, analysis, setAnalysis, required, isIncluded, included, missing, blocked, toggle };
};
