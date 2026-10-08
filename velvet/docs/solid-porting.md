# Porting the React reference → SolidJS

The reference components (`components/**/<Name>.jsx`) are React. Output is idiomatic Solid + TypeScript with **identical DOM, class names and attributes**, so `styles.css` works untouched.

## Translation table
| React | Solid |
|---|---|
| `className` (prop and attribute) | `class`; conditional classes via `cx(...)` (ported helper) or `classList` |
| `htmlFor` | `for` |
| `useState(x)` | `const [v, setV] = createSignal(x)`, read as `v()` |
| `useMemo` | `createMemo` |
| `useEffect(fn, [])` | `onMount` (+ `onCleanup`) |
| `useEffect(fn, [deps])` | `createEffect(on(deps, fn, { defer: true }))` (or plain `createEffect` if it should run initially) |
| `useLayoutEffect` | `createRenderEffect` / `onMount` (both run before paint for measuring) |
| `useRef` (DOM) | `let el!: HTMLElement` + `ref={el}` (or a signal: `ref={setEl}`) |
| `useRef` (mutable value) | plain `let x = …` in the component body |
| `useId` | `createUniqueId()` |
| `useContext` / Provider | `createContext` / `useContext` |
| `cond && <X/>`, ternary | `<Show when={cond} fallback={…}>` |
| `arr.map(...)` | `<For each={arr}>` (`<Index>` for primitive arrays) |
| switch chains | `<Switch><Match when=…>` |
| `children` read more than once | `const c = children(() => props.children)` |
| `{...rest}` | `const [local, rest] = splitProps(props, [...])`, then `<el {...rest}/>` |
| defaults in destructuring | `mergeProps({ variant: 'primary', size: 'md' }, props)` |
| `React.ReactNode` | `JSX.Element` |
| `React.ButtonHTMLAttributes<T>` etc. | `JSX.ButtonHTMLAttributes<T>` etc. |
| `style={{ minWidth: 4 }}` | `style={{ 'min-width': '4px' }}` (kebab keys, units explicit) |
| `ReactDOM.createPortal(x, document.body)` | `<Portal>{x}</Portal>` |
| `key=` | drop it (`<For>` tracks by reference) |
| `forwardRef` | accept `ref` in props and pass it on: `<button ref={local.ref}>` |

## Rules
1. **Never destructure props**, not in the signature and not in the body.
2. Defaults via `mergeProps`. Derived values as functions or `createMemo`.
3. **Controlled / uncontrolled** (used by nearly every input): the reference pattern is
   `value === undefined ? inner : value`, and on change `if (value === undefined) setInner(x); onValueChange?.(x)` (with `onChange` as an alias). Port it once as a helper:
   ```ts
   export function createControllable<T>(o: { value: () => T | undefined; defaultValue: T; onChange?: (v: T) => void }) {
     const [inner, setInner] = createSignal<T>(o.defaultValue);
     const get = () => (o.value() !== undefined ? (o.value() as T) : inner());
     const set = (v: T) => { if (o.value() === undefined) setInner(() => v); o.onChange?.(v); };
     return [get, set] as const;
   }
   // usage: createControllable({ value: () => props.value, defaultValue: props.defaultValue ?? null, onChange: (v) => (props.onValueChange ?? props.onChange)?.(v) })
   ```
4. Don't wrap handlers in effects. Cleanup only in `onCleanup`.
5. Compose other DS components. Never copy their markup. Port deps first (`docs/components.md`).
6. A11y parity: copy every role, `aria-*`, `tabIndex`, key handler, focus move, focus trap/return and `aria-live` from the `.jsx`.
7. Types: translate the `.d.ts` 1:1, keep JSDoc + `@default`, rename `className` → `class`, extend `ParentProps` when the component takes children.
8. No CSS imports per component and no CSS-in-JS. The global `styles.css` already contains every component's CSS.

## Helpers (port these first, same file names, `.ts`)
| Reference | Solid port |
|---|---|
| `primitives/cx.js` | same function (class joiner) |
| `primitives/date.js` | same pure functions (`DAY_MS`, `pad`, `sameDay`, `startOfDay`, `addDays`, `addMonths`, `minutesOfDay`, `toDate`, `ymd`, `weekdayNames`, `fmtDate`) |
| `primitives/tone.js` | same constants (`TONES`, `TONE_ICON`, `toneIcon`) |
| `primitives/useDismiss.js` `useDismiss(open, onDismiss, ref, opts)` | `createDismiss(open: Accessor<boolean>, onDismiss, el: () => HTMLElement \| undefined, opts)`: inside `createEffect`, when `open()` is true add `mousedown` (outside) and `keydown` (Escape) listeners and remove them in `onCleanup`. Keep the `refocus` selector behaviour and the `(false, 'outside' \| 'escape')` call signature. |
| `charts/useSize.js` `useWidth(initial)` | `createWidth(initial)` → `[setRef, width]` with a `ResizeObserver` disconnected in `onCleanup`. `niceTicks`, `compact` are pure: copy them. |
| `media/time.js` | pure, copy |
| `display/recron-logo-paths.js` | data, copy |

