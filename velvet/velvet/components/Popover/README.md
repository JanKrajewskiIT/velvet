Floating panel on the top material (material-4). For rich content — profiles, quick settings, small forms. openOn="hover" makes it a hover card (profile/link previews): opens after openDelay, stays open while the pointer is over the trigger or panel, also opens on focus. Use Tooltip for plain-text hints. Closes on outside click and Esc.

Popover — click-triggered panel for rich content (profile card, quick settings, short form).
- Use Tooltip for hover hints (text only); Popover when the content is interactive or longer than one line.
- `trigger` should be a Button/IconButton; it gets aria-expanded automatically.
- `align="end"` when the trigger sits near the right edge (topbar avatars).
- Keep content under ~340px wide; for anything bigger use Dialog or a drawer (`Dialog placement="right"`).
