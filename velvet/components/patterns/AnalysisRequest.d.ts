import * as React from 'react';
export interface AnalysisSource {
  id: string;
  label: string;
  /** Picks the icon: cv · job · notes · transcript · profile · company · portfolio · other */
  kind?: 'cv' | 'job' | 'notes' | 'transcript' | 'profile' | 'company' | 'portfolio' | 'other';
  icon?: string;
  /** e.g. "Anna_Kowalska_CV.pdf · 2 pages" */
  detail?: React.ReactNode;
  /** @default 'ready' */
  status?: 'ready' | 'missing' | 'loading' | 'error';
  error?: string;
  /** Shows Add / Replace for missing / error sources */
  onAttach?: () => void;
}
export interface AnalysisType { id: string; label: string; description?: string; icon?: string; /** Source ids that must be included for this type */ requires?: string[] }
export interface AnalysisRunPayload { analysis: string; sources: string[]; instructions: string; depth: string }
/**
 * Compose and send an AI analysis request from several pieces of context — e.g. a CV, a job offer and recruiter notes.
 * Pick an analysis type (each can require sources), include / exclude sources, add free-text focus and depth, then Run.
 * Run is blocked with a reason ("Needs: Job offer") until requirements are met. onRun may return a Promise; set
 * status="running" + steps/step to show progress, then render <AtsAnalysisPanel> (or AiResultPanel) with the result.
 */
export interface AnalysisRequestProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  sources: AnalysisSource[];
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  analyses?: AnalysisType[];
  analysis?: string;
  defaultAnalysis?: string;
  onAnalysisChange?: (id: string) => void;
  instructions?: string;
  defaultInstructions?: string;
  onInstructionsChange?: (v: string) => void;
  instructionsPlaceholder?: string;
  depth?: string;
  /** @default 'standard' */
  defaultDepth?: string;
  onDepthChange?: (id: string) => void;
  /** @default quick · standard · deep */
  depths?: { id: string; label: string; hint?: string }[];
  /** @default 'idle' */
  status?: 'idle' | 'running';
  /** Progress labels while running, e.g. ['Reading CV', 'Matching requirements', 'Scoring'] */
  steps?: string[];
  /** Index of the current step */
  step?: number;
  error?: React.ReactNode;
  onRun?: (payload: AnalysisRunPayload) => void | Promise<void>;
  onCancel?: () => void;
  runLabel?: string;
  /** Provenance chip, e.g. "Claude · EU" */
  model?: string;
  /** Footer note, e.g. "≈ 4k tokens · 1 credit" */
  estimate?: React.ReactNode;
  className?: string;
}
export declare function AnalysisRequest(props: AnalysisRequestProps): JSX.Element;
