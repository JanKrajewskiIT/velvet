# Export Coverage And Evidence Gaps

Status: **Not complete.** This is the required audit ledger before the specification can be approved. `src/index.ts` is the controlling source capability inventory; entries must be checked against the barrel, owning modules, styles, and available behavior evidence. Do not treat a family-level mention as complete behavioral coverage.

## Coverage Rule

For every source capability, record its user goal, semantic inputs/outputs, defaults that affect outcomes, state transitions, validation/error/loading/empty behavior, keyboard/pointer/accessibility behavior, persistence/network/navigation/DOM side effects, provenance and evidence status. Source prop/type/element names are traceability aids and need not be copied. Tests may be read as evidence but must not be changed without explicit authorization.

## Public Export Inventory

The name-level inventory is in [export-catalog.md](export-catalog.md) and has been reconciled line-by-line against restored `src/index.ts` at baseline 3.1.3. Generated declaration output is not present in the source tree and remains an authorized-build verification step.

The source-to-capability audit should be tracked against [acceptance-matrix.md](acceptance-matrix.md). Completion is based on behavior coverage, not reproducing legacy export names or signatures.

## Known Evidence Gaps

- `GAP-001`: Every root source export name is reconciled to the source inventory. Target names need not match under `USER-DEC-009`.
- `GAP-003`: All root token names and exact dark overrides are catalogued in `theme-tokens.md`. Exact primary brand colors/relationships are required by `USER-DEC-008`; other token values may improve.
- `GAP-004`: Dictionary leaf keys and placeholders are catalogued in `i18n-keys.md`. Locale detection, fallback and dictionary merge precedence are delegated to pinned `@jankrajewskiit/i18n` 2.0.9; `ACC-I18N-001` verifies the consumer-visible behavior without requiring a second implementation of that dependency.
- `GAP-005`: Shared auth context/config implementation is external. Keep the dependency baseline `@jankrajewskiit/auth ^2.0.7`; match user-facing authentication state and OIDC redirect outcomes, without requiring the replacement to expose the dependency's public API. OIDC edge behavior remains dependency-owned and is not independently verified.
- `GAP-007`: Reduced-motion rules are source-confirmed in 20 component stylesheets, but the full CSS-module audit is incomplete. This is a provenance limit rather than a target behavior gap: `AGENT-DEC-022` applies to the full replacement, with browser scenarios in `ACC-THEME-001` and `ACC-MEDIA-001`.
- `GAP-009`: Content policy is defined in `USER-DEC-002`/`AGENT-DEC-021`; sanitizer dependency remains unresolved in `ASSUMPTION-001`. Imported URLs/files remain untrusted; client accept filters are not security validation and consumers must validate uploads/destinations at trusted server boundaries.
- `GAP-012`: Source package identity, root/style entrypoints and build/CI/release workflow are described in `foundation.md`. The replacement must retain those distribution contracts; target release validation has not been run.
- `GAP-013`: The sanitizer dependency required by the accepted content-safety contract is not yet selected/authorized (`ASSUMPTION-001`). Package build/release validation is a separate deployment gate; generated source API declarations are not a compatibility requirement under `USER-DEC-009`.

## Confirmed Mappings

- `COVERED-001`: Async failure recovery is defined in `AGENT-DEC-005`, specialized by the overlay/domain requirements, and exercised by `ACC-ASYNC-001`; the in-workflow inline error, retained draft, pending reset and retry outcome are required.
- `COVERED-002`: Approved defect corrections map to `ACC-QUALITY-001` and their owning family scenarios: controls/forms (`ACC-FORM-002`), routing (`ACC-NAV-001`), date/time (`ACC-DATE-001`), tables (`ACC-DATA-001`), overlays (`ACC-OVERLAY-001`/`003`), tree (`ACC-WIDGET-005`), reduced motion (`ACC-THEME-001`/`ACC-MEDIA-001`).
- `COVERED-003`: Root source exports are reconciled in `export-catalog.md`; each export family is linked to its owning behavior spec and scenario group. Shared behavioral scenarios are intentional because target names and type aliases may differ.
- `COVERED-004`: Per user direction, creating or running tests is out of scope. `acceptance-matrix.md` is a requirements checklist, not a test-suite deliverable.
- `COVERED-005`: Previously ambiguous malformed/degenerate inputs now have explicit accepted outcomes in `AGENT-DEC-023`–`032`, linked from their owning capability specs and acceptance scenarios.

## Freeze Gate

The handoff can be marked **Approved** only when `ASSUMPTION-001` is resolved, all localization/token/security contracts have acceptance evidence, specs pass `.agents/skills/implementation-spec-authoring/references/review-checklist.md`, and the user approves the frozen spec version. Matching legacy export names or TypeScript signatures is not a gate under `USER-DEC-009`.