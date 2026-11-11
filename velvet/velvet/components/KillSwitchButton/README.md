Emergency stop trigger. A click never acts: it opens a `ConfirmDialog` that requires typing `requireText`, and only then calls `onActivate`. While `active`, the control shows `activeLabel` and calls `onActiveClick` (open the recovery view).

**Use it** once per app, in the top bar, for the one action that blocks new activity in the current scope. The description must say what the stop does **and does not** do (it blocks new orders; it does not cancel working orders or close positions).

**Built from** `NavbarChip` (`variant="chip"`, danger fill on the brand menubar) or `Button` danger (`variant="button"`), plus `ConfirmDialog`.

**Props.** The full contract is `KillSwitchButtonProps` in `components/index.d.ts`.

- `scope`: appended to the accessible name ("ACC-01 · PAPER").
- `open` / `onOpenChange`: control the dialog, e.g. to open it from a command palette.
- `collapse`: icon only below 1280px (chip).

**Preview:** `components/KillSwitchButton/preview.html`.
