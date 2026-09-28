# VelvetUi Clean-Room Specification

Status: **Approved/Frozen; implementation-authorizing handoff.** This specification describes the approved rebuild boundary and source-backed behavior. The rebuilding agent may implement from these documents without reopening the old source. Release validation remains an implementation task.

## Outcome

Rebuild the full VelvetUi functionality with cleaner SolidJS code. Preserve observable outcomes, data meaning, states, accessibility, integrations, localization meaning, and the approved brand colors. The public API may be redesigned: component/type/export names, prop names/shapes, and callback names may differ. This is a clean-room behavior specification, not a drop-in package compatibility contract.

## Scope And Boundaries

- `USER-001`: Cover the complete public library, not a subset.
- `USER-002`: Keep SolidJS; public component/type/export names, prop names/shapes, and callback names may be redesigned as long as specified functionality and data outcomes remain equivalent.
- `SOURCE-001`: Behavioral baseline inspected for this draft is commit `36306ba` (package `@jankrajewskiit/ui` version `3.1.3`). Package is ESM and exposes `.` with JS/types and `./styles` with CSS/types. Rebuild must freeze one exact baseline commit before approval; do not infer from a mutable branch.
- `SOURCE-002`: SolidJS is a peer dependency; optional integrations include Solid Router, OIDC auth, Solid Icons, and Solid Markdown. Required runtime dependencies include the shared auth/i18n packages and `remark-gfm`.
- `SOURCE-003`: Legacy source exports are defined by `src/index.ts`, including components, types, helpers, providers, hooks, dictionaries and utilities. That file is the authoritative capability inventory for the source baseline; replacement names may differ.
- `SOURCE-004`: Source CSS is packaged as a side effect and exposed through `./styles`. Preserve the package identity and documented root/style entrypoints so existing package consumers can adopt the rebuild; component/type/export names within those entrypoints may differ.
- In scope: public props/types/callbacks, state ownership, user-visible transitions, keyboard and pointer interaction, accessibility semantics, localization, persistence, integration behavior, global CSS/theme behavior, error/loading/empty states, and package entry points.
- Out of scope: matching source symbol/export/prop/callback names, private source layout, helper names, internal algorithms where outputs are equivalent, CSS-module class names, and unobservable state representation.
- Visual pixel parity is not a requirement. Per `USER-DEC-001` and `AGENT-DEC-008`, preserve semantic CSS token names/roles and a separately consumable stylesheet while allowing component variant spelling and non-brand values/layout to improve. Keep package identity and root/style entrypoints; preserve the exact primary brand palette per `USER-DEC-008`.

## Provenance

Requirement IDs use `SOURCE`, `USER`, `AGENT`, or `ASSUMPTION`. Source-backed requirements refer to executable code/configuration named in the thematic specs. `USER` records decisions explicitly confirmed for this task. `AGENT` is a proposal unless it appears under Accepted Agent Refinements in `open-decisions.md`; those refinements implement the user's approved quality direction. Unsupported behavior remains an explicit assumption; do not infer it.

## Specs And Dependency Order

| Order | Specification | Primary outcome | Depends on |
|---|---|---|---|
| 1 | [Foundation and package](foundation.md) | Package, providers, theme, localization, auth, shared types/utilities | none |
| 2 | [Primitives and forms](primitives-forms.md) | Buttons, typography, surfaces, form primitives, inputs, choice controls | foundation |
| 3 | [Composite widgets](composite-widgets.md) | Menus, selection widgets, keyboard/focus contracts | foundation, primitives |
| 4 | [Overlays and feedback](overlays-feedback.md) | Dialogs, popovers, notifications, status and loading states | foundation, primitives |
| 5 | [Navigation and media](navigation-media.md) | Navigation, responsive patterns, image/media interactions | foundation, primitives, overlays |
| 6 | [Date/time and scheduling](datetime-scheduling.md) | Date/time controls, calendar event utilities, scheduler | foundation, composite widgets, overlays |
| 7 | [Data display](data-display.md) | Lists, trees, timelines, tables, charts | foundation, primitives, composite widgets |
| 8 | [Domain composites](domain-composites.md) | Markdown/code, import, AI/analysis, kanban, flashcard and comparison flows | foundation, primitives, overlays, data display |
| 9 | [Coverage and decisions](coverage.md) | Export-to-spec traceability and remaining evidence | all specs |
| 10 | [Acceptance matrix](acceptance-matrix.md) | Black-box scenarios for replacement behavior | all specs |

The manually transcribed [source export catalog](export-catalog.md) maps old source names to behavior; replacement names are not constrained. `coverage.md` records behavior capabilities still needing completion or evidence.
The complete source dictionary messages/placeholders are in [i18n-keys.md](i18n-keys.md); the semantic CSS custom property names are in [theme-tokens.md](theme-tokens.md). Translation-key names may change with the replacement API; message meaning/interpolation data must remain.

## Shared Acceptance Criteria

- `USER-ACC-001`: Every legacy source export maps to a required capability; replacement names, prop shapes, callback names and payload structures may differ. SolidJS remains required.
- `AGENT-ACC-002`: Every capability specifies meaningful inputs/outputs, state transitions, validation/errors, accessibility and edge cases. Source object/property names are evidence, not target contracts.
- `AGENT-ACC-003`: Acceptance scenarios verify user-visible behavior against the replacement's own documented API; they do not assert old symbol names, DOM depth, or private selectors.
- `SOURCE-ACC-004`: Preserve evidenced persistence semantics, local date model, primary brand palette, locale/theme behavior, auth redirect outcomes, toast effects and integration results.
- `AGENT-ACC-005`: Correct security/accessibility defects only as documented in accepted refinements; use `isomorphic-dompurify` with the approved allowlist and URL protocol policy before rendering/emitting rich text.
- `AGENT-ACC-006`: The specs plus approved implementation dependencies are sufficient without the old source. Do not use the archived/source implementation as an additional design contract.
- `AGENT-ACC-007`: Legacy object/property names in code font are source evidence unless a line is explicitly marked as a fixed format, persistence key, CSS token, or data protocol.

## Handoff Rule

The rebuilding agent must not inspect or rely on the old source after this specification is explicitly approved and frozen by the user. Before approval, source remains the evidence authority and gaps must be resolved. Do not delete, overwrite, or archive the current implementation as part of this specification work.