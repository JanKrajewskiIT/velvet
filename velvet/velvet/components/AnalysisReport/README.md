Result of a scored analysis — e.g. a submission checked against a brief: score ring with a band (≥86 Excellent · ≥71 Strong · ≥51 Partial · else Weak), verdict and summary, weighted category bars, keyword coverage (found / partial / missing), strengths against gaps, and recommendations sorted critical → warning → suggestion with optional evidence quotes. The footer offers copy as text, export, re-run and accuracy feedback.

Pair it with `AnalysisRequest` for the input side. Always pass `model` and `generatedAt` so people can see what produced the result; `bands` replaces the thresholds and labels. `status` is `done` (default), `loading` (with `steps` and `step`), `empty` or `error` (with `onRetry`).

**Props.** The full contract is `AnalysisReportProps` in `components/index.d.ts`.

- `result`: `ReportResult | null`
- `status`: `'empty' | 'loading' | 'done' | 'error'`
- `subject`, `target`: what was analysed and what it was compared with
- `bands`: `ScoreBand[]`; the same thresholds are exported as `SCORE_BANDS` and `scoreBand(score, bands?)`

**Built from: Badge, Button, CopyButton, Glyph, IconTile, Meter, ProgressRing, SectionLabel, Skeleton, SkeletonText, Tag.** **CSS:** `.vui-report*`. **Preview:** `components/AnalysisReport/preview.html` (group Patterns).
