The transparent control button shared by `VideoPlayer` and `AudioPlayer`: play / pause, volume, playback speed, full screen. It has no background of its own, takes the colour of its surroundings and darkens or lightens on hover, so place it on the player's control bar.

Always pass `label`; it is the accessible name and the tooltip. Use `icon` for an icon button, `children` for a text button such as the speed ("1×"), or both. `pressed` marks a toggle such as mute.

**Props.** The full contract is `PlayerButtonProps` in `components/index.d.ts`.

- `label` (required)
- `icon`: icon name; `children`: text
- `pressed`: `boolean`; `onClick`: `() => void`

**Built from: Glyph.** **CSS:** `.vui-player__btn`. **Preview:** `components/PlayerButton/preview.html` (group Media). Defined in the same module as `VideoPlayer`.
