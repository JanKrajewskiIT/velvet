Popover — click-triggered panel for rich content (profile card, quick settings, short form).
- Use Tooltip for hover hints (text only); Popover when the content is interactive or longer than one line.
- `trigger` should be a Button/IconButton; it gets aria-expanded automatically.
- `align="end"` when the trigger sits near the right edge (topbar avatars).
- Keep content under ~340px wide; for anything bigger use Dialog or a drawer (`Dialog placement="right"`).
