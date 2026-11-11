Audio row — play button, title / artist, waveform scrubber, time, speed and mute. The waveform is a role="slider": click or drag to seek, ← → 5 s, PgUp / PgDn 15 s, Home / End, Space plays. Pass real peaks (0–1) from your backend; without them a stable decorative waveform is derived from the title. Voice notes, podcasts, meeting recordings.

**Props.** The full contract is `AudioPlayerProps` in `components/index.d.ts`.

**Built from:** Glyph, VideoPlayer, `media/time.js`. **CSS:** `.vui-player*`. **Preview:** `components/AudioPlayer/preview.html` (group Media).
