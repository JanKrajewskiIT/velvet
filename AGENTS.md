# VelvetUi

SolidJS UI component library: `@jankrajewskiit/ui`. TypeScript, CSS Modules, Vite.
Peers: `solid-js >=1.9`, `@solidjs/router >=0.15`.

## Commands

`npm run verify` (typecheck + lint + build + test), `npm run build`, `npm run lint:fix`, `npm run format`, `npm test`

## Git

Branch from `main`, conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`). CI publishes on push to `main`.

## Structure

`src/components/{category}/` (9 categories, 58+ components), `src/hooks/`, `src/models/Props.ts`, `src/theme/`, `src/utils/`, `src/index.ts`, `config/`, `demo/`

## Principles

- Generic, app-agnostic -- no auth/app/data-fetching/business workflows in core components
- Built-in generic copy belongs in VelvetUi i18n -- do not push all text to props by default
- Prefer text resolution order: semantic prop override when justified -> `messages` override -> built-in `useI18n()` default
- When a reusable component needs new built-in copy, add the key to `src/i18n/messages.ts` instead of leaving hardcoded user-facing strings in component logic
- Self-documenting -- no comments, no commented-out code, no `eslint-disable`
- Always use `~/` path alias for hooks, utils, models -- never deep relative paths
- Use `Props<T>` from `src/models/Props.ts` as the base public contract (`class`, `id`, `aria-*`, `data-*`)
- For field-like components reuse ARIA contracts from `src/models/Props.ts` (`AriaLabelingProps`, `AriaValidationProps`, `AriaFieldProps`) instead of redefining local `aria-*` props
- Merge generated and external ARIA id refs (`aria-labelledby`, `aria-describedby`) with `joinAriaIds()` from `src/utils/aria`
- Derive validation ARIA with shared helpers from `src/utils/aria` (`resolveAriaInvalid`, `resolveAriaErrorMessage`) to keep defaults consistent
- Reuse shared core native prop subsets from `src/models/Props.ts` (`ButtonCoreNativeProps`, `InputCoreNativeProps`, `TextAreaCoreNativeProps`, `SelectCoreNativeProps`, `ChoiceInputCoreNativeProps`, `SliderCoreNativeProps`, `TableHeaderCoreNativeProps`, `TableCellCoreNativeProps`)
- Never expose full `JSX.*HTMLAttributes` on public component props; use narrow core subsets + explicit semantic props
- Keep `name` local to form-like controls only; do not add it as a universal base prop
- Use `classNames()` utility for conditional class composition -- never template literal concatenation for multi-condition classes
- Use VelvetUi primitives (Heading, Text, Button, IconButton, ButtonBase, Input, TextArea) -- never raw HTML equivalents
- Prefer extending existing primitives over wrapper-only components. If a wrapper adds no unique behavior/API, use the primitive directly
- For reusable list/dropdown ecosystems, keep one primitive per role (e.g. one option primitive, one surface primitive) instead of parallel variants
- Semantic text APIs should prefer dedicated props (e.g. `label`) over arbitrary `children` when the component contract is label-driven
- For label-driven components, prefer `label`/`message` string props and block free-form text slots with `children?: never` when possible
- Use shared label contracts from `src/models/Props.ts` (`LabelOnlyProps`, `OptionalLabelOnlyProps`) instead of redefining equivalent local types
- Prefer `label` over `title` for component-level semantic labels (actions, item headers, section headers); reserve `title` for domain data where it is the actual model field
- Label/description rendering should reuse `LabelText` instead of duplicating inline `Text` blocks
- Label props should render through VelvetUi typography primitives (`Text`/`Heading`) with explicit `variant` and `tone`
- Do not leave user-facing fallback strings in component code when an equivalent `messages.ts` key already exists or should exist
- Style prop must use object syntax `style={{ key: value }}` -- never string syntax (enforced by `solid/style-prop` lint rule)
- Dynamic values go through CSS custom properties (`style={{ '--my-var': value }}` + `var(--my-var)` in `.module.css`) -- never direct inline CSS for what CSS can handle
- Static styles belong in `.module.css` -- inline style only for truly dynamic runtime values (virtualization, user dimensions, DOM measurements)
- `class`/`classList` on primitives is allowed only for layout/composition (positioning, sizing, spacing, flex/grid, alignment, overflow)
- Do not skin primitives from host component classes (no typography/color/background/border/shadow/radius overrides on Text/Heading/CodeText/Button/IconButton/Input/TextArea)
- Visual semantics of primitives must come from primitive API (`variant`/`tone`/`size`/state props). Add or extend primitive props instead of local visual overrides
- If one shared primitive is used in multiple components (e.g. media navigation controls), keep its visual style in the shared primitive module; parent components should only position/place it
- Shared primitive styles should live with that primitive in its own directory/module file (avoid "base catch-all" CSS files)
- Prefer `ComponentName.tsx` + `ComponentName.module.css` pairs; avoid standalone `*.module.css` without a corresponding component
- Exception: shared primitive style modules can stay standalone when reused across different element types (e.g. button/select/input/div)
- Do not use `composes` in `*.module.css`; reuse shared styles by importing the primitive/component styles in TSX and combining classes with `classNames()`
- Base primitives and shared surfaces stay visually neutral by default -- no gradients, glow, hover lift, scale, or translate motion in default variants
- `Card` is a basic primitive: background, border, radius, subtle shadow; hoverable/elevated/spotlit cards must be explicit separate components or opt-in variants
- Only add motion-heavy or spotlight styling to components whose job is explicitly promotional, directional, or high-emphasis
- Wrapper components are valid when they provide real semantic API/default behavior/state (not only style pass-through)
- Demo app uses only library components and design tokens -- no inline styles, all layout via `demo.css` utility classes
- Demo should showcase built-in component defaults first; only pass text overrides when the point of the example is customization
- When migrating from `children`/`title` to `label` APIs, update library + demo usage and add lint restrictions for deprecated JSX usage where practical
- When extracting code from an app into VelvetUi, prefer reusable patterns and renamed generic contracts over copying business flows 1:1
- If an extracted component still reads as domain-specific, either generalize it before export or treat it as a template/business-layer component instead of a base primitive
