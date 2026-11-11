Compose and send an AI analysis request from several pieces of context — e.g. a proposal, a brief and reviewer notes. Pick an analysis type (each can require sources), include / exclude sources, add free-text focus and depth, then Run. Run is blocked with a reason ("Needs: Brief") until requirements are met. onRun may return a Promise; set status="running" + steps/step to show progress, then render <AnalysisReport> (or AiResultPanel) with the result.

**Props.** The full contract is `AnalysisRequestProps` in `components/index.d.ts`.

- …and 13 more in `components/index.d.ts`.

**Built from:** Checkmark, Button, Glyph, IconTile, Spinner. **CSS:** `.vui-areq*`. **Preview:** `components/AnalysisRequest/preview.html` (group Patterns).
