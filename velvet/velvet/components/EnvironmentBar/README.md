Always-visible environment strip with a label chip, key/value state, a connection indicator and a stop action. Each tone has its own colour family (tokens `--env-*`): neutral, info, warning, and danger as a solid fill, so two environments never look alike.

**Props.** The full contract is `EnvironmentBarProps` in `components/index.d.ts`.

- `label`: `string`. The chip text; defaults to the tone name.
- `onStop`: `() => void`. Shows the stop button; open a `ConfirmDialog` from it, never act directly. `stopLabel` defaults to "Stop".
- Also accepts the native attributes of the root element (`<div>`).

**Preview:** `components/EnvironmentBar/preview.html` (group Feedback).