## Patterns that need care
- **Trigger cloning** (`Menu`, `Popover`, `ConfirmAction`): React does `cloneElement(trigger, { onClick, onKeyDown, 'aria-expanded', … })`. Inject **every** prop the reference injects (e.g. `Menu` also opens on ArrowDown/ArrowUp). Solid elements are real DOM nodes, so resolve the trigger and wire it imperatively:
  ```tsx
  const t = children(() => props.trigger);
  createEffect(() => {
    const el = t() as unknown as HTMLElement;
    if (!(el instanceof HTMLElement)) return;           // string → render the reference fallback <Button> instead
    el.setAttribute('aria-haspopup', 'menu');
    el.setAttribute('aria-expanded', String(open()));
    el.setAttribute('aria-controls', id);
    const onClick = () => setOpen(!open());
    el.addEventListener('click', onClick); onCleanup(() => el.removeEventListener('click', onClick));
  });
  ```
  The trigger's own `onClick` still fires because it is a separate listener. Keep each reference fallback for a non-element trigger: `Menu` and `ConfirmAction` render `<Button variant="secondary">`, `Popover` renders a plain `<button type="button">`.
- **Prop injection into children** (`ButtonGroup` passes `size` to each child Button): use a context (`ButtonGroupContext`), and have `Button` read `useContext(ButtonGroupContext)?.size` when its own `size` is undefined. Same result, idiomatic.
- **`isValidElement` as a type check** (`PageHeader` status, `PricingTable` features, `LiveRegion` message): it tells "config object" apart from "renderable". In Solid use `v instanceof Node || typeof v === 'function'` for renderables, anything else non-null of type `object` is config.
- **`React.Children.toArray`** (`SplitPane`): `children(() => props.children).toArray()`.
- **Measure-before-paint** (`useLayoutEffect` in Tabs indicator, Tour, Table pins, Carousel, textareas auto-grow): measure in `onMount` / `createRenderEffect`, re-measure in an effect that tracks the same deps, and observe size with a `ResizeObserver` (cleanup!).
- **Timers / rAF** (Toast countdown, CopyButton, focus after open): `setTimeout` / `requestAnimationFrame` inside the handler or effect; clear in `onCleanup`.
- **Async handlers** (`AuthButton`, `ConfirmDialog` with `onConfirm` returning a promise): keep the loading/error flow exactly as in the `.jsx`.
- **`window.ReactDOM`** references in the reference: ignore. They are an artifact of the in-browser build.

## Golden example (Button)
Reference: `components/actions/Button.jsx`
```tsx
import { JSX, Show, splitProps, mergeProps, useContext } from 'solid-js';
import { Spinner } from '../feedback/Spinner';
import { renderIcon } from '../primitives/Glyph';
import { cx } from '../primitives/cx';
import { ButtonGroupContext } from './ButtonGroup';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'link' | 'dashed';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconLeft?: string | JSX.Element;
  iconRight?: string | JSX.Element;
  loading?: boolean;
  block?: boolean;
}

export function Button(props: ButtonProps) {
  const group = useContext(ButtonGroupContext);
  const p = mergeProps({ variant: 'primary', type: 'button' } as const, props);
  const [local, rest] = splitProps(p, ['variant', 'size', 'iconLeft', 'iconRight', 'loading', 'block', 'disabled', 'class', 'children']);
  const size = () => local.size ?? group?.size ?? 'md';
  return (
    <button
      {...rest}
      class={cx('vui-btn', 'vui-btn--' + local.variant, size() !== 'md' && 'vui-btn--' + size(), local.block && 'vui-btn--block', local.class)}
      disabled={local.disabled || local.loading}
      aria-busy={local.loading || undefined}
    >
      <Show when={local.loading} fallback={renderIcon(local.iconLeft)}>
        <Spinner size="inline" tone="current" />
      </Show>
      {local.children}
      <Show when={!local.loading}>{renderIcon(local.iconRight)}</Show>
    </button>
  );
}
```
Always check the class list against the actual `.jsx`. This example shows the pattern, it is not the spec.
