Renders a Markdown string as Velvet-styled prose: ATX and setext headings (unique ids for Anchor: repeats get -1, -2…), paragraphs, bold/italic (* and _)/strike, inline code, hard line breaks (two trailing spaces or \), links — inline, reference ([t][id], [t][], [id]) and autolinks (<url>, bare http(s)/www) — external ones open in a new tab, images, nested lists (ordered start kept), task lists (inline formatting kept), blockquotes, fenced code, tables, rules. HTML in the source is escaped and only http(s)/mailto/relative URLs are kept — safe for user or AI content. The .vui-prose class can also wrap hand-written HTML.

**Props.** The full contract is `MarkdownProps` in `components/index.d.ts`.

**Also exports:** renderMarkdown. **CSS:** `.vui-prose*`. **Preview:** `components/Markdown/preview.html` (group Display).
