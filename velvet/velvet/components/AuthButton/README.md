Session toggle: primary "Sign in" when signed out, secondary "Sign out" when signed in; icon swaps with a small spin. Handlers may be async (spinner); a rejected handler shows the error state (alert icon, danger edge, message announced + in the tooltip) until the next click. Session/roles live in the app — pass state in.

**Props.** The full contract is `AuthButtonProps` in `components/index.d.ts`.

**Built from:** Spinner, Glyph. **CSS:** `.vui-auth*`. **Preview:** `components/AuthButton/preview.html` (group Actions).
