---
paths:
  - 'src/**/*.tsx'
---

> Type: Rule (normative constraints)
> Source of truth: Rules define mandatory constraints; skills define operational playbooks.

# DOM Hygiene

Keep the rendered tree as shallow as possible. Every `div`, `span`, `Fragment`, or `<Show>` must justify itself with real semantics, real state, or layout that cannot move onto the child.

## No Wrapper-Only Nodes

- Do not introduce a `div`/`span` whose sole purpose is to carry a class for a single child; move the class onto the child via its `class` prop
- Do not introduce a wrapper just to hold a `style={{ ... }}` on behalf of a single child; pass the style to the child directly or expose a CSS custom property on the child's class
- Do not introduce a wrapper for a trivial gap/flex row when the parent already controls that layout or when the child accepts the same class
- Drop the wrapper's CSS rule when the wrapper is removed; never leave orphaned `.module.css` classes
- When deleting a wrapper, transfer every meaningful style (including `display`, `gap`, `flex-*`) onto the child's merged class list -- do not silently lose layout

## Primitive Class Merging

- Prefer primitives with first-class style-extension props (`class`, `contentClass`, `frontClass`, `backClass`, `containerClass`) over wrapping them in a host `div`
- When a consumer repeatedly needs to style an internal part of a primitive, add a dedicated `*Class` prop to the primitive instead of growing an external wrapper
- New `*Class` props must merge with internal defaults through `classNames()`, never replace them silently
- Keep class extension props opt-in and additive so default appearance is unchanged

## Semantic Elements via `as` / `role`

- Do not wrap a primitive in a semantic element (`article`, `section`, `nav`, etc.) just to gain semantics; pass `as="article"` (or equivalent) to the primitive and push the semantic attributes (`draggable`, `role`, `aria-*`) onto it
- Do not add an outer wrapper purely to carry `role="search"`, `role="switch"`, or other ARIA roles when the already-rendered child is the correct role holder
- Shared primitive APIs should accept the semantic props they legitimately need (`as`, `role`, `draggable`, `aria-*`) so parents never have to wrap them

## Structural vs Presentational CSS in Primitives

- Primitives that use absolute positioning, flip/translate animations, or stacking contexts must split their CSS:
  - Structural layer (positioning, `transform`, `backface-visibility`, size constraints) stays unconditional
  - Presentational defaults (background, border, radius, shadow, padding) live in a separate default class that is only applied when no consumer-provided class is passed
- This lets consumers pass `frontClass`/`backClass` (or similar) to restyle faces without breaking animations or positioning
- Never let a host component override structural behavior through class injection; only presentational layers are overridable

## Conditional Rendering Discipline

- Do not wrap `<Dialog>` (or other components that already manage their own open/close through `showModal()`/`close()`) in an outer `<Show when={open}>`; gate open state through the component's own `open` prop
- Use `<Show fallback={...}>` to avoid rendering an otherwise-useless wrapper when the optional parts (label, description, icon) are absent; prefer rendering the single child directly in the fallback over an empty `div`
- When conditional branches produce the same child with slightly different wrappers, factor the child out into a local variable and switch the wrapper via `<Show fallback={...}>` -- do not duplicate JSX
- Reserve outer `<Show>` gates around heavy children only when the goal is genuine unmount (e.g. to unmount a virtualized tree), not merely visibility

## Examples of Acceptable Wrappers

Wrappers are allowed when they provide at least one of:

- Real semantics not already expressed by the child (landmark role, form grouping, list container)
- Layout that intentionally composes more than one child (flex row/column, grid container)
- State-bearing or focus-management behavior (focus traps, scroll containers, intersection roots)
- A reusable primitive contract (a `Field`, `Card`, `LabelText`, etc. that owns its own styles and state)

If none of the above applies, the wrapper is redundant and must be inlined into its child.
